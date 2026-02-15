import { useGame } from "@/contexts/GameContext";
import {
  LADDER_POSITIONS,
  SNAKE_POSITIONS,
} from "@/constants/board";
import { BoardSquare } from "./BoardSquare";
import { LadderConnection } from "./LadderConnection";
import { SnakeConnection } from "./SnakeConnection";
import { TokenOverlay } from "./TokenOverlay";
import { LadderClimbing } from "@/components/animations/LadderClimbing";
import { SnakeSliding } from "@/components/animations/SnakeSliding";
import { StartingArea } from "@/components/game/StartingArea";

export const GameBoard = () => {
  const { gameState, movementState } = useGame();

  const squares = Array.from({ length: 81 }, (_, i) => i + 1);

  const boardSquares = squares.reduce<number[][]>((acc, _, index) => {
    if (index % 9 === 0) {
      const row = squares.slice(index, index + 9);
      const rowNumber = Math.floor(index / 9);
      acc.push(rowNumber % 2 === 0 ? row : row.reverse());
    }
    return acc;
  }, []);

  const reversedBoard = boardSquares.reverse();

  return (
    <section
      className="relative aspect-square w-full max-w-3xl"
      aria-label="Game board"
    >
      <StartingArea />

      <div className="grid grid-cols-9 gap-0.5 bg-muted p-0.5 relative z-0 rounded-sm overflow-hidden">
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

      <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden>
        {SNAKE_POSITIONS.map((snake) => (
          <SnakeConnection
            key={`snake-${snake.start}-${snake.end}`}
            snake={snake}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-[15] pointer-events-none" aria-hidden>
        {LADDER_POSITIONS.map((ladder) => (
          <LadderConnection
            key={`ladder-${ladder.start}-${ladder.end}`}
            ladder={ladder}
          />
        ))}
      </div>

      {/* All tokens in top layer so they are never obscured by snakes/ladders */}
      <TokenOverlay />

      {/* Ladder/snake animations: same top layer as tokens */}
      <div className="absolute inset-0 z-[100] overflow-visible pointer-events-none" aria-hidden>
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
            onComplete={() => {}}
          />
        )}

        {movementState?.isSlidingSnake && (
          <SnakeSliding
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
            onComplete={() => {}}
          />
        )}
      </div>
    </section>
  );
};
