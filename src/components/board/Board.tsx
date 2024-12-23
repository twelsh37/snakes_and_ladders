import { SnakeSliding } from "../animations/SnakeSliding";
import { motion } from "framer-motion";

{
  movementState?.isSlidingSnake && (
    <SnakeSliding
      playerId={movementState.playerId}
      playerColor={currentPlayer?.color || "blue"}
      playerName={currentPlayer?.name || ""}
      startPosition={movementState.currentPosition}
      endPosition={movementState.targetPosition}
      onComplete={() => setMovementState(null)}
    />
  );
}
