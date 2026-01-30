import { BarChart3, TrendingUp, Heart, DollarSign, Calendar } from 'lucide-react';
import { AppData } from '../types';

interface Props {
  data: AppData;
}

const StatsDashboard = ({ data }: Props) => {
  // Calculate statistics
  const totalMeals = data.meals.length;
  const totalCooked = data.meals.reduce((sum, meal) => sum + meal.timesCooked, 0);
  const avgRating =
    data.meals.filter((m) => m.rating).length > 0
      ? (
          data.meals.reduce((sum, m) => sum + (m.rating || 0), 0) /
          data.meals.filter((m) => m.rating).length
        ).toFixed(1)
      : 'N/A';

  const mostCookedMeals = [...data.meals]
    .sort((a, b) => b.timesCooked - a.timesCooked)
    .slice(0, 5)
    .filter((m) => m.timesCooked > 0);

  const topRatedMeals = [...data.meals]
    .filter((m) => m.rating && m.rating >= 4)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  const mealsByCategory = data.meals.reduce((acc, meal) => {
    const category = meal.category || 'other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const helloFreshMeals = data.meals.filter((m) => m.isHelloFresh).length;
  const avgCost =
    data.meals.filter((m) => m.cost).length > 0
      ? (
          data.meals.reduce((sum, m) => sum + (m.cost || 0), 0) /
          data.meals.filter((m) => m.cost).length
        ).toFixed(2)
      : 'N/A';

  const totalCost = data.meals.reduce((sum, m) => sum + (m.cost || 0) * m.timesCooked, 0).toFixed(2);

  const { pickyEater } = data;
  const positiveReactions = pickyEater.triedFoods.filter(
    (f) => f.reaction === 'loved' || f.reaction === 'liked'
  ).length;
  const negativeReactions = pickyEater.triedFoods.filter(
    (f) => f.reaction === 'disliked' || f.reaction === 'refused'
  ).length;
  const successRate =
    pickyEater.triedFoods.length > 0
      ? ((positiveReactions / pickyEater.triedFoods.length) * 100).toFixed(0)
      : 'N/A';

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<BarChart3 className="text-indigo-600" />}
          title="Gesamt Gerichte"
          value={totalMeals}
          subtitle={`${totalCooked} mal gekocht`}
          color="bg-indigo-50"
        />
        <StatCard
          icon={<TrendingUp className="text-green-600" />}
          title="Ø Bewertung"
          value={avgRating}
          subtitle={`${data.meals.filter((m) => m.rating).length} bewertet`}
          color="bg-green-50"
        />
        <StatCard
          icon={<DollarSign className="text-orange-600" />}
          title="Ø Kosten/Gericht"
          value={avgCost === 'N/A' ? avgCost : `€${avgCost}`}
          subtitle={`Gesamt: €${totalCost}`}
          color="bg-orange-50"
        />
        <StatCard
          icon={<Heart className="text-pink-600" />}
          title="Erfolgsrate Kind"
          value={successRate === 'N/A' ? successRate : `${successRate}%`}
          subtitle={`${positiveReactions} positive`}
          color="bg-pink-50"
        />
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Cooked Meals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp size={20} className="mr-2 text-indigo-600" />
            Am häufigsten gekocht
          </h3>
          {mostCookedMeals.length === 0 ? (
            <p className="text-gray-500 text-sm">Noch keine Gerichte gekocht</p>
          ) : (
            <div className="space-y-3">
              {mostCookedMeals.map((meal, index) => (
                <div key={meal.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{meal.name}</div>
                      {meal.rating && (
                        <div className="text-xs text-gray-500">⭐ {meal.rating}/5</div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-600">
                    {meal.timesCooked}x
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Rated Meals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Heart size={20} className="mr-2 text-pink-600" />
            Bestbewertete Gerichte
          </h3>
          {topRatedMeals.length === 0 ? (
            <p className="text-gray-500 text-sm">Noch keine Bewertungen</p>
          ) : (
            <div className="space-y-3">
              {topRatedMeals.map((meal, index) => (
                <div key={meal.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center font-bold text-pink-600">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{meal.name}</div>
                      <div className="text-xs text-gray-500">
                        {meal.timesCooked > 0 && `${meal.timesCooked}x gekocht`}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-yellow-600">
                    ⭐ {meal.rating}/5
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Meals by Category */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Calendar size={20} className="mr-2 text-blue-600" />
            Gerichte nach Kategorie
          </h3>
          <div className="space-y-3">
            {Object.entries(mealsByCategory).map(([category, count]) => {
              const labels: Record<string, string> = {
                breakfast: 'Frühstück',
                lunch: 'Mittagessen',
                dinner: 'Abendessen',
                snack: 'Snack',
                other: 'Sonstiges',
              };
              const percentage = ((count / totalMeals) * 100).toFixed(0);

              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{labels[category] || category}</span>
                    <span className="text-gray-600">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Picky Eater Progress */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Heart size={20} className="mr-2 text-pink-600" />
            {pickyEater.childName} - Fortschritt
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">{pickyEater.likes.length}</div>
                <div className="text-sm text-green-600">Mag ich</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-700">{pickyEater.dislikes.length}</div>
                <div className="text-sm text-red-600">Mag ich nicht</div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Probiert</span>
                <span className="text-gray-600">{pickyEater.triedFoods.length} Lebensmittel</span>
              </div>
              <div className="space-y-2 mt-3">
                <div className="flex justify-between text-xs">
                  <span>Positive Reaktionen</span>
                  <span className="font-semibold text-green-600">{positiveReactions}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Negative Reaktionen</span>
                  <span className="font-semibold text-red-600">{negativeReactions}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Neutral</span>
                  <span className="font-semibold text-gray-600">
                    {pickyEater.triedFoods.filter((f) => f.reaction === 'neutral').length}
                  </span>
                </div>
              </div>
            </div>
            {pickyEater.allergies.length > 0 && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="text-sm font-medium text-yellow-800">Allergien</div>
                <div className="text-xs text-yellow-700 mt-1">
                  {pickyEater.allergies.join(', ')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HelloFresh Stats */}
      {helloFreshMeals > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <BarChart3 size={20} className="mr-2 text-orange-600" />
            HelloFresh Statistiken
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-700">{helloFreshMeals}</div>
              <div className="text-sm text-orange-600">HelloFresh Gerichte</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-700">
                {data.helloFreshRecipes.length}
              </div>
              <div className="text-sm text-orange-600">Rezepte importiert</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-700">
                {data.helloFreshRecipes.filter((r) => r.converted).length}
              </div>
              <div className="text-sm text-orange-600">Konvertiert</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-700">
                {data.helloFreshRecipes.filter((r) => r.rating && r.rating >= 4).length}
              </div>
              <div className="text-sm text-orange-600">Top bewertet (≥4)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}) => (
  <div className={`${color} p-6 rounded-lg border border-gray-200`}>
    <div className="flex items-start justify-between mb-2">
      <div className="text-sm font-medium text-gray-600">{title}</div>
      {icon}
    </div>
    <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-xs text-gray-600">{subtitle}</div>
  </div>
);

export default StatsDashboard;
