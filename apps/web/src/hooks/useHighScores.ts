'use client';

import { useState, useCallback } from 'react';

export interface HighScore {
  score: number;
  level: number;
  lines: number;
  date: string;
}

const STORAGE_KEY = 'tetris-hockey-scores';
const MAX_SCORES = 10;

function loadScores(): HighScore[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HighScore[]) : [];
  } catch {
    return [];
  }
}

function persistScores(scores: HighScore[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {
    // localStorage unavailable — silent fail
  }
}

export function useHighScores() {
  const [scores, setScores] = useState<HighScore[]>(() => loadScores());

  const addScore = useCallback((score: number, level: number, lines: number) => {
    if (score === 0) return;
    const entry: HighScore = {
      score,
      level,
      lines,
      date: new Date().toLocaleDateString(),
    };
    setScores((prev) => {
      const updated = [...prev, entry]
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_SCORES);
      persistScores(updated);
      return updated;
    });
  }, []);

  return { scores, addScore };
}
