import React from 'react';
import { Paper } from '../types';

interface PaperPageProps {
  paper: Paper;
  onBack: () => void;
}

export const PaperPage: React.FC<PaperPageProps> = ({ paper, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
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
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/50 mb-8">
          <div className="flex items-start justify-between mb-6">
            <span className="px-3 py-1.5 text-xs font-bold tracking-wider uppercase text-blue-600 bg-blue-50 rounded-lg">
              Research Paper
            </span>
            {paper.isOpenAccess && (
              <span className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                Open Access
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">
            {paper.title}
          </h1>

          {/* Authors */}
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Authors</h2>
            <div className="flex flex-wrap gap-2">
              {paper.authors.map((author, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                  {author.name}
                </span>
              ))}
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Year</div>
              <div className="text-xl font-bold text-slate-900">{paper.year}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Citations</div>
              <div className="text-xl font-bold text-slate-900">{paper.citationCount.toLocaleString()}</div>
            </div>
            {paper.journal && (
              <div className="col-span-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Journal</div>
                <div className="text-lg font-semibold text-slate-900">{paper.journal}</div>
              </div>
            )}
          </div>
        </div>

        {/* Abstract Section */}
        {paper.abstract && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/50 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Abstract</h2>
            <p className="text-slate-700 leading-relaxed text-lg">
              {paper.abstract}
            </p>
          </div>
        )}

        {/* Topics Section */}
        {paper.topics.length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/50 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Topics & Keywords</h2>
            <div className="flex flex-wrap gap-3">
              {paper.topics.map(topic => (
                <span
                  key={topic}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 cursor-pointer transition-colors"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* DOI & Links Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/50 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Access & Links</h2>
          
          <div className="space-y-4">
            {paper.doi && (
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">DOI</div>
                  <code className="text-sm text-slate-700">{paper.doi}</code>
                </div>
                <a
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>View Paper</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {paper.pdfUrl && (
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">PDF Download</div>
                  <span className="text-sm text-slate-700">Full paper available</span>
                </div>
                <a
                  href={paper.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download PDF</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="px-8 py-3 border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            ← Back to Search Results
          </button>
        </div>
      </main>
    </div>
  );
};
