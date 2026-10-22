export interface MealPlan {
  id: number;
  name: string;
  dishCount: number;
  active?: boolean;
  leftoversForLunch?: boolean;
  costEur?: number | null;
}

export type MealSlot = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export const MEAL_SLOT_LABELS: Record<MealSlot, string> = {
  BREAKFAST: 'Frühstück',
  LUNCH: 'Mittagessen',
  DINNER: 'Abendessen',
};

export interface MissingIngredient {
  ingredientName: string;
  unit: string;
  missingQuantity: number;
  uncoveredQuantity: number;
}

export interface ScheduledMeal {
  dayOffset: number;
  mealSlot: MealSlot;
  status: 'COOKED' | 'PLANNED' | 'LEFTOVERS';
  planEntryId: number | null;
  planId: number | null;
  planName: string | null;
  dishId: number;
  dishName: string;
  imageUrl: string;
  prepMinutes: number | null;
  advancePrepNote: string | null;
  portions: number;
  cooksLeftovers: boolean;
  ingredientStatus: 'AVAILABLE' | 'ON_LIST' | 'MISSING' | 'UNKNOWN' | null;
  missingIngredients: MissingIngredient[];
}

export interface ScheduleDay {
  dayOffset: number;
  date: string;
  meals: ScheduledMeal[];
}

export interface Schedule {
  days: ScheduleDay[];
  shoppingWindowDays: number;
}

export interface ReplacementSuggestion {
  dishId: number;
  name: string;
  imageUrl: string;
  prepMinutes: number | null;
  ingredientCount: number;
  missingCount: number;
  coveragePercent: number;
}

export interface StapleItem {
  id: number;
  ingredientName: string;
  quantity: number;
  unit: string;
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
  mealSlot?: MealSlot;
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
  carbsGrams: number | null;
  fatGrams: number | null;
  vitaminAMcg: number | null;
  vitaminCMg: number | null;
  vitaminDMcg: number | null;
  vitaminKMcg: number | null;
  vitaminB12Mcg: number | null;
  folateMcg: number | null;
  galleryImageUrls: string[];
  steps: PrepStep[];
  ingredients: DishIngredientEntry[];
  averageRating: number | null;
  ratingCount: number;
  myRating: number | null;
  favorite: boolean;
  advancePrepNote: string | null;
  costEur?: number | null;
  editable?: boolean;
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
  calorieGoal: number | null;
  caloriePercent: number | null;
  proteinToday: number;
  proteinGoal: number | null;
  proteinPercent: number | null;
  nutritionTrackingEnabled: boolean;
  carbsToday: number;
  fatToday: number;
  vitaminAToday: number;
  vitaminCToday: number;
  vitaminDToday: number;
  vitaminKToday: number;
  vitaminB12Today: number;
  folateToday: number;
  nextDish: NextDish | null;
  cartItemCount: number;
  pantryItemCount: number;
  costTrackingEnabled?: boolean;
  cost?: CostSummary | null;
  expiringSoonCount?: number;
}

export interface WeekNutritionDay {
  date: string;
  meals: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WeekNutrition {
  days: WeekNutritionDay[];
  trackedDays: number;
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  calorieGoal: number | null;
  proteinGoal: number | null;
}

export interface CostSummary {
  spentThisWeek: number;
  spentThisMonth: number;
  plannedCost: number | null;
  weeklyBudget: number | null;
  budgetPercent: number | null;
}

export interface Receipt {
  id?: number;
  purchasedOn: string;
  totalEur: number;
  store: string | null;
}

export interface HouseholdMember {
  email: string;
  role: 'OWNER' | 'MEMBER';
  you: boolean;
}

export interface Household {
  id: number;
  name: string;
  guest: boolean;
  authenticated: boolean;
  role: 'OWNER' | 'MEMBER' | null;
  inviteCode: string | null;
  members: HouseholdMember[];
  defaultClaimable: boolean;
}

export interface RecipeImport {
  name: string;
  description: string | null;
  imageUrl: string | null;
  servings: number | null;
  prepMinutes: number | null;
  ingredients: string[];
  steps: string[];
  tags: string[];
  sourceUrl: string;
}

export interface Profile {
  defaultPortionSize: number;
  bodyWeightKg: number | null;
  bodyHeightCm: number | null;
  nutritionTrackingEnabled: boolean;
  calorieGoal: number | null;
  age: number | null;
  sex: 'MALE' | 'FEMALE' | null;
  activityLevel: number | null;
  householdSize: number;
  shoppingTripsPerWeek: number;
  costTrackingEnabled?: boolean;
  weeklyBudgetEur?: number | null;
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
  expiresOn?: string | null;
}

export interface UseSoon {
  items: PantryItem[];
  dishes: Array<{ id: number; name: string; imageUrl: string | null; matchedIngredients: string[] }>;
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
