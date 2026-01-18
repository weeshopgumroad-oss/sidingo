import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Header from './components/Header';
import QuizCard from './components/QuizCard';
import LessonComplete from './components/LessonComplete';
import { vocabularyDatabase, MAX_HEARTS, XP_PER_QUIZ, XP_PER_SHADOWING, XP_BONUS_COMPLETE } from './constants';
import { UserStats, GameState, QuizOption, ExerciseType } from './types';
import { generateShadowingContent } from './services/geminiService';
import { Check, X } from 'lucide-react';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App: React.FC = () => {
  // State
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userStats, setUserStats] = useState<UserStats>({
    hearts: MAX_HEARTS,
    streak: 1, 
    xp: 0
  });
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);
  
  // Exercise State
  const [exerciseType, setExerciseType] = useState<ExerciseType>(ExerciseType.QUIZ);
  const [shadowingData, setShadowingData] = useState<{sentence: string, tip: string} | null>(null);
  
  // Quiz State
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shadowingCompleted, setShadowingCompleted] = useState(false);

  // Lesson Queue
  const lessonQueue = useMemo(() => {
    return shuffleArray(vocabularyDatabase).slice(0, 10); 
  }, []);

  const currentWord = lessonQueue[currentWordIndex];

  // Logic to determine exercise type for current word
  useEffect(() => {
    // Randomly decide if this word is a quiz or shadowing (30% chance shadowing for variety)
    const isShadowing = Math.random() > 0.7; 
    setExerciseType(isShadowing ? ExerciseType.SHADOWING : ExerciseType.QUIZ);
    
    if (isShadowing) {
      setShadowingData(null); // Reset
      generateShadowingContent(currentWord.target).then(data => {
        setShadowingData(data);
      });
    }
  }, [currentWordIndex, currentWord]);

  // Generate Options for Quiz
  const options: QuizOption[] = useMemo(() => {
    if (!currentWord || exerciseType !== ExerciseType.QUIZ) return [];

    const correctOption = { id: currentWord.id, text: currentWord.native };
    
    const distractors = shuffleArray(
      vocabularyDatabase.filter(w => w.id !== currentWord.id)
    )
    .slice(0, 3)
    .map(w => ({ id: w.id, text: w.native }));

    return shuffleArray([correctOption, ...distractors]);
  }, [currentWord, exerciseType]);

  const handleOptionSelect = (id: number) => {
    setSelectedOptionId(id);
  };

  const handleCheck = useCallback(async () => {
    if (exerciseType === ExerciseType.QUIZ) {
        if (!selectedOptionId || !currentWord) return;

        const correct = selectedOptionId === currentWord.id;
        setIsCorrect(correct);
        setIsChecked(true);

        if (correct) {
          const clickAudio = new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3'); 
          clickAudio.volume = 0.5;
          clickAudio.play().catch(() => {});
          setUserStats(prev => ({ ...prev, xp: prev.xp + XP_PER_QUIZ }));
        } else {
          if (navigator.vibrate) navigator.vibrate(200);
          setUserStats(prev => {
            const newHearts = Math.max(0, prev.hearts - 1);
            if (newHearts === 0) {
              setTimeout(() => setGameState(GameState.GAME_OVER), 1000);
            }
            return { ...prev, hearts: newHearts };
          });
        }
    } else {
        // Shadowing Check (User self-reported completion)
        setIsChecked(true);
        setIsCorrect(true);
        setUserStats(prev => ({ ...prev, xp: prev.xp + XP_PER_SHADOWING }));
    }
  }, [selectedOptionId, currentWord, exerciseType]);

  const handleShadowingComplete = () => {
      setShadowingCompleted(true);
  };

  const handleNext = () => {
    if (gameState === GameState.GAME_OVER) return;

    if (currentWordIndex < lessonQueue.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsChecked(false);
      setIsCorrect(null);
      setShadowingCompleted(false);
    } else {
      setUserStats(prev => ({ ...prev, xp: prev.xp + XP_BONUS_COMPLETE }));
      setGameState(GameState.COMPLETED);
    }
  };

  const handleRestart = () => {
    window.location.reload(); 
  };

  if (gameState !== GameState.PLAYING) {
    return (
      <LessonComplete 
        stats={userStats} 
        onRestart={handleRestart} 
        isGameOver={gameState === GameState.GAME_OVER} 
      />
    );
  }

  const progressPercentage = ((currentWordIndex) / lessonQueue.length) * 100;

  // Render Footer Button State
  let isButtonDisabled = true;
  if (exerciseType === ExerciseType.QUIZ) {
      isButtonDisabled = !selectedOptionId && !isChecked;
  } else {
      isButtonDisabled = !shadowingCompleted && !isChecked;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      <Header stats={userStats} />
      
      <div className="w-full max-w-2xl mx-auto px-4 mt-2">
        <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">
           Day 1 • Foundation Phase
        </div>
      </div>

      <main className="flex-1 flex flex-col relative pb-32">
        <QuizCard 
          currentWord={currentWord}
          options={options}
          selectedOptionId={selectedOptionId}
          onSelectOption={handleOptionSelect}
          isChecked={isChecked}
          isCorrect={isCorrect}
          correctOptionId={currentWord.id}
          exerciseType={exerciseType}
          shadowingData={shadowingData}
          onShadowingComplete={handleShadowingComplete}
        />
      </main>

      <footer 
        className={`fixed bottom-0 w-full border-t-2 p-4 transition-colors duration-300 z-20 ${
          isChecked 
            ? isCorrect 
              ? 'bg-green-100 border-green-200' 
              : 'bg-red-100 border-red-200' 
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex-1">
            {isChecked && exerciseType === ExerciseType.QUIZ && (
              <div className="flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2">
                <div className={`p-1 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                   {isCorrect ? <Check size={24} /> : <X size={24} />}
                </div>
                <div>
                  <h3 className={`font-bold text-xl ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? 'Correct!' : 'Correct answer:'}
                  </h3>
                  {!isCorrect && (
                    <p className="text-red-600 font-medium">{currentWord.native}</p>
                  )}
                </div>
              </div>
            )}
             {isChecked && exerciseType === ExerciseType.SHADOWING && (
              <div className="flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2">
                <div className="p-1 rounded-full bg-green-500 text-white">
                   <Check size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-green-700">Excellent!</h3>
                  <p className="text-green-600 text-sm">Keep practicing that intonation.</p>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={isChecked ? handleNext : handleCheck}
            disabled={isButtonDisabled}
            className={`
              py-3 px-8 rounded-xl font-bold uppercase tracking-wide text-white transition-all shadow-sm
              min-w-[150px]
              ${
                isButtonDisabled
                  ? 'bg-gray-300 text-gray-400 cursor-not-allowed border-none'
                  : isChecked
                    ? isCorrect
                      ? 'bg-green-500 hover:bg-green-600 border-b-4 border-green-600 active:border-b-0 active:mt-1'
                      : 'bg-red-500 hover:bg-red-600 border-b-4 border-red-600 active:border-b-0 active:mt-1'
                    : 'bg-green-500 hover:bg-green-600 border-b-4 border-green-600 active:border-b-0 active:mt-1'
              }
            `}
          >
            {isChecked ? 'Continue' : 'Check'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;