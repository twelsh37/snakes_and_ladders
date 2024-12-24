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
  lastRoll: null,
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
  isSlidingSnake?: boolean;
  ladderPath?: {
    start: number;
    end: number;
  };
  snakePath?: {
    start: number;
    end: number;
  };
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
    setIsPaused(false);

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

  // Update the movement animation useEffect
  useEffect(() => {
    if (!movementState || !movementState.isMoving) return;

    // If climbing ladder or sliding down snake, don't use step-by-step movement
    if (movementState.isClimbingLadder || movementState.isSlidingSnake) {
      // Let the LadderClimbing or SnakeSliding component handle the animation
      setTimeout(() => {
        setMovementState(null);
      }, 1000);
      return;
    }

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

      if (steps.length > 1) {
        setTimeout(() => {
          steps.shift();
          moveToNextPosition();
        }, 250);
      } else {
        // Check for snake or ladder after movement completes
        const finalPosition = checkSnakeOrLadder(nextPosition);
        if (finalPosition !== nextPosition) {
          setTimeout(() => {
            const isLadder = nextPosition in LADDERS;
            setMovementState({
              playerId: movementState.playerId,
              currentPosition: nextPosition,
              targetPosition: finalPosition,
              isMoving: true,
              isClimbingLadder: isLadder,
              isSlidingSnake: !isLadder,
              ladderPath: isLadder
                ? {
                    start: nextPosition,
                    end: finalPosition,
                  }
                : undefined,
              snakePath: !isLadder
                ? {
                    start: nextPosition,
                    end: finalPosition,
                  }
                : undefined,
            });
          }, 500);
        } else {
          setMovementState(null);
        }
      }
    };

    moveToNextPosition();
  }, [movementState?.isMoving]);

  const movePlayer = async (playerId: string, steps: number) => {
    return new Promise<void>((resolve) => {
      console.log(`Moving player ${playerId} ${steps} steps`);
      const playerIndex = gameState.players.findIndex((p) => p.id === playerId);
      if (playerIndex === -1) {
        resolve();
        return;
      }

      const player = gameState.players[playerIndex];
      let newPosition = player.position;

      // Calculate new position
      if (!player.hasStarted) {
        newPosition = steps;
      } else {
        const targetPosition = player.position + steps;

        // Handle bounce-back logic for final square
        if (targetPosition > TOTAL_SQUARES) {
          const excess = targetPosition - TOTAL_SQUARES;
          newPosition = TOTAL_SQUARES - excess;
          console.log(
            `Bouncing back ${excess} spaces from ${TOTAL_SQUARES} to ${newPosition}`
          );
        } else {
          newPosition = targetPosition;
        }
      }

      // Initial movement animation
      setMovementState({
        playerId,
        currentPosition: player.position,
        targetPosition: Math.min(newPosition, TOTAL_SQUARES),
        isMoving: true,
      });

      // If we need to bounce back, add that as a second movement
      if (
        newPosition < TOTAL_SQUARES &&
        player.position + steps > TOTAL_SQUARES
      ) {
        setTimeout(() => {
          setMovementState({
            playerId,
            currentPosition: TOTAL_SQUARES,
            targetPosition: newPosition,
            isMoving: true,
          });
        }, 1000);
      }

      // Check for snake or ladder after bounce-back
      const finalPosition = checkSnakeOrLadder(newPosition);
      const hasSnakeOrLadder = finalPosition !== newPosition;
      const isLadder = newPosition in LADDERS;

      // Handle snake/ladder movement after any bounce-back
      if (hasSnakeOrLadder) {
        setTimeout(
          () => {
            if (isLadder) {
              setMovementState({
                playerId,
                currentPosition: newPosition,
                targetPosition: finalPosition,
                isMoving: true,
                isClimbingLadder: true,
                ladderPath: {
                  start: newPosition,
                  end: finalPosition,
                },
              });
            } else {
              setMovementState({
                playerId,
                currentPosition: newPosition,
                targetPosition: finalPosition,
                isMoving: true,
                isSlidingSnake: true,
                snakePath: {
                  start: newPosition,
                  end: finalPosition,
                },
              });
            }

            // Update final position after animation
            setTimeout(() => {
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

                // Only win if exactly on final square
                const isWinner = finalPosition === TOTAL_SQUARES;
                return {
                  ...prev,
                  players: updatedPlayers,
                  isGameOver: isWinner,
                  winner: isWinner ? updatedPlayers[playerIndex] : null,
                  currentTurn: isWinner
                    ? prev.currentTurn
                    : steps === 6
                    ? prev.currentTurn
                    : (prev.currentTurn + 1) % prev.players.length,
                };
              });
              resolve();
            }, 1000);
          },
          hasSnakeOrLadder ? 2000 : 1000
        ); // Extra delay if we had a bounce-back
      } else {
        // Normal movement completion
        setTimeout(() => {
          setGameState((prev) => {
            const updatedPlayers = [...prev.players];
            updatedPlayers[playerIndex] = {
              ...updatedPlayers[playerIndex],
              position: newPosition,
              hasStarted: true,
            };

            // Only win if exactly on final square
            const isWinner = newPosition === TOTAL_SQUARES;
            return {
              ...prev,
              players: updatedPlayers,
              isGameOver: isWinner,
              winner: isWinner ? updatedPlayers[playerIndex] : null,
              currentTurn: isWinner
                ? prev.currentTurn
                : steps === 6
                ? prev.currentTurn
                : (prev.currentTurn + 1) % prev.players.length,
            };
          });
          resolve();
        }, 1000);
      }
    });
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
    // Don't process if game is over, not computer's turn, or movement in progress
    if (
      gameState.isGameOver ||
      !gameState.players[gameState.currentTurn]?.isComputer ||
      movementState?.isMoving
    ) {
      return;
    }

    const roll = Math.floor(Math.random() * 6) + 1;
    const currentPlayer = gameState.players[gameState.currentTurn];
    const startPosition = currentPlayer.position;

    console.log(`Computer rolling ${roll} from position ${startPosition}`);

    // Update dice history and show roll
    setGameState((prev) => ({
      ...prev,
      lastRoll: roll,
      diceHistory: [
        ...prev.diceHistory,
        { value: roll, playerId: currentPlayer.id },
      ],
    }));

    if (roll === 6) {
      setShowRollSixNotification(true);
      setTimeout(() => {
        setShowRollSixNotification(false);
      }, 1500);
    }

    // Move the computer's piece and wait for completion
    await movePlayer(currentPlayer.id, roll);

    // Wait for all animations to complete
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Get the final position after movement
    const updatedPlayer = gameState.players.find(
      (p) => p.id === currentPlayer.id
    );
    const finalPosition = updatedPlayer?.position || 0;

    console.log(`Computer finished move at position ${finalPosition}`);

    // Only allow one extra turn for a 6
    if (
      roll === 6 &&
      !gameState.isGameOver &&
      startPosition !== finalPosition
    ) {
      console.log("Computer rolled 6, taking one more turn...");
      // Wait before taking the extra turn
      setTimeout(() => {
        // Verify it's still computer's turn and movement is complete
        if (
          !gameState.isGameOver &&
          gameState.players[gameState.currentTurn]?.isComputer &&
          !movementState?.isMoving
        ) {
          // Take exactly one more turn
          handleComputerTurn();
        }
      }, 2500);
    }
  };

  // Update the handleRollClick function
  const handleRollClick = async () => {
    const currentPlayer = gameState.players[gameState.currentTurn];
    if (currentPlayer?.isComputer || isRolling) return;

    try {
      setIsRolling(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const roll = Math.floor(Math.random() * 6) + 1;

      setGameState((prev) => ({
        ...prev,
        lastRoll: roll,
        diceHistory: [
          ...prev.diceHistory,
          { value: roll, playerId: currentPlayer.id },
        ],
      }));

      await movePlayer(currentPlayer.id, roll);

      if (roll === 6) {
        setShowRollSixNotification(true);
        setTimeout(() => {
          setShowRollSixNotification(false);
        }, 1500);
      }
    } finally {
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
