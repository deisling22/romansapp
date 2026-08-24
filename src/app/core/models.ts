export interface MealPlan {
  id: number;
  name: string;
  dishCount: number;
}

export interface CreatorSummary {
  id: number;
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  reelImageUrl: string;
  reelVideoUrl: string | null;
  planCount: number;
}

export interface CreatorPlan {
  id: number;
  name: string;
  dishCount: number;
  coverImageUrl: string;
}

export interface CreatorDetail {
  id: number;
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  plans: CreatorPlan[];
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
  averageRating: number | null;
  ratingCount: number;
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
  averageRating: number | null;
  ratingCount: number;
  myRating: number | null;
  favorite: boolean;
}

export interface DishRatingSummary {
  averageRating: number;
  ratingCount: number;
  myRating: number;
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
  averageRating: number | null;
  ratingCount: number;
}

export interface DashboardData {
  caloriesToday: number;
  proteinToday: number;
  proteinGoal: number | null;
  proteinPercent: number | null;
  nextDish: NextDish | null;
  cartItemCount: number;
  pantryItemCount: number;
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

export interface PantryItem {
  id: number;
  ingredientName: string;
  quantity: number;
  unit: string;
  purchasedAt: string;
}

export interface PlanRecommendation {
  id: number;
  name: string;
  creatorId: number;
  creatorName: string;
  creatorHandle: string;
  dishCount: number;
  coverImageUrl: string;
}

export interface Recommendations {
  dishes: DishCatalogEntry[];
  creators: CreatorSummary[];
  plans: PlanRecommendation[];
}
