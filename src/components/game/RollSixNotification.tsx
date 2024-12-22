import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../../contexts/GameContext";

type RollSixNotificationProps = {
  show: boolean;
};

export const RollSixNotification = ({ show }: RollSixNotificationProps) => {
  const { gameState } = useGame();
  const currentPlayer = gameState.players[gameState.currentTurn];

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="six-notification"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.2, 1],
            opacity: 1,
          }}
          exit={{
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 0.5,
            times: [0, 0.6, 1],
            ease: "easeOut",
          }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          <div
            className="bg-yellow-400 text-yellow-900 px-8 py-4 rounded-xl shadow-lg
                        font-bold text-2xl transform rotate-3"
          >
            <span className="block text-center">
              {currentPlayer?.name} Rolled a 6!
            </span>
            <span className="block text-center text-xl mt-1">
              Have Another Turn
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
