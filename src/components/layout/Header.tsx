/**
 * Main header component
 */
export const Header = () => {
  return (
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
  );
};

export default Header;
