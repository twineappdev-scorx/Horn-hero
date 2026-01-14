import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Character } from '../types';
import { SWEET_SPOT_START, SWEET_SPOT_END } from '../constants';

interface CourtProps {
  character: Character;
  onSuccess: (points: number) => void;
  onGameOver: (score: number, pranks: number) => void;
  onNextPlayer: () => void;
}

const Court: React.FC<CourtProps> = ({ character, onSuccess, onGameOver, onNextPlayer }) => {
  const [isTossing, setIsTossing] = useState(false);
  const [tossProgress, setTossProgress] = useState(0); 
  const [strikes, setStrikes] = useState(0);
  const [hornActive, setHornActive] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [pranks, setPranks] = useState(0);

  const requestRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const tossDuration = 1800 / character.tossSpeed;

  const playHornSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
      const mainGain = audioCtx.createGain();
      const frequencies = [233.08, 311.13, 369.99];
      
      mainGain.gain.setValueAtTime(0, audioCtx.currentTime);
      mainGain.gain.linearRampToValueAtTime(0.7, audioCtx.currentTime + 0.05);
      mainGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
      mainGain.connect(audioCtx.destination);

      frequencies.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.detune.setValueAtTime(i * 5 - 5, audioCtx.currentTime);
        oscGain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(mainGain);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
      });
    } catch (e) {
      console.log('Audio blocked');
    }
  };

  const startToss = useCallback(() => {
    setIsTossing(true);
    setTossProgress(0);
    startTimeRef.current = performance.now();
    
    const animate = (time: number) => {
      const elapsed = time - (startTimeRef.current || time);
      const progress = Math.min(elapsed / tossDuration, 1);
      setTossProgress(progress * 100);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setFeedback("CLEAN SERVE...");
        setIsTossing(false);
        setTimeout(() => {
          setFeedback(null);
          startToss();
        }, 1200);
      }
    };
    requestRef.current = requestAnimationFrame(animate);
  }, [tossDuration]);

  useEffect(() => {
    startToss();
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [startToss, character]);

  const handleHorn = () => {
    if (hornActive || !!feedback) return;
    setHornActive(true);
    playHornSound();
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    const progressPercent = tossProgress / 100;
    const isSweetSpot = progressPercent >= SWEET_SPOT_START && progressPercent <= SWEET_SPOT_END;

    if (isSweetSpot) {
      const points = 1000;
      setScore(s => s + points);
      setPranks(p => p + 1);
      setFeedback("CHOO CHOO! 🚂");
      onSuccess(points);
      setTimeout(() => {
        setFeedback(null);
        setHornActive(false);
        onNextPlayer();
      }, 1000);
    } else {
      setStrikes(s => {
        const newStrikes = s + 1;
        if (newStrikes >= 3) onGameOver(score, pranks);
        return newStrikes;
      });
      setFeedback("CAUGHT! 👮");
      setTimeout(() => {
        setFeedback(null);
        setHornActive(false);
        startToss();
      }, 1000);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between py-8 px-4 z-10">
      <div className="relative w-full max-w-5xl h-[55vh] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)] bg-[#0b2135]">
        
        {/* Tiled Advertising Boards using assets/card_primary.png */}
        <div className="absolute top-0 left-0 w-full h-14 bg-white flex overflow-hidden border-b-4 border-[#20c997]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 h-full w-[240px] border-r border-gray-200">
              <img src="./assets/card_primary.png" alt="ScorX Branding" className="h-full w-full object-contain px-2" />
            </div>
          ))}
        </div>

        {/* Court Surface */}
        <div className="absolute inset-0 top-14 court-gradient">
           <div className="absolute inset-x-0 top-1/2 h-0.5 bg-white/40"></div>
           <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/40"></div>
           <div className="absolute top-[48%] inset-x-0 h-4 bg-white/10 backdrop-blur-md border-y border-white/20"></div>

           <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
             <div className="text-white font-black bg-[#0b2135]/80 px-4 py-1.5 rounded-full text-[12px] mb-4 uppercase tracking-tighter border border-[#20c997]/40 shadow-lg">
               🎾 {character.name}
             </div>
             <div className="w-20 h-40 bg-white/5 rounded-t-full relative border-t-2 border-white/20">
               <div 
                 className="absolute w-5 h-5 bg-[#d9f99d] rounded-full shadow-[0_0_20px_rgba(217,249,157,1)]"
                 style={{ 
                   bottom: '100%', 
                   left: '50%', 
                   transform: `translateX(-50%) translateY(${-Math.sin((tossProgress/100) * Math.PI) * 240}px)` 
                 }}
               ></div>
             </div>
           </div>
        </div>

        {/* Feedback Overlay */}
        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0b2135]/60 backdrop-blur-sm z-50 animate-in fade-in duration-300">
            <h3 className="text-5xl md:text-8xl font-bungee text-[#f39c12] text-center drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
              {feedback}
            </h3>
          </div>
        )}
      </div>

      <div className="w-full max-w-md flex flex-col items-center gap-4">
        <div className="flex gap-4">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-bungee text-2xl shadow-xl transition-all duration-300
                ${i <= strikes ? 'bg-red-600 border-red-400 text-white scale-110' : 'bg-[#0b2135]/50 border-white/10 text-white/10'}`}
            >
              X
            </div>
          ))}
        </div>

        <button 
          onMouseDown={handleHorn}
          disabled={hornActive || !!feedback}
          className={`w-full py-8 rounded-[2.5rem] font-bungee text-4xl md:text-5xl transition-all shadow-[0_12px_0_0_rgba(153,27,27,1)] active:shadow-none active:translate-y-[12px] relative overflow-hidden group
            ${hornActive || !!feedback ? 'bg-gray-700 opacity-50' : 'bg-red-600 hover:bg-red-500'}
          `}
        >
          <span className="relative z-10 text-white uppercase italic tracking-wider">HORN!</span>
          <div 
            className="absolute bottom-0 left-0 h-2 bg-[#20c997] transition-all duration-75 shadow-[0_0_10px_#20c997]"
            style={{ width: `${tossProgress}%` }}
          ></div>
        </button>

        <div className="flex items-center gap-2 text-[#20c997] font-black text-xs uppercase tracking-[0.2em]">
           <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_red]"></span>
           Live from Center Court
        </div>
      </div>
    </div>
  );
};

export default Court;