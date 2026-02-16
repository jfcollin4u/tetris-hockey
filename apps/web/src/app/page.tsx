'use client';

import { useEffect, useCallback, useRef } from 'react';
import { GameBoard } from '@/components/GameBoard';
import { GameInfo } from '@/components/GameInfo';
import { HighScores } from '@/components/HighScores';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useHighScores } from '@/hooks/useHighScores';
import styles from './page.module.css';

const LEVEL_WISDOM: string[] = [
  /* 1  */ 'Lace up tight. Every champion started right here.',
  /* 2  */ 'Keep your stick on the ice and your head in the game.',
  /* 3  */ 'Skate to where the puck is going, not where it has been.',
  /* 4  */ 'A good shift is built on hustle and heart.',
  /* 5  */ 'Defense wins games. Stacking blocks wins championships.',
  /* 6  */ "You miss 100% of the shots you don't take. — Wayne Gretzky",
  /* 7  */ "The puck doesn't care about your excuses.",
  /* 8  */ "Hard work beats talent when talent doesn't work hard.",
  /* 9  */ 'Every block you stack is a brick in your dynasty.',
  /* 10 */ "Momentum is everything. Don't let up now.",
  /* 11 */ 'The best players see the ice before it happens.',
  /* 12 */ 'When your legs are tired, play with your heart.',
  /* 13 */ "Champions don't slow down in the second period.",
  /* 14 */ 'Stack it high. Clear the ice. Repeat.',
  /* 15 */ "The crowd's energy is yours — take it.",
  /* 16 */ "You've earned every line you've cleared.",
  /* 17 */ 'Great players make everyone around them better.',
  /* 18 */ 'Pain is just weakness leaving the bench.',
  /* 19 */ 'One more period. One more shift. One more block.',
  /* 20 */ "You're in the zone now. Trust your hands.",
  /* 21 */ "The ice doesn't lie — and neither do your results.",
  /* 22 */ "Play every shift like it's overtime.",
  /* 23 */ "The Cup isn't won in one game. Neither is this.",
  /* 24 */ 'Stay sharp. The game gets faster from here.',
  /* 25 */ 'Halfway to glory. The second half is for legends.',
  /* 26 */ 'Pressure makes diamonds — and elite players.',
  /* 27 */ 'When the going gets tough, the tough get skating.',
  /* 28 */ 'No one remembers who gave up. Be remembered.',
  /* 29 */ 'Your mind quits before your body does. Ignore it.',
  /* 30 */ 'This is where champions separate from the rest.',
  /* 31 */ 'Ice cold focus. Burning determination.',
  /* 32 */ "The zone is real. You're living in it.",
  /* 33 */ 'Every great dynasty survived moments exactly like this.',
  /* 34 */ 'There is no bench rest at this level.',
  /* 35 */ "You're not just a player anymore. You're a force.",
  /* 36 */ 'The puck finds the players who want it most.',
  /* 37 */ "Clutch isn't born — it's built in moments like these.",
  /* 38 */ "The crowd is on their feet. Don't let them sit down.",
  /* 39 */ "You've outlasted every quitter. Keep building.",
  /* 40 */ 'Elite is a decision you made. Now live it.',
  /* 41 */ 'Hall of Fame territory. Leave your mark on this ice.',
  /* 42 */ 'The ice remembers every legend who skated it.',
  /* 43 */ 'Pure instinct now. Your hands already know what to do.',
  /* 44 */ "You've outlasted everyone who doubted you.",
  /* 45 */ 'The summit is in sight. Every single block matters.',
  /* 46 */ 'Only the greatest have ever played this long.',
  /* 47 */ "Legends don't retire — they elevate.",
  /* 48 */ 'Your name belongs on this arena wall.',
  /* 49 */ 'One final push. This is what you were built for.',
  /* 50 */ 'You are the game. Gretzky himself would bow.',
];

export default function Home() {
  const {
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
  } = useGameLogic();

  const { scores, addScore } = useHighScores();
  const wisdom = LEVEL_WISDOM[Math.min(level - 1, LEVEL_WISDOM.length - 1)];

  // Save score to leaderboard when game ends
  const prevGameOver = useRef(false);
  useEffect(() => {
    if (gameOver && !prevGameOver.current) {
      addScore(score, level, linesCleared);
    }
    prevGameOver.current = gameOver;
  }, [gameOver, score, level, linesCleared, addScore]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver || paused) {
        if (e.key === ' ') {
          e.preventDefault();
          if (gameOver) resetGame();
          else togglePause();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece({ x: 1, y: 0 });
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePiece({ x: 0, y: 1 });
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotatePiece();
          break;
        case ' ':
          e.preventDefault();
          dropPiece();
          break;
        case 'p':
        case 'P':
          togglePause();
          break;
      }
    },
    [gameOver, paused, movePiece, rotatePiece, dropPiece, togglePause, resetGame]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        <div className={styles.titleWrapper}>
          <div className={styles.titleEyebrow}>Official Game of the Rink</div>
          <h1 className={styles.title}>
            Tetris&nbsp;<span className={styles.titleHockey}>Hockey</span>
          </h1>
          <div className={styles.titleDivider} />
        </div>

        <div className={styles.gameArea}>
          <GameInfo
            score={score}
            level={level}
            linesCleared={linesCleared}
            nextPiece={nextPiece}
            gameOver={gameOver}
            paused={paused}
          />
          <GameBoard board={board} currentPiece={currentPiece} />
          <HighScores scores={scores} latestScore={gameOver ? score : 0} />
        </div>

        <div className={styles.wisdomBar}>
          <span className={styles.wisdomLabel}>Coach says</span>
          <p className={styles.wisdomText}>&ldquo;{wisdom}&rdquo;</p>
        </div>

        <div className={styles.actionRow}>
          <button className={styles.btnRestart} onClick={resetGame}>
            ↺ Restart
          </button>
          {!gameOver ? (
            <button
              className={`${styles.btnPause} ${paused ? styles.btnPauseActive : ''}`}
              onClick={togglePause}
            >
              {paused ? '▶ Play' : '⏸ Pause'}
            </button>
          ) : (
            <button className={styles.btnPause} onClick={resetGame}>
              ▶ New Game
            </button>
          )}
        </div>

        <div className={styles.controls}>
          <div className={styles.controlsRow}>
            <span className={styles.controlItem}>
              <span className={styles.key}>← →</span> Move
            </span>
            <span className={styles.controlItem}>
              <span className={styles.key}>↑</span> Rotate
            </span>
            <span className={styles.controlItem}>
              <span className={styles.key}>↓</span> Soft Drop
            </span>
            <span className={styles.controlItem}>
              <span className={styles.key}>Space</span> Hard Drop
            </span>
            <span className={styles.controlItem}>
              <span className={styles.key}>P</span> Pause
            </span>
          </div>
        </div>

      </div>
    </main>
  );
}
