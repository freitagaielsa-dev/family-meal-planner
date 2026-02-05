import { useState, useMemo } from 'react';
import { BookOpen, Clock, ChefHat, Euro, Heart, Search, Filter, X, Plus, ShoppingBag } from 'lucide-react';
import { allRecipes, Recipe, RecipeCategory, Difficulty } from '../data/recipes';
import { useAppContext } from '../hooks/useAppContext';

type FilterCategory = 'all' | RecipeCategory;
type FilterDifficulty = 'all' | Difficulty;

const categoryLabels: Record<string, string> = {
  pasta: 'Pasta',
  rice: 'Reis',
  soulfood: 'Soul Food',
};

const categoryColors: Record<string, string> = {
  pasta: 'bg-red-100 text-red-800',
  rice: 'bg-yellow-100 text-yellow-800',
  soulfood: 'bg-orange-100 text-orange-800',
};

const difficultyLabels: Record<string, string> = {
  easy: 'Einfach',
  medium: 'Mittel',
  hard: 'Schwer',
};

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
};

export default function RecipeBrowser() {
  const { addMeal } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<FilterDifficulty>('all');
  const [pickyEaterFilter, setPickyEaterFilter] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showAddConfirmation, setShowAddConfirmation] = useState(false);

  const filteredRecipes = useMemo(() => {
    return allRecipes.filter((recipe) => {
      // Category filter
      if (categoryFilter !== 'all' && recipe.category !== categoryFilter) {
        return false;
      }

      // Difficulty filter
      if (difficultyFilter !== 'all' && recipe.difficulty !== difficultyFilter) {
        return false;
      }

      // Picky eater filter
      if (pickyEaterFilter && !recipe.pickyEaterFriendly) {
        return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = recipe.name.toLowerCase().includes(query);
        const matchesIngredients = recipe.ingredients.some((ing) =>
          ing.name.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesIngredients) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, categoryFilter, difficultyFilter, pickyEaterFilter]);

  const handleAddToMealPlan = (recipe: Recipe) => {
    // Convert recipe to meal format
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

    addMeal(meal);
    setShowAddConfirmation(true);
    setTimeout(() => setShowAddConfirmation(false), 2000);
  };

  const getSupermarkets = (recipe: Recipe) => {
    const supermarkets = new Set(recipe.ingredients.map((ing) => ing.supermarket));
    return Array.from(supermarkets);
  };

  const supermarketLabels: Record<string, { name: string; color: string }> = {
    rewe: { name: 'REWE', color: 'bg-red-500 text-white' },
    edeka: { name: 'EDEKA', color: 'bg-blue-500 text-white' },
    aldi: { name: 'ALDI', color: 'bg-blue-400 text-white' },
    lidl: { name: 'LIDL', color: 'bg-yellow-400 text-black' },
    other: { name: 'Sonstige', color: 'bg-gray-400 text-white' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="text-indigo-600" size={32} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Rezeptbuch</h2>
            <p className="text-gray-600">{allRecipes.length} leckere Rezepte zum Durchstöbern</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Suche nach Rezept oder Zutat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>

            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as FilterCategory)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">Alle Kategorien</option>
              <option value="pasta">Pasta</option>
              <option value="rice">Reis</option>
              <option value="soulfood">Soul Food</option>
            </select>

            {/* Difficulty filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as FilterDifficulty)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">Alle Schwierigkeiten</option>
              <option value="easy">Einfach</option>
              <option value="medium">Mittel</option>
              <option value="hard">Schwer</option>
            </select>

            {/* Picky eater filter */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={pickyEaterFilter}
                onChange={(e) => setPickyEaterFilter(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 flex items-center gap-1">
                <Heart size={14} className="text-pink-500" />
                Picky-Eater freundlich
              </span>
            </label>

            {/* Clear filters */}
            {(searchQuery || categoryFilter !== 'all' || difficultyFilter !== 'all' || pickyEaterFilter) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setDifficultyFilter('all');
                  setPickyEaterFilter(false);
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X size={14} />
                Filter zurücksetzen
              </button>
            )}
          </div>

          {/* Results count */}
          <div className="text-sm text-gray-600">
            {filteredRecipes.length} von {allRecipes.length} Rezepten angezeigt
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => setSelectedRecipe(recipe)}
            className="bg-white rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  categoryColors[recipe.category]
                }`}
              >
                {categoryLabels[recipe.category]}
              </span>
              {recipe.pickyEaterFriendly && (
                <Heart size={18} className="text-pink-500 fill-pink-500" />
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{recipe.name}</h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>

            {/* Meta info */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                <Clock size={12} />
                {recipe.prepTime + recipe.cookTime} Min.
              </span>
              <span
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                  difficultyColors[recipe.difficulty]
                }`}
              >
                <ChefHat size={12} />
                {difficultyLabels[recipe.difficulty]}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                <Euro size={12} />
                ~{recipe.costEstimate}€
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {recipe.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {recipe.tags.length > 3 && (
                <span className="text-xs text-gray-400">+{recipe.tags.length - 3}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredRecipes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Keine Rezepte gefunden</h3>
          <p className="text-gray-500">Versuche andere Filter oder Suchbegriffe</p>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      categoryColors[selectedRecipe.category]
                    }`}
                  >
                    {categoryLabels[selectedRecipe.category]}
                  </span>
                  {selectedRecipe.pickyEaterFriendly && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                      <Heart size={12} className="fill-pink-500" />
                      Picky-Eater freundlich
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedRecipe.name}</h2>
              </div>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <p className="text-gray-600">{selectedRecipe.description}</p>

              {/* Quick info */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <Clock size={18} className="text-indigo-600" />
                  <div>
                    <div className="text-xs text-gray-500">Vorbereitung</div>
                    <div className="font-medium">{selectedRecipe.prepTime} Min.</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <ChefHat size={18} className="text-indigo-600" />
                  <div>
                    <div className="text-xs text-gray-500">Kochzeit</div>
                    <div className="font-medium">{selectedRecipe.cookTime} Min.</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <Euro size={18} className="text-indigo-600" />
                  <div>
                    <div className="text-xs text-gray-500">Geschätzte Kosten</div>
                    <div className="font-medium">~{selectedRecipe.costEstimate}€</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="text-lg">⭐</span>
                  <div>
                    <div className="text-xs text-gray-500">Bewertung</div>
                    <div className="font-medium">{selectedRecipe.rating}/5</div>
                  </div>
                </div>
              </div>

              {/* Supermarkets */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <ShoppingBag size={18} />
                  Verfügbar bei
                </h3>
                <div className="flex flex-wrap gap-2">
                  {getSupermarkets(selectedRecipe).map((sm) => (
                    <span
                      key={sm}
                      className={`px-3 py-1 rounded text-sm font-medium ${supermarketLabels[sm]?.color || 'bg-gray-400 text-white'}`}
                    >
                      {supermarketLabels[sm]?.name || sm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  Zutaten (für {selectedRecipe.servings} Portionen)
                </h3>
                <ul className="space-y-2 bg-gray-50 rounded-lg p-4">
                  {selectedRecipe.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span className="text-gray-800">{ingredient.name}</span>
                      <span className="text-gray-600 text-sm">
                        {ingredient.amount} {ingredient.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Zubereitung</h3>
                <ol className="space-y-3">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-medium">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRecipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedRecipe.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Notizen & Tipps</h3>
                  <p className="text-yellow-700">{selectedRecipe.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
              <button
                onClick={() => handleAddToMealPlan(selectedRecipe)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                <Plus size={20} />
                Zu meinen Gerichten hinzufügen
              </button>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success notification */}
      {showAddConfirmation && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <Plus size={20} />
          Rezept zu deinen Gerichten hinzugefügt!
        </div>
      )}
    </div>
  );
}
