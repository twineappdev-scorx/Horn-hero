
import { Character } from './types';

export const CHARACTERS: Character[] = [
  { name: 'Iga S.', energy: 'Intense', tossSpeed: 1.2 },
  { name: 'Aryna S.', energy: 'Power', tossSpeed: 1.5 },
  { name: 'Coco G.', energy: 'Speed', tossSpeed: 1.0 },
  { name: 'Elena R.', energy: 'Calm', tossSpeed: 0.8 },
];

export const TOSS_DURATION = 1800; // ms
export const SWEET_SPOT_START = 0.45; // percentage of toss
export const SWEET_SPOT_END = 0.55; 
