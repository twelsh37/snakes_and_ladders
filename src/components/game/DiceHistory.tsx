import { useGame } from "../../contexts/GameContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const DiceHistory = () => {
  const { gameState } = useGame();
  const rolls = gameState.diceHistory.slice(-5).reverse();

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle>Last 5 Rolls</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <div className="flex gap-2 justify-start">
          {rolls.map((roll, index) => (
            <div
              key={index}
              className={`
                w-8 h-8 flex items-center justify-center rounded-lg
                ${
                  gameState.players.find((p) => p.id === roll.playerId)
                    ?.color === "blue"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-red-100 text-red-600"
                }
              `}
            >
              {roll.value}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
