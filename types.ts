
export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  RESULT = 'RESULT',
}

export interface PlayerStats {
  score: number;
  multiplier: number;
  totalPranks: number;
  bestPrank: string;
}

export interface PrankResult {
  accuracy: number; // 0 to 1
  comment: string;
  isDoubleFault: boolean;
}

export interface Character {
  name: string;
  energy: string;
  tossSpeed: number;
}
