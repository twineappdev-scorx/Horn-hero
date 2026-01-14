
import React from 'react';
import { PlayerStats } from '../types';

interface GameHUDProps {
  stats: PlayerStats;
}

const GameHUD: React.FC<GameHUDProps> = ({ stats }) => {
  return (
    <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-30 pointer-events-none">
      <div className="bg-[#0b2135]/80 backdrop-blur-md p-4 rounded-2xl border border-[#20c997]/20 shadow-xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#20c997]/60">Bandit Score</p>
        <p className="text-3xl font-bungee text-white">{stats.score.toLocaleString()}</p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="bg-[#f39c12] p-4 rounded-2xl shadow-xl transform rotate-1 border-b-4 border-orange-700">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#0b2135]">Multiplier</p>
          <p className="text-3xl font-bungee text-[#0b2135]">x{stats.multiplier.toFixed(1)}</p>
        </div>
        <div className="bg-[#20c997] px-3 py-1 rounded-full text-[#0b2135] font-bold text-[10px] tracking-tighter uppercase shadow-lg">
          Powered by ScorX
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
