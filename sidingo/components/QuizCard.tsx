import React, { useEffect, useState } from 'react';
import { VocabularyItem, QuizOption, ExerciseType } from '../types';
import { Volume2, Mic, Play } from 'lucide-react';

interface QuizCardProps {
  currentWord: VocabularyItem;
  options: QuizOption[];
  selectedOptionId: number | null;
  onSelectOption: (id: number) => void;
  isChecked: boolean;
  isCorrect: boolean | null;
  correctOptionId: number;
  exerciseType: ExerciseType;
  shadowingData?: { sentence: string, tip: string } | null;
  onShadowingComplete: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({
  currentWord,
  options,
  selectedOptionId,
  onSelectOption,
  isChecked,
  isCorrect,
  correctOptionId,
  exerciseType,
  shadowingData,
  onShadowingComplete
}) => {
  
  const [hasSpoken, setHasSpoken] = useState(false);

  const handleSpeak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // English US for shadowing
    utterance.rate = 0.9; // Slightly slower for beginners
    window.speechSynthesis.speak(utterance);
  };

  // Auto-play audio when shadowing data loads
  useEffect(() => {
    if (exerciseType === ExerciseType.SHADOWING && shadowingData) {
       // Small delay to let UI render
       setTimeout(() => handleSpeak(shadowingData.sentence), 500);
       setHasSpoken(false);
    }
  }, [exerciseType, shadowingData]);

  if (exerciseType === ExerciseType.SHADOWING) {
    return (
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center p-4">
        <h2 className="text-xl font-bold text-blue-600 mb-2 text-center uppercase tracking-widest">
          Shadowing Practice
        </h2>
        <p className="text-gray-500 text-center mb-8">Listen and mimic the speaker exactly.</p>

        <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center border-2 border-blue-100 relative overflow-hidden">
          {/* Progress Indication */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-100">
             <div className="h-full bg-blue-500 w-1/3"></div>
          </div>

          {!shadowingData ? (
             <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-8 w-64 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
             </div>
          ) : (
             <>
               <button 
                  onClick={() => handleSpeak(shadowingData.sentence)}
                  className="mb-8 w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 hover:scale-105 transition-all shadow-blue-200 shadow-xl"
               >
                  <Volume2 size={40} />
               </button>

               <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 text-center mb-4 leading-relaxed">
                 "{shadowingData.sentence}"
               </h3>
               
               <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200 mb-8">
                  <span className="text-yellow-600 font-bold text-sm">💡 Tip:</span>
                  <span className="text-yellow-800 text-sm">{shadowingData.tip}</span>
               </div>

               <button
                 onClick={() => {
                   setHasSpoken(true);
                   onShadowingComplete();
                 }}
                 className={`
                    w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all
                    ${hasSpoken 
                      ? 'bg-green-100 text-green-700 border-2 border-green-200' 
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'}
                 `}
               >
                 {hasSpoken ? 'Great Job!' : (
                   <>
                     <Mic size={20} />
                     I repeated it aloud
                   </>
                 )}
               </button>
             </>
          )}
        </div>
      </div>
    );
  }

  // DEFAULT QUIZ MODE
  return (
    <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center p-4">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-8 text-center">
        Select the correct meaning
      </h2>

      {/* Question Card */}
      <div className="flex flex-col items-center mb-10">
        <div className="border-2 border-gray-200 rounded-2xl p-6 mb-4 w-full md:w-2/3 flex flex-col items-center bg-white shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
          
          <div className="flex items-center gap-3 mb-2">
             <Volume2 
                className="text-blue-500 cursor-pointer hover:scale-110 transition-transform" 
                size={32} 
                onClick={() => handleSpeak(currentWord.target)}
             />
             <h1 className="text-4xl font-extrabold text-gray-800">{currentWord.target}</h1>
          </div>
          <span className="text-gray-400 font-semibold uppercase tracking-wider text-xs">{currentWord.category}</span>
          
          {currentWord.image && (
             <img src={currentWord.image} alt="Visual hint" className="mt-4 w-24 h-24 rounded-xl object-cover shadow-sm" />
          )}
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          
          let baseClasses = "p-4 rounded-xl border-2 border-b-4 text-center cursor-pointer font-bold text-lg transition-all active:scale-95 select-none";
          let colorClasses = "bg-white border-gray-200 text-gray-700 hover:bg-gray-50";

          if (isSelected && !isChecked) {
            colorClasses = "bg-blue-100 border-blue-400 text-blue-600";
          } else if (isChecked) {
            if (option.id === correctOptionId) {
              colorClasses = "bg-green-100 border-green-500 text-green-600";
            } else if (isSelected && !isCorrect) {
              colorClasses = "bg-red-100 border-red-400 text-red-500 animate-shake";
            } else {
              colorClasses = "bg-gray-100 border-gray-200 text-gray-400 opacity-60";
            }
          }

          return (
            <div
              key={option.id}
              onClick={() => !isChecked && onSelectOption(option.id)}
              className={`${baseClasses} ${colorClasses}`}
            >
              {option.text}
              <div className="hidden md:block absolute top-2 left-2 text-xs opacity-30 border rounded px-1">
                 {options.indexOf(option) + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizCard;