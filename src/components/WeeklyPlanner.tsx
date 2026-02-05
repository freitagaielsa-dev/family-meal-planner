import { useState, useMemo, useCallback } from 'react';
import { Plus, AlertCircle, BookOpen } from 'lucide-react';
import { Meal, WeekPlan } from '../types';
import { format, startOfWeek, addDays, parseISO } from 'date-fns';
import { useAppContext } from '../hooks/useAppContext';
import { getOrCreateWeekPlan, getCurrentWeekStart } from '../utils/data';
import { formatDateDE, getDayNameDE, formatMealType } from '../utils/formatting';
import { getMealValidationError } from '../utils/validation';
import { allRecipes, Recipe } from '../data/recipes';
import MealForm from './features/MealForm';
import MealLibraryCard from './features/MealLibraryCard';

/**
 * Weekly meal planner component
 */
const WeeklyPlanner = () => {
  const { data, addMeal, updateMeal, deleteMeal, updateWeekPlan } = useAppContext();
  const [selectedWeek, setSelectedWeek] = useState<string>(getCurrentWeekStart());
  const [showMealForm, setShowMealForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);

  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = weekDays.map(getDayNameDE);

  // Get or create current week plan
  const currentPlan = useMemo(() => {
    return getOrCreateWeekPlan(selectedWeek, data);
  }, [selectedWeek, data]);

  // Add meal to plan
  const handleAddMealToPlan = useCallback(
    (day: string, mealType: 'breakfast' | 'lunch' | 'dinner', mealId: string) => {
      if (!mealId) return;
      
      const updatedPlan: WeekPlan = {
        ...currentPlan,
        meals: {
          ...currentPlan.meals,
          [day]: {
            ...(currentPlan.meals[day] || {}),
            [mealType]: mealId,
          },
        },
      };
      updateWeekPlan(currentPlan.id, updatedPlan);
    },
    [currentPlan, updateWeekPlan]
  );

  // Remove meal from plan
  const handleRemoveMealFromPlan = useCallback(
    (day: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
      const dayMeals = { ...(currentPlan.meals[day] || {}) };
      delete dayMeals[mealType];

      const updatedPlan: WeekPlan = {
        ...currentPlan,
        meals: {
          ...currentPlan.meals,
          [day]: dayMeals,
        },
      };
      updateWeekPlan(currentPlan.id, updatedPlan);
    },
    [currentPlan, updateWeekPlan]
  );

  // Handle meal form submission
  const handleSaveMeal = useCallback(
    (mealData: any) => {
      const validationError = getMealValidationError(mealData);
      if (validationError) {
        setError(validationError);
        return;
      }

      try {
        if (editingMeal) {
          updateMeal(editingMeal.id, mealData);
        } else {
          addMeal(mealData);
        }
        setShowMealForm(false);
        setEditingMeal(null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save meal');
      }
    },
    [editingMeal, addMeal, updateMeal]
  );

  const handleDeleteMeal = useCallback(
    (mealId: string) => {
      if (window.confirm('Möchten Sie dieses Gericht wirklich löschen?')) {
        try {
          deleteMeal(mealId);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to delete meal');
        }
      }
    },
    [deleteMeal]
  );

  // Add recipe from recipe book
  const handleAddRecipeToMeals = useCallback(
    (recipe: Recipe) => {
      const meal = {
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients.map((ing) => ({
          id: crypto.randomUUID(),
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
          category: ing.category,
          supermarket: ing.supermarket,
        })),
        servings: recipe.servings,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        category: 'dinner' as const,
        rating: recipe.rating,
        notes: recipe.notes,
      };

      const newMealId = addMeal(meal);
      
      // If a day/meal type was selected, add it to the plan
      if (selectedDay && selectedMealType) {
        const updatedPlan: WeekPlan = {
          ...currentPlan,
          meals: {
            ...currentPlan.meals,
            [selectedDay]: {
              ...(currentPlan.meals[selectedDay] || {}),
              [selectedMealType]: newMealId,
            },
          },
        };
        updateWeekPlan(currentPlan.id, updatedPlan);
      }

      setShowRecipeSelector(false);
      setSelectedDay(null);
      setSelectedMealType(null);
    },
    [addMeal, selectedDay, selectedMealType, currentPlan, updateWeekPlan]
  );

  const getMealById = (id: string) => data.meals.find((m) => m.id === id);

  const weekStart = parseISO(selectedWeek);

  return (
    <div className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Week planner */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Wochenplan</h2>
          <div className="flex space-x-4 flex-wrap gap-2">
            <input
              type="date"
              value={format(weekStart, 'yyyy-MM-dd')}
              onChange={(e) => {
                const selected = parseISO(e.target.value);
                const monday = startOfWeek(selected, { weekStartsOn: 1 });
                setSelectedWeek(format(monday, 'yyyy-MM-dd'));
              }}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              onClick={() => setShowMealForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus size={20} />
              <span>Neues Gericht</span>
            </button>
          </div>
        </div>

        {/* Week days grid */}
        <div className="grid grid-cols-1 gap-4">
          {weekDays.map((day, index) => {
            const dayDate = addDays(weekStart, index);
            const dayMeals = currentPlan.meals[day] || {};

            return (
              <div key={day} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <h3 className="font-semibold text-lg mb-3">
                  {dayLabels[index]} ({formatDateDE(dayDate, 'd. MMM')})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
                    const mealId = dayMeals[mealType];
                    const meal = mealId ? getMealById(mealId) : null;

                    return (
                      <div key={mealType} className="bg-white p-4 rounded border border-gray-200">
                        <div className="text-sm font-medium text-gray-600 mb-3">
                          {formatMealType(mealType)}
                        </div>
                        {meal ? (
                          <div className="space-y-3">
                            <div className="font-semibold text-gray-800">{meal.name}</div>
                            {meal.description && (
                              <p className="text-sm text-gray-600">{meal.description}</p>
                            )}
                            <button
                              onClick={() => handleRemoveMealFromPlan(day, mealType)}
                              className="w-full text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                            >
                              Entfernen
                            </button>
                          </div>
                        ) : (
                          <select
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === 'from-recipe-book') {
                                setSelectedDay(day);
                                setSelectedMealType(mealType);
                                setShowRecipeSelector(true);
                                e.target.value = '';
                              } else if (value) {
                                handleAddMealToPlan(day, mealType, value);
                                e.target.value = '';
                              }
                            }}
                            className="w-full text-sm border rounded p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            defaultValue=""
                          >
                            <option value="">Gericht wählen...</option>
                            {data.meals.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name}
                              </option>
                            ))}
                            <option value="from-recipe-book" className="font-medium text-indigo-600">
                              📖 Aus dem Rezeptbuch...
                            </option>
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meal library */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Meine Gerichte ({data.meals.length})</h2>

        {data.meals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Keine Gerichte vorhanden</p>
            <p className="text-gray-400 text-sm mt-2">
              Klicken Sie auf "Neues Gericht" um Ihr erstes Gericht hinzuzufügen
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.meals.map((meal) => (
              <MealLibraryCard
                key={meal.id}
                meal={meal}
                onEdit={() => setEditingMeal(meal)}
                onDelete={() => handleDeleteMeal(meal.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Meal form modal */}
      {(showMealForm || editingMeal) && (
        <MealForm
          meal={editingMeal}
          onSave={handleSaveMeal}
          onCancel={() => {
            setShowMealForm(false);
            setEditingMeal(null);
            setError(null);
          }}
        />
      )}

      {/* Recipe Book Selector Modal */}
      {showRecipeSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookOpen className="text-indigo-600" size={24} />
                <h3 className="text-xl font-bold">Rezeptbuch</h3>
              </div>
              <button
                onClick={() => {
                  setShowRecipeSelector(false);
                  setSelectedDay(null);
                  setSelectedMealType(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="border rounded-lg p-4 hover:bg-indigo-50 hover:border-indigo-300 cursor-pointer transition-colors"
                    onClick={() => handleAddRecipeToMeals(recipe)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        recipe.category === 'pasta' ? 'bg-red-100 text-red-800' :
                        recipe.category === 'rice' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {recipe.category === 'pasta' ? 'Pasta' : recipe.category === 'rice' ? 'Reis' : 'Soul Food'}
                      </span>
                      {recipe.pickyEaterFriendly && (
                        <span className="text-pink-500">♥</span>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">{recipe.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
                    <div className="flex gap-2 mt-2 text-xs text-gray-500">
                      <span>⏱️ {recipe.prepTime + recipe.cookTime} Min.</span>
                      <span>💶 ~{recipe.costEstimate}€</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyPlanner;
