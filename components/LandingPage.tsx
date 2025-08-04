import React from 'react';
import { Essay, User } from '../types';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { ClockIcon } from './icons/ClockIcon';

interface LandingPageProps {
  essays: Essay[];
  user?: User;
  onSelectEssay: (id: string) => void;
  onRefreshEssays: () => void;
  loadingEssays: boolean;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="bg-gray-800 p-4 rounded-lg flex items-center">
    <div className="p-3 rounded-full bg-indigo-600/20 text-indigo-400 mr-4">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ essays, user, onSelectEssay, onRefreshEssays, loadingEssays }) => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <BookOpenIcon className="w-8 h-8 text-indigo-500 mr-4" />
            <h1 className="text-2xl font-bold text-white">Select an Essay</h1>
          </div>
          <button
            onClick={onRefreshEssays}
            disabled={loadingEssays}
            className={`ml-4 flex items-center px-4 py-2 rounded bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed`}
            aria-label="Refresh Essays"
          >
            {loadingEssays ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l5-5-5-5v4a10 10 0 00-10 10h4z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.002 19.938A9 9 0 0021 12h-1m-7-7V4m0 16v-1m-2-2a7 7 0 1114 0 7 7 0 01-14 0z" /></svg>
            )}
            Refresh Essays
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {essays.map(essay => (
              <button
                key={essay.id}
                onClick={() => onSelectEssay(essay.id)}
                className="bg-gray-800 rounded-xl shadow-lg p-6 text-left hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 flex flex-col h-full group"
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white pr-2">{essay.title}</h3>
                    <span className="flex-shrink-0 text-xs font-semibold uppercase bg-teal-500/20 text-teal-400 py-1 px-2 rounded-full">{essay.genre}</span>
                  </div>
                  <p className="text-gray-400 font-medium">by {essay.author}</p>
                </div>
                 <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                    <span className="text-indigo-400 font-semibold group-hover:text-indigo-300 transition-colors">Start Reading &rarr;</span>
                    <div className="flex items-center text-sm text-gray-400">
                      <ClockIcon className="w-4 h-4 mr-1.5" />
                      <span>{essay.duration} min read</span>
                    </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Powered by Gemini API. Essays sourced from Aeon.co.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
