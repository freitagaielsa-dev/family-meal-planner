import { Meal, WeekPlan, ShoppingListItem, AppData } from '../types';
import { startOfWeek, format } from 'date-fns';

/**
 * Get current week's ISO string (Monday start)
 */
export const getCurrentWeekStart = (): string => {
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
  return format(monday, 'yyyy-MM-dd');
};

/**
 * Get week plan for a specific week, or create empty one
 */
export const getOrCreateWeekPlan = (weekStart: string, data: AppData): WeekPlan => {
  const existing = data.weekPlans.find((p) => p.weekStart === weekStart);
  if (existing) {
    return existing;
  }
  return {
    id: crypto.randomUUID(),
    weekStart,
    meals: {},
    notes: '',
  };
};

/**
 * Get meal by ID
 */
export const getMealById = (id: string, data: AppData): Meal | undefined => {
  return data.meals.find((m) => m.id === id);
};

/**
 * Get meals for a specific week from the plan
 */
export const getMealsForWeek = (weekStart: string, data: AppData): Meal[] => {
  const weekPlan = data.weekPlans.find((p) => p.weekStart === weekStart);
  if (!weekPlan) return [];

  const mealIds = new Set<string>();
  Object.values(weekPlan.meals).forEach((dayMeals) => {
    Object.values(dayMeals || {}).forEach((mealId) => {
      if (mealId) mealIds.add(mealId);
    });
  });

  return Array.from(mealIds)
    .map((id) => getMealById(id, data))
    .filter((m): m is Meal => m !== undefined);
};

/**
 * Generate shopping list items from a week's meals
 */
export const generateShoppingListFromWeek = (weekStart: string, data: AppData): ShoppingListItem[] => {
  const mealsForWeek = getMealsForWeek(weekStart, data);
  const ingredientsMap = new Map<string, ShoppingListItem>();

  mealsForWeek.forEach((meal) => {
    meal.ingredients.forEach((ingredient) => {
      const key = `${ingredient.name}-${ingredient.unit}`;
      if (ingredientsMap.has(key)) {
        const existing = ingredientsMap.get(key)!;
        existing.amount += ingredient.amount;
        if (!existing.mealIds.includes(meal.id)) {
          existing.mealIds.push(meal.id);
        }
      } else {
        ingredientsMap.set(key, {
          id: crypto.randomUUID(),
          ingredientId: ingredient.id,
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          category: ingredient.category,
          supermarket: ingredient.supermarket || 'other',
          checked: false,
          mealIds: [meal.id],
        });
      }
    });
  });

  return Array.from(ingredientsMap.values());
};

/**
 * Get stats for dashboard
 */
export const getMealStats = (data: AppData) => {
  const meals = data.meals;
  
  if (meals.length === 0) {
    return {
      totalMeals: 0,
      averageRating: 0,
      mostCooked: null,
      byCategory: {},
      totalCost: 0,
      averageCost: 0,
    };
  }

  const totalCost = meals.reduce((sum, m) => sum + (m.cost || 0), 0);
  const ratedMeals = meals.filter((m) => m.rating);
  const averageRating = ratedMeals.length > 0 
    ? ratedMeals.reduce((sum, m) => sum + (m.rating || 0), 0) / ratedMeals.length 
    : 0;

  const mostCooked = meals.reduce((prev, current) =>
    (prev.timesCooked > current.timesCooked) ? prev : current
  ) || null;

  const byCategory: Record<string, number> = {};
  meals.forEach((m) => {
    const cat = m.category || 'other';
    byCategory[cat] = (byCategory[cat] || 0) + 1;
  });

  return {
    totalMeals: meals.length,
    averageRating: parseFloat(averageRating.toFixed(2)),
    mostCooked,
    byCategory,
    totalCost: parseFloat(totalCost.toFixed(2)),
    averageCost: parseFloat((totalCost / meals.length).toFixed(2)),
  };
};

/**
 * Get picky eater stats
 */
export const getPickyEaterStats = (data: AppData) => {
  const pe = data.pickyEater;
  const triedTotal = pe.triedFoods.length;
  const loved = pe.triedFoods.filter((f) => f.reaction === 'loved').length;
  const liked = pe.triedFoods.filter((f) => f.reaction === 'liked').length;
  const refused = pe.triedFoods.filter((f) => f.reaction === 'refused').length;

  const successRate = triedTotal > 0 
    ? Math.round(((loved + liked) / triedTotal) * 100) 
    : 0;

  return {
    totalTried: triedTotal,
    liked: liked + loved,
    disliked: refused + pe.triedFoods.filter((f) => f.reaction === 'disliked').length,
    neutral: pe.triedFoods.filter((f) => f.reaction === 'neutral').length,
    successRate,
    likeCount: pe.likes.length,
    dislikeCount: pe.dislikes.length,
  };
};

/**
 * Get HelloFresh stats
 */
export const getHelloFreshStats = (data: AppData) => {
  const recipes = data.helloFreshRecipes;
  const ratedRecipes = recipes.filter((r) => r.rating);
  const averageRating = ratedRecipes.length > 0
    ? ratedRecipes.reduce((sum, r) => sum + (r.rating || 0), 0) / ratedRecipes.length
    : 0;

  const converted = recipes.filter((r) => r.converted).length;

  return {
    totalRecipes: recipes.length,
    convertedToMeals: converted,
    averageRating: parseFloat(averageRating.toFixed(2)),
    ratedRecipes: ratedRecipes.length,
  };
};

/**
 * Get most used ingredients
 */
export const getMostUsedIngredients = (data: AppData, limit = 10) => {
  const ingredientMap = new Map<string, number>();

  data.meals.forEach((meal) => {
    meal.ingredients.forEach((ing) => {
      const count = ingredientMap.get(ing.name) || 0;
      ingredientMap.set(ing.name, count + 1);
    });
  });

  return Array.from(ingredientMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
};

/**
 * Group shopping list by supermarket
 */
export const groupShoppingListBySupermarket = (items: ShoppingListItem[]) => {
  const grouped: Record<string, ShoppingListItem[]> = {};

  items.forEach((item) => {
    if (!grouped[item.supermarket]) {
      grouped[item.supermarket] = [];
    }
    grouped[item.supermarket].push(item);
  });

  return grouped;
};

/**
 * Group shopping list by category
 */
export const groupShoppingListByCategory = (items: ShoppingListItem[]) => {
  const grouped: Record<string, ShoppingListItem[]> = {};

  items.forEach((item) => {
    const category = item.category || 'Sonstige';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(item);
  });

  return grouped;
};
