'use client';

import { Piece } from '@tetris-hockey/shared';
import styles from './GameBoard.module.css';

interface GameBoardProps {
  board: (string | null)[][];
  currentPiece: Piece | null;
}

const CELL_SIZE = 30;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

export function GameBoard({ board, currentPiece }: GameBoardProps) {
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

    return (
      <div
        key={`${row}-${col}`}
        className={`${styles.cell}${color ? ` ${styles.filled}` : ''}`}
        style={{
          backgroundColor: color || 'rgba(8, 25, 65, 0.55)',
          borderColor: color ? `${color}55` : 'rgba(91, 163, 212, 0.07)',
          boxShadow: color
            ? `inset 0 0 10px ${color}33, 0 0 3px ${color}22`
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
