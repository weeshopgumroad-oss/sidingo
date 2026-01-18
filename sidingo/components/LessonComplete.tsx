import React from 'react';
import { Trophy, ArrowRight, RefreshCcw } from 'lucide-react';
import { UserStats } from '../types';

interface LessonCompleteProps {
  stats: UserStats;
  onRestart: () => void;
  isGameOver?: boolean;
}

const LessonComplete: React.FC<LessonCompleteProps> = ({ stats, onRestart, isGameOver = false }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform scale-100 transition-all">
        
        <div className="mb-6 flex justify-center">
          {isGameOver ? (
             <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">😢</span>
             </div>
          ) : (
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-extrabold text-gray-700 mb-2">
          {isGameOver ? "Out of Hearts!" : "Lesson Complete!"}
        </h2>
        
        <p className="text-gray-500 mb-8 text-lg">
          {isGameOver 
            ? "Don't give up! Practice makes perfect." 
            : `You earned ${stats.xp} XP and kept your streak alive!`}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-100">
              <div className="text-orange-500 font-bold text-sm uppercase">Streak</div>
              <div className="text-2xl font-black text-orange-600">{stats.streak}</div>
           </div>
           <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-100">
              <div className="text-yellow-500 font-bold text-sm uppercase">Total XP</div>
              <div className="text-2xl font-black text-yellow-600">{stats.xp}</div>
           </div>
        </div>

        <button 
          onClick={onRestart}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl border-b-4 border-green-700 active:border-b-0 active:mt-1 transition-all flex items-center justify-center gap-2"
        >
          {isGameOver ? <RefreshCcw size={20} /> : <ArrowRight size={20} />}
          {isGameOver ? "Try Again" : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default LessonComplete;