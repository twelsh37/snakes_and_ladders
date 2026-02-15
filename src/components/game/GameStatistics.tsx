import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const GameStatistics = () => {
  const { gameState } = useGame();

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle>Game statistics</CardTitle>
      </CardHeader>
      <CardContent className="py-2 space-y-3">
        <div className="space-y-2">
          {gameState.players.map((player) => (
            <div
              key={player.id}
              className={cn(
                "p-2 rounded-md border-l-4",
                player.color === "blue"
                  ? "bg-muted border-player-1"
                  : "bg-muted border-player-2"
              )}
            >
              <div
                className={cn(
                  "font-medium",
                  player.color === "blue" ? "text-player-1" : "text-player-2"
                )}
              >
                {player.name}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span aria-hidden>🪜</span>
                  <span>{player.laddersClimbed} ladders climbed</span>
                </div>
                <div className="flex items-center gap-1">
                  <span aria-hidden>🐍</span>
                  <span>{player.snakesHit} snakes hit</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
