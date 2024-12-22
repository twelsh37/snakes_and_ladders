import { useGame } from "../../contexts/GameContext";
import { DiceRoll } from "../game/DiceRoll";
import { DiceHistory } from "../game/DiceHistory";
import { GameStatistics } from "../game/GameStatistics";
import { PauseMenu } from "../game/PauseMenu";
import { PlayerTurn } from "../game/PlayerTurn";
import { Button } from "../ui/button";
import { useState } from "react";

export const GameSidebar = () => {
  const { gameState, isPaused, rollDice, togglePause, isMoving } = useGame();

  const [isRolling, setIsRolling] = useState(false);

  const handleRollClick = async () => {
    setIsRolling(true);
    await rollDice();
    setIsRolling(false);
  };

  const currentPlayer = gameState.players[gameState.currentTurn];

  if (!currentPlayer) return null;

  return (
    <div className="w-80 p-4 bg-white rounded-lg shadow-lg space-y-4">
      <PlayerTurn />
      <div className="space-y-4">
        <DiceRoll
          isRolling={isRolling}
          disabled={isMoving || currentPlayer.isComputer}
          onRoll={handleRollClick}
        />
        <DiceHistory />
      </div>
      <GameStatistics />
      <div className="pt-4 border-t border-gray-200">
        <Button variant="secondary" className="w-full" onClick={togglePause}>
          Pause Game
        </Button>
      </div>
      {isPaused && <PauseMenu />}
    </div>
  );
};
