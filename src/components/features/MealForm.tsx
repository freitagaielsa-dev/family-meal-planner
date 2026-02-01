import { useState, useCallback } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { Meal, Ingredient } from '../../types';

interface MealFormProps {
  meal: Meal | null;
  onSave: (meal: any) => void;
  onCancel: () => void;
}

const SUPERMARKETS = ['edeka', 'rewe', 'aldi', 'lidl', 'other'] as const;
const CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

const CATEGORY_LABELS: Record<string, string> = {
  breakfast: 'Frühstück',
  lunch: 'Mittagessen',
  dinner: 'Abendessen',
  snack: 'Snack',
};

const SUPERMARKET_LABELS: Record<string, string> = {
  edeka: 'Edeka',
  rewe: 'Rewe',
  aldi: 'Aldi',
  lidl: 'Lidl',
  other: 'Sonstige',
};

/**
 * Form for creating/editing meals
 */
const MealForm = ({ meal, onSave, onCancel }: MealFormProps) => {
  const [formData, setFormData] = useState<Partial<Meal>>(
    meal || {
      name: '',
      description: '',
      ingredients: [],
      servings: 4,
      category: 'dinner',
      prepTime: undefined,
      cookTime: undefined,
      rating: undefined,
      notes: '',
    }
  );

  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    name: '',
    amount: 1,
    unit: '',
    category: '',
    supermarket: 'other',
  });

  const [ingredientError, setIngredientError] = useState<string | null>(null);

  const handleAddIngredient = useCallback(() => {
    setIngredientError(null);

    if (!newIngredient.name?.trim()) {
      setIngredientError('Zutat Name erforderlich');
      return;
    }
    if (!newIngredient.amount || newIngredient.amount <= 0) {
      setIngredientError('Menge muss größer als 0 sein');
      return;
    }
    if (!newIngredient.unit?.trim()) {
      setIngredientError('Einheit erforderlich');
      return;
    }

    const ingredient: Ingredient = {
      id: crypto.randomUUID(),
      name: newIngredient.name.trim(),
      amount: newIngredient.amount,
      unit: newIngredient.unit.trim(),
      category: newIngredient.category?.trim() || undefined,
      supermarket: (newIngredient.supermarket as any) || 'other',
    };

    setFormData((prev) => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), ingredient],
    }));

    setNewIngredient({
      name: '',
      amount: 1,
      unit: '',
      category: '',
      supermarket: 'other',
    });
  }, [newIngredient]);

  const handleRemoveIngredient = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: (prev.ingredients || []).filter((i) => i.id !== id),
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{meal ? 'Gericht bearbeiten' : 'Neues Gericht'}</h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Grundinformationen</h4>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="z.B. Spaghetti Bolognese"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beschreibung
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                rows={3}
                placeholder="Notizen, Tipps, Variationen..."
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Portionen <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.servings || 4}
                  onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategorie
                </label>
                <select
                  value={formData.category || 'dinner'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vorbereitung (min)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.prepTime || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, prepTime: e.target.value ? parseInt(e.target.value) : undefined })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kochzeit (min)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.cookTime || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, cookTime: e.target.value ? parseInt(e.target.value) : undefined })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Zutaten</h4>

            {ingredientError && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                {ingredientError}
              </div>
            )}

            {/* Ingredient list */}
            {(formData.ingredients || []).length > 0 && (
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                {(formData.ingredients || []).map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center justify-between bg-white p-3 rounded border">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{ingredient.name}</div>
                      <div className="text-sm text-gray-600">
                        {ingredient.amount} {ingredient.unit}
                        {ingredient.category && ` • ${ingredient.category}`}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(ingredient.id)}
                      className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add ingredient form */}
            <div className="border-t pt-4 space-y-3">
              <h5 className="font-medium text-gray-700">Neue Zutat hinzufügen</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newIngredient.name || ''}
                  onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                  placeholder="Zutat Name"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={newIngredient.amount || ''}
                    onChange={(e) =>
                      setNewIngredient({ ...newIngredient, amount: e.target.value ? parseFloat(e.target.value) : 0 })
                    }
                    placeholder="Menge"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newIngredient.unit || ''}
                    onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                    placeholder="z.B. g, ml"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newIngredient.category || ''}
                  onChange={(e) => setNewIngredient({ ...newIngredient, category: e.target.value })}
                  placeholder="Kategorie (z.B. Gemüse)"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <select
                  value={newIngredient.supermarket || 'other'}
                  onChange={(e) =>
                    setNewIngredient({ ...newIngredient, supermarket: e.target.value as any })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {SUPERMARKETS.map((sm) => (
                    <option key={sm} value={sm}>
                      {SUPERMARKET_LABELS[sm]}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleAddIngredient}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <Plus size={18} />
                <span>Zutat hinzufügen</span>
              </button>
            </div>
          </div>

          {/* Form actions */}
          <div className="flex justify-end space-x-3 border-t pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Save size={18} />
              <span>Speichern</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealForm;
