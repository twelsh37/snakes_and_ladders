import { useGame } from "../../contexts/GameContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const GameStatistics = () => {
  const { gameState } = useGame();

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle>Game Statistics</CardTitle>
      </CardHeader>
      <CardContent className="py-2 space-y-3">
        {/* Player Statistics */}
        <div className="space-y-2">
          {gameState.players.map((player) => (
            <div
              key={player.id}
              className={`p-2 rounded-md ${
                player.color === "blue" ? "bg-blue-50" : "bg-red-50"
              }`}
            >
              <div
                className={`font-medium ${
                  player.color === "blue" ? "text-blue-600" : "text-red-600"
                }`}
              >
                {player.name}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <span>🪜</span>
                  <span>{player.laddersClimbed} Climbed</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🐍</span>
                  <span>{player.snakesHit} Hit</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
