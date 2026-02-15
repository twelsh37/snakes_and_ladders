import { SnakeSliding } from "../animations/SnakeSliding";
import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";

interface BoardProps {
  movementState: {
    playerId: string;
    currentPosition: number;
    targetPosition: number;
    isSlidingSnake: boolean;
  } | null;
  setMovementState: (state: any) => void;
}

export const Board = ({ movementState, setMovementState }: BoardProps) => {
  const { gameState } = useGame();
  const currentPlayer = gameState.players.find(
    (p) => p.id === movementState?.playerId
  );

  return (
    <>
      {movementState?.isSlidingSnake && (
        <SnakeSliding
          playerId={movementState.playerId}
          playerColor={currentPlayer?.color || "blue"}
          playerName={currentPlayer?.name || ""}
          startPosition={movementState.currentPosition}
          endPosition={movementState.targetPosition}
          onComplete={() => setMovementState(null)}
        />
      )}
    </>
  );
};
