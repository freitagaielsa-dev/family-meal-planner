import { Meal, Ingredient, ShoppingListItem } from '../types';

/**
 * Validate meal object
 */
export const validateMeal = (meal: any): meal is Meal => {
  return (
    typeof meal === 'object' &&
    meal !== null &&
    typeof meal.name === 'string' &&
    meal.name.trim().length > 0 &&
    typeof meal.servings === 'number' &&
    meal.servings > 0 &&
    Array.isArray(meal.ingredients)
  );
};

/**
 * Validate ingredient
 */
export const validateIngredient = (ingredient: any): ingredient is Ingredient => {
  return (
    typeof ingredient === 'object' &&
    ingredient !== null &&
    typeof ingredient.name === 'string' &&
    ingredient.name.trim().length > 0 &&
    typeof ingredient.amount === 'number' &&
    ingredient.amount > 0 &&
    typeof ingredient.unit === 'string' &&
    ingredient.unit.trim().length > 0
  );
};

/**
 * Validate shopping list item
 */
export const validateShoppingListItem = (item: any): item is ShoppingListItem => {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.name === 'string' &&
    item.name.trim().length > 0 &&
    typeof item.amount === 'number' &&
    item.amount > 0 &&
    typeof item.unit === 'string' &&
    typeof item.checked === 'boolean'
  );
};

/**
 * Validate meal name
 */
export const validateMealName = (name: string): boolean => {
  return typeof name === 'string' && name.trim().length > 0 && name.length <= 200;
};

/**
 * Validate ingredient amount
 */
export const validateAmount = (amount: any): amount is number => {
  return typeof amount === 'number' && !isNaN(amount) && amount > 0;
};

/**
 * Get validation error message for meal
 */
export const getMealValidationError = (meal: any): string | null => {
  if (!meal.name || meal.name.trim().length === 0) {
    return 'Meal name is required';
  }
  if (meal.name.length > 200) {
    return 'Meal name must be less than 200 characters';
  }
  if (!meal.servings || meal.servings <= 0) {
    return 'Number of servings must be greater than 0';
  }
  if (!Array.isArray(meal.ingredients)) {
    return 'Ingredients must be an array';
  }
  return null;
};

/**
 * Get validation error message for ingredient
 */
export const getIngredientValidationError = (ingredient: any): string | null => {
  if (!ingredient.name || ingredient.name.trim().length === 0) {
    return 'Ingredient name is required';
  }
  if (!ingredient.amount || ingredient.amount <= 0) {
    return 'Amount must be greater than 0';
  }
  if (!ingredient.unit || ingredient.unit.trim().length === 0) {
    return 'Unit is required';
  }
  return null;
};
