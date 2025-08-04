import React, { useState, useCallback, useEffect } from 'react';
import { Essay, VocabularyWord, Question } from './types';
import { fetchEssays, fetchEssayById } from './services/essayService';
import { analyzeVocabulary, generateQuestions } from './services/geminiService';
import Sidebar from './components/Sidebar';
import EssayViewer from './components/EssayViewer';
import Questionnaire from './components/Questionnaire';
import Loader from './components/Loader';
import { HelpCircleIcon } from './components/icons/HelpCircleIcon';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  // Debug: Print Gemini API key to console
  // (It should be undefined or a string; never expose secrets in production, but this is for debugging only)
  // eslint-disable-next-line no-console
  console.log('VITE_GEMINI_API_KEY:', import.meta.env.VITE_GEMINI_API_KEY);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [currentEssay, setCurrentEssay] = useState<Essay | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingEssay, setIsLoadingEssay] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [loadingEssays, setLoadingEssays] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleRefreshEssays = useCallback(() => {
    setLoadingEssays(true);
    setError(null);
    fetchEssays()
      .then(setEssays)
      .catch(() => setError('Failed to load essays from Aeon.'))
      .finally(() => setLoadingEssays(false));
  }, []);

  useEffect(() => {
    handleRefreshEssays();
  }, [handleRefreshEssays]);

  const handleSelectEssay = useCallback(async (id: string) => {
    setIsLoadingEssay(true);
    setError(null);
    setVocabulary([]);
    setQuestions([]);

    try {
      const selectedEssay = await fetchEssayById(id);
      setCurrentEssay(selectedEssay);
      if (!selectedEssay) {
        setError("Essay not found.");
        setIsLoadingEssay(false);
        return;
      }
      const vocabData = await analyzeVocabulary(selectedEssay.content);
      setVocabulary(vocabData);
    } catch (err) {
      console.error(err);
      setError('Failed to load or analyze essay.');
    } finally {
      setIsLoadingEssay(false);
    }
  }, []);

  const handleGenerateQuestions = useCallback(async () => {
    if (!currentEssay) return;

    setIsLoadingQuestions(true);
    setError(null);
    setQuestions([]);

    try {
      const questionData = await generateQuestions(currentEssay.content);
      setQuestions(questionData);
    } catch (err) {
      console.error(err);
      setError('Failed to generate questions. Please check your API key and try again.');
    } finally {
      setIsLoadingQuestions(false);
    }
  }, [currentEssay]);

  const handleGoHome = () => {
    setCurrentEssay(null);
    setVocabulary([]);
    setQuestions([]);
    setError(null);
  };

  if (!currentEssay) {
    if (loadingEssays && essays.length === 0) {
      return <div className="flex items-center justify-center min-h-screen text-xl text-gray-300">Loading latest essays from Aeon...</div>;
    }
    if (error && essays.length === 0) {
      return <div className="flex items-center justify-center min-h-screen text-xl text-red-400">{error}</div>;
    }
    return (
      <LandingPage
        essays={essays}
        onSelectEssay={handleSelectEssay}
        onRefreshEssays={handleRefreshEssays}
        loadingEssays={loadingEssays}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-800 font-sans">
      <Sidebar 
        essays={essays} 
        onSelectEssay={handleSelectEssay} 
        currentEssayId={currentEssay?.id}
        onGoHome={handleGoHome}
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
