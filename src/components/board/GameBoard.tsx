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
import { LadderClimbing } from "../animations/LadderClimbing";
import { StartingArea } from "../game/StartingArea";

export const GameBoard = () => {
  const { gameState, movementState } = useGame();

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
      {/* Starting Area */}
      <StartingArea />

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

      {/* Snakes Layer */}
      <div className="absolute inset-0 z-20">
        {SNAKE_POSITIONS.map((snake) => (
          <SnakeConnection
            key={`snake-${snake.start}-${snake.end}`}
            snake={snake}
          />
        ))}
      </div>

      {/* Ladders Layer */}
      <div className="absolute inset-0 z-25">
        {LADDER_POSITIONS.map((ladder) => (
          <LadderConnection
            key={`ladder-${ladder.start}-${ladder.end}`}
            ladder={ladder}
          />
        ))}
      </div>

      {/* Climbing Animation Layer */}
      {movementState?.isClimbingLadder && (
        <LadderClimbing
          playerId={movementState.playerId}
          playerColor={
            gameState.players.find((p) => p.id === movementState.playerId)
              ?.color || "blue"
          }
          playerName={
            gameState.players.find((p) => p.id === movementState.playerId)
              ?.name || ""
          }
          startPosition={movementState.currentPosition}
          endPosition={movementState.targetPosition}
          onComplete={() => {
            // Animation complete callback
          }}
        />
      )}
    </div>
  );
};
