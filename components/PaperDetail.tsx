import React from 'react';
import { Paper } from '../types';

interface PaperDetailProps {
  paper: Paper;
  onClose: () => void;
}

export const PaperDetail: React.FC<PaperDetailProps> = ({ paper, onClose }) => {
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

        {/* Header */}
        <div className="mb-8">
          <span className="px-3 py-1.5 text-xs font-bold tracking-wider uppercase text-blue-600 bg-blue-50 rounded-lg inline-block mb-4">
            Paper
          </span>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-4 pr-8">
            {paper.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-6">
            <span>{paper.authors.map(a => a.name).join(', ')}</span>
            <span>•</span>
            <span>{paper.year}</span>
            {paper.journal && (
              <>
                <span>•</span>
                <span>{paper.journal}</span>
              </>
            )}
          </div>

          {paper.isOpenAccess && (
            <span className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 w-fit">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              Open Access
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 pb-8 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Citations
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {paper.citationCount}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Year
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {paper.year}
            </div>
          </div>
          {paper.doi && (
            <div className="col-span-2 md:col-span-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                DOI
              </div>
              <a
                href={`https://doi.org/${paper.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-mono text-sm truncate"
              >
                {paper.doi}
              </a>
            </div>
          )}
        </div>

        {/* Abstract */}
        {paper.abstract && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Abstract</h2>
            <p className="text-slate-700 leading-relaxed">
              {paper.abstract}
            </p>
          </div>
        )}

        {/* Topics */}
        {paper.topics.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Topics</h2>
            <div className="flex flex-wrap gap-2">
              {paper.topics.map(topic => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-slate-200">
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </a>
          )}
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
