import { useGame } from "../../contexts/GameContext";
import { motion } from "framer-motion";
import { DiceDisplay } from "./DiceDisplay";
import { RollSixNotification } from "./RollSixNotification";
import { useState, useEffect } from "react";

export const GameControls = () => {
  const { gameState, rollDice, resetGame, togglePause } = useGame();
  const [isRolling, setIsRolling] = useState(false);
  const [showRollSix, setShowRollSix] = useState(false);
  const [rollSixKey, setRollSixKey] = useState(0);
  const currentPlayer = gameState.players[gameState.currentTurn];
  const lastRoll = gameState.diceHistory[gameState.diceHistory.length - 1];

  // Show notification when a 6 is rolled
  useEffect(() => {
    if (lastRoll === 6 && !gameState.isGameOver) {
      setRollSixKey((prev) => prev + 1);
      setShowRollSix(true);
      const timer = setTimeout(() => {
        setShowRollSix(false);
      }, 1500); // Show for 1.5s before hiding
      return () => clearTimeout(timer);
    }
  }, [gameState.diceHistory.length]);

  const handleRollClick = async () => {
    setIsRolling(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    rollDice();
    setIsRolling(false);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Current Player Display */}
        <div className="relative">
          <motion.div
            animate={{
              backgroundColor: currentPlayer?.isComputer
                ? "rgb(254 226 226)"
                : currentPlayer?.color === "blue"
                ? "rgb(219 234 254)"
                : "rgb(254 226 226)",
            }}
            className="rounded-lg p-4 shadow-md"
          >
            <h3 className="text-lg font-semibold mb-2">Current Turn</h3>
            <div
              className={`p-2 rounded font-medium
              ${
                currentPlayer?.color === "blue"
                  ? "text-blue-600"
                  : "text-red-600"
              }`}
            >
              {currentPlayer?.name || "Waiting for players..."}
            </div>
          </motion.div>
          <button
            onClick={togglePause}
            className="absolute top-4 right-4 bg-gray-500 text-white px-4 py-2 rounded-lg
                     hover:bg-gray-600 transition-colors text-sm"
          >
            Pause
          </button>
        </div>

        {/* Game Controls */}
        <div className="text-center space-y-4">
          {gameState.isGameOver ? (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg
                       hover:bg-green-600 transition-colors"
            >
              New Game
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRollClick}
              disabled={isRolling}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg
                       hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed
                       transition-colors"
            >
              Roll Dice
            </motion.button>
          )}

          {/* Dice Display */}
          {lastRoll && !gameState.isGameOver && (
            <div className="flex justify-center">
              <DiceDisplay value={lastRoll} isRolling={isRolling} />
            </div>
          )}
        </div>

        {/* Game Status */}
        {gameState.isGameOver && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 p-4 rounded-lg text-center"
          >
            <h3 className="font-bold text-green-800 mb-2">
              {gameState.winner?.name} Wins!
            </h3>
            <p className="text-sm text-green-600">
              Click New Game to play again
            </p>
          </motion.div>
        )}
      </div>

      <RollSixNotification show={showRollSix} key={rollSixKey} />
    </>
  );
};
