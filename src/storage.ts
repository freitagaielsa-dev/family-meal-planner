import { AppData } from './types';

const STORAGE_KEY = 'family-meal-planner-data';

const defaultData: AppData = {
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
};

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  return defaultData;
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const exportData = (): string => {
  const data = loadData();
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString) as AppData;
    saveData(data);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

export const clearData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
