import { useGame } from "@/contexts/GameContext";

export const RollHistory = () => {
  const { gameState } = useGame();
  const recentRolls = gameState.diceHistory.slice(-5).reverse(); // Get last 5 rolls

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="font-bold text-lg mb-2">Last 5 Rolls</h2>
      <div className="flex gap-2 flex-wrap">
        {recentRolls.map((roll, index) => {
          const player = gameState.players.find((p) => p.id === roll.playerId);
          return (
            <div
              key={index}
              className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                player?.isComputer ? "bg-red-100" : "bg-blue-100"
              }`}
            >
              {roll.value}
            </div>
          );
        })}
      </div>
    </div>
  );
};
