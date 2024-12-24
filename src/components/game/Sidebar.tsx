import { useState } from "react";
import { Button } from "../ui/button";
import { LogViewerModal } from "./LogViewerModal";
import { useGame } from "../../contexts/GameContext";
import { DiceRoll } from "./DiceRoll";
import { GameStatistics } from "./GameStatistics";
import { RollHistory } from "./RollHistory";

export const Sidebar = () => {
  const [isLogViewerOpen, setIsLogViewerOpen] = useState(false);
  const { gameState, rollDice, isMoving, togglePause } = useGame();

  return (
    <div className="w-full max-w-sm space-y-4">
      {/* Current Turn */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="font-bold text-lg mb-2">Current Turn</h2>
        <div className="text-blue-600">
          {gameState.players[gameState.currentTurn]?.name}
        </div>
      </div>

      {/* Dice Roll */}
      <DiceRoll isRolling={false} disabled={isMoving} onRoll={rollDice} />

      {/* Last 5 Rolls */}
      <RollHistory />

      {/* Game Statistics */}
      <GameStatistics />

      {/* Game Control Buttons */}
      <Button
        onClick={togglePause}
        variant="secondary"
        className="w-full bg-gray-100"
      >
        Pause Game
      </Button>

      <Button
        onClick={() => setIsLogViewerOpen(true)}
        variant="secondary"
        className="w-full bg-gray-100"
      >
        View Logs
      </Button>

      <LogViewerModal
        isOpen={isLogViewerOpen}
        onClose={() => setIsLogViewerOpen(false)}
      />
    </div>
  );
};
