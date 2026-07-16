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
}