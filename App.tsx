import React, { useState, useEffect, useCallback } from 'react';
import { Essay, VocabularyWord, Question, User } from './types';
import { getEssays, getEssayById } from './services/essayService';
import { analyzeVocabulary, generateQuestions } from './services/geminiService';
import * as userService from './services/userService';
import Sidebar from './components/Sidebar';
import EssayViewer from './components/EssayViewer';
import Questionnaire from './components/Questionnaire';
import Loader from './components/Loader';
import { HelpCircleIcon } from './components/icons/HelpCircleIcon';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  
  const [essays, setEssays] = useState<Essay[]>([]);
  const [currentEssay, setCurrentEssay] = useState<Essay | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const [isLoadingEssay, setIsLoadingEssay] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for persisted user session on initial load
  useEffect(() => {
    const checkSession = () => {
      const loggedInUser = userService.getCurrentUser();
      if (loggedInUser) {
        setUser(loggedInUser);
      }
    };
    checkSession();
  }, []);
  
  // Fetch essays when user is logged in and is on the landing page
  useEffect(() => {
    if (user && !currentEssay) {
      setEssays(getEssays());
    }
  }, [user, currentEssay]);

  const handleSelectEssay = useCallback(async (id: string) => {
    setIsLoadingEssay(true);
    setError(null);
    setVocabulary([]);
    setQuestions([]);
    
    const selectedEssay = getEssayById(id);
    setCurrentEssay(selectedEssay);

    if (!selectedEssay) {
      setError("Essay not found.");
      setIsLoadingEssay(false);
      return;
    }

    try {
      const vocabData = await analyzeVocabulary(selectedEssay.content);
      setVocabulary(vocabData);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze vocabulary. Please check your API key and try again.');
    } finally {
      setIsLoadingEssay(false);
    }
  }, []);

  const handleGenerateQuestions = useCallback(async () => {
    if (!currentEssay || !user) return;

    setIsLoadingQuestions(true);
    setError(null);
    setQuestions([]);

    try {
      const questionData = await generateQuestions(currentEssay.content);
      setQuestions(questionData);
      const updatedUser = userService.markEssayAsRead(user.email, currentEssay.id);
      if (updatedUser) {
          setUser(updatedUser);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate questions. Please check your API key and try again.');
    } finally {
      setIsLoadingQuestions(false);
    }
  }, [currentEssay, user]);
  
  const handleGoHome = () => {
    setCurrentEssay(null);
    setVocabulary([]);
    setQuestions([]);
    setError(null);
  };

  const handleLogin = (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      const authenticatedUser = userService.authenticateUser(email, password);
      if (authenticatedUser) {
        const updatedUser = userService.updateUserOnLogin(authenticatedUser.email);
        setUser(updatedUser);
        resolve(updatedUser);
      } else {
        reject(new Error("Invalid email or password."));
      }
    });
  };

  const handleSignup = (name: string, email: string, password: string): Promise<User> => {
     return new Promise((resolve, reject) => {
      try {
        const newUser = userService.createUser(name, email, password);
        setUser(newUser);
        resolve(newUser);
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleLogout = () => {
    userService.logoutUser();
    setUser(null);
    setCurrentEssay(null);
  };

  if (!user) {
    if (authView === 'login') {
      return <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setAuthView('signup')} />;
    }
    return <SignupPage onSignup={handleSignup} onSwitchToLogin={() => setAuthView('login')} />;
  }

  if (!currentEssay) {
    return <LandingPage essays={essays} onSelectEssay={handleSelectEssay} user={user} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-800 font-sans">
      <Sidebar 
        essays={essays} 
        onSelectEssay={handleSelectEssay} 
        currentEssayId={currentEssay?.id}
        onGoHome={handleGoHome}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{currentEssay.title}</h1>
            <div className="flex flex-wrap items-center text-gray-400 gap-x-2 text-md">
              <span>by {currentEssay.author}</span>
              <span className="text-gray-600">&bull;</span>
              <span className="font-medium text-teal-400">{currentEssay.genre}</span>
              <span className="text-gray-600">&bull;</span>
              <span>{currentEssay.duration} min read</span>
            </div>
          </header>

          <div className="bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg mb-8">
            <EssayViewer essayText={currentEssay.content} vocabulary={vocabulary} isLoading={isLoadingEssay} />
          </div>

          {error && (
            <div className="bg-red-900/50 border-l-4 border-red-500 text-red-300 p-4 mb-6 rounded-md" role="alert">
              <p className="font-bold">An Error Occurred</p>
              <p>{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleGenerateQuestions}
              disabled={isLoadingQuestions || isLoadingEssay}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isLoadingQuestions ? <Loader /> : <HelpCircleIcon className="w-5 h-5 mr-2" />}
              Generate RC Questions
            </button>
          </div>
          
          {questions.length > 0 && <Questionnaire questions={questions} />}

        </div>
      </main>
    </div>
  );
};

export default App;
