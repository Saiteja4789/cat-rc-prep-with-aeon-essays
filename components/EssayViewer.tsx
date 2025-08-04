import React, { useMemo } from 'react';
import { VocabularyWord } from '../types';
import Tooltip from './Tooltip';

interface EssayViewerProps {
  essayText: string;
  vocabulary: VocabularyWord[];
  isLoading: boolean;
}

const EssayViewer: React.FC<EssayViewerProps> = ({ essayText, vocabulary, isLoading }) => {
  const processedText = useMemo(() => {
    if (vocabulary.length === 0) {
      return essayText.split('\n').map((paragraph, index) => (
        <p key={index} className="mb-4 font-serif text-lg leading-relaxed text-gray-300">{paragraph}</p>
      ));
    }

    const vocabMap = new Map(vocabulary.map(v => [v.word.toLowerCase(), v]));
    const wordsToHighlight = new Set(vocabulary.map(v => v.word));

    const regex = new RegExp(`\\b(${Array.from(wordsToHighlight).join('|')})\\b`, 'gi');

    const paragraphs = essayText.split('\n');

    return paragraphs.map((paragraph, pIndex) => {
      if (!paragraph.trim()) return null;
      
      const parts = paragraph.split(regex);

      return (
        <p key={pIndex} className="mb-4 font-serif text-lg leading-relaxed text-gray-300">
          {parts.map((part, index) => {
            const lowerPart = part.toLowerCase();
            if (vocabMap.has(lowerPart)) {
              const vocabItem = vocabMap.get(lowerPart)!;
              return (
                <Tooltip key={index} content={<>
                  <strong className="font-bold">{vocabItem.word}</strong>
                  <p className="text-sm mt-1">{vocabItem.definition}</p>
                  <p className="text-sm italic mt-2 text-gray-400">"{vocabItem.usageExample}"</p>
                </>}>
                  <span className="bg-indigo-500/20 text-indigo-300 font-medium rounded-md px-1 cursor-pointer transition-colors hover:bg-indigo-500/30">
                    {part}
                  </span>
                </Tooltip>
              );
            }
            return <React.Fragment key={index}>{part}</React.Fragment>;
          })}
        </p>
      );
    });

  }, [essayText, vocabulary]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
         <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return <div>{processedText}</div>;
};

export default EssayViewer;