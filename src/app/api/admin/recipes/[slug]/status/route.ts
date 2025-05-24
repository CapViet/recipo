import { NextResponse } from "next/server";
// Update the import path below to the actual location of your Drizzle db instance
import { db } from "@/database/db";
// Update the import path below to the actual location of your schema file
import * as schema from "@/database/schema";
import { eq } from "drizzle-orm";

interface RequestBody {
  status: "approved" | "rejected";
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const body: RequestBody = await req.json();

    if (!body.status || !["approved", "rejected"].includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Update recipe status in DB
    const result = await db
      .update(schema.recipe)
      .set({ status: body.status })
      .where(eq(schema.recipe.slug, slug))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Recipe status updated" });
  } catch (error) {
    console.error("Error updating recipe status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
