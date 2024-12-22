import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface DiceDisplayProps {
  value: number | null;
  isRolling: boolean;
}

export const DiceDisplay = ({ value, isRolling }: DiceDisplayProps) => {
  const [rollDuration, setRollDuration] = useState(0);

  useEffect(() => {
    if (isRolling) {
      setRollDuration(1 + Math.random() * 2);
    }
  }, [isRolling]);

  return (
    <div className="perspective-500">
      <motion.div
        initial={false}
        animate={{
          rotateY: isRolling ? 1800 : 0,
          transition: {
            duration: isRolling ? rollDuration : 0,
            ease: [0.3, 0.1, 0.3, 1],
          },
        }}
        className="w-20 h-20 bg-gradient-to-br from-white to-gray-100 
                   rounded-xl shadow-lg flex items-center justify-center 
                   text-4xl font-bold border-2 border-gray-200
                   preserve-3d backface-visible"
      >
        <motion.span
          initial={false}
          animate={{
            opacity: isRolling ? 0.5 : 1,
            scale: isRolling ? 0.9 : 1,
          }}
          transition={{
            duration: 0.2,
            delay: isRolling ? 0 : rollDuration - 0.2,
          }}
        >
          {isRolling ? "?" : value || "-"}
        </motion.span>
      </motion.div>
    </div>
  );
};
