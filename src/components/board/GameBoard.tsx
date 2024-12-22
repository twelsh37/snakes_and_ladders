import { useContext } from "react";
import { useGame } from "../../contexts/GameContext";
import {
  BOARD_SIZE,
  LADDER_POSITIONS,
  SNAKE_POSITIONS,
} from "../../constants/board";
import { BoardSquare } from "./BoardSquare";
import { LadderConnection } from "./LadderConnection";
import { SnakeConnection } from "./SnakeConnection";

export const GameBoard = () => {
  // Create array of 81 squares (9x9 grid)
  const squares = Array.from({ length: 81 }, (_, i) => i + 1);

  // Create the board layout with alternating row directions
  const boardSquares = squares.reduce<number[][]>((acc, _, index) => {
    if (index % 9 === 0) {
      const row = squares.slice(index, index + 9);
      const rowNumber = Math.floor(index / 9);
      // Reverse even-numbered rows to create snake pattern
      acc.push(rowNumber % 2 === 0 ? row : row.reverse());
    }
    return acc;
  }, []);

  // Reverse the entire board to start from bottom
  const reversedBoard = boardSquares.reverse();

  return (
    <div className="relative aspect-square w-full max-w-3xl">
      {/* Board squares - Base Layer */}
      <div className="grid grid-cols-9 gap-0.5 bg-gray-200 p-0.5 relative z-0">
        {reversedBoard.map((row, rowIndex) =>
          row.map((number, colIndex) => (
            <BoardSquare
              key={number}
              number={number}
              position={{ row: rowIndex, col: colIndex }}
            />
          ))
        )}
      </div>

      {/* Snakes Layer - Below Ladders */}
      <div className="absolute inset-0 z-10">
        {SNAKE_POSITIONS.map((snake) => (
          <SnakeConnection
            key={`snake-${snake.start}-${snake.end}`}
            snake={snake}
          />
        ))}
      </div>

      {/* Ladders Layer - Above Snakes */}
      <div className="absolute inset-0 z-20">
        {LADDER_POSITIONS.map((ladder) => (
          <LadderConnection
            key={`ladder-${ladder.start}-${ladder.end}`}
            ladder={ladder}
          />
        ))}
      </div>

      {/* Player Pieces would go here with z-30 */}
    </div>
  );
};
