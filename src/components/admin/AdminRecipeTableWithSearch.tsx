"use client";
import { Button } from "@/components/ui/button";
import { useRecipeFiltering } from "@/hooks/use-recipe-filter";
import { RecipeWithCountry } from "@/types/recipe";
import RecipeTable from "./recipe-table";
import { Input } from "../ui/input";
import { Search, FilterX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface AdminRecipeTableWithSearchProps {
  initialRecipes: RecipeWithCountry[];
}

export default function AdminRecipeTableWithSearch({
  initialRecipes,
}: AdminRecipeTableWithSearchProps) {
  const handleSearchChange = (query: string) => {
    setSearch(query);
    debouncedSearch(query);
  };
  const {
    search,
    setSearch,
  countryFilter,
  setCountryFilter,
  difficultyFilter,
  setDifficultyFilter,
  filteredRecipes,
  countries,
  difficultyLevels,
  resetFilters,
  hasActiveFilters,
  debouncedSearch,
} = useRecipeFiltering(initialRecipes);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-3">
      <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-10 pr-4"
                placeholder="Search recipes by name..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
      <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
      </Select>

      <Select
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficultyLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
      </Select>
      {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={resetFilters}
                className="md:self-start flex gap-2 items-center"
              >
                <FilterX className="h-4 w-4" />
                Clear filters
              </Button>
            )}

    </div>
      </div>
      <RecipeTable recipes={filteredRecipes} />
    </div>
  );
}
