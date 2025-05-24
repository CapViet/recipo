import BackButton from "@/components/recipes/back-button";
import { RecipeForm } from "@/components/admin/recipe-form";
import { getPopularCuisines } from "@/database/queries";
import { Suspense } from "react";
import { CircularProgress } from "@/components/ui/circular-progress";

async function UserRecipeFormSection() {
  const countries = await getPopularCuisines();
  return <RecipeForm countries={countries} isUserSubmit={true} />;
}

export default async function SubmitUserRecipePage() {
  return (
    <div className="container py-10 px-20">
      <div className="mb-8">
        <BackButton title="Back to Home" />
        <h1 className="text-3xl font-bold">Submit a Recipe</h1>
        <p className="text-muted-foreground mt-2">
          Share your recipe with the community! Your submission will be reviewed before it&apos;s published.
        </p>
      </div>

      <Suspense fallback={<CircularProgress />}>
        <UserRecipeFormSection />
      </Suspense>
    </div>
  );
}
