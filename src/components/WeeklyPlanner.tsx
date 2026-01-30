import { useState } from 'react';
import { Plus, Trash2, Edit2, Save } from 'lucide-react';
import { AppData, Meal, WeekPlan } from '../types';
import { format, startOfWeek, addDays } from 'date-fns';
import { de } from 'date-fns/locale';

interface Props {
  data: AppData;
  setData: (data: AppData) => void;
}

const WeeklyPlanner = ({ data, setData }: Props) => {
  const [selectedWeek, setSelectedWeek] = useState<string>(
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  );
  const [showMealForm, setShowMealForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

  const weekDays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const currentPlan = data.weekPlans.find((p) => p.weekStart === selectedWeek) || {
    id: crypto.randomUUID(),
    weekStart: selectedWeek,
    meals: {},
  };

  const addMealToPlan = (day: string, mealType: 'breakfast' | 'lunch' | 'dinner', mealId: string) => {
    const updatedPlans = data.weekPlans.filter((p) => p.weekStart !== selectedWeek);
    const updatedPlan: WeekPlan = {
      ...currentPlan,
      meals: {
        ...currentPlan.meals,
        [day]: {
          ...currentPlan.meals[day],
          [mealType]: mealId,
        },
      },
    };
    updatedPlans.push(updatedPlan);
    setData({ ...data, weekPlans: updatedPlans });
  };

  const removeMealFromPlan = (day: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const updatedPlans = data.weekPlans.filter((p) => p.weekStart !== selectedWeek);
    const dayMeals = { ...currentPlan.meals[day] };
    delete dayMeals[mealType];
    const updatedPlan: WeekPlan = {
      ...currentPlan,
      meals: {
        ...currentPlan.meals,
        [day]: dayMeals,
      },
    };
    updatedPlans.push(updatedPlan);
    setData({ ...data, weekPlans: updatedPlans });
  };

  const addNewMeal = (meal: Omit<Meal, 'id' | 'timesCooked'>) => {
    const newMeal: Meal = {
      ...meal,
      id: crypto.randomUUID(),
      timesCooked: 0,
    };
    setData({ ...data, meals: [...data.meals, newMeal] });
    setShowMealForm(false);
  };

  const updateMeal = (meal: Meal) => {
    setData({
      ...data,
      meals: data.meals.map((m) => (m.id === meal.id ? meal : m)),
    });
    setEditingMeal(null);
  };

  const deleteMeal = (mealId: string) => {
    if (confirm('Möchten Sie dieses Gericht wirklich löschen?')) {
      setData({
        ...data,
        meals: data.meals.filter((m) => m.id !== mealId),
      });
    }
  };

  const getMealById = (id: string) => data.meals.find((m) => m.id === id);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Wochenplan</h2>
          <div className="flex space-x-4">
            <input
              type="week"
              value={format(new Date(selectedWeek), "yyyy-'W'II")}
              onChange={(e) => {
                const [year, week] = e.target.value.split('-W');
                const firstDay = startOfWeek(new Date(parseInt(year), 0, 1 + (parseInt(week) - 1) * 7), { weekStartsOn: 1 });
                setSelectedWeek(format(firstDay, 'yyyy-MM-dd'));
              }}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => setShowMealForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus size={20} />
              <span>Neues Gericht</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {weekDays.map((day, index) => {
            const dayKey = dayKeys[index];
            const dayDate = addDays(new Date(selectedWeek), index);
            const dayMeals = currentPlan.meals[dayKey] || {};

            return (
              <div key={day} className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-lg mb-3">
                  {day} ({format(dayDate, 'd. MMM', { locale: de })})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
                    const mealId = dayMeals[mealType];
                    const meal = mealId ? getMealById(mealId) : null;
                    const labels = { breakfast: 'Frühstück', lunch: 'Mittagessen', dinner: 'Abendessen' };

                    return (
                      <div key={mealType} className="bg-white p-3 rounded border">
                        <div className="text-sm font-medium text-gray-600 mb-2">{labels[mealType]}</div>
                        {meal ? (
                          <div>
                            <div className="font-medium">{meal.name}</div>
                            <button
                              onClick={() => removeMealFromPlan(dayKey, mealType)}
                              className="mt-2 text-sm text-red-600 hover:text-red-800"
                            >
                              Entfernen
                            </button>
                          </div>
                        ) : (
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                addMealToPlan(dayKey, mealType, e.target.value);
                              }
                            }}
                            className="w-full text-sm border rounded p-1"
                            value=""
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

      {/* Meal Library */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Meine Gerichte</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.meals.map((meal) => (
            <div key={meal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{meal.name}</h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setEditingMeal(meal)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteMeal(meal.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {meal.description && <p className="text-sm text-gray-600 mb-2">{meal.description}</p>}
              <div className="text-xs text-gray-500">
                {meal.timesCooked > 0 && <div>{meal.timesCooked}x gekocht</div>}
                {meal.rating && <div>⭐ {meal.rating}/5</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Form Modal */}
      {(showMealForm || editingMeal) && (
        <MealForm
          meal={editingMeal}
          onSave={editingMeal ? updateMeal : addNewMeal}
          onCancel={() => {
            setShowMealForm(false);
            setEditingMeal(null);
          }}
        />
      )}
    </div>
  );
};

const MealForm = ({
  meal,
  onSave,
  onCancel,
}: {
  meal: Meal | null;
  onSave: (meal: any) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Partial<Meal>>(
    meal || {
      name: '',
      description: '',
      ingredients: [],
      servings: 4,
      category: 'dinner',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h3 className="text-xl font-bold mb-4">{meal ? 'Gericht bearbeiten' : 'Neues Gericht'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name*</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Beschreibung</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Portionen</label>
              <input
                type="number"
                value={formData.servings || 4}
                onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kategorie</label>
              <select
                value={formData.category || 'dinner'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="breakfast">Frühstück</option>
                <option value="lunch">Mittagessen</option>
                <option value="dinner">Abendessen</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Save size={20} className="inline mr-2" />
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WeeklyPlanner;
