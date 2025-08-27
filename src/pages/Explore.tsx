import React, { useState, useMemo, useCallback } from 'react';
import { BookOpen } from 'lucide-react';
import { BookCard } from '../components/BookCard';
import { SearchBar } from '../components/SearchBar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useBooks } from '../hooks/useBooks';
import { useLibrary } from '../hooks/useLibrary';
import { Book, SearchFilters } from '../types/Book';

interface ExploreProps {
  onViewBook: (book: Book) => void;
}

export const Explore: React.FC<ExploreProps> = ({ onViewBook }) => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const { books, loading, error, refetch } = useBooks(searchFilters);
  const { addToLibrary, removeFromLibrary, isInLibrary } = useLibrary();

  const genres = useMemo(() => {
    if (!books.length) return [];
    const uniqueGenres = [...new Set(books.map(book => book.genre))].filter(Boolean);
    return uniqueGenres.sort();
  }, [books]);

  const handleSearchChange = useCallback((filters: SearchFilters) => {
    setSearchFilters(filters);
  }, []);

  const handleToggleLibrary = useCallback(async (book: Book) => {
    try {
      if (isInLibrary(book.id)) {
        await removeFromLibrary(book.id);
      } else {
        await addToLibrary(book.id);
      }
    } catch (error) {
      console.error('Error toggling library status:', error);
    }
  }, [isInLibrary, removeFromLibrary, addToLibrary]);

  const handleViewBook = useCallback((book: Book) => {
    onViewBook(book);
  }, [onViewBook]);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Books</h1>
          <p className="text-gray-600">Discover your next great read</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Books</h1>
        <p className="text-gray-600">Discover your next great read</p>
      </div>

      <SearchBar
        onSearchChange={handleSearchChange}
        availableGenres={genres}
        loading={loading}
      />

      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      )}

      {!loading && books.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isInLibrary={isInLibrary(book.id)}
              onViewDetails={() => handleViewBook(book)}
              onToggleLibrary={() => handleToggleLibrary(book)}
            />
          ))}
        </div>
      )}

      {!loading && books.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600">
            {searchFilters.search || searchFilters.genre || searchFilters.author
              ? 'Try adjusting your search criteria'
              : 'No books are available at the moment'}
          </p>
        </div>
      )}
    </div>
  );
};