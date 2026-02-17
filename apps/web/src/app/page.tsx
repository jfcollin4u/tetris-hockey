'use client';

import { useEffect, useCallback, useRef } from 'react';
import { GameBoard } from '@/components/GameBoard';
import { GameInfo } from '@/components/GameInfo';
import { HighScores } from '@/components/HighScores';
import { MobileControls } from '@/components/MobileControls';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useHighScores } from '@/hooks/useHighScores';
import styles from './page.module.css';

// Hockey-themed background per level zone (5 levels each)
const LEVEL_BACKGROUNDS: string[] = [
  /* L1-5   Training Camp     */ 'radial-gradient(ellipse 100% 55% at 50% 0%, rgba(0, 80, 200, 0.28) 0%, transparent 70%), radial-gradient(ellipse 100% 50% at 50% 100%, rgba(0, 40, 130, 0.2) 0%, transparent 70%), #06091a',
  /* L6-10  Regular Season    */ 'radial-gradient(ellipse 100% 55% at 50% 0%, rgba(0, 150, 55, 0.3) 0%, transparent 70%), radial-gradient(ellipse 100% 50% at 50% 100%, rgba(0, 90, 30, 0.2) 0%, transparent 70%), #050e07',
  /* L11-15 Power Play        */ 'radial-gradient(ellipse 100% 55% at 50% 0%, rgba(110, 0, 200, 0.3) 0%, transparent 70%), radial-gradient(ellipse 100% 50% at 50% 100%, rgba(70, 0, 130, 0.22) 0%, transparent 70%), #09060e',
  /* L16-20 Rivalry Night     */ 'radial-gradient(ellipse 100% 55% at 50% 0%, rgba(190, 15, 0, 0.35) 0%, transparent 70%), radial-gradient(ellipse 100% 50% at 50% 100%, rgba(110, 8, 0, 0.25) 0%, transparent 70%), #0e0505',
  /* L21-25 Playoff Push      */ 'radial-gradient(ellipse 100% 55% at 50% 0%, rgba(0, 175, 165, 0.3) 0%, transparent 70%), radial-gradient(ellipse 100% 50% at 50% 100%, rgba(0, 105, 100, 0.22) 0%, transparent 70%), #050d0d',
  /* L26-30 Championship Run  */ 'radial-gradient(ellipse 100% 55% at 50% 0%, rgba(210, 145, 0, 0.35) 0%, transparent 70%), radial-gradient(ellipse 100% 50% at 50% 100%, rgba(135, 90, 0, 0.25) 0%, transparent 70%), #0e0b03',
  /* L31-35 OT Thriller       */ 'radial-gradient(ellipse 100% 55% at 50% 0%, rgba(220, 80, 0, 0.35) 0%, transparent 70%), radial-gradient(ellipse 100% 50% at 50% 100%, rgba(145, 50, 0, 0.25) 0%, transparent 70%), #0e0703',
  /* L36-40 Dynasty Mode      */ 'radial-gradient(ellipse 100% 55% at 50% 0%, rgba(175, 0, 135, 0.35) 0%, transparent 70%), radial-gradient(ellipse 100% 50% at 50% 100%, rgba(115, 0, 88, 0.25) 0%, transparent 70%), #0e060b',
  /* L41-45 Legend Territory  */ 'radial-gradient(ellipse 100% 55% at 50% 0%, rgba(0, 185, 95, 0.32) 0%, transparent 70%), radial-gradient(ellipse 100% 50% at 50% 100%, rgba(0, 115, 58, 0.22) 0%, transparent 70%), #041009',
  /* L46-50 Hall of Fame      */ 'radial-gradient(ellipse 100% 55% at 50% 0%, rgba(190, 215, 245, 0.24) 0%, transparent 70%), radial-gradient(ellipse 100% 50% at 50% 100%, rgba(140, 165, 195, 0.18) 0%, transparent 70%), #090c10',
];

