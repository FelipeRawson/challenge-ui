import React from 'react';
import { Heart, BookOpen } from 'lucide-react';
import { BookCard } from '../components/BookCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useLibrary } from '../hooks/useLibrary';
import { Book } from '../types/Book';

interface LibraryProps {
  onViewBook: (book: Book) => void;
}

export const Library: React.FC<LibraryProps> = ({ onViewBook }) => {
  const { libraryBooks, loading, error, removeFromLibrary, refetch } = useLibrary();

  const handleRemoveFromLibrary = async (book: Book) => {
    try {
      await removeFromLibrary(book.id);
    } catch (error) {
      console.error('Error removing book from library:', error);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Library</h1>
          <p className="text-gray-600">Your favorite books collection</p>
        </div>
        <ErrorMessage 
          message={error} 
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Heart className="w-8 h-8 text-red-500 fill-current" />
          <h1 className="text-3xl font-bold text-gray-900">My Library</h1>
        </div>
        <p className="text-gray-600">Your favorite books collection</p>
        {!loading && libraryBooks.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {libraryBooks.length} book{libraryBooks.length !== 1 ? 's' : ''} in your library
          </p>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" text="Loading your library..." />
        </div>
      )}

      {!loading && libraryBooks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {libraryBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isInLibrary={true}
              onViewDetails={() => onViewBook(book)}
              onToggleLibrary={() => handleRemoveFromLibrary(book)}
            />
          ))}
        </div>
      )}

      {!loading && libraryBooks.length === 0 && (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Your library is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Start building your collection by exploring books and adding them to your library.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">
                💡 <strong>Tip:</strong> Click the heart icon on any book to add it to your library.
              </p>
              <p className="text-xs text-gray-500">
                Books in your library are saved and you can access them anytime from here.
              </p>
            </div>
          </div>
        </div>
      )}

      {!loading && libraryBooks.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-primary-600">
                {libraryBooks.length}
              </div>
              <div className="text-sm text-gray-600">Total Books</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-primary-600">
                {new Set(libraryBooks.map(book => book.genre)).size}
              </div>
              <div className="text-sm text-gray-600">Genres</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-primary-600">
                {new Set(libraryBooks.map(book => book.author)).size}
              </div>
              <div className="text-sm text-gray-600">Authors</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};