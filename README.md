# recipo
To deploy on vercel


# how does the chat bot works?: 
the backend will be placed in the src/app/api/chat/route.ts file. This is how it works:

# 1️⃣ **Astra DB API**

**What it is:**
Astra DB is your **vector database**, where you store recipe documents.

**What the code does with it:**

* Connects to Astra DB
* Searches for documents that are similar to the user’s message
* Returns the top matches

---

# 2️⃣ **Ollama Embedding API**

**What it is:**
This is Ollama’s endpoint that creates **embeddings** (vectors).

**What the code does with it:**

* Sends the user’s message to Ollama
* Ollama turns the text into a vector (embedding)
* You use that vector to search in Astra DB

---

# 3️⃣ **Ollama LLM Generation API**

**What it is:**
Ollama’s endpoint that generates text responses using an LLM (LLaMA2).

**What the code does with it:**

* Sends a prompt that includes:

  * The retrieved documents
  * The conversation history
  * The user’s question
* Ollama streams back an answer, little by little

---

# 4️⃣ **Next.js Route Handler API**

**What it is:**
This is the server endpoint (`POST`) that receives the request from your frontend.

**What the code does:**

* Reads the chat messages
* Calls Ollama Embedding API
* Calls Astra DB to retrieve documents
* Builds a prompt
* Calls Ollama LLM to generate a response
* Streams the reply back to the user
