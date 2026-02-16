export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: PieceType;
  shape: boolean[][];
  position: Position;
  color: string;
}

export interface GameState {
  board: (string | null)[][];
  currentPiece: Piece | null;
  nextPiece: Piece | null;
  score: number;
  level: number;
  linesCleared: number;
  gameOver: boolean;
  paused: boolean;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  side: 'left' | 'right';
}
