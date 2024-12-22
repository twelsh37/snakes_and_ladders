import { useGame } from '../../contexts/GameContext';

export const GameStatistics = () => {
  const { statistics } = useGame();

  return (
    <div className="mt-8 p-4 bg-white/80 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Game Statistics</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Games Played:</span>
          <span>{statistics.gamesPlayed}</span>
        </div>
        <div className="flex justify-between">
          <span>Win/Loss Ratio:</span>
          <span>{(statistics.winLossRatio * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Longest Game:</span>
          <span>{statistics.longestGame} turns</span>
        </div>
        <div className="flex justify-between">
          <span>Snakes Hit:</span>
          <span>{statistics.snakesHit}</span>
        </div>
        <div className="flex justify-between">
          <span>Ladders Climbed:</span>
          <span>{statistics.laddersClimbed}</span>
        </div>
      </div>
    </div>
  );
}; 
