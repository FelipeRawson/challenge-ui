import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { SearchFilters } from '../types/Book';

interface SearchBarProps {
  onSearchChange: (filters: SearchFilters) => void;
  availableGenres: string[];
  loading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = React.memo(({
  onSearchChange,
  availableGenres,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const debounceRef = useRef<number>();

  const sendFilters = useCallback((search: string, genre: string, author: string) => {
    const filters: SearchFilters = {};
    if (search.trim()) filters.search = search.trim();
    if (genre) filters.genre = genre;
    if (author.trim()) filters.author = author.trim();
    onSearchChange(filters);
  }, [onSearchChange]);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    const shouldDebounce = searchTerm !== '' || authorFilter !== '';
    
    if (shouldDebounce) {
      debounceRef.current = window.setTimeout(() => {
        sendFilters(searchTerm, selectedGenre, authorFilter);
      }, 500);
    } else {
      sendFilters(searchTerm, selectedGenre, authorFilter);
    }

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [searchTerm, authorFilter, sendFilters]);

  useEffect(() => {
    sendFilters(searchTerm, selectedGenre, authorFilter);
  }, [selectedGenre]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedGenre('');
    setAuthorFilter('');
    setShowFilters(false);
    onSearchChange({});
  }, [onSearchChange]);

  const hasActiveFilters = searchTerm || selectedGenre || authorFilter;
  const activeFiltersCount = [searchTerm, selectedGenre, authorFilter].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search books by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
            autoComplete="off"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(prev => !prev)}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            showFilters || hasActiveFilters
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
          disabled={loading}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            title="Clear all filters"
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="genre-select" className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <select
                id="genre-select"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">All genres</option>
                {availableGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="author-input" className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                id="author-input"
                type="text"
                placeholder="Filter by author..."
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
                disabled={loading}
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-600 font-medium">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800 font-medium">
                  Search: "{searchTerm}"
                </span>
              )}
              {selectedGenre && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">
                  Genre: {selectedGenre}
                </span>
              )}
              {authorFilter && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                  Author: "{authorFilter}"
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});