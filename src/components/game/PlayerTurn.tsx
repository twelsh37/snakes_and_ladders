import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const PlayerTurn = () => {
  const { gameState } = useGame();
  const currentPlayer = gameState.players[gameState.currentTurn];

  if (!currentPlayer) return null;

  const isHuman = !currentPlayer.isComputer;
  const label = isHuman ? "Your turn" : "Computer's turn";

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <div
          className={cn(
            "text-lg font-semibold",
            currentPlayer.color === "blue" ? "text-player-1" : "text-player-2"
          )}
        >
          {currentPlayer.name}
        </div>
      </CardContent>
    </Card>
  );
};
