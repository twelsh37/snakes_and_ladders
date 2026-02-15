"use client";

import { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { GameMode, Player } from "@/types/game.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const GameModeSelect = () => {
  const { startGame } = useGame();
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState(
    selectedMode === "single" ? "Computer" : "Player 2"
  );

  const handleStartGame = () => {
    if (!player1Name.trim()) return;
    if (selectedMode === "multiplayer" && !player2Name.trim()) return;

    const players: Player[] = [
      {
        id: "1",
        name: player1Name.trim(),
        position: 0,
        isComputer: false,
        hasStarted: false,
        color: "blue" as const,
        snakesHit: 0,
        laddersClimbed: 0,
      },
      {
        id: "2",
        name: selectedMode === "single" ? "Computer" : player2Name.trim(),
        position: 0,
        isComputer: selectedMode === "single",
        hasStarted: false,
        color: "red" as const,
        snakesHit: 0,
        laddersClimbed: 0,
      },
    ];
    startGame(selectedMode!, players);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-foreground">
            {selectedMode ? "Enter player names" : "Select game mode"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedMode ? (
            <div className="space-y-4">
              <Button
                onClick={() => setSelectedMode("single")}
                className="w-full"
                variant="primary"
              >
                Single player
              </Button>
              <Button
                onClick={() => setSelectedMode("multiplayer")}
                className="w-full"
                variant="success"
              >
                Two players
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="player1-name" className="text-sm font-medium text-foreground">
                  Player 1 name
                </label>
                <Input
                  id="player1-name"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  placeholder="Enter name"
                  maxLength={20}
                  className="w-full"
                />
              </div>

              {selectedMode === "multiplayer" && (
                <div className="space-y-2">
                  <label htmlFor="player2-name" className="text-sm font-medium text-foreground">
                    Player 2 name
                  </label>
                  <Input
                    id="player2-name"
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
                    placeholder="Enter name"
                    maxLength={20}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => setSelectedMode(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button onClick={handleStartGame} className="flex-1" variant="success">
                  Start game
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
