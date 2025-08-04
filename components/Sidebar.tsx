import React from 'react';
import { Essay } from '../types';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface SidebarProps {
  essays: Essay[];
  currentEssayId?: string;
  onSelectEssay: (id: string) => void;
  onGoHome: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ essays, currentEssayId, onSelectEssay, onGoHome, onLogout }) => {
  return (
    <nav className="w-72 bg-gray-900 shadow-md flex-shrink-0 p-4 hidden md:flex md:flex-col">
      <div className="flex items-center mb-6">
        <BookOpenIcon className="w-8 h-8 text-indigo-500 mr-3" />
        <h2 className="text-xl font-bold text-white">Aeon Essays</h2>
      </div>
       <button
          onClick={onGoHome}
          className="w-full flex items-center justify-start text-left px-4 py-2 mb-4 rounded-md text-sm font-medium transition-colors bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>Back to All Essays</span>
        </button>
      <ul className="flex-1 overflow-y-auto space-y-1">
        {essays.map((essay) => (
          <li key={essay.id}>
            <button
              onClick={() => onSelectEssay(essay.id)}
              className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentEssayId === essay.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {essay.title}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <LogoutIcon className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;