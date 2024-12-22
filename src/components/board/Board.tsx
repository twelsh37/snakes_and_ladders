import { SnakeSliding } from "../animations/SnakeSliding";

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
