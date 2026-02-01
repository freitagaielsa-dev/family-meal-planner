import { useState, useMemo, useCallback } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { Meal, WeekPlan } from '../types';
import { format, startOfWeek, addDays, parseISO } from 'date-fns';
import { useAppContext } from '../hooks/useAppContext';
import { getOrCreateWeekPlan, getCurrentWeekStart } from '../utils/data';
import { formatDateDE, getDayNameDE, formatMealType } from '../utils/formatting';
import { getMealValidationError } from '../utils/validation';
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
                              if (e.target.value) {
                                handleAddMealToPlan(day, mealType, e.target.value);
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
    </div>
  );
};

export default WeeklyPlanner;
