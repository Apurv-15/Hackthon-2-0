import React, { useState } from 'react';
import { Book } from '../types';

interface BookDetailProps {
  book: Book;
  onClose: () => void;
}

export const BookDetail: React.FC<BookDetailProps> = ({ book, onClose }) => {
  const [imgError, setImgError] = useState(false);
  const coverUrl = book.coverId
    ? `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl max-w-3xl w-full my-8 p-8 shadow-2xl animate-in fade-in scale-95 duration-300" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex gap-8 mb-8">
          {/* Cover Image */}
          {!imgError && coverUrl && (
            <div className="shrink-0 w-32 h-48 bg-slate-100 rounded-lg overflow-hidden shadow-lg">
              <img
                src={coverUrl}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            </div>
          )}

          {/* Header */}
          <div className="flex-1">
            <span className="px-3 py-1.5 text-xs font-bold tracking-wider uppercase text-emerald-600 bg-emerald-50 rounded-lg inline-block mb-4">
              Book
            </span>

            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              {book.title}
            </h1>

            <div className="space-y-2 text-sm text-slate-600 mb-6">
              {book.authors.length > 0 && (
                <p>
                  <span className="font-semibold text-slate-700">Author:</span>{' '}
                  {book.authors.map(a => a.name).join(', ')}
                </p>
              )}
              <p>
                <span className="font-semibold text-slate-700">Year:</span>{' '}
                {book.year}
              </p>
              {book.publisher && (
                <p>
                  <span className="font-semibold text-slate-700">Publisher:</span>{' '}
                  {book.publisher}
                </p>
              )}
            </div>

            {/* Rating & Editions */}
            <div className="flex gap-6">
              {book.rating && (
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Rating
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl text-yellow-500">★</span>
                    <span className="text-2xl font-bold text-slate-900">
                      {book.rating}
                    </span>
                  </div>
                </div>
              )}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Editions
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {book.editionCount}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects/Topics */}
        {book.subjects.length > 0 && (
          <div className="mb-8 pb-8 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Subjects</h2>
            <div className="flex flex-wrap gap-2">
              {book.subjects.slice(0, 10).map(subject => (
                <span
                  key={subject}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  {subject}
                </span>
              ))}
              {book.subjects.length > 10 && (
                <span className="px-3 py-1 text-slate-600 text-sm">
                  +{book.subjects.length - 10} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-slate-200">
          <a
            href={`https://openlibrary.org/search?q=${encodeURIComponent(book.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View on Open Library
          </a>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
