import { Piece, PieceType, Position, GameState } from './types';

const PIECE_SHAPES: Record<PieceType, boolean[][]> = {
  I: [[true, true, true, true]],
  O: [
    [true, true],
    [true, true],
  ],
  T: [
    [false, true, false],
    [true, true, true],
  ],
  S: [
    [false, true, true],
    [true, true, false],
  ],
  Z: [
    [true, true, false],
    [false, true, true],
  ],
  J: [
    [true, false, false],
    [true, true, true],
  ],
  L: [
    [false, false, true],
    [true, true, true],
  ],
};

const PIECE_COLORS: Record<PieceType, string> = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000',
};

export function createPiece(type: PieceType, position: Position): Piece {
  return {
    type,
    shape: PIECE_SHAPES[type],
    position,
    color: PIECE_COLORS[type],
  };
}

export function getRandomPieceType(): PieceType {
  const types: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  return types[Math.floor(Math.random() * types.length)];
}

export function rotatePiece(piece: Piece): Piece {
  const rows = piece.shape.length;
  const cols = piece.shape[0].length;
  const rotated: boolean[][] = [];

  for (let col = 0; col < cols; col++) {
    rotated[col] = [];
    for (let row = rows - 1; row >= 0; row--) {
      rotated[col][rows - 1 - row] = piece.shape[row][col];
    }
  }

  return {
    ...piece,
    shape: rotated,
  };
}

export function canPlacePiece(
  board: (string | null)[][],
  piece: Piece,
  offset: Position = { x: 0, y: 0 }
): boolean {
  const newX = piece.position.x + offset.x;
  const newY = piece.position.y + offset.y;

  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col]) {
        const boardX = newX + col;
        const boardY = newY + row;

        if (
          boardX < 0 ||
          boardX >= board[0].length ||
          boardY < 0 ||
          boardY >= board.length ||
          board[boardY][boardX] !== null
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

export function placePiece(
  board: (string | null)[][],
  piece: Piece
): (string | null)[][] {
  const newBoard = board.map((row) => [...row]);

  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col]) {
        const boardX = piece.position.x + col;
        const boardY = piece.position.y + row;
        if (boardY >= 0 && boardY < newBoard.length) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }

  return newBoard;
}

export function clearLines(board: (string | null)[][]): {
  newBoard: (string | null)[][];
  linesCleared: number;
} {
  const newBoard: (string | null)[][] = [];
  let linesCleared = 0;

  for (let row = board.length - 1; row >= 0; row--) {
    const isFullLine = board[row].every((cell) => cell !== null);
    if (!isFullLine) {
      newBoard.unshift([...board[row]]);
    } else {
      linesCleared++;
    }
  }

  while (newBoard.length < board.length) {
    newBoard.unshift(new Array(board[0].length).fill(null));
  }

  return { newBoard, linesCleared };
}

export function createEmptyBoard(width: number, height: number): (string | null)[][] {
  return Array(height)
    .fill(null)
    .map(() => Array(width).fill(null));
}
