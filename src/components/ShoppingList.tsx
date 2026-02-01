import { useState, useMemo, useCallback } from 'react';
import { ShoppingCart, Trash2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';
import { generateShoppingListFromWeek, getCurrentWeekStart, groupShoppingListBySupermarket, groupShoppingListByCategory } from '../utils/data';
import { formatSupermarket } from '../utils/formatting';

type FilterType = 'all' | 'edeka' | 'rewe' | 'aldi' | 'lidl' | 'other' | 'category';

/**
 * Shopping list component
 */
const ShoppingList = () => {
  const { data, updateShoppingItem, deleteShoppingItem, clearShoppingList, updateData } = useAppContext();
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterValue, setFilterValue] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  const SUPERMARKETS = ['edeka', 'rewe', 'aldi', 'lidl', 'other'] as const;

  // Generate shopping list from current week
  const handleGenerateFromWeek = useCallback(() => {
    try {
      const weekStart = getCurrentWeekStart();
      const items = generateShoppingListFromWeek(weekStart, data);
      
      if (items.length === 0) {
        setError('Keine Gerichte für diese Woche geplant');
        return;
      }

      updateData({ ...data, shoppingLists: items });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate shopping list');
    }
  }, [data, updateData]);

  // Toggle item checked status
  const handleToggleItem = useCallback(
    (id: string) => {
      const item = data.shoppingLists.find((i) => i.id === id);
      if (item) {
        updateShoppingItem(id, { ...item, checked: !item.checked });
      }
    },
    [data.shoppingLists, updateShoppingItem]
  );

  // Delete item
  const handleDeleteItem = useCallback(
    (id: string) => {
      deleteShoppingItem(id);
    },
    [deleteShoppingItem]
  );

  // Clear checked items
  const handleClearChecked = useCallback(() => {
    if (window.confirm('Alle abgehakten Artikel löschen?')) {
      try {
        const remaining = data.shoppingLists.filter((item) => !item.checked);
        updateData({ ...data, shoppingLists: remaining });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to clear items');
      }
    }
  }, [data, updateData]);

  // Clear all items
  const handleClearAll = useCallback(() => {
    if (window.confirm('Alle Artikel löschen?')) {
      clearShoppingList();
    }
  }, [clearShoppingList]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (filterType === 'all') {
      return data.shoppingLists;
    } else if (filterType === 'category') {
      return data.shoppingLists.filter((item) => (item.category || 'Sonstige') === filterValue);
    } else {
      return data.shoppingLists.filter((item) => item.supermarket === filterValue);
    }
  }, [data.shoppingLists, filterType, filterValue]);

  // Stats
  const stats = useMemo(() => {
    const total = data.shoppingLists.length;
    const checked = data.shoppingLists.filter((i) => i.checked).length;
    const unchecked = total - checked;
    return { total, checked, unchecked };
  }, [data.shoppingLists]);

  // Group by supermarket or category
  const grouped = useMemo(() => {
    if (filterType === 'category') {
      return groupShoppingListByCategory(filteredItems);
    }
    return groupShoppingListBySupermarket(filteredItems);
  }, [filteredItems, filterType]);

  return (
    <div className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Header with stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Einkaufsliste</h2>
          <button
            onClick={handleGenerateFromWeek}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ShoppingCart size={20} />
            <span>Aus Wochenplan generieren</span>
          </button>
        </div>

        {/* Stats */}
        {stats.total > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Artikel</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.checked}</div>
              <div className="text-sm text-gray-600">Abgehakt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.unchecked}</div>
              <div className="text-sm text-gray-600">Offen</div>
            </div>
          </div>
        )}

        {/* Filters */}
        {stats.total > 0 && (
          <div className="flex gap-4 flex-wrap mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gruppierung</label>
              <select
                value={filterType}
                onChange={(e) => {
                  const type = e.target.value as FilterType;
                  setFilterType(type);
                  setFilterValue(type === 'category' ? 'Sonstige' : 'all');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="all">Nach Supermarkt</option>
                <option value="category">Nach Kategorie</option>
              </select>
            </div>

            {filterType !== 'all' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter</label>
                <select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {filterType === 'category' ? (
                    Object.keys(groupShoppingListByCategory(data.shoppingLists)).sort().map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))
                  ) : (
                    SUPERMARKETS.map((sm) => (
                      <option key={sm} value={sm}>
                        {formatSupermarket(sm)}
                      </option>
                    ))
                  )}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {stats.total > 0 && (
          <div className="flex gap-2 flex-wrap">
            {stats.checked > 0 && (
              <button
                onClick={handleClearChecked}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Abgehakte löschen
              </button>
            )}
            {stats.total > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Alles löschen
              </button>
            )}
          </div>
        )}
      </div>

      {/* Items by group */}
      {stats.total === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <ShoppingCart className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500 text-lg">Keine Artikel auf der Einkaufsliste</p>
          <p className="text-gray-400 text-sm mt-2">
            Klicken Sie auf "Aus Wochenplan generieren" um automatisch eine Einkaufsliste zu erstellen
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {formatSupermarket(group)} ({items.length})
              </h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleToggleItem(item.id)}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className={`font-medium ${item.checked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.amount} {item.unit}
                          {item.category && ` • ${item.category}`}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="ml-4 p-1 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                      title="Löschen"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
