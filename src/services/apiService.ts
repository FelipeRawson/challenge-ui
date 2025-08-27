import axios, { AxiosResponse } from 'axios';
import { Book, LibraryEntry, SearchFilters } from '../types/Book';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const bookService = {
  async getAllBooks(filters?: SearchFilters): Promise<Book[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.search) {
        params.append('search', filters.search);
      }
      if (filters?.genre) {
        params.append('genre', filters.genre);
      }
      if (filters?.author) {
        params.append('author', filters.author);
      }

      const response: AxiosResponse<Book[]> = await api.get(
        `/books${params.toString() ? `?${params.toString()}` : ''}`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw new Error('Failed to fetch books');
    }
  },

  // Get single book by ID
  async getBookById(id: string): Promise<Book> {
    try {
      const response: AxiosResponse<Book> = await api.get(`/books/${id}`);
      return response.data;

    } catch (error) {
      console.error('Error fetching book:', error);
      throw new Error('Failed to fetch book details');
    }
  },
};

export const libraryService = {
  async getLibraryBooks(): Promise<Book[]> {
    try {
      const response: AxiosResponse<LibraryEntry[]> = await api.get('/library');
      return response.data.map(entry => entry.book);

    } catch (error) {
      console.error('Error fetching library books:', error);
      throw new Error('Failed to fetch library books');
    }
  },

  async addToLibrary(bookId: string): Promise<void> {
    try {
      await api.post('/library', { bookId });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Book not found');
        }
        if (error.response?.status === 409) {
          throw new Error('Book is already in your library');
        }
      }
      console.error('Error adding book to library:', error);
      throw new Error('Failed to add book to library');
    }
  },

  async removeFromLibrary(bookId: string): Promise<void> {
    try {
      await api.delete(`/library/${bookId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Book is not in your library');
        }
      }
      console.error('Error removing book from library:', error);
      throw new Error('Failed to remove book from library');
    }
  },
};

export const healthService = {
  async checkHealth(): Promise<boolean> {
    try {
      const response = await api.get('/health');
      return response.data.status === 'OK';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },
};