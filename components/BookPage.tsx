import React, { useState } from 'react';
import { Book } from '../types';

interface BookPageProps {
  book: Book;
  onBack: () => void;
}

export const BookPage: React.FC<BookPageProps> = ({ book, onBack }) => {
  const [imgError, setImgError] = useState(false);
  const coverUrl = book.coverId
    ? `https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Search</span>
          </button>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Book Cover */}
            <div className="shrink-0 mx-auto md:mx-0">
              {!imgError && coverUrl ? (
                <img
                  src={coverUrl}
                  alt={book.title}
                  className="w-48 h-72 object-cover rounded-xl shadow-lg"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-48 h-72 flex items-center justify-center bg-slate-200 dark:bg-slate-800 rounded-xl text-slate-400 dark:text-slate-600">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              )}
            </div>

            {/* Book Info */}
            <div className="flex-1">
              <span className="px-3 py-1.5 text-xs font-bold tracking-wider uppercase text-emerald-600 bg-emerald-50 rounded-lg inline-block mb-4">
                Book
              </span>

              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                {book.title}
              </h1>

              {/* Authors */}
              <div className="mb-6">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Author{book.authors.length > 1 ? 's' : ''}</h2>
                <div className="flex flex-wrap gap-2">
                  {book.authors.length > 0 ? (
                    book.authors.map((author, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium">
                        {author.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500">Unknown Author</span>
                  )}
                </div>
              </div>

              {/* Rating */}
              {book.rating && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1 text-yellow-500 text-2xl">
                    <span>★</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{book.rating}</span>
                  <span className="text-slate-500">/ 5</span>
                </div>
              )}

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Year</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{book.year}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Editions</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{book.editionCount}</div>
                </div>
                {book.publisher && (
                  <div className="col-span-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Publisher</div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">{book.publisher}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Section */}
        {book.subjects.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50 mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Subjects & Categories</h2>
            <div className="flex flex-wrap gap-3">
              {book.subjects.slice(0, 15).map(subject => (
                <span
                  key={subject}
                  className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 cursor-pointer transition-colors"
                >
                  {subject}
                </span>
              ))}
              {book.subjects.length > 15 && (
                <span className="px-4 py-2 text-slate-500 dark:text-slate-400 text-sm">
                  +{book.subjects.length - 15} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Links Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50 mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Where to Find This Book</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Open Library</div>
                <span className="text-sm text-slate-700 dark:text-slate-300">Free digital lending library</span>
              </div>
              <a
                href={`https://openlibrary.org/search?q=${encodeURIComponent(book.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <span>View on Open Library</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">WorldCat</div>
                <span className="text-sm text-slate-700 dark:text-slate-300">Find in libraries near you</span>
              </div>
              <a
                href={`https://www.worldcat.org/search?q=${encodeURIComponent(book.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <span>Search WorldCat</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="px-8 py-3 border-2 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors"
          >
            ← Back to Search Results
          </button>
        </div>
      </main>
    </div>
  );
};
