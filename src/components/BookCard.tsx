import React from 'react';
import { Heart, Eye, Calendar } from 'lucide-react';
import { Book } from '../types/Book';

interface BookCardProps {
  book: Book;
  isInLibrary: boolean;
  onViewDetails: () => void;
  onToggleLibrary: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  isInLibrary,
  onViewDetails,
  onToggleLibrary,
}) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group">
      <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
        <div className="text-primary-600 text-center">
          <div className="text-4xl font-bold mb-2">📚</div>
          <div className="text-xs font-medium px-2">
            {truncateText(book.title, 20)}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
            {truncateText(book.title, 40)}
          </h3>
          <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
          <p className="text-xs text-primary-600 font-medium">{book.genre}</p>
        </div>

        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
          {truncateText(book.synopsis, 100)}
        </p>

        {book.year && (
          <div className="flex items-center text-xs text-gray-500 mb-4">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{book.year}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button
            onClick={onViewDetails}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>

          <button
            onClick={onToggleLibrary}
            className={`p-2 rounded-full transition-all ${
              isInLibrary
                ? 'text-red-500 hover:text-red-600 hover:bg-red-50'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
            title={isInLibrary ? 'Remove from library' : 'Add to library'}
          >
            <Heart className={`w-5 h-5 ${isInLibrary ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};