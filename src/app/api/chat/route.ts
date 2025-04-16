import { DataAPIClient } from "@datastax/astra-db-ts";

const {
    ASTRA_COLLECTION,
    ASTRA_ENDPOINT,
    ASTRA_NAMESPACE,
    ASTRA_TOKEN,
    OLLAMA_API_URL
} = process.env;

if (!ASTRA_ENDPOINT || !ASTRA_NAMESPACE || !ASTRA_TOKEN || !ASTRA_COLLECTION || !OLLAMA_API_URL) {
    throw new Error("Missing required environment variables");
}

const client = new DataAPIClient(ASTRA_TOKEN);
const db = client.db(ASTRA_ENDPOINT, { namespace: ASTRA_NAMESPACE });

async function getEmbedding(text: string) {
    try {
        const response = await fetch(`${OLLAMA_API_URL}/api/embeddings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "nomic-embed-text",
                prompt: text
            })
        });

        const json = await response.json();
        return json.embedding || [];
    } catch (error) {
        console.error("Error generating embedding:", error);
        return [];
    }
}

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        type ChatMessage = {
            role: "user" | "assistant" | "system";
            content: string;
        };

        const historyMessages = (messages as ChatMessage[])
            .filter(m => m.role === "user" || m.role === "assistant")
            .slice(0, -1)
            .map(m => `${m.role.toUpperCase()}: ${m.content}`)
            .join("\n");

        const latestMessage = messages[messages.length - 1].content;

        let docContext = "";
        const embedding = await getEmbedding(latestMessage);

        if (embedding.length > 0) {
            try {
                const collection = await db.collection(ASTRA_COLLECTION!);
                const cursor = collection.find({}, {
                    sort: { $vector: embedding },
                    limit: 5
                });

                const documents = await cursor.toArray();
                const relevantDocs = documents.slice(0, 3);
                docContext = relevantDocs.map(doc => doc.text).join("\n\n");
            } catch (err) {
                console.error("Error querying Astra DB:", err);
            }
        }

        const prompt = `
You are an AI assistant who knows everything about food recipes and their reviews.
Use the below CONTEXT and CONVERSATION HISTORY to help answer the user's question.
Format responses using Markdown, with proper line breaks, lists, and bold/italic formatting when needed.

--------------
START CONTEXT:
${docContext}
END CONTEXT
--------------

CONVERSATION HISTORY:
${historyMessages}

QUESTION: ${latestMessage}
        `;

        const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama2",
                prompt: prompt,
                stream: true
            })
        });

        const reader = response.body?.getReader();
        const encoder = new TextEncoder();
        let partialResponse = "";

        const stream = new ReadableStream({
            async start(controller) {
                if (!reader) return;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunkText = new TextDecoder().decode(value);
                    const chunks = chunkText.trim().split("\n");

                    for (const chunk of chunks) {
                        try {
                            const json = JSON.parse(chunk);
                            if (json.response) {
                                partialResponse += json.response;

                                const words = partialResponse.split(" ");
                                const lastWord = words.pop();

                                if (words.length > 0) {
                                    controller.enqueue(encoder.encode(words.join(" ") + " "));
                                }

                                partialResponse = lastWord || "";
                            }
                        } catch (err) {
                            console.error("Error parsing chunk:", err);
                        }
                    }
                }

                if (partialResponse) {
                    controller.enqueue(encoder.encode(partialResponse + " "));
                }

                controller.close();
            }
        });

        return new Response(stream, {
            headers: { "Content-Type": "text/plain; charset=utf-8" }
        });

    } catch (err) {
        console.error("Error:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}
