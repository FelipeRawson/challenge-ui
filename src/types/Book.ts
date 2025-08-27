export interface Book {
  id: string; 
  title: string;
  author: string;
  genre: string;
  synopsis: string;
  year?: number;
}

export interface LibraryEntry {
  id: string;
  bookId: string;
  addedAt: string;
  book: Book;
}

export interface SearchFilters {
  search?: string;
  genre?: string;
  author?: string;
}