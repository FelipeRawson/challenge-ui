import { useState, useEffect, useCallback } from 'react';
import { Book } from '../types/Book';
import { libraryService } from '../services/apiService';

export const useLibrary = () => {
  const [libraryBooks, setLibraryBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLibraryBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const books = await libraryService.getLibraryBooks();
      setLibraryBooks(books);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const addToLibrary = useCallback(async (bookId: string) => {
    try {
      setError(null);
      await libraryService.addToLibrary(bookId);
      await fetchLibraryBooks(); // Refresh library
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add book to library';
      setError(errorMessage);
      throw err;
    }
  }, [fetchLibraryBooks]);

  const removeFromLibrary = useCallback(async (bookId: string) => {
    try {
      setError(null);
      await libraryService.removeFromLibrary(bookId);
      await fetchLibraryBooks(); // Refresh library
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove book from library';
      setError(errorMessage);
      throw err;
    }
  }, [fetchLibraryBooks]);

  const isInLibrary = useCallback((bookId: string) => {
    return libraryBooks.some(book => book.id === bookId);
  }, [libraryBooks]);

  const getLibraryStats = useCallback(() => {
    const totalBooks = libraryBooks.length;
    const uniqueGenres = new Set(libraryBooks.map(book => book.genre)).size;
    const uniqueAuthors = new Set(libraryBooks.map(book => book.author)).size;
    
    return {
      totalBooks,
      uniqueGenres,
      uniqueAuthors,
    };
  }, [libraryBooks]);

  useEffect(() => {
    fetchLibraryBooks();
  }, [fetchLibraryBooks]);

  return {
    libraryBooks,
    loading,
    error,
    addToLibrary,
    removeFromLibrary,
    isInLibrary,
    getLibraryStats,
    refetch: fetchLibraryBooks,
  };
};