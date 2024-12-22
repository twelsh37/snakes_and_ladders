import { useGame } from "../../contexts/GameContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const PlayerTurn = () => {
  const { gameState } = useGame();
  const currentPlayer = gameState.players[gameState.currentTurn];

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle>Current Turn</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <div
          className={`text-lg font-semibold ${
            currentPlayer?.color === "blue" ? "text-blue-600" : "text-red-600"
          }`}
        >
          {currentPlayer?.name}
        </div>
      </CardContent>
    </Card>
  );
};
