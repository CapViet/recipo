"use client";

import React, { useState } from "react";
import { RecipeWithCountry } from "@/types/recipe";
import { Button } from "@/components/ui/button";

interface PendingRecipeListProps {
  recipes: RecipeWithCountry[];
}

export default function PendingRecipeList({ recipes }: PendingRecipeListProps) {
  const [pendingRecipes, setPendingRecipes] = useState(recipes);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  const toggleDetails = (slug: string) => {
    setOpenSlug(openSlug === slug ? null : slug);
  };

  const updateStatus = async (slug: string, status: "approved" | "rejected") => {
    setLoadingSlug(slug);
    try {
      const res = await fetch(`/api/admin/recipes/${slug}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update recipe status");
      }

      // Remove recipe from pending list on success
      setPendingRecipes((prev) => prev.filter((r) => r.slug !== slug));
      setOpenSlug(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Error updating recipe status");
    } finally {
      setLoadingSlug(null);
    }
  };

  if (pendingRecipes.length === 0) {
    return <p>No pending recipes found.</p>;
  }

  return (
    <div className="space-y-4">
      {pendingRecipes.map((recipe) => (
        <div
          key={recipe.slug}
          className="border rounded p-4 cursor-pointer"
          onClick={() => toggleDetails(recipe.slug)}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{recipe.title}</h3>
            <span className="text-sm italic">{recipe.countryName}</span>
          </div>

          {openSlug === recipe.slug && (
            <div
              className="mt-4 bg-gray-50 p-4 rounded"
              onClick={(e) => e.stopPropagation()} // prevent toggle when clicking inside details
            >
              <p><strong>Description:</strong> {recipe.description}</p>
              <p><strong>Time:</strong> {recipe.time} minutes</p>
              <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
              <p><strong>Servings:</strong> {recipe.servings}</p>

              <h4 className="mt-2 font-semibold">Ingredients:</h4>
              <pre className="whitespace-pre-wrap">{String(recipe.ingredients)}</pre>

              <h4 className="mt-2 font-semibold">Instructions:</h4>
              <pre className="whitespace-pre-wrap">{String(recipe.instructions)}</pre>

              <div className="mt-4 flex gap-3">
                <Button
                  variant="default"
                  disabled={loadingSlug === recipe.slug}
                  onClick={() => updateStatus(recipe.slug, "approved")}
                >
                  {loadingSlug === recipe.slug ? "Approving..." : "Approve"}
                </Button>
                <Button
                  variant="destructive"
                  disabled={loadingSlug === recipe.slug}
                  onClick={() => updateStatus(recipe.slug, "rejected")}
                >
                  {loadingSlug === recipe.slug ? "Rejecting..." : "Reject"}
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
