import React, { useState } from 'react';
import { ArrowLeft, Heart, User, Calendar, Tag, BookOpen } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useLibrary } from '../hooks/useLibrary';
import { Book } from '../types/Book';

interface BookDetailProps {
  book: Book | null;
  onBack: () => void;
}

export const BookDetail: React.FC<BookDetailProps> = ({ book, onBack }) => {
  const { addToLibrary, removeFromLibrary, isInLibrary } = useLibrary();
  const [isToggling, setIsToggling] = useState(false);

  if (!book) {
    return (
      <div className="text-center py-20">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Book not found</h3>
        <p className="text-gray-600 mb-4">The book you're looking for doesn't exist.</p>
        <button
          onClick={onBack}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Go back to explore
        </button>
      </div>
    );
  }

  const handleToggleLibrary = async () => {
    if (isToggling) return;
    
    try {
      setIsToggling(true);
      if (isInLibrary(book.id)) {
        await removeFromLibrary(book.id);
      } else {
        await addToLibrary(book.id);
      }
    } catch (error) {
      console.error('Error toggling library status:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const inLibrary = isInLibrary(book.id);

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 p-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to books</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-gradient-to-br from-primary-100 to-primary-300 p-8 flex items-center justify-center">
            <div className="text-center text-primary-700">
              <div className="text-8xl mb-4">📚</div>
              <div className="text-lg font-semibold">
                {book.title}
              </div>
            </div>
          </div>

          <div className="md:w-2/3 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {book.title}
                </h1>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-lg">{book.author}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Tag className="w-4 h-4 mr-2" />
                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm font-medium">
                      {book.genre}
                    </span>
                  </div>
                  {book.year && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{book.year}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleToggleLibrary}
                disabled={isToggling}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  inLibrary
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                    : 'bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isToggling ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <>
                    <Heart className={`w-5 h-5 ${inLibrary ? 'fill-current' : ''}`} />
                    <span>
                      {inLibrary ? 'Remove from Library' : 'Add to Library'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Synopsis */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Synopsis</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {book.synopsis}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {book.author.split(' ').length}
                </div>
                <div className="text-sm text-gray-600">Author Names</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {book.synopsis.split(' ').length}
                </div>
                <div className="text-sm text-gray-600">Words in Synopsis</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {inLibrary && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <Heart className="w-5 h-5 text-green-600 fill-current mr-2" />
            <span className="text-green-800 font-medium">
              This book is in your library
            </span>
          </div>
        </div>
      )}
    </div>
  );
};