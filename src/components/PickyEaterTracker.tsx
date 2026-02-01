import { useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';
import { getPickyEaterStats } from '../utils/data';
import { formatRelativeTime, getReactionEmoji, formatReaction } from '../utils/formatting';

type TabType = 'stats' | 'profile' | 'likes' | 'dislikes' | 'tried';

/**
 * Picky eater tracker component
 */
const PickyEaterTracker = () => {
  const { data, addPickyEaterFood, removePickyEaterFood, updatePickyEaterProfile } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [error, setError] = useState<string | null>(null);

  const pickyEater = data.pickyEater;
  const stats = getPickyEaterStats(data);

  const handleAddFood = (type: 'likes' | 'dislikes', name: string, notes?: string) => {
    if (!name.trim()) {
      setError('Food name required');
      return;
    }
    try {
      addPickyEaterFood(type, { name: name.trim(), notes });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add food');
    }
  };

  const handleRemoveFood = (type: 'likes' | 'dislikes', id: string) => {
    try {
      removePickyEaterFood(type, id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove food');
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

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b overflow-x-auto">
          {[
            { id: 'stats' as TabType, label: 'Übersicht' },
            { id: 'profile' as TabType, label: 'Profil' },
            { id: 'likes' as TabType, label: `Mag ich (${pickyEater.likes.length})` },
            { id: 'dislikes' as TabType, label: `Mag ich nicht (${pickyEater.dislikes.length})` },
            { id: 'tried' as TabType, label: `Probiert (${pickyEater.triedFoods.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Stats tab */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">Fortschritt von {pickyEater.childName}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-600">{stats.totalTried}</div>
                  <div className="text-sm text-gray-700">Probiert</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-600">{stats.liked}</div>
                  <div className="text-sm text-gray-700">Mag ich</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                  <div className="text-3xl font-bold text-orange-600">{stats.disliked}</div>
                  <div className="text-sm text-gray-700">Mag ich nicht</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                  <div className="text-3xl font-bold text-purple-600">{stats.successRate}%</div>
                  <div className="text-sm text-gray-700">Erfolgsrate</div>
                </div>
              </div>
            </div>
          )}

          {/* Profile tab */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">Kinderprofil</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={pickyEater.childName}
                    onChange={(e) =>
                      updatePickyEaterProfile({ ...pickyEater, childName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alter</label>
                  <input
                    type="number"
                    step="0.5"
                    value={pickyEater.age}
                    onChange={(e) =>
                      updatePickyEaterProfile({ ...pickyEater, age: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allergien</label>
                  <textarea
                    value={pickyEater.allergies.join(', ')}
                    onChange={(e) =>
                      updatePickyEaterProfile({
                        ...pickyEater,
                        allergies: e.target.value.split(',').map((a) => a.trim()),
                      })
                    }
                    placeholder="Durch Komma getrennt"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Likes tab */}
          {activeTab === 'likes' && (
            <AddFoodTab
              title="Lieblingslebensmittel"
              items={pickyEater.likes}
              onAdd={(name, notes) => handleAddFood('likes', name, notes)}
              onRemove={(id) => handleRemoveFood('likes', id)}
            />
          )}

          {/* Dislikes tab */}
          {activeTab === 'dislikes' && (
            <AddFoodTab
              title="Nicht gemocht"
              items={pickyEater.dislikes}
              onAdd={(name, notes) => handleAddFood('dislikes', name, notes)}
              onRemove={(id) => handleRemoveFood('dislikes', id)}
            />
          )}

          {/* Tried tab */}
          {activeTab === 'tried' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">Probierte Lebensmittel</h3>
              {pickyEater.triedFoods.length === 0 ? (
                <p className="text-gray-500">Noch keine Lebensmittel probiert</p>
              ) : (
                <div className="space-y-2">
                  {pickyEater.triedFoods.map((food) => (
                    <div key={food.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{food.foodName}</div>
                          <div className="text-sm text-gray-600">
                            {getReactionEmoji(food.reaction)} {formatReaction(food.reaction)}
                          </div>
                          {food.notes && <div className="text-sm text-gray-600 mt-1">{food.notes}</div>}
                          <div className="text-xs text-gray-400 mt-1">{formatRelativeTime(food.dateTried)}</div>
                        </div>
                        {food.willTryAgain && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Nächste Probe</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AddFoodTab = ({
  title,
  items,
  onAdd,
  onRemove,
}: {
  title: string;
  items: any[];
  onAdd: (name: string, notes?: string) => void;
  onRemove: (id: string) => void;
}) => {
  const [foodName, setFoodName] = useState('');
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    onAdd(foodName, notes);
    setFoodName('');
    setNotes('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      
      <div className="space-y-2">
        <input
          type="text"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Lebensmittel Name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notizen (optional)"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
          <span>Hinzufügen</span>
        </button>
      </div>

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <div>
                <div className="font-medium text-gray-800">{item.name}</div>
                {item.notes && <div className="text-sm text-gray-600">{item.notes}</div>}
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="ml-4 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PickyEaterTracker;
