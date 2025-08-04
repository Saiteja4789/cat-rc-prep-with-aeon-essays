import React, { useState } from 'react';
import { Question } from '../types';

interface QuestionnaireProps {
  questions: Question[];
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ questions }) => {
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
  const [selectedOptions, setSelectedOptions] = useState<Map<number, number>>(new Map());

  const handleToggleAnswer = (index: number) => {
    setRevealedAnswers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleSelectOption = (qIndex: number, oIndex: number) => {
    setSelectedOptions(prev => new Map(prev).set(qIndex, oIndex));
    setRevealedAnswers(prev => new Set(prev).add(qIndex));
  };
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">Reading Comprehension Questions</h2>
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <p className="font-semibold text-lg mb-4 text-gray-200">{qIndex + 1}. {q.question}</p>
          <div className="space-y-3 mb-4">
            {q.options.map((option, oIndex) => {
              const isSelected = selectedOptions.get(qIndex) === oIndex;
              const isCorrect = q.correctAnswerIndex === oIndex;
              const isRevealed = revealedAnswers.has(qIndex);

              let optionClass = 'border-gray-600 hover:border-indigo-500 hover:bg-gray-800';
              if (isRevealed) {
                if (isCorrect) {
                  optionClass = 'bg-green-500/10 border-green-500 text-green-300';
                } else if (isSelected && !isCorrect) {
                  optionClass = 'bg-red-500/10 border-red-500 text-red-300';
                }
              } else if (isSelected) {
                optionClass = 'border-indigo-500 bg-indigo-500/10';
              }

              return (
                <button
                  key={oIndex}
                  onClick={() => handleSelectOption(qIndex, oIndex)}
                  disabled={isRevealed}
                  className={`w-full text-left flex items-start p-3 border rounded-md transition-all duration-200 text-gray-300 ${optionClass} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + oIndex)}.</span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handleToggleAnswer(qIndex)}
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
          >
            {revealedAnswers.has(qIndex) ? 'Hide' : 'Show'} Answer & Explanation
          </button>

          {revealedAnswers.has(qIndex) && (
            <div className="mt-4 p-4 bg-gray-800 rounded-md border border-gray-700">
              <p className="font-semibold text-green-400">Correct Answer: {String.fromCharCode(65 + q.correctAnswerIndex)}. {q.options[q.correctAnswerIndex]}</p>
              <p className="mt-2 text-gray-300"><strong className="font-medium text-gray-200">Explanation:</strong> {q.explanation}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Questionnaire;