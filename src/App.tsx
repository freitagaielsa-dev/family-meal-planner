import { useState, useEffect } from 'react';
import { Calendar, ShoppingCart, Heart, ChefHat, BarChart3 } from 'lucide-react';
import { AppData } from './types';
import { loadData, saveData } from './storage';
import WeeklyPlanner from './components/WeeklyPlanner';
import ShoppingList from './components/ShoppingList';
import PickyEaterTracker from './components/PickyEaterTracker';
import HelloFreshIntegration from './components/HelloFreshIntegration';
import StatsDashboard from './components/StatsDashboard';

type Tab = 'planner' | 'shopping' | 'picky-eater' | 'hellofresh' | 'stats';

function App() {
  const [data, setData] = useState<AppData>(loadData());
  const [activeTab, setActiveTab] = useState<Tab>('planner');

  useEffect(() => {
    saveData(data);
  }, [data]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'planner', label: 'Wochenplan', icon: <Calendar size={20} /> },
    { id: 'shopping', label: 'Einkaufsliste', icon: <ShoppingCart size={20} /> },
    { id: 'picky-eater', label: 'Essgewohnheiten', icon: <Heart size={20} /> },
    { id: 'hellofresh', label: 'HelloFresh', icon: <ChefHat size={20} /> },
    { id: 'stats', label: 'Statistiken', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🍽️ Family Meal Planner
          </h1>
          <p className="text-gray-600 mt-1">
            Planung, Einkauf & Essgewohnheiten für die ganze Familie
          </p>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'planner' && <WeeklyPlanner data={data} setData={setData} />}
        {activeTab === 'shopping' && <ShoppingList data={data} setData={setData} />}
        {activeTab === 'picky-eater' && <PickyEaterTracker data={data} setData={setData} />}
        {activeTab === 'hellofresh' && <HelloFreshIntegration data={data} setData={setData} />}
        {activeTab === 'stats' && <StatsDashboard data={data} />}
      </main>
    </div>
  );
}

export default App;
