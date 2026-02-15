import { useGame } from "@/contexts/GameContext";
import { SNAKES, LADDERS } from "@/constants/board";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type BoardSquareProps = {
  number: number;
  position: {
    row: number;
    col: number;
  };
};

export const BoardSquare = ({ number, position }: BoardSquareProps) => {
  const { gameState, movementState } = useGame();

  const isSnakeHead = number in SNAKES;
  const isSnakeTail = Object.values(SNAKES).includes(number);
  const isLadderBottom = number in LADDERS;
  const isLadderTop = Object.values(LADDERS).includes(number);

  const connectedSquare = isSnakeHead
    ? SNAKES[number]
    : isLadderBottom
    ? LADDERS[number]
    : null;

  const playersHere = gameState.players.filter(
    (player) => player.hasStarted && player.position === number
  );

  const ariaParts: string[] = [`Square ${number}`];
  if (isSnakeHead && connectedSquare) ariaParts.push(`snake down to ${connectedSquare}`);
  if (isLadderBottom && connectedSquare) ariaParts.push(`ladder up to ${connectedSquare}`);
  if (playersHere.length > 0) {
    ariaParts.push(playersHere.map((p) => p.name).join(" and ") + " here");
  }
  const ariaLabel = ariaParts.join(". ");

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn(
        "relative aspect-square border rounded-sm p-1",
        "flex items-center justify-center transition-colors duration-200",
        "border-border hover:bg-muted/50",
        isSnakeHead && "bg-snake-muted border-snake/30",
        isSnakeTail && "bg-snake-muted/70",
        isLadderBottom && "bg-ladder-muted border-ladder/30",
        isLadderTop && "bg-ladder-muted/70"
      )}
    >
      <span className="absolute bottom-0.5 right-0.5 text-[0.5rem] text-muted-foreground">
        {number}
      </span>

      {connectedSquare && (
        <span className="absolute top-0.5 left-0.5 text-[0.5rem] font-bold text-foreground">
          {isSnakeHead ? "↓" : "↑"} {connectedSquare}
        </span>
      )}

      {/* Tokens are rendered in TokenOverlay (GameBoard) so they stay on top of snakes/ladders */}
    </div>
  );
};
