import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../../contexts/GameContext";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export const PauseMenu = () => {
  const { isPaused, togglePause, saveGame, loadGame, resetGame, hasSavedGame } =
    useGame();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isPaused) return null;

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 w-screen h-screen bg-black/50 z-[20000] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 z-[20000]"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Game Paused</h2>
          <div className="space-y-4">
            <Button
              onClick={togglePause}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Resume Game
            </Button>
            <Button
              onClick={saveGame}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              Save Game
            </Button>
            <Button
              onClick={loadGame}
              className="w-full bg-yellow-500 hover:bg-yellow-600"
              disabled={!hasSavedGame()}
            >
              Load Game
            </Button>
            <Button
              onClick={resetGame}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              Exit to Menu
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
