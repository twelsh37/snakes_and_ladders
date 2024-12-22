import { motion, AnimatePresence } from "framer-motion";
import ReactConfetti from "react-confetti";
import { useEffect, useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";

interface WinnerCelebrationProps {
  winnerName: string;
}

export const WinnerCelebration = ({ winnerName }: WinnerCelebrationProps) => {
  const { width, height } = useWindowSize();
  const [isConfettiActive, setIsConfettiActive] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setIsConfettiActive(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen z-[10000] pointer-events-none">
      {isConfettiActive && width > 0 && height > 0 && (
        <ReactConfetti
          width={width}
          height={height}
          recycle={true}
          numberOfPieces={200}
          gravity={0.2}
          className="fixed top-0 left-0 w-screen h-screen z-[10000]"
        />
      )}

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-full max-w-2xl px-4">
        <motion.div
          initial={{ scale: 0, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          className="relative"
        >
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 p-8 rounded-2xl shadow-2xl transform rotate-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: [1, 1.2, 1],
                transition: {
                  duration: 0.8,
                  times: [0, 0.5, 1],
                  ease: "easeOut",
                  delay: 0.3,
                },
              }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-4">
                🎉 Congratulations! 🎉
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold text-white text-center">
                {winnerName} Wins!
              </h2>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: `${Math.random() * 100}vw`,
            y: "100vh",
            rotate: 0,
          }}
          animate={{
            y: "-10vh",
            rotate: 360,
            transition: {
              duration: 4,
              delay: i * 0.5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            },
          }}
          className="fixed text-4xl"
        >
          🏆
        </motion.div>
      ))}
    </div>
  );
};
