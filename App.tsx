import React, { useState, useEffect, useCallback } from 'react';
import { Hero } from './components/Hero';
import { PaperCard } from './components/PaperCard';
import { BookCard } from './components/BookCard';
import { PaperPage } from './components/PaperPage';
import { BookPage } from './components/BookPage';
import { TopicGraph } from './components/TopicGraph';
import { searchResources, debounce, generateTopicData, fetchFeaturedBooks } from './services/discoveryService';
import { UnifiedResult, ResourceType, TopicData, Paper, Book } from './types';
import { generateSlug } from './services/slugService';
import { useVoiceSearch } from './hooks/useVoiceSearch';
import { useDarkMode } from './hooks/useDarkMode';

type ViewState =
  | { type: 'home' }
  | { type: 'paper'; item: Paper; slug: string }
  | { type: 'book'; item: Book; slug: string };

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UnifiedResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [topicData, setTopicData] = useState<TopicData>({ nodes: [], links: [] });
  const [activeFilter, setActiveFilter] = useState<'all' | 'paper' | 'book'>('all');
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'home' });

  // Dark mode
  const { isDark, toggleTheme } = useDarkMode();

  // Featured books state
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [visibleBooksCount, setVisibleBooksCount] = useState(12);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  // Voice search handler
  const handleVoiceResult = useCallback((transcript: string) => {
    setQuery(transcript);
    performSearch(transcript);
  }, []);

  const { isListening, isSupported: voiceSupported, startListening, stopListening, transcript: voiceTranscript } = useVoiceSearch(handleVoiceResult);

  // Update query in real-time while listening
  useEffect(() => {
    if (isListening && voiceTranscript) {
      setQuery(voiceTranscript);
    }
  }, [isListening, voiceTranscript]);

  // Fetch featured books on mount
  useEffect(() => {
    const loadFeaturedBooks = async () => {
      setLoadingFeatured(true);
      const books = await fetchFeaturedBooks();
      setFeaturedBooks(books);
      setLoadingFeatured(false);
    };
    loadFeaturedBooks();
  }, []);

  // Debounced search
  const performSearch = useCallback(
    debounce(async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }
      setIsLoading(true);
      setHasSearched(true);
      const data = await searchResources(q);
      setResults(data);
      setTopicData(generateTopicData(data));
      setIsLoading(false);
    }, 600),
    []
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    performSearch(e.target.value);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setCurrentView({ type: 'home' });
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleCardClick = (slug: string) => {
    const item = results.find(r => {
      const itemSlug = generateSlug(r.id, r.title);
      return itemSlug === slug;
    });

    if (item) {
      window.history.pushState({ slug, type: item.type }, '', `#/${item.type}/${slug}`);
      if (item.type === ResourceType.Paper) {
        setCurrentView({ type: 'paper', item: item as Paper, slug });
      } else {
        setCurrentView({ type: 'book', item: item as Book, slug });
      }
      window.scrollTo(0, 0);
    }
  };

  const handleFeaturedBookClick = (book: Book) => {
    const slug = generateSlug(book.id, book.title);
    window.history.pushState({ slug, type: 'book' }, '', `#/book/${slug}`);
    setCurrentView({ type: 'book', item: book, slug });
    window.scrollTo(0, 0);
  };

  const handleExploreMore = () => {
    setVisibleBooksCount(prev => Math.min(prev + 12, featuredBooks.length));
  };

  const goBack = () => {
    window.history.pushState({}, '', window.location.pathname);
    setCurrentView({ type: 'home' });
  };

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      if (!hash || hash === '#/') {
        setCurrentView({ type: 'home' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const filteredResults = results.filter(r => activeFilter === 'all' || r.type === activeFilter);

  // Render detail pages
  if (currentView.type === 'paper') {
    return <PaperPage paper={currentView.item} onBack={goBack} />;
  }

  if (currentView.type === 'book') {
    return <BookPage book={currentView.item} onBack={goBack} />;
  }

  // Render home/search view

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100 transition-colors duration-300">

      {/* Navigation / Header */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-white/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={clearSearch}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
              L
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-white">Lumina</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              )}
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className={`relative pt-24 px-4 md:px-6 transition-all duration-500 max-w-[1400px] mx-auto`}>

        <Hero hasSearched={hasSearched} />

        {/* Sticky Search Bar */}
        <div className={`sticky top-20 z-40 transition-all duration-500 ${hasSearched ? 'translate-y-0' : '-translate-y-12'}`}>
          <div className={`mx-auto max-w-2xl relative group ${!hasSearched && 'hidden'}`}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-24 py-3.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl leading-5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent shadow-lg shadow-slate-200/50 dark:shadow-black/20 transition-all"
              placeholder={isListening ? "Listening..." : "Search for quantum physics, neural networks..."}
              value={query}
              onChange={handleInput}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
              {/* Voice Search Button */}
              {voiceSupported && (
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`p-2 rounded-full transition-all duration-300 ${isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                    : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  title={isListening ? "Stop listening" : "Voice search"}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              )}
              {/* Clear Button */}
              {query && (
                <button onClick={clearSearch} className="cursor-pointer">
                  <span className="text-slate-400 hover:text-slate-600 bg-slate-200/50 hover:bg-slate-200 rounded-full p-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Initial Center Search Input (Only shown when not searched) */}
          {!hasSearched && (
            <div className="max-w-2xl mx-auto -mt-32 relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-14 pr-28 py-5 text-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/60 dark:border-slate-700/60 rounded-3xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] transition-all hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)]"
                placeholder={isListening ? "🎤 Listening... speak now" : "Search papers, books, and topics..."}
                value={query}
                onChange={handleInput}
                autoFocus
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {/* Voice Search Button */}
                {voiceSupported && (
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`p-3 rounded-full transition-all duration-300 ${isListening
                      ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30 scale-110'
                      : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    title={isListening ? "Stop listening" : "Voice search"}
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                )}
                <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-md">⌘K</kbd>
              </div>
            </div>
          )}
        </div>

        {/* Featured Books Section (Only shown when not searched) */}
        {!hasSearched && (
          <div className="mt-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Books</h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">{featuredBooks.length} books available</span>
            </div>

            {loadingFeatured ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                  <div key={i} className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-4 animate-pulse">
                    <div className="w-full h-40 bg-slate-200 dark:bg-slate-700 rounded-lg mb-3"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-600 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {featuredBooks.slice(0, visibleBooksCount).map((book) => (
                    <div
                      key={book.id}
                      onClick={() => handleFeaturedBookClick(book)}
                      className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-2xl p-4 shadow-sm hover:shadow-lg dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                      {/* Book Cover */}
                      <div className="w-full h-40 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden mb-3 relative">
                        {book.coverId ? (
                          <img
                            src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-600 text-slate-400">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Book Info */}
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight line-clamp-2 mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {book.authors.length > 0 ? book.authors[0].name : 'Unknown Author'}
                      </p>
                      {book.rating && (
                        <div className="flex items-center gap-1 mt-2 text-yellow-500 text-xs">
                          <span>★</span>
                          <span className="text-slate-600 dark:text-slate-400">{book.rating}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Explore More Button */}
                {visibleBooksCount < featuredBooks.length && (
                  <div className="text-center mt-8">
                    <button
                      onClick={handleExploreMore}
                      className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Explore More Books
                      <span className="ml-2 text-emerald-100">({featuredBooks.length - visibleBooksCount} remaining)</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Results Section */}
        {hasSearched && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* Left Sidebar: Filters */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-36">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl p-6 border border-white/50 dark:border-slate-700/50 shadow-sm">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Filters</h3>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">Type</label>
                    <div className="space-y-2">
                      {['all', 'paper', 'book'].map((type) => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${activeFilter === type ? 'border-blue-500 bg-blue-500' : 'border-slate-300 dark:border-slate-600 group-hover:border-slate-400'}`}>
                            {activeFilter === type && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <span className="text-sm text-slate-700 dark:text-slate-300 capitalize group-hover:text-slate-900 dark:group-hover:text-white">{type === 'all' ? 'All Resources' : type + 's'}</span>
                          <input type="radio" name="filter-type" className="hidden" onChange={() => setActiveFilter(type as any)} checked={activeFilter === type} />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">Year Range</label>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="bg-white dark:bg-slate-700 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">2010</span>
                      <div className="h-1 flex-1 bg-slate-200 dark:bg-slate-600 rounded-full relative">
                        <div className="absolute inset-y-0 left-0 right-0 bg-blue-500 rounded-full opacity-50"></div>
                      </div>
                      <span className="bg-white dark:bg-slate-700 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">2025</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">Availability</label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-slate-700" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Open Access Only</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            {/* Center: Grid */}
            <div className="col-span-1 lg:col-span-6 min-h-[500px]">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-64 rounded-3xl bg-white/50 dark:bg-slate-800/50 animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-slate-800 dark:text-white font-semibold">{filteredResults.length} Results</h2>
                    <select className="bg-transparent text-sm text-slate-500 dark:text-slate-400 border-none focus:ring-0 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
                      <option>Relevance</option>
                      <option>Newest</option>
                      <option>Most Cited</option>
                    </select>
                  </div>

                  {filteredResults.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                      No results found. Try a broader search term.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {filteredResults.map((item) => (
                        <div key={item.id}>
                          {item.type === ResourceType.Paper ? (
                            <PaperCard paper={item as Paper} onClick={handleCardClick} />
                          ) : (
                            <BookCard book={item as Book} onClick={handleCardClick} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right Panel: Explore */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-36">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl p-6 border border-white/50 dark:border-slate-700/50 shadow-sm space-y-6">
                <TopicGraph data={topicData} isDark={isDark} />

                <div className="pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 px-2">Trending in this search</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Deep Learning', 'Transformers', 'Cognitive Science'].map(t => (
                      <span key={t} className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">
                        {t} ↗
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
