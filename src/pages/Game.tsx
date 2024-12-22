import { GameBoard } from '../components/board/GameBoard';
import { DiceRoller } from '../components/dice/DiceRoller';
import { GameStatistics } from '../components/statistics/GameStatistics';

export const Game = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <div className="flex-1">
        <GameBoard />
      </div>
      <div className="w-80 p-4">
        <DiceRoller />
        <GameStatistics />
      </div>
    </div>
  );
}; 
