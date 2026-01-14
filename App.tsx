import React, { useState, useEffect, useCallback } from 'react';
import { GameState, PlayerStats, Character } from './types';
import { CHARACTERS } from './constants';
import Court from './components/Court';
import GameHUD from './components/GameHUD';
import { getUmpireReaction, getPostMatchNews } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [stats, setStats] = useState<PlayerStats>({
    score: 0,
    multiplier: 1,
    totalPranks: 0,
    bestPrank: 'N/A'
  });
  const [umpireComment, setUmpireComment] = useState<string>("");
  const [newsHeadline, setNewsHeadline] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentCharacter, setCurrentCharacter] = useState<Character>(CHARACTERS[0]);

  const startGame = () => {
    setStats({ score: 0, multiplier: 1, totalPranks: 0, bestPrank: 'N/A' });
    setGameState(GameState.PLAYING);
    setCurrentCharacter(CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]);
  };

  const handleGameOver = async (finalScore: number, pranks: number) => {
    setLoading(true);
    setGameState(GameState.RESULT);
    
    const [comment, headline] = await Promise.all([
      getUmpireReaction(finalScore, pranks),
      getPostMatchNews(finalScore)
    ]);
    
    setUmpireComment(comment);
    setNewsHeadline(headline);
    setLoading(false);
  };

  const updateStats = (points: number) => {
    setStats(prev => ({
      ...prev,
      score: prev.score + points,
      totalPranks: prev.totalPranks + 1,
      multiplier: Math.min(prev.multiplier + 0.5, 5)
    }));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-[#0b2135] text-white select-none">
      {/* ScorX Branding Banner */}
      <div className="w-full bg-[#0b2135]/95 backdrop-blur-sm py-2 px-4 z-50 border-b border-[#20c997]/30 text-center shadow-lg shrink-0">
        <p className="text-[10px] md:text-sm font-medium tracking-wide">
          <span className="text-white/90">Brought to you for a laugh by </span>
          <a href="https://scorx.com.au" target="_blank" rel="noopener noreferrer" className="text-[#20c997] font-bold uppercase tracking-tighter hover:text-[#1bb488] transition-colors">ScorX</a>
          <span className="mx-2 text-white/30">|</span>
          <span className="text-white/90">Download the app to score your tennis matches and <span className="text-[#20c997] font-bold italic">Grow your Game!</span></span>
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {gameState === GameState.START && (
          <div className="z-20 text-center animate-in fade-in zoom-in duration-500 px-4">
            <h1 className="text-5xl md:text-8xl font-bungee mb-4 text-[#f39c12] drop-shadow-xl tracking-tighter leading-none">BRISBANE BANDIT</h1>
            <p className="text-lg md:text-2xl mb-8 font-bold text-[#20c997] uppercase tracking-widest">Tennis's Worst Nightmare.</p>
            <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-md border border-white/10 mb-8 max-w-md mx-auto">
              <h2 className="text-lg font-bold mb-2 text-[#f39c12]">Your Goal</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Wait for the player to toss the ball. <br/>
                Click the <span className="text-red-500 font-black underline decoration-wavy">TRAIN HORN</span> at the peak of the toss. <br/>
                3 strikes and tournament security drags you out.
              </p>
            </div>
            <button 
              onClick={startGame}
              className="px-12 py-4 bg-[#f39c12] hover:bg-orange-400 text-[#0b2135] font-bungee text-2xl md:text-3xl rounded-full transition-transform active:scale-95 shadow-2xl border-b-8 border-orange-700"
            >
              START
            </button>
          </div>
        )}

        {gameState === GameState.PLAYING && (
          <div className="w-full h-full relative">
            <GameHUD stats={stats} />
            <Court 
              character={currentCharacter} 
              onSuccess={updateStats} 
              onGameOver={handleGameOver}
              onNextPlayer={() => setCurrentCharacter(CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)])}
            />
          </div>
        )}

        {gameState === GameState.RESULT && (
          <div className="z-20 w-full max-w-4xl px-4 text-center animate-in slide-in-from-bottom duration-700 overflow-y-auto max-h-[90vh] py-8">
            <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-2xl text-[#0b2135]">
              <h2 className="text-3xl md:text-5xl font-bungee text-red-600 mb-2">BANNED FROM THE ARENA!</h2>
              <div className="mb-6 p-4 border-y-2 border-gray-100 italic font-bold text-lg md:text-xl text-[#0b2135]/80">
                "{newsHeadline}"
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Chaos Score</p>
                  <p className="text-3xl md:text-5xl font-bungee text-[#0b2135]">{stats.score.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Pranks Landed</p>
                  <p className="text-3xl md:text-5xl font-bungee text-[#0b2135]">{stats.totalPranks}</p>
                </div>
              </div>

              <div className="mb-8 text-left bg-gray-100 p-5 rounded-2xl relative border-l-8 border-red-600">
                <div className="text-[10px] font-bold uppercase text-red-600 mb-1">Umpire Rant</div>
                {loading ? (
                  <div className="flex items-center gap-2 py-2">
                    <div className="w-2 h-2 bg-[#0b2135] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#0b2135] rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-[#0b2135] rounded-full animate-bounce delay-150"></div>
                  </div>
                ) : (
                  <p className="text-base md:text-lg leading-relaxed">"{umpireComment}"</p>
                )}
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bungee text-[#20c997]">Time to play properly?</h3>
                <p className="text-gray-600 font-medium">
                  Once you're done causing chaos, get back to your court and play. Use <span className="text-[#20c997] font-bold">ScorX</span> to score your real matches!
                </p>
                
                <div className="flex flex-col md:flex-row gap-6 justify-center items-start py-4">
                  <div className="w-full md:w-1/2 flex flex-col items-center">
                    <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Match Tracking</p>
                    <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-100 bg-gray-900">
                      <img src="./assets/screenshot1.png" alt="ScorX Match View" className="w-full h-auto max-w-[280px]" />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col items-center">
                    <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Pro Stats Entry</p>
                    <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-100 bg-gray-900">
                      <img src="./assets/screenshot2.png" alt="ScorX Stats View" className="w-full h-auto max-w-[280px]" />
                    </div>
                  </div>
                </div>

                <a 
                  href="https://apps.apple.com/us/app/scorx/id6753859833" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-5 bg-[#20c997] hover:bg-[#1bb488] text-white font-bungee text-2xl rounded-2xl transition-all shadow-lg active:translate-y-1"
                >
                  DOWNLOAD SCORX
                </a>
                
                <button 
                  onClick={() => setGameState(GameState.START)}
                  className="text-gray-400 hover:text-[#0b2135] text-xs font-bold uppercase tracking-widest pt-4"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#20c997] rounded-full blur-[160px]"></div>
        </div>
      </div>
    </div>
  );
};

export default App;
