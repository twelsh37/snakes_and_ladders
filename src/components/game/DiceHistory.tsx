import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const DiceHistory = () => {
  const { gameState } = useGame();
  const rolls = gameState.diceHistory.slice(-5).reverse();

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle>Last 5 rolls</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        {rolls.length === 0 ? (
          <p className="text-sm text-muted-foreground">No rolls yet — roll the dice to start.</p>
        ) : (
          <div className="flex gap-2 justify-start flex-wrap">
            {rolls.map((roll, index) => {
              const player = gameState.players.find((p) => p.id === roll.playerId);
              return (
                <div
                  key={`${roll.playerId}-${index}`}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-lg font-medium",
                    player?.color === "blue"
                      ? "bg-player-1/20 text-player-1"
                      : "bg-player-2/20 text-player-2"
                  )}
                >
                  {roll.value}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
