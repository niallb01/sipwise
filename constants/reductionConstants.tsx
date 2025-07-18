export const MS_PER_SIMULATED_DAY = 10 * 1000; // 10 seconds = 1 simulated day

export const GRACE_PERIOD_MS = 10000;

export const EDGE_CASE_GRACE_MS = 10000; // edge case grace only

// export const MS_PER_SIMULATED_DAY = 10000; // 10 seconds for testing
// export const MS_GRACE_PERIOD = MS_PER_SIMULATED_DAY; // 1 simulated day grace, adjust as needed

export const quotes = [
  "Look at you, being all responsible! 💪",
  "Crushing it harder than your hangovers. 💥",
  "Your liver just sent a thank-you card. 🥳",
  "Brain cells surviving and thriving. 🧠",
  "Rocketing past temptation like a boss. 🚀",
  "Sharp as a tack, and twice as shiny. 🎯",
  "Counting days like a pro. ⏳",
  "Small wins, big smug face. 😎",
  "Keep going, you legend in the making! 🌟",
  "Less booze, more you — you’re glowing! 🍋",
  "Future you is already doing a happy dance. 💃",
  "Momentum? More like turbo mode. 🔥",
  "Freedom tastes better than last night’s regrets. 🔓",
  "Clear mornings beat messy evenings, every time. ☀️",
];

export const getRandomQuote = () => {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
};

export const reductionQuotes = [
  "Each day without a drink is progress. ✅",
  "You’re building better habits, one step at a time. 🛠️",
  "Change takes time. Keep moving forward. ⏳",
  "Your effort today shapes your tomorrow. 🌱",
  "Focus on what you control — your next choice. 🎯",
  "Progress isn’t always visible, but it’s happening. 👀",
  "Small changes add up over time. 📈",
  "Resilience grows with every challenge faced. 🛡️",
  "You’re proving to yourself what’s possible. 🔥",
  "Commitment today leads to freedom tomorrow. 🕊️",
  "This is about you, not anyone else’s timeline. 🕰️",
  "Trust the process, even when it feels slow. 🐢",
  "Strength is quiet and steady. 💪",
  "Consistency beats intensity every time. 📅",
  "Every sober moment is a step toward clarity. 🌞",
];

export const getReductionQuote = () => {
  const index = Math.floor(Math.random() * reductionQuotes.length);
  return reductionQuotes[index];
};
