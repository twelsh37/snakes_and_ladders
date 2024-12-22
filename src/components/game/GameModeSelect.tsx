import { motion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { GameMode } from '../../types/game.types';
import { useState } from 'react';

export const GameModeSelect = () => {
  const { startGame, loadGame, hasSavedGame } = useGame();
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');

  const handleStartGame = (mode: GameMode) => {
    const players = [
      { 
        id: '1', 
        name: player1Name, 
        position: 0, 
        isComputer: false, 
        hasStarted: false,
        color: 'blue'  // Add color for Player 1
      },
      { 
        id: '2', 
        name: mode === 'single' ? 'Computer' : player2Name, 
        position: 0, 
        isComputer: mode === 'single',
        hasStarted: false,
        color: 'red'   // Add color for Player 2/Computer
      },
    ];
    startGame(mode, players);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-purple-100">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-xl shadow-xl w-96 space-y-6"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Snakes and Ladders</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-600">Player 1 Name</label>
            <input
              type="text"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                       border-blue-200"
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-red-600">Player 2 Name</label>
            <input
              type="text"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500
                       border-red-200"
              disabled={false}
              maxLength={20}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStartGame('single')}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium
                     hover:bg-blue-600 transition-colors"
          >
            vs Computer
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStartGame('multiplayer')}
            className="w-full py-3 bg-green-500 text-white rounded-lg font-medium
                     hover:bg-green-600 transition-colors"
          >
            2 Players
          </motion.button>
        </div>

        {hasSavedGame() && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadGame}
            className="w-full py-3 mt-4 bg-yellow-500 text-white rounded-lg font-medium
                     hover:bg-yellow-600 transition-colors"
          >
            Load Saved Game
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}; 
