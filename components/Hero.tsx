import React from 'react';

interface HeroProps {
  hasSearched: boolean;
}

export const Hero: React.FC<HeroProps> = ({ hasSearched }) => {
  if (hasSearched) return null;

  return (
    <div className="relative w-full h-[60vh] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-in-out">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 mesh-gradient opacity-60"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <div className="inline-block mb-4 px-3 py-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full border border-white/40 dark:border-slate-700/40 shadow-sm">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase">New Discovery Engine 2.0</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 drop-shadow-sm">
          Knowledge, <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">Reimagined.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Access 200M+ research papers and books in one beautiful, intelligent workspace.
        </p>

        {/* Floating Stats */}
        <div className="hidden md:flex justify-center gap-6 mt-12">
           <StatPill label="Papers" value="10M+" color="bg-blue-100 text-blue-700" darkColor="dark:bg-blue-900/50 dark:text-blue-300" />
           <StatPill label="Books" value="50M+" color="bg-emerald-100 text-emerald-700" darkColor="dark:bg-emerald-900/50 dark:text-emerald-300" />
           <StatPill label="Topics" value="200K+" color="bg-purple-100 text-purple-700" darkColor="dark:bg-purple-900/50 dark:text-purple-300" />
        </div>
      </div>
    </div>
  );
};

const StatPill: React.FC<{ label: string; value: string; color: string; darkColor?: string }> = ({ label, value, color, darkColor }) => (
  <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl backdrop-blur-md bg-white/60 dark:bg-slate-800/60 border border-white/50 dark:border-slate-700/50 shadow-sm transition hover:scale-105`}>
    <div className={`w-2 h-2 rounded-full ${color.split(' ')[1].replace('text', 'bg')}`}></div>
    <span className="font-bold text-slate-800 dark:text-white">{value}</span>
    <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
  </div>
);
