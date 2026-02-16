'use client';

import { Piece } from '@tetris-hockey/shared';
import styles from './GameInfo.module.css';

interface GameInfoProps {
  score: number;
  level: number;
  linesCleared: number;
  nextPiece: Piece | null;
  gameOver: boolean;
  paused: boolean;
}

export function GameInfo({
  score,
  level,
  linesCleared,
  nextPiece,
  gameOver,
  paused,
}: GameInfoProps) {
  return (
    <div className={styles.info}>
      <div className={styles.scoreboardHeader}>Scoreboard</div>

      <div className={styles.statBlock}>
        <div className={styles.label}>Score</div>
        <div className={styles.value}>{score.toLocaleString()}</div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statBlock}>
          <div className={styles.label}>Level</div>
          <div className={styles.value}>{level}</div>
        </div>
        <div className={styles.statBlock}>
          <div className={styles.label}>Lines</div>
          <div className={styles.value}>{linesCleared}</div>
        </div>
      </div>

      <div className={styles.nextSection}>
        <div className={styles.label}>Next</div>
        {nextPiece && (
          <div
            className={styles.preview}
            style={{
              gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 24px)`,
              gridTemplateRows: `repeat(${nextPiece.shape.length}, 24px)`,
            }}
          >
            {nextPiece.shape.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: cell ? nextPiece.color : 'transparent',
                    borderRadius: 2,
                    boxShadow: cell ? `0 0 6px ${nextPiece.color}88` : 'none',
                  }}
                />
              ))
            )}
          </div>
        )}
      </div>

      {(gameOver || paused) && (
        <div className={styles.overlay}>
          <div className={gameOver ? styles.overlayMessage : styles.overlayMessagePaused}>
            {gameOver ? 'Game Over' : 'Paused'}
          </div>
          <div className={styles.overlayHint}>
            {gameOver ? 'Space to restart' : 'Space to resume'}
          </div>
        </div>
      )}
    </div>
  );
}
