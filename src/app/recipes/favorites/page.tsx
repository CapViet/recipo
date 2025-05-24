import { auth } from "@/lib/auth";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getFavoriteRecipes, getUserRecipes } from "@/database/queries";
import { Suspense } from "react";
import BackButton from "@/components/recipes/back-button";
import RecipeList, { RecipesListSkeleton } from "@/components/recipes/recipes-list";

async function FavoriteRecipesSection({ userId }: { userId: string }) {
  const recipes = await getFavoriteRecipes(userId);

  if (recipes.length === 0) {
    return <div className="text-center text-gray-500">No favorite recipes yet.</div>;
  }

  return <RecipeList initialRecipes={recipes} isFavoritePage={true} />;
}

async function UserRecipesSection({ userId }: { userId: string }) {
  const recipes = await getUserRecipes(userId);

  if (recipes.length === 0) {
    return <div className="text-center text-gray-500">You haven&apos;t submitted any recipes yet.</div>;
  }

  return <RecipeList initialRecipes={recipes} isFavoritePage={false} />;
}

export default async function Favorites() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) redirect("/");

  return (
    <div className="min-h-screen bg-gray-50 px-12 py-12">
      <BackButton title="Home" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Favorites</h1>
        <Link
          href="/recipes/submit"
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Upload Your Own Recipe
        </Link>
      </div>

      <section className="mb-16">
        <Suspense fallback={<RecipesListSkeleton />}>
          <FavoriteRecipesSection userId={user.id} />
        </Suspense>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Your Recipes</h2>
        <Suspense fallback={<RecipesListSkeleton />}>
          <UserRecipesSection userId={user.id} />
        </Suspense>
      </section>
    </div>
  );
}
