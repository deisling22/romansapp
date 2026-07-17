export interface MealPlan {
  id: number;
  name: string;
  dishCount: number;
}

export interface Dish {
  id: number;
  name: string;
  imageUrl: string;
  sortOrder: number;
  planEntryId: number;
  cooked: boolean;
}

export interface DishCatalogEntry {
  id: number;
  name: string;
  imageUrl: string;
  description: string | null;
  prepMinutes: number | null;
  tags: string[];
}

export interface PrepStep {
  id: number;
  stepOrder: number;
  text: string;
  timerSeconds: number | null;
}

export interface DishIngredientEntry {
  id: number;
  ingredientName: string;
  quantityGrams: number;
  unit: string;
}

export interface DishDetail {
  id: number;
  name: string;
  imageUrl: string;
  description: string | null;
  prepMinutes: number | null;
  servings: number;
  tags: string[];
  caloriesPerServing: number;
  proteinPerServing: number;
  galleryImageUrls: string[];
  steps: PrepStep[];
  ingredients: DishIngredientEntry[];
}

export interface Ingredient {
  id: number;
  name: string;
  kcalPer100: number;
  proteinPer100: number;
  unit: string;
}

export interface NextDish {
  planEntryId: number;
  planId: number;
  dishId: number;
  name: string;
  imageUrl: string;
}

export interface DashboardData {
  caloriesToday: number;
  proteinToday: number;
  proteinGoal: number | null;
  proteinPercent: number | null;
  nextDish: NextDish | null;
}

export interface Profile {
  defaultPortionSize: number;
  bodyWeightKg: number | null;
  bodyHeightCm: number | null;
}

export interface ShoppingListItem {
  id: number;
  ingredientName: string;
  quantity: number;
  unit: string;
  checked: boolean;
}
