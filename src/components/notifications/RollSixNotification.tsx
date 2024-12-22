import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface RollSixNotificationProps {
  playerName: string;
}

export const RollSixNotification = ({
  playerName,
}: RollSixNotificationProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3, y: 50 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: 0.3,
          ease: "easeOut",
        },
      }}
      exit={{
        opacity: 0,
        scale: 0.5,
        y: -50,
        transition: {
          duration: 0.2,
        },
      }}
      className="fixed inset-0 flex items-center justify-center z-[9000] pointer-events-none"
    >
      <div className="bg-yellow-400 text-yellow-900 px-8 py-6 rounded-xl shadow-lg transform rotate-2">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{
            scale: [1, 1.1, 1],
            transition: {
              duration: 0.4,
              times: [0, 0.5, 1],
              repeat: 0,
            },
          }}
        >
          <span className="block text-center text-3xl font-bold mb-2">
            {playerName} Rolled a 6!
          </span>
          <span className="block text-center text-xl">Roll Again!</span>
        </motion.div>
      </div>
    </motion.div>
  );
};
