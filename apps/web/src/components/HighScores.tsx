'use client';

import { HighScore } from '@/hooks/useHighScores';
import styles from './HighScores.module.css';

interface HighScoresProps {
  scores: HighScore[];
  latestScore: number;
}

const MEDALS = ['', '', ''];

export function HighScores({ scores, latestScore }: HighScoresProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>Top 10</div>

      {scores.length === 0 ? (
        <div className={styles.empty}>No scores yet.<br />Be the first legend.</div>
      ) : (
        <div className={styles.list}>
          {scores.map((s, i) => (
            <div
              key={i}
              className={`${styles.row} ${s.score === latestScore && latestScore > 0 ? styles.highlight : ''}`}
            >
              <span className={styles.rank}>
                {i < 3 ? MEDALS[i] : `#${i + 1}`}
              </span>
              <div className={styles.details}>
                <span className={styles.score}>{s.score.toLocaleString()}</span>
                <span className={styles.meta}>Lvl {s.level} · {s.lines}L</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
