import { useGame } from "../../contexts/GameContext";
import { format } from "date-fns";

export const LogViewer = () => {
  const { gameState } = useGame();

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg max-h-96 overflow-y-auto">
      <h3 className="font-bold mb-2">Game Log</h3>
      <div className="space-y-1 text-sm">
        {gameState.rollLog.map((log, index) => (
          <div
            key={index}
            className={`py-1 ${
              log.isComputer ? "text-red-600" : "text-blue-600"
            }`}
          >
            {format(new Date(log.timestamp), "HH:mm:ss")} -{" "}
            {log.isComputer ? "Computer" : "Player"} {log.playerName} rolled a{" "}
            {log.value} at position {log.position}
          </div>
        ))}
      </div>
    </div>
  );
};