const LEVEL_WISDOM: string[] = [
  /* 1  */ 'The only limits that exist are the ones you accept.',
  /* 2  */ 'Discipline is choosing what you want most over what you want now.',
  /* 3  */ 'You are the average of the five habits you repeat daily.',
  /* 4  */ 'Silence is the loudest answer you can give.',
  /* 5  */ 'Comfort is the enemy of progress.',
  /* 6  */ 'What you tolerate, you teach.',
  /* 7  */ 'The mind gives up long before the body does.',
  /* 8  */ 'Your character is built in moments nobody is watching.',
  /* 9  */ 'Every master was once a disaster who kept going.',
  /* 10 */ 'Be so good they cannot ignore you.',
  /* 11 */ 'Pain is temporary. Quitting lasts forever.',
  /* 12 */ 'The person you become is built by the choices you make today.',
  /* 13 */ 'Respect is earned in the moments when it costs you something.',
  /* 14 */ 'Strength is not the absence of fear. It is acting despite it.',
  /* 15 */ 'The only person you should compete with is who you were yesterday.',
  /* 16 */ 'Small consistent steps beat one heroic leap every time.',
  /* 17 */ 'Love is not something you find. It is something you build.',
  /* 18 */ 'How you do anything is how you do everything.',
  /* 19 */ 'Your habits are a vote for the person you want to become.',
  /* 20 */ 'The loudest voice in the room is rarely the wisest.',
  /* 21 */ 'You cannot pour from an empty cup. Fill yours first.',
  /* 22 */ 'Work in silence. Let success make the noise.',
  /* 23 */ 'A focused mind is more powerful than a brilliant one.',
  /* 24 */ 'Accountability is the rarest form of courage.',
  /* 25 */ 'You do not rise to your goals. You fall to your systems.',
  /* 26 */ 'Patience is not waiting. It is working while you wait.',
  /* 27 */ 'The right kind of hard work never feels wasted.',
  /* 28 */ 'Earn your opinions. Read. Question. Think.',
  /* 29 */ 'Kindness is strength that does not need to prove itself.',
  /* 30 */ 'The world makes room for people who know where they are going.',
  /* 31 */ 'Do not ask for a lighter load. Ask for broader shoulders.',
  /* 32 */ 'Trust is built in drops and lost in buckets.',
  /* 33 */ 'You cannot go back to change the beginning. But you can start now.',
  /* 34 */ 'Be the energy you want to attract.',
  /* 35 */ 'Clarity is the superpower nobody talks about.',
  /* 36 */ 'Real growth lives just outside your comfort zone.',
  /* 37 */ 'Listen twice as much as you speak.',
  /* 38 */ 'The most dangerous words: I already know that.',
  /* 39 */ 'Joy is not in things. It is in you.',
  /* 40 */ 'Ambition without humility is just noise.',
  /* 41 */ 'Do it scared. Do it tired. Just do not stop.',
  /* 42 */ 'Your reaction to adversity defines your character.',
  /* 43 */ 'A good life is built one good decision at a time.',
  /* 44 */ 'Love deeply. Lead honestly. Work relentlessly.',
  /* 45 */ 'Let your actions speak so loudly your words become irrelevant.',
  /* 46 */ 'Focus is saying no to a thousand good ideas.',
  /* 47 */ 'Show up fully or do not show up at all.',
  /* 48 */ 'Iron sharpens iron. Surround yourself accordingly.',
  /* 49 */ 'Legacy is built in ordinary moments, not extraordinary ones.',
  /* 50 */ 'The game is never over. It never is. Keep stacking.',
];

const GOAL_LABELS: Record<number, string> = {
  2: 'GOAL!',
  3: 'HAT TRICK!',
  4: 'GRAND SLAM!',
};

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
    lastClearCount,
    clearEventId,
    movePiece,
    rotatePiece,
    dropPiece,
    togglePause,
    resetGame,
  } = useGameLogic();

  const { scores, addScore } = useHighScores();
  const wisdom = LEVEL_WISDOM[Math.min(level - 1, LEVEL_WISDOM.length - 1)];

  // Apply level-based background
  useEffect(() => {
    const zoneIndex = Math.min(Math.floor((level - 1) / 5), LEVEL_BACKGROUNDS.length - 1);
    document.body.style.background = LEVEL_BACKGROUNDS[zoneIndex];
    return () => { document.body.style.background = ''; };
  }, [level]);

  // Touch swipe detection for mobile
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current || gameOver || paused) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);

      if (adx < 8 && ady < 8) {
        dropPiece();
      } else if (adx > ady) {
        movePiece({ x: dx > 0 ? 1 : -1, y: 0 });
      } else if (dy < -20) {
        rotatePiece();
      } else if (dy > 20) {
        movePiece({ x: 0, y: 1 });
      }
      touchStart.current = null;
    },
    [gameOver, paused, movePiece, rotatePiece, dropPiece]
  );

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

  const goalLabel = GOAL_LABELS[lastClearCount] ?? 'GOAL!';
  const isHatTrick = lastClearCount === 3;
  const isGrandSlam = lastClearCount >= 4;

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
          <div className={styles.leftCol}>
            <GameInfo
              score={score}
              level={level}
              linesCleared={linesCleared}
              nextPiece={nextPiece}
              gameOver={gameOver}
              paused={paused}
            />
          </div>
          <div className={styles.boardWrapper} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ touchAction: 'none' }}>
            <GameBoard board={board} currentPiece={currentPiece} />
            <div className={styles.wisdomOverlay}>
              <span className={styles.wisdomOverlayLabel}>Words of wisdom</span>
              <p className={styles.wisdomOverlayText}>&ldquo;{wisdom}&rdquo;</p>
            </div>
            {clearEventId > 0 && (
              <div
                key={clearEventId}
                className={`${styles.goalOverlay} ${isHatTrick ? styles.goalHatTrick : ''} ${isGrandSlam ? styles.goalGrandSlam : ''}`}
              >
                <div className={styles.goalText}>{goalLabel}</div>
                {isHatTrick && <div className={styles.hatTrickPucks}>🏒 🏒 🏒</div>}
                {isGrandSlam && <div className={styles.hatTrickPucks}>🏆</div>}
              </div>
            )}
          </div>
          <div className={styles.highScoresWrapper}>
            <HighScores scores={scores} latestScore={gameOver ? score : 0} />
          </div>
        </div>

        <MobileControls
          onLeft={() => movePiece({ x: -1, y: 0 })}
          onRight={() => movePiece({ x: 1, y: 0 })}
          onRotate={rotatePiece}
          onSoftDrop={() => movePiece({ x: 0, y: 1 })}
          onHardDrop={dropPiece}
          onPause={togglePause}
        />

        <div className={styles.actionRow}>
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
