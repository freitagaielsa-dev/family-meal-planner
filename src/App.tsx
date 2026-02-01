import { useState } from 'react';
import { Calendar, ShoppingCart, Heart, ChefHat, BarChart3 } from 'lucide-react';
import { AppProvider } from './context/AppContext';
import WeeklyPlanner from './components/WeeklyPlanner';
import ShoppingList from './components/ShoppingList';
import PickyEaterTracker from './components/PickyEaterTracker';
import HelloFreshIntegration from './components/HelloFreshIntegration';
import StatsDashboard from './components/StatsDashboard';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';

type Tab = 'planner' | 'shopping' | 'picky-eater' | 'hellofresh' | 'stats';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState<Tab>('planner');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'planner', label: 'Wochenplan', icon: <Calendar size={20} /> },
    { id: 'shopping', label: 'Einkaufsliste', icon: <ShoppingCart size={20} /> },
    { id: 'picky-eater', label: 'Essgewohnheiten', icon: <Heart size={20} /> },
    { id: 'hellofresh', label: 'HelloFresh', icon: <ChefHat size={20} /> },
    { id: 'stats', label: 'Statistiken', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <Navigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'planner' && <WeeklyPlanner />}
        {activeTab === 'shopping' && <ShoppingList />}
        {activeTab === 'picky-eater' && <PickyEaterTracker />}
        {activeTab === 'hellofresh' && <HelloFreshIntegration />}
        {activeTab === 'stats' && <StatsDashboard />}
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
