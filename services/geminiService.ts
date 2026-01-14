
const UMPIRE_RANTS = [
  "I have no words for such unsportsmanlike behavior! The server is trying to concentrate and you're making train noises!",
  "This is a championship match, not a freight yard! Security, escort this hooligan out of the stadium immediately!",
  "Silence! Absolute silence! If I hear one more train whistle, I'm calling the tournament director!",
  "You there! In the kangaroo hat! One more blast and you're banned from the grounds for a decade!",
  "Disgraceful! Simply disgraceful! Do you think the player needs this kind of distraction during their service motion?",
  "Someone find that prankster and seize their batteries before the next set begins!",
  "Quiet please! The players are professionals, and you are acting like a derailed locomotive!",
  "Right, that's it! If I see one more horn, I'm personally ensuring you're banned from every bakery in the country!"
];

const NEWS_HEADLINES = [
  "HORN BANDIT STRIKES: PROS BAFFLED BY LOCOMOTIVE SOUNDS",
  "TRAIN WHISTLE TERRORIST RUINS CHAMPIONSHIP SEMI-FINALS",
  "SABOTAGE ON THE COURT: MYSTERY HORN DISRUPTS THE SERVE",
  "BRISBANE BANDIT RETURNS? FANS IN STITCHES, UMPIRE LURID",
  "TRACKS TO THE COURT: THE HORN THAT BROKE THE BIG MATCH",
  "CHOO-CHOO CHAOS: SERVE DERAILED BY MYSTERY SPECTATOR",
  "TENNIS OR TERMINUS? CROWD CONFUSED BY AUDIBLE TRAIN",
  "SABOTEUR ON THE SIDE-LINE: OFFICIALS CALL FOR CALM DURING SERVE"
];

export const getUmpireReaction = async (score: number, totalPranks: number) => {
  await new Promise(r => setTimeout(r, 600));
  return UMPIRE_RANTS[Math.floor(Math.random() * UMPIRE_RANTS.length)];
};

export const getPostMatchNews = async (score: number) => {
  return NEWS_HEADLINES[Math.floor(Math.random() * NEWS_HEADLINES.length)];
};
