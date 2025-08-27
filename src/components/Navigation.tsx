import React from 'react';
import { BookOpen, Heart } from 'lucide-react';

interface NavigationProps {
  activePage: 'explore' | 'library' | 'book-detail';
  onNavigate: (page: 'explore' | 'library') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activePage, onNavigate }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Library Challenge</span>
          </div>

          <div className="flex space-x-8">
            <button
              onClick={() => onNavigate('explore')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === 'explore'
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore</span>
            </button>

            <button
              onClick={() => onNavigate('library')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === 'library'
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>My Favorites</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};