// D:\recipo\src\actions\submit-user-recipe.ts

"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/database/drizzle";
import * as schema from "@/database/schema";
import { v4 as uuidv4 } from "uuid";
import { RecipeInsert, RecipeInsertSchema } from "@/lib/zod-schema";
import { slugify } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function submitUserRecipe(input: RecipeInsert) {
  const validatedData = RecipeInsertSchema.parse(input);

  const slug = slugify(validatedData.title);
  const id = uuidv4();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!session?.session || !user) {
    throw new Error("Unauthorized");
  }

  await db.insert(schema.recipe).values({
    id,
    title: validatedData.title,
    slug,
    description: validatedData.description,
    image:
      validatedData.image ||
      "https://images.unsplash.com/photo-1428895009712-de9e58a18409?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2hlZnxlbnwwfHwwfHx8MA%3D%3D",
    time: validatedData.time,
    difficulty: validatedData.difficulty,
    countryId: validatedData.countryId,
    servings: validatedData.servings,
    calories: validatedData.calories || null,
    videoUrl: validatedData.videoUrl || null,
    ingredients: validatedData.ingredients,
    instructions: validatedData.instructions,
    isFeatured: false,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: user.id,
  });

  revalidatePath("/recipes");

  return { success: true, id };
}
