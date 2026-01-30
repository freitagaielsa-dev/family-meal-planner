import { useState } from 'react';
import { ChefHat, Plus, Star, Trash2, Check } from 'lucide-react';
import { AppData, HelloFreshRecipe, Meal } from '../types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface Props {
  data: AppData;
  setData: (data: AppData) => void;
}

const HelloFreshIntegration = ({ data, setData }: Props) => {
  const [showImportForm, setShowImportForm] = useState(false);

  const importRecipe = (name: string, helloFreshId: string) => {
    const newRecipe: HelloFreshRecipe = {
      id: crypto.randomUUID(),
      helloFreshId,
      name,
      imported: new Date().toISOString(),
      converted: false,
    };

    setData({
      ...data,
      helloFreshRecipes: [...data.helloFreshRecipes, newRecipe],
    });
    setShowImportForm(false);
  };

  const rateRecipe = (id: string, rating: number) => {
    setData({
      ...data,
      helloFreshRecipes: data.helloFreshRecipes.map((recipe) =>
        recipe.id === id ? { ...recipe, rating } : recipe
      ),
    });
  };

  const addNotes = (id: string) => {
    const recipe = data.helloFreshRecipes.find((r) => r.id === id);
    if (!recipe) return;

    const notes = prompt('Notizen zum Rezept:', recipe.notes || '');
    if (notes === null) return;

    setData({
      ...data,
      helloFreshRecipes: data.helloFreshRecipes.map((r) =>
        r.id === id ? { ...r, notes } : r
      ),
    });
  };

  const convertToMeal = (recipeId: string) => {
    const recipe = data.helloFreshRecipes.find((r) => r.id === recipeId);
    if (!recipe) return;

    const servings = parseInt(prompt('Anzahl Portionen:', '4') || '4');
    const description = prompt('Beschreibung (optional):') || '';

    const newMeal: Meal = {
      id: crypto.randomUUID(),
      name: recipe.name,
      description,
      ingredients: [], // User can add these later
      servings,
      category: 'dinner',
      isHelloFresh: true,
      helloFreshId: recipe.helloFreshId,
      rating: recipe.rating,
      timesCooked: 0,
    };

    setData({
      ...data,
      meals: [...data.meals, newMeal],
      helloFreshRecipes: data.helloFreshRecipes.map((r) =>
        r.id === recipeId ? { ...r, converted: true, mealId: newMeal.id } : r
      ),
    });
  };

  const deleteRecipe = (id: string) => {
    if (confirm('HelloFresh-Rezept löschen?')) {
      setData({
        ...data,
        helloFreshRecipes: data.helloFreshRecipes.filter((r) => r.id !== id),
      });
    }
  };

  const averageRating =
    data.helloFreshRecipes.filter((r) => r.rating).length > 0
      ? (
          data.helloFreshRecipes.reduce((sum, r) => sum + (r.rating || 0), 0) /
          data.helloFreshRecipes.filter((r) => r.rating).length
        ).toFixed(1)
      : 'N/A';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <ChefHat className="mr-2 text-orange-500" />
              HelloFresh Integration
            </h2>
            <p className="text-gray-600 mt-1">Importiere und bewerte HelloFresh-Rezepte</p>
          </div>
          <button
            onClick={() => setShowImportForm(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <Plus size={20} className="inline mr-1" />
            Rezept importieren
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-700">{data.helloFreshRecipes.length}</div>
            <div className="text-sm text-orange-600">Rezepte importiert</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-700">
              {data.helloFreshRecipes.filter((r) => r.converted).length}
            </div>
            <div className="text-sm text-green-600">In Gerichte umgewandelt</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-700">
              {data.helloFreshRecipes.filter((r) => r.rating).length}
            </div>
            <div className="text-sm text-yellow-600">Bewertet</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-700">⭐ {averageRating}</div>
            <div className="text-sm text-purple-600">Ø Bewertung</div>
          </div>
        </div>

        {/* Recipe List */}
        <div className="space-y-3">
          {data.helloFreshRecipes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ChefHat size={48} className="mx-auto mb-4 opacity-50" />
              <p>Keine HelloFresh-Rezepte importiert</p>
              <p className="text-sm mt-2">Fügen Sie Rezepte hinzu, um sie zu verfolgen und zu bewerten</p>
            </div>
          ) : (
            [...data.helloFreshRecipes]
              .sort((a, b) => new Date(b.imported).getTime() - new Date(a.imported).getTime())
              .map((recipe) => (
                <div
                  key={recipe.id}
                  className={`p-4 rounded-lg border-2 ${
                    recipe.converted ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{recipe.name}</h3>
                        {recipe.converted && (
                          <span className="text-xs px-2 py-1 bg-green-600 text-white rounded">
                            <Check size={12} className="inline mr-1" />
                            Umgewandelt
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Importiert am {format(new Date(recipe.imported), 'dd.MM.yyyy', { locale: de })}
                      </div>
                      {recipe.notes && (
                        <p className="text-sm mt-2 text-gray-700 italic">{recipe.notes}</p>
                      )}

                      {/* Rating */}
                      <div className="flex items-center space-x-1 mt-3">
                        <span className="text-sm text-gray-600 mr-2">Bewertung:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => rateRecipe(recipe.id, star)}
                            className="focus:outline-none"
                          >
                            <Star
                              size={20}
                              className={
                                recipe.rating && star <= recipe.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }
                            />
                          </button>
                        ))}
                        {recipe.rating && (
                          <span className="ml-2 text-sm text-gray-600">({recipe.rating}/5)</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-4">
                      {!recipe.converted && (
                        <button
                          onClick={() => convertToMeal(recipe.id)}
                          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          In Gericht umwandeln
                        </button>
                      )}
                      <button
                        onClick={() => addNotes(recipe.id)}
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Notizen
                      </button>
                      <button
                        onClick={() => deleteRecipe(recipe.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Import Form Modal */}
      {showImportForm && (
        <ImportForm
          onImport={importRecipe}
          onCancel={() => setShowImportForm(false)}
        />
      )}
    </div>
  );
};

const ImportForm = ({
  onImport,
  onCancel,
}: {
  onImport: (name: string, helloFreshId: string) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState('');
  const [helloFreshId, setHelloFreshId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && helloFreshId) {
      onImport(name, helloFreshId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">HelloFresh-Rezept importieren</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rezeptname*</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="z.B. Pasta Carbonara"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">HelloFresh-ID*</label>
            <input
              type="text"
              required
              value={helloFreshId}
              onChange={(e) => setHelloFreshId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="z.B. HF-12345"
            />
            <p className="text-xs text-gray-500 mt-1">
              Die ID finden Sie auf der Rezeptkarte oder in der HelloFresh-App
            </p>
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
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Importieren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HelloFreshIntegration;
