import React, { useMemo } from 'react';
import { VocabularyWord } from '../types';
import Tooltip from './Tooltip';
import parse, { HTMLReactParserOptions, DOMNode, Text } from 'html-react-parser';

interface EssayViewerProps {
  essayText: string;
  vocabulary: VocabularyWord[];
  isLoading: boolean;
}

const EssayViewer: React.FC<EssayViewerProps> = ({ essayText, vocabulary, isLoading }) => {
  // Debug: Log incoming essayText
  React.useEffect(() => {
    if (essayText === undefined) {
      console.warn('EssayViewer: essayText is undefined');
    } else if (!essayText || !essayText.trim()) {
      console.warn('EssayViewer: essayText is empty');
    } else {
      console.log('EssayViewer: received essayText (first 200 chars):', essayText.slice(0, 200));
    }
  }, [essayText]);

  const processedContent = useMemo(() => {
    if (!essayText || !essayText.trim()) return null;

    // If there's no vocabulary to highlight, just parse the HTML directly for performance.
    if (vocabulary.length === 0) {
      return parse(essayText);
    }

    const vocabMap = new Map<string, VocabularyWord>(vocabulary.map(v => [v.word.toLowerCase(), v]));
    const wordsToHighlight = new Set(vocabulary.map(v => v.word));
    const regex = new RegExp(`\b(${Array.from(wordsToHighlight).join('|')})\b`, 'gi');

    const options: HTMLReactParserOptions = {
      replace: (domNode: DOMNode) => {
        // The key is to only process Text nodes for replacement.
        // The parser will handle traversing through all other element nodes for us.
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
        // By returning undefined for non-Text nodes, we let the parser handle them with its default behavior,
        // which includes processing their children. This is the correct way to recurse.
      },
    };

    return parse(essayText, options);
  }, [essayText, vocabulary]);

  // Show a loading skeleton only if there is no text content to display yet.
  if (isLoading && !essayText) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  // Fallback: If essayText is missing or empty, show a clear message.
  if (!essayText || !essayText.trim()) {
    return (
      <div className="text-center text-gray-400 py-10">
        <p>No essay content available. Please try refreshing or select another essay.</p>
      </div>
    );
  }

  // Render the processed content. A subtle pulse animation indicates when new content/analysis is loading.
  return (
    <div className={`prose prose-invert max-w-none ${isLoading ? 'animate-pulse' : ''}`}>
      {processedContent}
    </div>
  );
};

export default EssayViewer;