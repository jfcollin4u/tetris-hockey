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
const INITIAL_DROP_INTERVAL = 1000;
const LEVEL_UP_LINES = 10;

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
  }, [spawnNewPiece]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

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

    let newY = currentPiece.position.y;
    while (canPlacePiece(board, { ...currentPiece, position: { x: currentPiece.position.x, y: newY + 1 } })) {
      newY++;
    }

    // Lock the piece at the dropped position directly — avoids React batching overwriting
    // the setCurrentPiece(dropped) call when lockPiece also calls setCurrentPiece(nextPiece).
    const droppedPiece = { ...currentPiece, position: { ...currentPiece.position, y: newY } };
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
  }, [board, currentPiece, gameOver, paused, nextPiece, level, spawnNewPiece]);

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
  }, [board, currentPiece, nextPiece, level, spawnNewPiece]);

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

    // Spread speed across 50 levels: level 1 = 1000ms, level ~48+ = 50ms minimum
    const dropSpeed = Math.max(50, 1000 - (level - 1) * 20);
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
    movePiece,
    rotatePiece,
    dropPiece,
    togglePause,
    resetGame,
  };
}
