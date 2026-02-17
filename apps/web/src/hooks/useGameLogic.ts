'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Piece,
  Position,
  createPiece,
  getRandomPieceType,
  rotatePiece as rotatePieceUtil,
  canPlacePiece,
  placePiece,
  clearLines,
  createEmptyBoard,
} from '@tetris-hockey/shared';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const LEVEL_UP_LINES = 10;

export interface DropTrail {
  shape: boolean[][];
  color: string;
  x: number;
  fromY: number;
  toY: number;
}

export function useGameLogic() {
  const [board, setBoard] = useState<(string | null)[][]>(() =>
    createEmptyBoard(BOARD_WIDTH, BOARD_HEIGHT)
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [linesCleared, setLinesCleared] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [lastClearCount, setLastClearCount] = useState(0);
  const [clearEventId, setClearEventId] = useState(0);
  const [dropTrail, setDropTrail] = useState<DropTrail | null>(null);
  const clearEventIdRef = useRef(0);
  const trailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastDropTimeRef = useRef<number>(Date.now());

  const spawnNewPiece = useCallback((): Piece => {
    const type = getRandomPieceType();
    return createPiece(type, { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
  }, []);

  const initializeGame = useCallback(() => {
    const firstPiece = spawnNewPiece();
    const secondPiece = spawnNewPiece();
    setCurrentPiece(firstPiece);
    setNextPiece(secondPiece);
    setBoard(createEmptyBoard(BOARD_WIDTH, BOARD_HEIGHT));
    setScore(0);
    setLevel(1);
    setLinesCleared(0);
    setGameOver(false);
    setPaused(false);
    setLastClearCount(0);
    setDropTrail(null);
    if (trailTimerRef.current) clearTimeout(trailTimerRef.current);
  }, [spawnNewPiece]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const triggerClearEvent = useCallback((cleared: number) => {
    if (cleared >= 2) {
      clearEventIdRef.current += 1;
      setClearEventId(clearEventIdRef.current);
      setLastClearCount(cleared);
    }
  }, []);

  const movePiece = useCallback(
    (offset: Position) => {
      if (!currentPiece || gameOver || paused) return;

      const newPosition = {
        x: currentPiece.position.x + offset.x,
        y: currentPiece.position.y + offset.y,
      };

      if (canPlacePiece(board, { ...currentPiece, position: newPosition })) {
        setCurrentPiece({ ...currentPiece, position: newPosition });
      } else if (offset.y > 0) {
        lockPiece();
      }
    },
    [board, currentPiece, gameOver, paused]
  );

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver || paused) return;

    const rotated = rotatePieceUtil(currentPiece);
    if (canPlacePiece(board, rotated)) {
      setCurrentPiece(rotated);
    }
  }, [board, currentPiece, gameOver, paused]);

  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver || paused) return;

    const fromY = currentPiece.position.y;
    let newY = fromY;
    while (canPlacePiece(board, { ...currentPiece, position: { x: currentPiece.position.x, y: newY + 1 } })) {
      newY++;
    }
    const toY = newY;

    // Set trail for significant drops (3+ rows)
    if (toY - fromY > 2) {
      if (trailTimerRef.current) clearTimeout(trailTimerRef.current);
      setDropTrail({
        shape: currentPiece.shape,
        color: currentPiece.color,
        x: currentPiece.position.x,
        fromY,
        toY,
      });
      trailTimerRef.current = setTimeout(() => setDropTrail(null), 350);
    }

    const droppedPiece = { ...currentPiece, position: { ...currentPiece.position, y: toY } };
    const newBoard = placePiece(board, droppedPiece);
    const { newBoard: clearedBoard, linesCleared: cleared } = clearLines(newBoard);

    setBoard(clearedBoard);
    setLinesCleared((prev) => {
      const newTotal = prev + cleared;
      setLevel(Math.floor(newTotal / LEVEL_UP_LINES) + 1);
      return newTotal;
    });

    if (cleared > 0) {
      const points = [0, 40, 100, 300, 1200][cleared] * level;
      setScore((prev) => prev + points);
    }

    triggerClearEvent(cleared);

    if (nextPiece) {
      const newNextPiece = spawnNewPiece();
      setCurrentPiece(nextPiece);
      setNextPiece(newNextPiece);
      if (!canPlacePiece(clearedBoard, nextPiece)) {
        setGameOver(true);
      }
    } else {
      setCurrentPiece(spawnNewPiece());
      setNextPiece(spawnNewPiece());
    }
  }, [board, currentPiece, gameOver, paused, nextPiece, level, spawnNewPiece, triggerClearEvent]);

  const lockPiece = useCallback(() => {
    if (!currentPiece) return;

    const newBoard = placePiece(board, currentPiece);
    const { newBoard: clearedBoard, linesCleared: cleared } = clearLines(newBoard);

    setBoard(clearedBoard);
    setLinesCleared((prev) => {
      const newTotal = prev + cleared;
      const newLevel = Math.floor(newTotal / LEVEL_UP_LINES) + 1;
      setLevel(newLevel);
      return newTotal;
    });

    if (cleared > 0) {
      const points = [0, 40, 100, 300, 1200][cleared] * level;
      setScore((prev) => prev + points);
    }

    triggerClearEvent(cleared);

    if (nextPiece) {
      const newNextPiece = spawnNewPiece();
      setCurrentPiece(nextPiece);
      setNextPiece(newNextPiece);

      if (!canPlacePiece(clearedBoard, nextPiece)) {
        setGameOver(true);
      }
    } else {
      const newPiece = spawnNewPiece();
      setCurrentPiece(newPiece);
      setNextPiece(spawnNewPiece());
    }
  }, [board, currentPiece, nextPiece, level, spawnNewPiece, triggerClearEvent]);

  const togglePause = useCallback(() => {
    if (!gameOver) {
      setPaused((prev) => !prev);
    }
  }, [gameOver]);

  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (gameOver || paused || !currentPiece) {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
        dropIntervalRef.current = null;
      }
      return;
    }

    // 50% faster each level: 1000ms → 667ms → 444ms … floor at 50ms (~level 9+)
    const dropSpeed = Math.max(50, Math.round(1000 / Math.pow(1.5, level - 1)));
    const now = Date.now();
    const timeSinceLastDrop = now - lastDropTimeRef.current;

    if (timeSinceLastDrop >= dropSpeed) {
      movePiece({ x: 0, y: 1 });
      lastDropTimeRef.current = now;
    }

    dropIntervalRef.current = setInterval(() => {
      if (!paused && !gameOver) {
        movePiece({ x: 0, y: 1 });
        lastDropTimeRef.current = Date.now();
      }
    }, dropSpeed);

    return () => {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
        dropIntervalRef.current = null;
      }
    };
  }, [gameOver, paused, currentPiece, level, movePiece]);

  return {
    board,
    currentPiece,
    nextPiece,
    score,
    level,
    linesCleared,
    gameOver,
    paused,
    lastClearCount,
    clearEventId,
    dropTrail,
    movePiece,
    rotatePiece,
    dropPiece,
    togglePause,
    resetGame,
  };
}
