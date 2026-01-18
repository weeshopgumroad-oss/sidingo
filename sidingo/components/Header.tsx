import React from 'react';
import { Heart, Flame, Zap } from 'lucide-react';
import { UserStats } from '../types';

interface HeaderProps {
  stats: UserStats;
}

const Header: React.FC<HeaderProps> = ({ stats }) => {
  return (
    <header className="w-full max-w-2xl mx-auto p-4 flex justify-between items-center bg-white md:bg-transparent sticky top-0 z-10">
      {/* Logo Area */}
      <div className="flex items-center gap-2">
         {/* Simple Sidingo Logo mimicking the prompt's mascot vibe */}
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          S
        </div>
        <span className="text-xl font-extrabold text-green-600 tracking-wide hidden sm:block">Sidingo</span>
      </div>

      {/* Stats Area */}
      <div className="flex items-center gap-4">
        {/* Streak */}
        <div className="flex items-center gap-1.5">
          <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
          <span className="font-bold text-orange-500">{stats.streak}</span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1.5">
          <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          <span className="font-bold text-yellow-500">{stats.xp}</span>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1.5">
          <Heart className="w-6 h-6 text-red-500 fill-red-500 animate-pulse" />
          <span className="font-bold text-red-500">{stats.hearts}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;