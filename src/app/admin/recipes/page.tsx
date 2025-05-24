import { Button } from "@/components/ui/button";
import Link from "next/link";
import AdminRecipeTableWithSearch from "@/components/admin/AdminRecipeTableWithSearch";
import { getAllRecipes } from "@/database/queries";
import { Suspense } from "react";
import BackButton from "@/components/recipes/back-button";
import { CircularProgress } from "@/components/ui/circular-progress";

async function RecipeTableSection() {
  // Fetch all recipes, or keep a limit if you want (e.g., 100)
  const recipes = await getAllRecipes({ limit: 100 });
  return <AdminRecipeTableWithSearch initialRecipes={recipes} />;
}

export default async function RecipesPage() {
  return (
    <div className="container max-w-6xl mx-auto py-12 px-4 md:px-8">
      <div className="mb-10">
        <BackButton title="Back to Admin" />
        <h1 className="text-3xl font-bold tracking-tight">All Recipes</h1>
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground mt-2">
            Manage all recipes in the collection
          </p>
          <Link href="/admin/recipes/add">
            <Button>Add Recipe</Button>
          </Link>
        </div>
      </div>
      <Suspense fallback={<CircularProgress />}>
        <RecipeTableSection />
      </Suspense>
    </div>
  );
}
