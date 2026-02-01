import { Edit2, Trash2 } from 'lucide-react';
import { Meal } from '../../types';
import { formatCurrency, formatRating, formatTime } from '../../utils/formatting';

interface MealLibraryCardProps {
  meal: Meal;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Card component for displaying a meal in the library
 */
const MealLibraryCard = ({ meal, onEdit, onDelete }: MealLibraryCardProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-800 flex-1 pr-2">{meal.name}</h3>
        <div className="flex space-x-1 flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Bearbeiten"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Löschen"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {meal.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{meal.description}</p>
      )}

      <div className="space-y-2 text-xs text-gray-600 border-t pt-3">
        <div className="flex justify-between">
          <span className="font-medium">Portionen:</span>
          <span>{meal.servings}</span>
        </div>

        {meal.prepTime && (
          <div className="flex justify-between">
            <span className="font-medium">Vorbereitung:</span>
            <span>{formatTime(meal.prepTime)}</span>
          </div>
        )}

        {meal.cookTime && (
          <div className="flex justify-between">
            <span className="font-medium">Kochzeit:</span>
            <span>{formatTime(meal.cookTime)}</span>
          </div>
        )}

        {meal.timesCooked > 0 && (
          <div className="flex justify-between">
            <span className="font-medium">Gekocht:</span>
            <span>{meal.timesCooked}x</span>
          </div>
        )}

        {meal.rating && (
          <div className="flex justify-between">
            <span className="font-medium">Bewertung:</span>
            <span>{formatRating(meal.rating)}</span>
          </div>
        )}

        {meal.cost && (
          <div className="flex justify-between">
            <span className="font-medium">Kosten:</span>
            <span>{formatCurrency(meal.cost)}</span>
          </div>
        )}

        {meal.ingredients.length > 0 && (
          <div className="flex justify-between">
            <span className="font-medium">Zutaten:</span>
            <span>{meal.ingredients.length}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealLibraryCard;
