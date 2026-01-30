export interface Meal {
  id: string;
  name: string;
  description?: string;
  ingredients: Ingredient[];
  servings: number;
  prepTime?: number; // minutes
  cookTime?: number; // minutes
  category?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  rating?: number; // 1-5
  isHelloFresh?: boolean;
  helloFreshId?: string;
  lastCooked?: string; // ISO date
  timesCooked: number;
  notes?: string;
  nutritionInfo?: NutritionInfo;
  cost?: number; // in EUR
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category?: string;
  supermarket?: 'edeka' | 'rewe' | 'aldi' | 'lidl' | 'other';
}

export interface NutritionInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

export interface WeekPlan {
  id: string;
  weekStart: string; // ISO date (Monday)
  meals: {
    [day: string]: { // 'monday', 'tuesday', etc.
      breakfast?: string; // meal ID
      lunch?: string;
      dinner?: string;
    };
  };
  notes?: string;
}

export interface PickyEaterProfile {
  childName: string;
  age: number;
  likes: FoodPreference[];
  dislikes: FoodPreference[];
  allergies: string[];
  triedFoods: TriedFood[];
}

export interface FoodPreference {
  id: string;
  name: string;
  category?: string;
  addedDate: string;
  notes?: string;
}

export interface TriedFood {
  id: string;
  foodName: string;
  dateTried: string;
  reaction: 'loved' | 'liked' | 'neutral' | 'disliked' | 'refused';
  notes?: string;
  willTryAgain: boolean;
}

export interface ShoppingListItem {
  id: string;
  ingredientId: string;
  name: string;
  amount: number;
  unit: string;
  category?: string;
  supermarket: 'edeka' | 'rewe' | 'aldi' | 'lidl' | 'other';
  checked: boolean;
  mealIds: string[]; // which meals need this ingredient
}

export interface HelloFreshRecipe {
  id: string;
  helloFreshId: string;
  name: string;
  imported: string; // ISO date
  rating?: number;
  notes?: string;
  converted: boolean; // converted to regular meal
  mealId?: string; // if converted
}

export interface AppData {
  meals: Meal[];
  weekPlans: WeekPlan[];
  pickyEater: PickyEaterProfile;
  helloFreshRecipes: HelloFreshRecipe[];
  shoppingLists: ShoppingListItem[];
}
