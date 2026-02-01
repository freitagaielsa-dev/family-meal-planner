import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { AppData } from '../types';
import { loadData, saveData } from '../utils/storage';

interface AppContextType {
  data: AppData;
  updateData: (data: AppData) => void;
  addMeal: (meal: Omit<any, 'id' | 'timesCooked'>) => string;
  updateMeal: (id: string, meal: any) => void;
  deleteMeal: (id: string) => void;
  addWeekPlan: (plan: any) => string;
  updateWeekPlan: (id: string, plan: any) => void;
  addShoppingItem: (item: any) => string;
  updateShoppingItem: (id: string, item: any) => void;
  deleteShoppingItem: (id: string) => void;
  clearShoppingList: () => void;
  addPickyEaterFood: (type: 'likes' | 'dislikes', food: any) => string;
  removePickyEaterFood: (type: 'likes' | 'dislikes', id: string) => void;
  recordTriedFood: (food: any) => string;
  updatePickyEaterProfile: (profile: any) => void;
  addHelloFreshRecipe: (recipe: any) => string;
  updateHelloFreshRecipe: (id: string, recipe: any) => void;
  deleteHelloFreshRecipe: (id: string) => void;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [data, setData] = useState<AppData>(loadData());
  const [error, setError] = useState<string | null>(null);

  // Persist data to localStorage whenever it changes
  useEffect(() => {
    try {
      saveData(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save data';
      setError(message);
      console.error('Error saving data:', err);
    }
  }, [data]);

  const updateData = useCallback((newData: AppData) => {
    setData(newData);
  }, []);

  // Meal operations
  const addMeal = useCallback((meal: any) => {
    const id = crypto.randomUUID();
    const newMeal = { ...meal, id, timesCooked: 0 };
    setData((prev) => ({ ...prev, meals: [...prev.meals, newMeal] }));
    return id;
  }, []);

  const updateMeal = useCallback((id: string, meal: any) => {
    setData((prev) => ({
      ...prev,
      meals: prev.meals.map((m) => (m.id === id ? { ...m, ...meal, id } : m)),
    }));
  }, []);

  const deleteMeal = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      meals: prev.meals.filter((m) => m.id !== id),
      weekPlans: prev.weekPlans.map((plan) => ({
        ...plan,
        meals: Object.entries(plan.meals).reduce((acc, [day, dayMeals]) => {
          acc[day] = Object.entries(dayMeals as any).reduce((dayAcc, [type, mealId]) => {
            if (mealId !== id) {
              dayAcc[type] = mealId;
            }
            return dayAcc;
          }, {} as any);
          return acc;
        }, {} as any),
      })),
    }));
  }, []);

  // Week plan operations
  const addWeekPlan = useCallback((plan: any) => {
    const id = crypto.randomUUID();
    const newPlan = { ...plan, id };
    setData((prev) => ({ ...prev, weekPlans: [...prev.weekPlans, newPlan] }));
    return id;
  }, []);

  const updateWeekPlan = useCallback((id: string, plan: any) => {
    setData((prev) => ({
      ...prev,
      weekPlans: prev.weekPlans.map((p) => (p.id === id ? { ...p, ...plan, id } : p)),
    }));
  }, []);

  // Shopping list operations
  const addShoppingItem = useCallback((item: any) => {
    const id = crypto.randomUUID();
    const newItem = { ...item, id };
    setData((prev) => ({ ...prev, shoppingLists: [...prev.shoppingLists, newItem] }));
    return id;
  }, []);

  const updateShoppingItem = useCallback((id: string, item: any) => {
    setData((prev) => ({
      ...prev,
      shoppingLists: prev.shoppingLists.map((s) => (s.id === id ? { ...s, ...item, id } : s)),
    }));
  }, []);

  const deleteShoppingItem = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      shoppingLists: prev.shoppingLists.filter((s) => s.id !== id),
    }));
  }, []);

  const clearShoppingList = useCallback(() => {
    setData((prev) => ({ ...prev, shoppingLists: [] }));
  }, []);

  // Picky eater operations
  const addPickyEaterFood = useCallback((type: 'likes' | 'dislikes', food: any) => {
    const id = crypto.randomUUID();
    const newFood = { ...food, id, addedDate: new Date().toISOString() };
    setData((prev) => ({
      ...prev,
      pickyEater: {
        ...prev.pickyEater,
        [type]: [...prev.pickyEater[type], newFood],
      },
    }));
    return id;
  }, []);

  const removePickyEaterFood = useCallback((type: 'likes' | 'dislikes', id: string) => {
    setData((prev) => ({
      ...prev,
      pickyEater: {
        ...prev.pickyEater,
        [type]: prev.pickyEater[type].filter((f) => f.id !== id),
      },
    }));
  }, []);

  const recordTriedFood = useCallback((food: any) => {
    const id = crypto.randomUUID();
    const newFood = { ...food, id, dateTried: new Date().toISOString() };
    setData((prev) => ({
      ...prev,
      pickyEater: {
        ...prev.pickyEater,
        triedFoods: [...prev.pickyEater.triedFoods, newFood],
      },
    }));
    return id;
  }, []);

  const updatePickyEaterProfile = useCallback((profile: any) => {
    setData((prev) => ({ ...prev, pickyEater: profile }));
  }, []);

  // HelloFresh operations
  const addHelloFreshRecipe = useCallback((recipe: any) => {
    const id = crypto.randomUUID();
    const newRecipe = { ...recipe, id, imported: new Date().toISOString() };
    setData((prev) => ({ ...prev, helloFreshRecipes: [...prev.helloFreshRecipes, newRecipe] }));
    return id;
  }, []);

  const updateHelloFreshRecipe = useCallback((id: string, recipe: any) => {
    setData((prev) => ({
      ...prev,
      helloFreshRecipes: prev.helloFreshRecipes.map((r) =>
        r.id === id ? { ...r, ...recipe, id } : r
      ),
    }));
  }, []);

  const deleteHelloFreshRecipe = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      helloFreshRecipes: prev.helloFreshRecipes.filter((r) => r.id !== id),
    }));
  }, []);

  // Data import/export
  const exportData = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const importData = useCallback((jsonString: string): boolean => {
    try {
      const imported = JSON.parse(jsonString) as AppData;
      // Validate structure
      if (!imported.meals || !imported.weekPlans || !imported.pickyEater) {
        throw new Error('Invalid data structure');
      }
      setData(imported);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to import data';
      setError(message);
      console.error('Error importing data:', err);
      return false;
    }
  }, []);

  const value: AppContextType = {
    data,
    updateData,
    addMeal,
    updateMeal,
    deleteMeal,
    addWeekPlan,
    updateWeekPlan,
    addShoppingItem,
    updateShoppingItem,
    deleteShoppingItem,
    clearShoppingList,
    addPickyEaterFood,
    removePickyEaterFood,
    recordTriedFood,
    updatePickyEaterProfile,
    addHelloFreshRecipe,
    updateHelloFreshRecipe,
    deleteHelloFreshRecipe,
    exportData,
    importData,
  };

  return (
    <AppContext.Provider value={value}>
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
      {children}
    </AppContext.Provider>
  );
};
