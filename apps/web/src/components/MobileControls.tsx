'use client';

import styles from './MobileControls.module.css';

interface MobileControlsProps {
  onLeft: () => void;
  onRight: () => void;
  onRotate: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  onPause: () => void;
}

export function MobileControls({
  onLeft,
  onRight,
  onRotate,
  onSoftDrop,
  onHardDrop,
  onPause,
}: MobileControlsProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <button className={styles.btn} onClick={onLeft}>◀</button>
        <button className={`${styles.btn} ${styles.rotate}`} onClick={onRotate}>↺ Rotate</button>
        <button className={styles.btn} onClick={onRight}>▶</button>
      </div>
      <div className={styles.row}>
        <button className={`${styles.btn} ${styles.drop}`} onClick={onSoftDrop}>▼ Soft</button>
        <button className={`${styles.btn} ${styles.hard}`} onClick={onHardDrop}>⬇ Hard Drop</button>
        <button className={`${styles.btn} ${styles.pause}`} onClick={onPause}>⏸</button>
      </div>
    </div>
  );
}
