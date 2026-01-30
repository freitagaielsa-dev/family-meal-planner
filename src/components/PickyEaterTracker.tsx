import { useState } from 'react';
import { Heart, ThumbsUp, ThumbsDown, Plus, Trash2 } from 'lucide-react';
import { AppData, TriedFood, FoodPreference } from '../types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface Props {
  data: AppData;
  setData: (data: AppData) => void;
}

const PickyEaterTracker = ({ data, setData }: Props) => {
  const [activeTab, setActiveTab] = useState<'likes' | 'dislikes' | 'tried'>('tried');
  const { pickyEater } = data;

  const addTriedFood = () => {
    const foodName = prompt('Name des Lebensmittels:');
    if (!foodName) return;

    const reactions: Array<TriedFood['reaction']> = ['loved', 'liked', 'neutral', 'disliked', 'refused'];
    
    const reactionChoice = prompt(
      `Reaktion auf "${foodName}":\n1: Geliebt\n2: Gemocht\n3: Neutral\n4: Nicht gemocht\n5: Verweigert\n\nWählen Sie 1-5:`
    );
    
    if (!reactionChoice || !['1', '2', '3', '4', '5'].includes(reactionChoice)) return;
    
    const reaction = reactions[parseInt(reactionChoice) - 1];
    const notes = prompt('Notizen (optional):') || '';
    const willTryAgain = reaction !== 'refused' && confirm('Nochmal probieren?');

    const newFood: TriedFood = {
      id: crypto.randomUUID(),
      foodName,
      dateTried: new Date().toISOString(),
      reaction,
      notes,
      willTryAgain,
    };

    setData({
      ...data,
      pickyEater: {
        ...pickyEater,
        triedFoods: [...pickyEater.triedFoods, newFood],
      },
    });

    // Auto-add to likes/dislikes
    if (reaction === 'loved' || reaction === 'liked') {
      addToLikes(foodName);
    } else if (reaction === 'disliked' || reaction === 'refused') {
      addToDislikes(foodName);
    }
  };

  const addToLikes = (name?: string) => {
    const foodName = name || prompt('Name des Lebensmittels:');
    if (!foodName) return;

    const newLike: FoodPreference = {
      id: crypto.randomUUID(),
      name: foodName,
      addedDate: new Date().toISOString(),
    };

    setData({
      ...data,
      pickyEater: {
        ...pickyEater,
        likes: [...pickyEater.likes, newLike],
      },
    });
  };

  const addToDislikes = (name?: string) => {
    const foodName = name || prompt('Name des Lebensmittels:');
    if (!foodName) return;

    const newDislike: FoodPreference = {
      id: crypto.randomUUID(),
      name: foodName,
      addedDate: new Date().toISOString(),
    };

    setData({
      ...data,
      pickyEater: {
        ...pickyEater,
        dislikes: [...pickyEater.dislikes, newDislike],
      },
    });
  };

  const removeFromLikes = (id: string) => {
    setData({
      ...data,
      pickyEater: {
        ...pickyEater,
        likes: pickyEater.likes.filter((item) => item.id !== id),
      },
    });
  };

  const removeFromDislikes = (id: string) => {
    setData({
      ...data,
      pickyEater: {
        ...pickyEater,
        dislikes: pickyEater.dislikes.filter((item) => item.id !== id),
      },
    });
  };

  const removeTriedFood = (id: string) => {
    setData({
      ...data,
      pickyEater: {
        ...pickyEater,
        triedFoods: pickyEater.triedFoods.filter((item) => item.id !== id),
      },
    });
  };

  const updateChildInfo = () => {
    const name = prompt('Name des Kindes:', pickyEater.childName);
    if (!name) return;
    const age = parseFloat(prompt('Alter:', pickyEater.age.toString()) || pickyEater.age.toString());

    setData({
      ...data,
      pickyEater: {
        ...pickyEater,
        childName: name,
        age,
      },
    });
  };

  const getReactionEmoji = (reaction: TriedFood['reaction']) => {
    const emojis = {
      loved: '❤️',
      liked: '👍',
      neutral: '😐',
      disliked: '👎',
      refused: '🙅',
    };
    return emojis[reaction];
  };

  const getReactionColor = (reaction: TriedFood['reaction']) => {
    const colors = {
      loved: 'bg-pink-100 border-pink-300',
      liked: 'bg-green-100 border-green-300',
      neutral: 'bg-yellow-100 border-yellow-300',
      disliked: 'bg-orange-100 border-orange-300',
      refused: 'bg-red-100 border-red-300',
    };
    return colors[reaction];
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Heart className="mr-2 text-pink-500" />
              Essgewohnheiten
            </h2>
            <p className="text-gray-600 mt-1">
              {pickyEater.childName} ({pickyEater.age} Jahre)
              <button
                onClick={updateChildInfo}
                className="ml-2 text-sm text-indigo-600 hover:underline"
              >
                bearbeiten
              </button>
            </p>
          </div>
          <button
            onClick={addTriedFood}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus size={20} className="inline mr-1" />
            Neues Lebensmittel probiert
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-700">{pickyEater.likes.length}</div>
            <div className="text-sm text-green-600">Mag ich</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-700">{pickyEater.dislikes.length}</div>
            <div className="text-sm text-red-600">Mag ich nicht</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{pickyEater.triedFoods.length}</div>
            <div className="text-sm text-blue-600">Probiert</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-700">
              {pickyEater.triedFoods.filter((f) => f.reaction === 'loved' || f.reaction === 'liked').length}
            </div>
            <div className="text-sm text-purple-600">Positive Reaktionen</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b">
          {[
            { id: 'tried' as const, label: 'Probiert', count: pickyEater.triedFoods.length },
            { id: 'likes' as const, label: 'Mag ich', count: pickyEater.likes.length },
            { id: 'dislikes' as const, label: 'Mag ich nicht', count: pickyEater.dislikes.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'tried' && (
          <div className="space-y-3">
            {pickyEater.triedFoods.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Noch keine Lebensmittel probiert</p>
            ) : (
              [...pickyEater.triedFoods]
                .sort((a, b) => new Date(b.dateTried).getTime() - new Date(a.dateTried).getTime())
                .map((food) => (
                  <div
                    key={food.id}
                    className={`p-4 rounded-lg border-2 ${getReactionColor(food.reaction)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getReactionEmoji(food.reaction)}</span>
                          <h3 className="font-semibold text-lg">{food.foodName}</h3>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Probiert am {format(new Date(food.dateTried), 'dd.MM.yyyy', { locale: de })}
                        </div>
                        {food.notes && <p className="text-sm mt-2 text-gray-700">{food.notes}</p>}
                        {food.willTryAgain && (
                          <div className="mt-2 text-sm text-green-600">🔄 Nochmal probieren</div>
                        )}
                      </div>
                      <button
                        onClick={() => removeTriedFood(food.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {activeTab === 'likes' && (
          <div>
            <button
              onClick={() => addToLikes()}
              className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <ThumbsUp size={16} className="inline mr-1" />
              Hinzufügen
            </button>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {pickyEater.likes.map((item) => (
                <div key={item.id} className="bg-green-50 p-3 rounded-lg border border-green-200 flex justify-between items-center">
                  <span className="font-medium">{item.name}</span>
                  <button
                    onClick={() => removeFromLikes(item.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {pickyEater.likes.length === 0 && (
                <p className="col-span-full text-center text-gray-500 py-8">Keine Favoriten hinzugefügt</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'dislikes' && (
          <div>
            <button
              onClick={() => addToDislikes()}
              className="mb-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <ThumbsDown size={16} className="inline mr-1" />
              Hinzufügen
            </button>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {pickyEater.dislikes.map((item) => (
                <div key={item.id} className="bg-red-50 p-3 rounded-lg border border-red-200 flex justify-between items-center">
                  <span className="font-medium">{item.name}</span>
                  <button
                    onClick={() => removeFromDislikes(item.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {pickyEater.dislikes.length === 0 && (
                <p className="col-span-full text-center text-gray-500 py-8">Keine Abneigungen hinzugefügt</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickyEaterTracker;
