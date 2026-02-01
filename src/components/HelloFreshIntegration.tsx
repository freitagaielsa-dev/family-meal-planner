import { useState } from 'react';
import { ChefHat, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';
import { getHelloFreshStats } from '../utils/data';
import { formatDateDE, formatRating } from '../utils/formatting';

/**
 * HelloFresh recipe integration component
 */
const HelloFreshIntegration = () => {
  const { data, addHelloFreshRecipe, updateHelloFreshRecipe, deleteHelloFreshRecipe, addMeal } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    helloFreshId: '',
    name: '',
    rating: undefined as number | undefined,
    notes: '',
  });

  const stats = getHelloFreshStats(data);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.helloFreshId.trim()) {
      setError('Name and HelloFresh ID required');
      return;
    }

    try {
      if (editingId) {
        updateHelloFreshRecipe(editingId, formData);
      } else {
        addHelloFreshRecipe({ ...formData, converted: false });
      }

      setFormData({ helloFreshId: '', name: '', rating: undefined, notes: '' });
      setShowForm(false);
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save recipe');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Really delete this recipe?')) {
      deleteHelloFreshRecipe(id);
    }
  };

  const handleConertToMeal = (recipe: any) => {
    if (window.confirm(`Convert "${recipe.name}" to a regular meal?`)) {
      try {
        addMeal({
          name: recipe.name,
          description: recipe.notes || '',
          ingredients: [],
          servings: 4,
          category: 'dinner',
          isHelloFresh: true,
          helloFreshId: recipe.helloFreshId,
          rating: recipe.rating,
        });

        updateHelloFreshRecipe(recipe.id, { ...recipe, converted: true });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to convert recipe');
      }
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-gray-800">HelloFresh Integration</h2>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({ helloFreshId: '', name: '', rating: undefined, notes: '' });
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            <span>Rezept importieren</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">{stats.totalRecipes}</div>
            <div className="text-sm text-gray-600">Rezepte</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.convertedToMeals}</div>
            <div className="text-sm text-gray-600">Konvertiert</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.ratedRecipes}</div>
            <div className="text-sm text-gray-600">Bewertet</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.averageRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Ø Rating</div>
          </div>
        </div>
      </div>

      {/* Recipe list */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Rezepte</h3>

        {data.helloFreshRecipes.length === 0 ? (
          <div className="text-center py-8">
            <ChefHat className="mx-auto mb-3 text-gray-400" size={40} />
            <p className="text-gray-500">Keine HelloFresh Rezepte</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.helloFreshRecipes.map((recipe) => (
              <div key={recipe.id} className="border rounded-lg p-4 flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{recipe.name}</h4>
                  <div className="text-sm text-gray-600">ID: {recipe.helloFreshId}</div>
                  {recipe.rating && <div className="text-sm text-gray-600">{formatRating(recipe.rating)}</div>}
                  {recipe.notes && <div className="text-sm text-gray-600 mt-1">{recipe.notes}</div>}
                  <div className="text-xs text-gray-400">
                    Importiert: {formatDateDE(recipe.imported)}
                    {recipe.converted && ' • Konvertiert'}
                  </div>
                </div>
                <div className="ml-4 flex gap-2">
                  {!recipe.converted && (
                    <button
                      onClick={() => handleConertToMeal(recipe)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Konvertieren
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingId(recipe.id);
                      setFormData({
                        helloFreshId: recipe.helloFreshId,
                        name: recipe.name,
                        rating: recipe.rating,
                        notes: recipe.notes || '',
                      });
                      setShowForm(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? 'Rezept bearbeiten' : 'Rezept importieren'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">HelloFresh ID *</label>
                <input
                  type="text"
                  required
                  value={formData.helloFreshId}
                  onChange={(e) => setFormData({ ...formData, helloFreshId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bewertung (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  value={formData.rating || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value ? parseFloat(e.target.value) : undefined })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notizen</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelloFreshIntegration;
