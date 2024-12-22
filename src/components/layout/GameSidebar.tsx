import { useGame } from "../../contexts/GameContext";
import { DiceDisplay } from "../game/DiceDisplay";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { WinnerCelebration } from "../game/WinnerCelebration";
import { useState } from "react";

export const GameSidebar = () => {
  const {
    gameState,
    rollDice,
    resetGame,
    togglePause,
    showRollSixNotification,
  } = useGame();
  const currentPlayer = gameState.players[gameState.currentTurn];

  const [isRolling, setIsRolling] = useState(false);
  const lastRoll = gameState.diceHistory[gameState.diceHistory.length - 1];

  const handleRollClick = async () => {
    setIsRolling(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await rollDice();
    setIsRolling(false);
  };

  // Get player color based on player ID
  const getPlayerColor = (playerId: string) => {
    const player = gameState.players.find((p) => p.id === playerId);
    return player?.color === "blue" ? "bg-blue-100" : "bg-red-100";
  };

  // Calculate dice roll percentages
  const calculateDiceStats = () => {
    if (gameState.diceHistory.length === 0) return null;

    const counts = gameState.diceHistory.reduce((acc, roll) => {
      acc[roll.value] = (acc[roll.value] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Array.from({ length: 6 }, (_, i) => i + 1).map((num) => ({
      number: num,
      percentage: ((counts[num] || 0) / gameState.diceHistory.length) * 100,
    }));
  };

  const diceStats = calculateDiceStats();

  // Calculate player statistics
  const getPlayerStats = (playerId: string) => {
    const playerMoves = gameState.diceHistory.filter(
      (roll) => roll.playerId === playerId
    );
    const player = gameState.players.find((p) => p.id === playerId);

    return {
      name: player?.name || "",
      color: player?.color || "",
      snakesHit: player?.snakesHit || 0,
      laddersClimbed: player?.laddersClimbed || 0,
    };
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-80 bg-white/80 border-r flex flex-col h-screen">
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* Current Player Card */}
        <Card className="flex-shrink-0">
          <CardHeader className="py-3">
            <CardTitle>Current Turn</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div
              className={`text-lg font-semibold ${
                currentPlayer?.color === "blue"
                  ? "text-blue-600"
                  : "text-red-600"
              }`}
            >
              {currentPlayer?.name}
            </div>
          </CardContent>
        </Card>

        {/* Dice Controls */}
        <Card className="flex-shrink-0">
          <CardHeader className="py-3">
            <CardTitle>Roll Dice</CardTitle>
          </CardHeader>
          <CardContent className="py-2 space-y-4">
            {gameState.isGameOver ? (
              <Button
                onClick={resetGame}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                New Game
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleRollClick}
                  disabled={isRolling}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {isRolling ? "Rolling..." : "Roll Dice"}
                </Button>
                <div className="flex justify-center">
                  <DiceDisplay
                    value={lastRoll?.value || null}
                    isRolling={isRolling}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* Game Statistics */}
        <Card className="flex-shrink-0">
          <CardHeader className="py-3">
            <CardTitle>Game Statistics</CardTitle>
          </CardHeader>
          <CardContent className="py-2 space-y-3">
            <div className="flex justify-between">
              <span>Moves Made:</span>
              <span>{gameState.diceHistory.length}</span>
            </div>

            {/* Player Statistics */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-500">
                Player Statistics
              </div>
              {gameState.players.map((player) => {
                const stats = getPlayerStats(player.id);
                return (
                  <div
                    key={player.id}
                    className={`p-2 rounded-md ${
                      player.color === "blue" ? "bg-blue-50" : "bg-red-50"
                    }`}
                  >
                    <div
                      className={`font-medium ${
                        player.color === "blue"
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {player.name}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <span>🪜</span>
                        <span>{stats.laddersClimbed} Climbed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🐍</span>
                        <span>{stats.snakesHit} Hit</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dice Roll Distribution */}
            {diceStats && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">
                  Dice Roll Distribution
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {diceStats.map(({ number, percentage }) => (
                    <div
                      key={number}
                      className="flex flex-col items-center p-1 bg-gray-50 rounded-md"
                    >
                      <span className="text-base font-bold">{number}</span>
                      <span className="text-xs text-gray-500">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dice History */}
        <Card className="flex-shrink-0">
          <CardHeader className="py-3">
            <CardTitle>Last 5 Rolls</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex gap-2 flex-wrap">
              {gameState.diceHistory
                .slice(-5)
                .reverse()
                .map((roll, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded flex items-center justify-center font-bold
                      ${getPlayerColor(
                        roll.playerId
                      )} border border-gray-200 shadow-sm`}
                  >
                    {roll.value}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Controls */}
        <Card className="flex-shrink-0">
          <CardHeader className="py-3">
            <CardTitle>Game Controls</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <Button onClick={togglePause} variant="outline" className="w-full">
              Pause Game
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Winner celebration */}
      <AnimatePresence>
        {gameState.isGameOver && gameState.winner && (
          <WinnerCelebration winnerName={gameState.winner.name} />
        )}
      </AnimatePresence>
    </div>
  );
};
