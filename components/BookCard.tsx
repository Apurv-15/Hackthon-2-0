import React, { useState } from 'react';
import { Book } from '../types';
import { generateSlug } from '../services/slugService';

interface BookCardProps {
  book: Book;
  onClick?: (slug: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const [imgError, setImgError] = useState(false);
  const coverUrl = book.coverId 
    ? `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg` 
    : null;
  
  const slug = generateSlug(book.id, book.title);
  
  const handleClick = () => {
    if (onClick) {
      onClick(slug);
    }
  };

  return (
    <div
      className="group relative bg-white/80 backdrop-blur-xl border border-white/40 p-4 rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover-lift transition-all duration-300 h-full cursor-pointer"
      onClick={handleClick}
    >
        <div className="flex gap-4 h-full">
            {/* Cover Image Container */}
            <div className="shrink-0 w-24 h-36 bg-slate-100 rounded-lg overflow-hidden shadow-inner relative">
                {!imgError && coverUrl ? (
                    <img 
                        src={coverUrl} 
                        alt={book.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 min-w-0">
                <div className="mb-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-emerald-600 bg-emerald-50 rounded-md">
                        Book
                    </span>
                </div>
                
                <h3 className="text-base font-bold text-slate-900 leading-snug mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {book.title}
                </h3>
                
                <div className="text-xs text-slate-500 mb-2">
                     {book.authors.length > 0 ? book.authors[0].name : 'Unknown Author'}
                     {' • '}{book.year}
                </div>

                <div className="mt-auto">
                    {book.rating && (
                        <div className="flex items-center gap-1 mb-2 text-yellow-500 text-xs">
                             <span>★</span> <span className="text-slate-600 font-medium">{book.rating}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                         <span className="text-[10px] text-slate-400 font-medium border border-slate-200 rounded px-1.5 py-0.5">
                            {book.editionCount} Editions
                         </span>
                         <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
