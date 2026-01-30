import { useState } from 'react';
import { ShoppingCart, Plus, Trash2, Check } from 'lucide-react';
import { AppData, ShoppingListItem } from '../types';

interface Props {
  data: AppData;
  setData: (data: AppData) => void;
}

const ShoppingList = ({ data, setData }: Props) => {
  const [selectedSupermarket, setSelectedSupermarket] = useState<'all' | 'edeka' | 'rewe' | 'aldi' | 'lidl' | 'other'>('all');

  const generateShoppingListFromWeek = () => {
    // Find current week plan
    const currentWeek = data.weekPlans[data.weekPlans.length - 1];
    if (!currentWeek) {
      alert('Keine Wochenplanung gefunden!');
      return;
    }

    const ingredientsMap = new Map<string, ShoppingListItem>();

    // Collect all ingredients from meals in the week
    Object.values(currentWeek.meals).forEach((dayMeals) => {
      Object.values(dayMeals).forEach((mealId) => {
        const meal = data.meals.find((m) => m.id === mealId);
        if (meal) {
          meal.ingredients.forEach((ingredient) => {
            const key = `${ingredient.name}-${ingredient.unit}`;
            if (ingredientsMap.has(key)) {
              const existing = ingredientsMap.get(key)!;
              existing.amount += ingredient.amount;
              existing.mealIds.push(meal.id);
            } else {
              ingredientsMap.set(key, {
                id: crypto.randomUUID(),
                ingredientId: ingredient.id,
                name: ingredient.name,
                amount: ingredient.amount,
                unit: ingredient.unit,
                category: ingredient.category,
                supermarket: ingredient.supermarket || 'other',
                checked: false,
                mealIds: [meal.id],
              });
            }
          });
        }
      });
    });

    setData({
      ...data,
      shoppingLists: Array.from(ingredientsMap.values()),
    });
  };

  const toggleItem = (id: string) => {
    setData({
      ...data,
      shoppingLists: data.shoppingLists.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    });
  };

  const deleteItem = (id: string) => {
    setData({
      ...data,
      shoppingLists: data.shoppingLists.filter((item) => item.id !== id),
    });
  };

  const addManualItem = () => {
    const name = prompt('Artikel Name:');
    if (!name) return;
    const amount = parseFloat(prompt('Menge:') || '1');
    const unit = prompt('Einheit (z.B. kg, Stück):') || 'Stück';
    
    const newItem: ShoppingListItem = {
      id: crypto.randomUUID(),
      ingredientId: crypto.randomUUID(),
      name,
      amount,
      unit,
      supermarket: 'other',
      checked: false,
      mealIds: [],
    };

    setData({
      ...data,
      shoppingLists: [...data.shoppingLists, newItem],
    });
  };

  const clearChecked = () => {
    if (confirm('Alle abgehakten Artikel löschen?')) {
      setData({
        ...data,
        shoppingLists: data.shoppingLists.filter((item) => !item.checked),
      });
    }
  };

  const filteredItems = selectedSupermarket === 'all'
    ? data.shoppingLists
    : data.shoppingLists.filter((item) => item.supermarket === selectedSupermarket);

  const groupedByCategory = filteredItems.reduce((acc, item) => {
    const category = item.category || 'Sonstiges';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);

  const supermarkets = [
    { id: 'all' as const, label: 'Alle', color: 'bg-gray-100' },
    { id: 'edeka' as const, label: 'Edeka', color: 'bg-yellow-100' },
    { id: 'rewe' as const, label: 'Rewe', color: 'bg-red-100' },
    { id: 'aldi' as const, label: 'Aldi', color: 'bg-blue-100' },
    { id: 'lidl' as const, label: 'Lidl', color: 'bg-blue-100' },
    { id: 'other' as const, label: 'Andere', color: 'bg-gray-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <ShoppingCart className="mr-2" />
            Einkaufsliste
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={generateShoppingListFromWeek}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Aus Wochenplan generieren
            </button>
            <button
              onClick={addManualItem}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus size={20} className="inline mr-1" />
              Manuell hinzufügen
            </button>
            <button
              onClick={clearChecked}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 size={20} className="inline mr-1" />
              Abgehakte löschen
            </button>
          </div>
        </div>

        {/* Supermarket Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {supermarkets.map((market) => (
            <button
              key={market.id}
              onClick={() => setSelectedSupermarket(market.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedSupermarket === market.id
                  ? `${market.color} ring-2 ring-indigo-600`
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {market.label}
              {market.id !== 'all' && (
                <span className="ml-2 text-sm">
                  ({data.shoppingLists.filter((i) => i.supermarket === market.id).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Shopping List */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
            <p>Keine Artikel in der Einkaufsliste</p>
            <p className="text-sm mt-2">Generieren Sie eine Liste aus Ihrem Wochenplan oder fügen Sie manuell Artikel hinzu</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByCategory).map(([category, items]) => (
              <div key={category} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-gray-700">{category}</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        item.checked ? 'bg-gray-50 opacity-60' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                            item.checked
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {item.checked && <Check size={16} className="text-white" />}
                        </button>
                        <div className={item.checked ? 'line-through' : ''}>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">
                            {item.amount} {item.unit}
                            {item.mealIds.length > 0 && (
                              <span className="ml-2 text-xs text-indigo-600">
                                ({item.mealIds.length} Gericht{item.mealIds.length > 1 ? 'e' : ''})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 rounded bg-gray-100">
                          {item.supermarket}
                        </span>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {filteredItems.length > 0 && (
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Gesamt: {filteredItems.length} Artikel</span>
              <span>Abgehakt: {filteredItems.filter((i) => i.checked).length}</span>
              <span>Offen: {filteredItems.filter((i) => !i.checked).length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
