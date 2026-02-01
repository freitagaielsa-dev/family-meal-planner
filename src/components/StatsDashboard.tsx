import { BarChart3 } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';
import { getMealStats, getPickyEaterStats, getHelloFreshStats, getMostUsedIngredients } from '../utils/data';
import { formatCurrency, formatRating } from '../utils/formatting';

/**
 * Statistics dashboard component
 */
const StatsDashboard = () => {
  const { data } = useAppContext();

  const mealStats = getMealStats(data);
  const pickyEaterStats = getPickyEaterStats(data);
  const helloFreshStats = getHelloFreshStats(data);
  const topIngredients = getMostUsedIngredients(data, 10);

  return (
    <div className="space-y-6">
      {/* Meal Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <BarChart3 size={28} className="text-indigo-600" />
          Essensstatistiken
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Gerichte insgesamt"
            value={mealStats.totalMeals}
            color="indigo"
          />
          <StatCard
            label="Durchschn. Bewertung"
            value={formatRating(mealStats.averageRating)}
            color="blue"
          />
          <StatCard
            label="Durchschn. Kosten"
            value={formatCurrency(mealStats.averageCost)}
            color="green"
          />
          <StatCard
            label="Gesamtkosten"
            value={formatCurrency(mealStats.totalCost)}
            color="purple"
          />
        </div>

        {mealStats.mostCooked && (
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="text-sm font-medium text-indigo-700">Häufigstes Gericht</div>
            <div className="text-lg font-bold text-indigo-900">
              {mealStats.mostCooked.name} ({mealStats.mostCooked.timesCooked}x)
            </div>
          </div>
        )}
      </div>

      {/* Category Distribution */}
      {Object.keys(mealStats.byCategory).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Gerichte nach Kategorie</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(mealStats.byCategory).map(([category, count]) => (
              <div
                key={category}
                className="border rounded-lg p-4 text-center bg-gradient-to-br from-gray-50 to-gray-100"
              >
                <div className="text-2xl font-bold text-gray-800">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{category}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Ingredients */}
      {topIngredients.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Top 10 Zutaten</h3>
          <div className="space-y-2">
            {topIngredients.map((ing, index) => (
              <div key={ing.name} className="flex items-center gap-3">
                <div className="text-sm font-medium text-gray-600 w-8">{index + 1}.</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="h-2 bg-indigo-500 rounded-full" style={{ width: `${(ing.count / (topIngredients[0]?.count || 1)) * 100}%` }} />
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-800">{ing.name}</div>
                  <div className="text-xs text-gray-600">{ing.count}x</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Picky Eater Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Essgewohnheiten - {data.pickyEater.childName}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Probiert"
            value={pickyEaterStats.totalTried}
            color="blue"
          />
          <StatCard
            label="Mag ich"
            value={pickyEaterStats.liked}
            color="green"
          />
          <StatCard
            label="Mag ich nicht"
            value={pickyEaterStats.disliked}
            color="red"
          />
          <StatCard
            label="Erfolgsrate"
            value={`${pickyEaterStats.successRate}%`}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-700">Lieblingslebensmittel</div>
            <div className="text-2xl font-bold text-blue-900">{pickyEaterStats.likeCount}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-sm font-medium text-red-700">Nicht gemocht</div>
            <div className="text-2xl font-bold text-red-900">{pickyEaterStats.dislikeCount}</div>
          </div>
        </div>
      </div>

      {/* HelloFresh Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">HelloFresh Statistiken</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Rezepte insgesamt"
            value={helloFreshStats.totalRecipes}
            color="indigo"
          />
          <StatCard
            label="Konvertiert"
            value={helloFreshStats.convertedToMeals}
            color="green"
          />
          <StatCard
            label="Bewertet"
            value={helloFreshStats.ratedRecipes}
            color="blue"
          />
          <StatCard
            label="Ø Bewertung"
            value={helloFreshStats.averageRating.toFixed(1)}
            color="purple"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) => {
  const colorClasses = {
    indigo: 'from-indigo-50 to-indigo-100 text-indigo-900',
    blue: 'from-blue-50 to-blue-100 text-blue-900',
    green: 'from-green-50 to-green-100 text-green-900',
    red: 'from-red-50 to-red-100 text-red-900',
    purple: 'from-purple-50 to-purple-100 text-purple-900',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-lg p-4`}>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
};

export default StatsDashboard;
