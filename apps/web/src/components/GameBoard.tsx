'use client';

import { useMemo } from 'react';
import { Piece } from '@tetris-hockey/shared';
import { DropTrail } from '@/hooks/useGameLogic';
import styles from './GameBoard.module.css';

interface GameBoardProps {
  board: (string | null)[][];
  currentPiece: Piece | null;
  dropTrail?: DropTrail | null;
}

const CELL_SIZE = 30;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

export function GameBoard({ board, currentPiece, dropTrail }: GameBoardProps) {
  // Pre-compute trail cell positions for performance
  const trailMap = useMemo(() => {
    if (!dropTrail) return null;
    const { shape, x, fromY, toY, color } = dropTrail;
    const range = toY - fromY;
    if (range <= 0) return null;

    const map = new Map<string, number>(); // "row-col" → opacity (0–1)
    for (let trailY = fromY; trailY < toY; trailY++) {
      // Cells closer to the landing point are more opaque
      const opacity = 0.7 * ((trailY - fromY + 1) / range);
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < (shape[r]?.length ?? 0); c++) {
          if (shape[r][c]) {
            const boardRow = trailY + r;
            const boardCol = x + c;
            const key = `${boardRow}-${boardCol}`;
            const existing = map.get(key) ?? 0;
            if (opacity > existing) map.set(key, opacity);
          }
        }
      }
    }
    return { map, color };
  }, [dropTrail]);

  const renderCell = (row: number, col: number) => {
    let color = board[row][col];

    if (!color && currentPiece) {
      const pieceRow = row - currentPiece.position.y;
      const pieceCol = col - currentPiece.position.x;

      if (
        pieceRow >= 0 &&
        pieceRow < currentPiece.shape.length &&
        pieceCol >= 0 &&
        pieceCol < currentPiece.shape[pieceRow].length &&
        currentPiece.shape[pieceRow][pieceCol]
      ) {
        color = currentPiece.color;
      }
    }

    // Trail cell (only if board cell is empty and not covered by current piece)
    if (!color && trailMap) {
      const trailOpacity = trailMap.map.get(`${row}-${col}`);
      if (trailOpacity !== undefined) {
        return (
          <div
            key={`${row}-${col}`}
            className={`${styles.cell} ${styles.trailCell}`}
            style={{
              backgroundColor: trailMap.color,
              borderColor: `${trailMap.color}44`,
              boxShadow: `inset 0 0 10px ${trailMap.color}66`,
            }}
          />
        );
      }
    }

    return (
      <div
        key={`${row}-${col}`}
        className={`${styles.cell}${color ? ` ${styles.filled}` : ''}`}
        style={{
          backgroundColor: color || 'rgb(5, 13, 38)',
          borderColor: color ? `${color}55` : 'rgba(91, 163, 212, 0.06)',
          boxShadow: color
            ? `inset 0 0 10px ${color}44, 0 0 4px ${color}33`
            : undefined,
        }}
      />
    );
  };

  return (
    <div
      className={styles.board}
      style={{
        gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${CELL_SIZE}px)`,
      }}
    >
      {Array.from({ length: BOARD_HEIGHT }, (_, row) =>
        Array.from({ length: BOARD_WIDTH }, (_, col) => renderCell(row, col))
      )}
    </div>
  );
}
