import React from 'react';
import { Essay, User } from '../types';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { ClockIcon } from './icons/ClockIcon';

interface LandingPageProps {
  essays: Essay[];
  user: User;
  onSelectEssay: (id: string) => void;
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

const LandingPage: React.FC<LandingPageProps> = ({ essays, user, onSelectEssay }) => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <BookOpenIcon className="w-8 h-8 text-indigo-500 mr-4" />
            <h1 className="text-2xl font-bold text-white">Select an Essay</h1>
          </div>
          <div className="text-right">
             <p className="text-md text-white">Welcome, {user.name}!</p>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <StatCard icon={<CheckCircleIcon className="w-6 h-6"/>} label="Essays Read" value={user.essaysRead} />
              <StatCard icon={<TrendingUpIcon className="w-6 h-6"/>} label="Day Streak" value={user.dayStreak} />
            </div>
          </div>

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
