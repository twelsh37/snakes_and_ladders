import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogViewerModal } from "./LogViewerModal";
import { useGame } from "@/contexts/GameContext";
import { DiceRoll } from "./DiceRoll";
import { GameStatistics } from "./GameStatistics";
import { RollHistory } from "./RollHistory";

/** Alternative sidebar layout; GameSidebar is the canonical one used in Game. */
export const Sidebar = () => {
  const [isLogViewerOpen, setIsLogViewerOpen] = useState(false);
  const { gameState, rollDice, isMoving, togglePause } = useGame();

  const handleLogViewerOpen = () => setIsLogViewerOpen(true);

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

      {/* Game Controls - Separate container */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <Button
          onClick={togglePause}
          variant="secondary"
          className="w-full bg-gray-100 mb-4"
        >
          Pause Game
        </Button>
      </div>

      {/* Log Viewer Button - Separate container for visibility */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <Button
          variant="primary"
          onClick={handleLogViewerOpen}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium"
        >
          View Game Logs ({gameState.rollLog.length})
        </Button>
      </div>

      {/* Log Viewer Modal */}
      <LogViewerModal
        isOpen={isLogViewerOpen}
        onClose={() => setIsLogViewerOpen(false)}
      />
    </div>
  );
};
