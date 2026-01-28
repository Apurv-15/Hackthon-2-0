import React from 'react';
import { Paper } from '../types';
import { generateSlug } from '../services/slugService';

interface PaperCardProps {
  paper: Paper;
  onClick?: (slug: string) => void;
}

export const PaperCard: React.FC<PaperCardProps> = ({ paper, onClick }) => {
  const slug = generateSlug(paper.id, paper.title);
  
  const handleClick = () => {
    if (onClick) {
      onClick(slug);
    }
  };

  return (
    <div
      className="group relative bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover-lift transition-all duration-300 flex flex-col h-full cursor-pointer"
      onClick={handleClick}
    >
      {/* Top Badge */}
      <div className="flex justify-between items-start mb-3">
        <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 rounded-lg">
          Paper
        </span>
        {paper.isOpenAccess && (
          <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>
            Open Access
          </span>
        )}
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
        {paper.title}
      </h3>
      
      <div className="text-sm text-slate-500 mb-4 line-clamp-1">
        {paper.authors.slice(0, 3).map(a => a.name).join(', ')} {paper.authors.length > 3 && '+ more'}
        {' • '}{paper.year}
        {paper.journal && ` • ${paper.journal}`}
      </div>

      {paper.abstract && (
        <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
          {paper.abstract}
        </p>
      )}

      {/* Footer Tags & Actions */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {paper.topics.slice(0, 2).map(topic => (
            <span key={topic} className="text-[11px] px-2 py-1 rounded-md bg-slate-100 text-slate-600 font-medium">
              {topic}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                {paper.citationCount}
            </div>
            <button className="text-slate-400 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
            </button>
        </div>
      </div>
    </div>
  );
};
