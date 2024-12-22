"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import {
  GameState,
  Player,
  GameMode,
  GameStatistics,
} from "../types/game.types";
import { TOTAL_SQUARES, SNAKES, LADDERS } from "../constants/board";
import { StorageService } from "../services/storage";

type GameContextType = {
  gameState: GameState;
  statistics: GameStatistics;
  isPaused: boolean;
  showRollSixNotification: boolean;
  startGame: (mode: GameMode, players: Player[]) => void;
  rollDice: () => void;
  movePlayer: (playerId: string, steps: number) => void;
  saveGame: () => void;
  loadGame: () => void;
  hasSavedGame: () => boolean;
  resetGame: () => void;
  togglePause: () => void;
  isMoving: boolean;
};

const initialGameState: GameState = {
  players: [],
  currentTurn: 0,
  gameMode: "single",
  isGameOver: false,
  winner: null,
  diceHistory: [],
};

export const GameContext = createContext<GameContextType | undefined>(
  undefined
);

// Add new types for movement
type MovementState = {
  playerId: string;
  currentPosition: number;
  targetPosition: number;
  isMoving: boolean;
  isClimbingLadder?: boolean;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [statistics, setStatistics] = useState<GameStatistics>(
    StorageService.loadStatistics()
  );
  const [isPaused, setIsPaused] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [showRollSixNotification, setShowRollSixNotification] = useState(false);
  const [movementState, setMovementState] = useState<MovementState | null>(
    null
  );

  // Update statistics when game ends
  useEffect(() => {
    if (gameState.isGameOver) {
      const newStats = {
        ...statistics,
        gamesPlayed: statistics.gamesPlayed + 1,
        winLossRatio: calculateWinLossRatio(statistics.gamesPlayed + 1),
        longestGame: Math.max(
          statistics.longestGame,
          gameState.diceHistory.length
        ),
      };
      setStatistics(newStats);
      StorageService.saveStatistics(newStats);
    }
  }, [gameState.isGameOver]);

  // Helper function to calculate win/loss ratio
  const calculateWinLossRatio = (totalGames: number) => {
    const wins = totalGames - statistics.gamesPlayed;
    return totalGames > 0 ? wins / totalGames : 0;
  };

  // Check for snake or ladder after player moves
  const checkSnakeOrLadder = (position: number): number => {
    // Check if player landed on a snake head
    if (position in SNAKES) {
      return SNAKES[position];
    }
    // Check if player landed on a ladder bottom
    if (position in LADDERS) {
      return LADDERS[position];
    }
    return position;
  };

  const startGame = (mode: GameMode, players: Player[]) => {
    console.log("Starting game with players:", players);
    setGameState({
      ...initialGameState,
      gameMode: mode,
      players: players.map((player) => ({
        ...player,
        position: 0,
        hasStarted: false,
        snakesHit: 0,
        laddersClimbed: 0,
        isComputer: mode === "single" && player.id !== "1",
      })),
    });
  };

  // Helper function to create movement steps
  const createMovementSteps = (start: number, end: number): number[] => {
    const steps: number[] = [];
    if (start < end) {
      for (let i = start + 1; i <= end; i++) steps.push(i);
    } else {
      for (let i = start - 1; i >= end; i--) steps.push(i);
    }
    return steps;
  };

  // Handle piece movement animation
  useEffect(() => {
    if (!movementState || !movementState.isMoving) return;

    const steps = createMovementSteps(
      movementState.currentPosition,
      movementState.targetPosition
    );

    if (steps.length === 0) {
      setMovementState(null);
      return;
    }

    const moveToNextPosition = () => {
      const nextPosition = steps[0];

      setGameState((prev) => {
        const playerIndex = prev.players.findIndex(
          (p) => p.id === movementState.playerId
        );
        if (playerIndex === -1) return prev;

        const updatedPlayers = [...prev.players];
        updatedPlayers[playerIndex] = {
          ...updatedPlayers[playerIndex],
          position: nextPosition,
        };

        return {
          ...prev,
          players: updatedPlayers,
        };
      });

      setMovementState((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          currentPosition: nextPosition,
          isMoving: steps.length > 1,
        };
      });

      // Schedule next movement if there are more steps
      if (steps.length > 1) {
        setTimeout(() => {
          steps.shift();
          moveToNextPosition();
        }, 250); // 250ms per square
      } else {
        // Check for ladder after movement completes
        const finalPosition = checkSnakeOrLadder(nextPosition);
        if (finalPosition !== nextPosition) {
          // Start ladder animation after a brief pause
          setTimeout(() => {
            setMovementState({
              playerId: movementState.playerId,
              currentPosition: nextPosition,
              targetPosition: finalPosition,
              isMoving: true,
              isClimbingLadder: nextPosition in LADDERS,
            });
          }, 500);
        } else {
          setMovementState(null);
        }
      }
    };

    moveToNextPosition();
  }, [movementState?.isMoving]);

  const movePlayer = (playerId: string, steps: number) => {
    console.log("Moving player:", playerId, "steps:", steps);
    const playerIndex = gameState.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) return;

    const player = gameState.players[playerIndex];
    let newPosition = player.position;

    // Player can start with any number
    if (!player.hasStarted) {
      newPosition = steps; // Start at the rolled number
    } else {
      // Normal movement for started players
      newPosition = Math.min(player.position + steps, TOTAL_SQUARES);
    }

    // Check for snake or ladder at the new position immediately
    const finalPosition = checkSnakeOrLadder(newPosition);
    const hasSnakeOrLadder = finalPosition !== newPosition;

    // First movement animation to the rolled position
    setMovementState({
      playerId,
      currentPosition: player.position,
      targetPosition: newPosition,
      isMoving: true,
    });

    // If there's a snake or ladder, schedule the second movement after a delay
    if (hasSnakeOrLadder) {
      setTimeout(() => {
        setMovementState({
          playerId,
          currentPosition: newPosition,
          targetPosition: finalPosition,
          isMoving: true,
          isClimbingLadder: newPosition in LADDERS,
        });

        setGameState((prev) => {
          const updatedPlayers = [...prev.players];
          updatedPlayers[playerIndex] = {
            ...updatedPlayers[playerIndex],
            position: finalPosition,
            hasStarted: true,
            snakesHit:
              prev.players[playerIndex].snakesHit +
              (newPosition in SNAKES ? 1 : 0),
            laddersClimbed:
              prev.players[playerIndex].laddersClimbed +
              (newPosition in LADDERS ? 1 : 0),
          };

          // Check for winner
          const isWinner = finalPosition >= TOTAL_SQUARES;

          // If there's a winner, don't schedule any more turns
          if (isWinner) {
            return {
              ...prev,
              players: updatedPlayers,
              isGameOver: true,
              winner: updatedPlayers[playerIndex],
              currentTurn: prev.currentTurn, // Keep current turn
            };
          }

          return {
            ...prev,
            players: updatedPlayers,
            currentTurn:
              steps === 6
                ? prev.currentTurn
                : (prev.currentTurn + 1) % prev.players.length,
          };
        });
      }, 1000);
    } else {
      setGameState((prev) => {
        const updatedPlayers = [...prev.players];
        updatedPlayers[playerIndex] = {
          ...updatedPlayers[playerIndex],
          position: newPosition,
          hasStarted: true,
        };

        const isWinner = newPosition >= TOTAL_SQUARES;

        // If there's a winner, don't schedule any more turns
        if (isWinner) {
          return {
            ...prev,
            players: updatedPlayers,
            isGameOver: true,
            winner: updatedPlayers[playerIndex],
            currentTurn: prev.currentTurn, // Keep current turn
          };
        }

        return {
          ...prev,
          players: updatedPlayers,
          currentTurn:
            steps === 6
              ? prev.currentTurn
              : (prev.currentTurn + 1) % prev.players.length,
        };
      });
    }
  };

  // Computer player logic
  useEffect(() => {
    if (
      !gameState.isGameOver &&
      gameState.players[gameState.currentTurn]?.isComputer &&
      !movementState?.isMoving // Don't roll while piece is moving
    ) {
      // Add a delay to make the computer's move feel more natural
      const timeoutId = setTimeout(() => {
        handleComputerTurn();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [gameState.currentTurn, gameState.isGameOver, movementState?.isMoving]);

  // New function to handle computer's turn
  const handleComputerTurn = async () => {
    // Don't process if game is over or computer isn't current player
    if (
      gameState.isGameOver ||
      !gameState.players[gameState.currentTurn]?.isComputer
    ) {
      return;
    }

    const roll = Math.floor(Math.random() * 6) + 1;
    const currentPlayer = gameState.players[gameState.currentTurn];

    // Update dice history
    setGameState((prev) => ({
      ...prev,
      diceHistory: [
        ...prev.diceHistory,
        {
          value: roll,
          playerId: currentPlayer.id,
        },
      ],
    }));

    // Show roll six notification if applicable
    if (roll === 6) {
      setShowRollSixNotification(true);
      setTimeout(() => {
        setShowRollSixNotification(false);
      }, 1500);
    }

    // Move the computer's piece
    await movePlayer(currentPlayer.id, roll);

    // Check if game is over before scheduling next turn
    if (!gameState.isGameOver && roll === 6) {
      // Wait for movement and any animations to complete
      setTimeout(() => {
        // Double-check game isn't over and it's still computer's turn
        if (
          !gameState.isGameOver &&
          gameState.players[gameState.currentTurn]?.isComputer
        ) {
          handleComputerTurn();
        }
      }, 1500);
    }
  };

  // Update the handleRollClick function
  const handleRollClick = async () => {
    // Don't allow rolling if it's computer's turn or already rolling
    const currentPlayer = gameState.players[gameState.currentTurn];
    if (currentPlayer?.isComputer || isRolling) return;

    try {
      // Start rolling animation
      setIsRolling(true);

      // Wait for dice animation
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Perform the roll
      const roll = Math.floor(Math.random() * 6) + 1;

      // Update game state with roll result
      setGameState((prev) => ({
        ...prev,
        diceHistory: [
          ...prev.diceHistory,
          {
            value: roll,
            playerId: currentPlayer.id,
          },
        ],
      }));

      // Move the player
      await movePlayer(currentPlayer.id, roll);

      // Show roll six notification if applicable
      if (roll === 6) {
        setShowRollSixNotification(true);
        setTimeout(() => {
          setShowRollSixNotification(false);
        }, 1500);
      }
    } finally {
      // Ensure rolling state is reset
      setIsRolling(false);
    }
  };

  const resetGame = () => {
    setGameState({
      ...initialGameState,
      players: [], // Clear players to show mode selection
    });
  };

  const saveGame = () => {
    if (gameState.players.length > 0) {
      const saveData = {
        ...gameState,
        savedAt: new Date().toISOString(),
      };
      StorageService.saveGame(saveData);
      setIsPaused(false); // Close pause menu after saving
    }
  };

  const loadGame = () => {
    const savedGame = StorageService.loadGame();
    if (savedGame) {
      setGameState(savedGame);
      setIsPaused(false); // Close pause menu after loading
    }
  };

  // Add check for saved game
  const hasSavedGame = (): boolean => {
    return StorageService.hasSavedGame();
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const value = {
    gameState,
    statistics,
    isPaused,
    showRollSixNotification,
    startGame,
    rollDice: handleRollClick,
    movePlayer,
    saveGame,
    loadGame,
    hasSavedGame,
    resetGame,
    togglePause,
    isMoving: !!movementState?.isMoving,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
