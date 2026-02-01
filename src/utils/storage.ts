import { AppData } from '../types';

const STORAGE_KEY = 'family-meal-planner-data';

/**
 * Default empty data structure
 */
export const getDefaultData = (): AppData => ({
  meals: [],
  weekPlans: [],
  pickyEater: {
    childName: 'Meine Tochter',
    age: 3.5,
    likes: [],
    dislikes: [],
    allergies: [],
    triedFoods: [],
  },
  helloFreshRecipes: [],
  shoppingLists: [],
});

/**
 * Load data from localStorage with error handling
 */
export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate that it has the required structure
      if (validateDataStructure(parsed)) {
        return parsed as AppData;
      }
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  return getDefaultData();
};

/**
 * Save data to localStorage with error handling
 */
export const saveData = (data: AppData): void => {
  try {
    if (!validateDataStructure(data)) {
      throw new Error('Invalid data structure');
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
    throw error;
  }
};

/**
 * Validate that data has the correct structure
 */
const validateDataStructure = (data: unknown): data is AppData => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  return !!(
    Array.isArray(obj.meals) &&
    Array.isArray(obj.weekPlans) &&
    obj.pickyEater &&
    typeof obj.pickyEater === 'object' &&
    Array.isArray(obj.helloFreshRecipes) &&
    Array.isArray(obj.shoppingLists)
  );
};

/**
 * Export data as JSON string
 */
export const exportDataAsJson = (data: AppData): string => {
  return JSON.stringify(data, null, 2);
};

/**
 * Import data from JSON string with validation
 */
export const importDataFromJson = (jsonString: string): AppData => {
  const data = JSON.parse(jsonString) as AppData;
  if (!validateDataStructure(data)) {
    throw new Error('Invalid data structure in import file');
  }
  return data;
};

/**
 * Clear all stored data
 */
export const clearStoredData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing stored data:', error);
  }
};
