import { useState } from 'react';
import { Navigation } from './components/Navigation.tsx';
import { Explore } from './pages/Explore.tsx';
import { Library } from './pages/Library.tsx';
import { BookDetail } from './pages/BookDetail.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { Book } from './types/Book';

type ActivePage = 'explore' | 'library' | 'book-detail';

function App() {
  const [activePage, setActivePage] = useState<ActivePage>('explore');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleViewBook = (book: Book) => {
    setSelectedBook(book);
    setActivePage('book-detail');
  };

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    if (page !== 'book-detail') {
      setSelectedBook(null);
    }
  };

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'library':
        return <Library onViewBook={handleViewBook} />;
      case 'book-detail':
        return <BookDetail book={selectedBook} onBack={() => handleNavigate('explore')} />;
      default:
        return <Explore onViewBook={handleViewBook} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navigation 
          activePage={activePage} 
          onNavigate={handleNavigate}
        />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {renderCurrentPage()}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;