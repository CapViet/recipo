import PendingRecipeList from "@/components/admin/pending-recipes-list";
import { getPendingRecipes } from "@/database/queries";

export default async function PendingRecipesPage() {
  const recipes = await getPendingRecipes();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Pending Recipes</h1>
      <PendingRecipeList recipes={recipes} />
    </div>
  );
}
