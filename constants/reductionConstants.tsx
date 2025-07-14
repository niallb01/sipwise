export const MS_PER_SIMULATED_DAY = 10 * 1000; // 10 seconds = 1 simulated day

export const GRACE_PERIOD_MS = 10000;

export const EDGE_CASE_GRACE_MS = 10000; // edge case grace only

import { useMemo } from "react";

export const quotes = [
  "You’ve got this! 💪",
  "Let’s crush it! 💥",
  "Your liver is loving it!. 🐾",
  "Stay focused and strong. 🧠",
  "Progress starts now. 🚀",
  "Eyes on the goal. 🎯",
  "Every day counts. ⏳",
  "Small wins, big gains. 📈",
  "Keep going, legend! 🌟",
  "Less booze, more you. 🍋",
  "Your future self says thanks. 🙌",
  "Momentum > Motivation. 🔄",
  "Discipline is freedom. 🔓",
  "Cheers to clear mornings! ☀️",
];

export const getRandomQuote = () => {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
};
