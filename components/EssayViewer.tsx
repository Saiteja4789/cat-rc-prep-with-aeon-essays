import React, { useMemo } from 'react';
import { VocabularyWord } from '../types';
import Tooltip from './Tooltip';
import parse, { domToReact, HTMLReactParserOptions, Element, DOMNode, Text } from 'html-react-parser';

interface EssayViewerProps {
  essayText: string;
  vocabulary: VocabularyWord[];
  isLoading: boolean;
}

const EssayViewer: React.FC<EssayViewerProps> = ({ essayText, vocabulary, isLoading }) => {
  const processedContent = useMemo(() => {
    if (!essayText) return null;

    const vocabMap = new Map<string, VocabularyWord>(vocabulary.map(v => [v.word.toLowerCase(), v]));
    if (vocabMap.size === 0) {
      return parse(essayText);
    }

    const wordsToHighlight = new Set(vocabulary.map(v => v.word));
    const regex = new RegExp(`\\b(${Array.from(wordsToHighlight).join('|')})\\b`, 'gi');

    const options: HTMLReactParserOptions = {
      replace: (domNode: DOMNode) => {
        if (domNode instanceof Text) {
          const text = domNode.data;
          if (!text.trim()) {
            return <>{text}</>;
          }

          const parts = text.split(regex);
          if (parts.length <= 1) {
            return <>{text}</>;
          }

          return (
            <>
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
            </>
          );
        }
        return domToReact([domNode], options);
      },
    };

    return parse(essayText, options);
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

  return <div className="prose prose-invert max-w-none">{processedContent}</div>;
};

export default EssayViewer;