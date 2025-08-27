import { useState, useEffect, useCallback } from 'react';
import { Book, SearchFilters } from '../types/Book';
import { bookService } from '../services/apiService';

export const useBooks = (filters?: SearchFilters) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const booksData = await bookService.getAllBooks(filters);
      setBooks(booksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return { books, loading, error, refetch: fetchBooks };
};

export const useBook = (id: string | null) => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setBook(null);
      return;
    }

    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const bookData = await bookService.getBookById(id);
        setBook(bookData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return { book, loading, error };
};