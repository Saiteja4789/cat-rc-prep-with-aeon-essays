import React, { useState, useCallback, useEffect } from 'react';
import { Essay, VocabularyWord, Question } from './types';
import { fetchEssays, fetchFullEssayContent } from './services/essayService';
import { analyzeVocabulary, generateQuestions } from './services/geminiService';
import Sidebar from './components/Sidebar';
import EssayViewer from './components/EssayViewer';
import Questionnaire from './components/Questionnaire';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [currentEssay, setCurrentEssay] = useState<Essay | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingEssays, setIsLoadingEssays] = useState(true);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefreshEssays = useCallback((force: boolean) => {
    setIsLoadingEssays(true);
    setError(null);
    fetchEssays(force)
      .then(setEssays)
      .catch(() => setError('Failed to load essays from Aeon.'))
      .finally(() => setIsLoadingEssays(false));
  }, []);

  useEffect(() => {
    // Initial load, don't force refresh
    handleRefreshEssays(false);
  }, [handleRefreshEssays]);

  const handleSelectEssay = useCallback((id: string) => {
    const essay = essays.find(e => e.id === id);
    if (essay) {
      // Set the essay immediately with summary content for a fast UI response
      setCurrentEssay(essay);
      setVocabulary([]);
      setQuestions([]);
      setIsLoadingAnalysis(true);

      // Then, fetch the full content in the background
      fetchFullEssayContent(essay.url)
        .then(fullContent => {
          const completeEssay = { ...essay, content: fullContent };
          setCurrentEssay(completeEssay);
          
          // Now analyze the full content
          return analyzeVocabulary(fullContent);
        })
        .then(vocabData => {
          setVocabulary(vocabData);
        })
        .catch(err => {
          console.error('Failed to fetch or analyze essay:', err);
          setError('Could not load or analyze the full essay. Please try again.');
        })
        .finally(() => {
          setIsLoadingAnalysis(false);
        });
    }
  }, [essays]);

  const handleGenerateQuestions = useCallback(async () => {
    if (!currentEssay?.content) return;

    setIsLoadingAnalysis(true);
    try {
      const generatedQuestions = await generateQuestions(currentEssay.content);
      setQuestions(generatedQuestions);
    } catch (err) {
      setError('Failed to generate questions.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  }, [currentEssay]);

  const handleBackToList = () => {
    setCurrentEssay(null);
    setVocabulary([]);
    setQuestions([]);
    setError(null);
  };

  if (error && essays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <p className="text-2xl mb-4 text-red-500">{error}</p>
        <button 
          onClick={() => handleRefreshEssays(true)} 
          className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!currentEssay) {
    return (
      <LandingPage
        essays={essays}
        onSelectEssay={handleSelectEssay}
        onRefreshEssays={handleRefreshEssays}
        loadingEssays={isLoadingEssays}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar
        essays={essays}
        currentEssayId={currentEssay.id}
        onSelectEssay={handleSelectEssay}
        onGoHome={handleBackToList}
        onLogout={handleBackToList} // Assuming logout and go home are the same for now
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <button onClick={handleBackToList} className="text-indigo-400 hover:text-indigo-300 mb-4">
            &larr; Back to list
          </button>
          <h1 className="text-4xl font-bold text-white mb-2 font-serif">{currentEssay.title}</h1>
          <p className="text-lg text-gray-400 mb-8">by {currentEssay.author}</p>
          {/* CRITICAL FIX: Ensure vocabulary is an array before rendering */}
          {Array.isArray(vocabulary) && (
            <EssayViewer
              essayText={currentEssay.content}
              vocabulary={vocabulary}
              isLoading={isLoadingAnalysis}
            />
          )}
        </div>
        {/* The Questionnaire and future analysis tools would go here */}
        {questions.length > 0 && (
          <div className="w-full lg:w-1/3 xl:w-1/4 p-6 bg-gray-800 border-l border-gray-700 overflow-y-auto">
            <Questionnaire questions={questions} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
