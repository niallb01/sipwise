import { atom } from "jotai";

export const activeReductionAtom = atom(null);

export const completedReductionAtom = atom(null);

export const allCheckInsAtom = atom([]);

export const reductionDurationsAtom = atom<number[]>([3, 7, 10, 14, 30, 60]);

export const reductionOptionsAtom = atom<Record<number, number[]>>({
  3: [1, 2, 3],
  7: [1, 2, 3, 4, 5, 6, 7],
  10: [1, 3, 5, 7, 10],
  14: [3, 5, 7, 10, 14],
  30: [7, 10, 14, 20, 30],
  60: [14, 20, 30, 45, 60],
});

export const selectedReductionDurationAtom = atom<number | null>(null);

export const reductionTargetAtom = atom<number | null>(null);
