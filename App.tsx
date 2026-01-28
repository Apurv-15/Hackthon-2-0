import React, { useState, useEffect, useCallback } from 'react';
import { Hero } from './components/Hero';
import { PaperCard } from './components/PaperCard';
import { BookCard } from './components/BookCard';
import { TopicGraph } from './components/TopicGraph';
import { searchResources, debounce, generateTopicData } from './services/discoveryService';
import { UnifiedResult, ResourceType, TopicData } from './types';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UnifiedResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [topicData, setTopicData] = useState<TopicData>({ nodes: [], links: [] });
  const [activeFilter, setActiveFilter] = useState<'all' | 'paper' | 'book'>('all');

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
  };

  const filteredResults = results.filter(r => activeFilter === 'all' || r.type === activeFilter);

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Navigation / Header */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-white/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={clearSearch}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                    L
                </div>
                <span className="font-bold text-lg tracking-tight text-slate-800">Lumina</span>
            </div>
            
            <div className="flex items-center gap-4">
                 <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                 </button>
                 <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
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
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                     </svg>
                </div>
                <input
                    type="text"
                    className="block w-full pl-11 pr-12 py-3.5 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl leading-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent shadow-lg shadow-slate-200/50 transition-all"
                    placeholder="Search for quantum physics, neural networks..."
                    value={query}
                    onChange={handleInput}
                />
                 {query && (
                    <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                        <span className="text-slate-400 hover:text-slate-600 bg-slate-200/50 hover:bg-slate-200 rounded-full p-1">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </span>
                    </button>
                )}
            </div>
            
            {/* Initial Center Search Input (Only shown when not searched) */}
            {!hasSearched && (
               <div className="max-w-2xl mx-auto -mt-32 relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                     <svg className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                     </svg>
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-14 pr-12 py-5 text-lg bg-white/90 backdrop-blur-2xl border border-white/60 rounded-3xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)]"
                    placeholder="Search papers, books, and topics..."
                    value={query}
                    onChange={handleInput}
                    autoFocus
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 pointer-events-none">
                     <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-md">⌘K</kbd>
                  </div>
               </div>
            )}
        </div>

        {/* Results Section */}
        {hasSearched && (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                {/* Left Sidebar: Filters */}
                <aside className="hidden lg:block lg:col-span-3 sticky top-36">
                    <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-white/50 shadow-sm">
                        <h3 className="font-semibold text-slate-800 mb-4">Filters</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Type</label>
                                <div className="space-y-2">
                                    {['all', 'paper', 'book'].map((type) => (
                                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${activeFilter === type ? 'border-blue-500 bg-blue-500' : 'border-slate-300 group-hover:border-slate-400'}`}>
                                                {activeFilter === type && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                            </div>
                                            <span className="text-sm text-slate-700 capitalize group-hover:text-slate-900">{type === 'all' ? 'All Resources' : type + 's'}</span>
                                            <input type="radio" name="filter-type" className="hidden" onChange={() => setActiveFilter(type as any)} checked={activeFilter === type}/>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Year Range</label>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <span className="bg-white px-2 py-1 rounded border border-slate-200">2010</span>
                                    <div className="h-1 flex-1 bg-slate-200 rounded-full relative">
                                        <div className="absolute inset-y-0 left-0 right-0 bg-blue-500 rounded-full opacity-50"></div>
                                    </div>
                                    <span className="bg-white px-2 py-1 rounded border border-slate-200">2025</span>
                                </div>
                            </div>

                             <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Availability</label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm text-slate-700">Open Access Only</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Center: Grid */}
                <div className="col-span-1 lg:col-span-6 min-h-[500px]">
                    {isLoading ? (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {[1,2,3,4].map(i => (
                               <div key={i} className="h-64 rounded-3xl bg-white/50 animate-pulse"></div>
                           ))}
                       </div>
                    ) : (
                        <>
                           <div className="flex items-center justify-between mb-4 px-2">
                               <h2 className="text-slate-800 font-semibold">{filteredResults.length} Results</h2>
                               <select className="bg-transparent text-sm text-slate-500 border-none focus:ring-0 cursor-pointer hover:text-slate-700">
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
                                                <PaperCard paper={item as any} />
                                            ) : (
                                                <BookCard book={item as any} />
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
                    <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-white/50 shadow-sm space-y-6">
                        <TopicGraph data={topicData} />
                        
                        <div className="pt-6 border-t border-slate-200/50">
                             <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 px-2">Trending in this search</h4>
                             <div className="flex flex-wrap gap-2">
                                 {['Deep Learning', 'Transformers', 'Cognitive Science'].map(t => (
                                     <span key={t} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600 cursor-pointer transition-colors">
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
