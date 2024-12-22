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

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [statistics, setStatistics] = useState<GameStatistics>(
    StorageService.loadStatistics()
  );
  const [isPaused, setIsPaused] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [showRollSixNotification, setShowRollSixNotification] = useState(false);

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

  const movePlayer = (playerId: string, steps: number) => {
    setGameState((prev) => {
      const playerIndex = prev.players.findIndex((p) => p.id === playerId);
      if (playerIndex === -1) return prev;

      const player = prev.players[playerIndex];
      let newPosition = Math.min(player.position + steps, TOTAL_SQUARES);
      const oldPosition = player.position;

      // Check for snakes and ladders
      const finalPosition = checkSnakeOrLadder(newPosition);

      // Determine if player hit a snake or climbed a ladder
      const hitSnake = finalPosition < newPosition;
      const climbedLadder = finalPosition > newPosition;

      // Create updated player with new statistics
      const updatedPlayer = {
        ...player,
        position: finalPosition,
        hasStarted: true,
        snakesHit: (player.snakesHit || 0) + (hitSnake ? 1 : 0),
        laddersClimbed: (player.laddersClimbed || 0) + (climbedLadder ? 1 : 0),
      };

      // Update all players array
      const updatedPlayers = [...prev.players];
      updatedPlayers[playerIndex] = updatedPlayer;

      // Update global statistics if snake or ladder was encountered
      if (hitSnake || climbedLadder) {
        const newStats = {
          ...statistics,
          snakesHit: statistics.snakesHit + (hitSnake ? 1 : 0),
          laddersClimbed: statistics.laddersClimbed + (climbedLadder ? 1 : 0),
        };
        setStatistics(newStats);
        StorageService.saveStatistics(newStats);
      }

      // Check for win condition
      const isWinner = finalPosition === TOTAL_SQUARES;

      return {
        ...prev,
        players: updatedPlayers,
        isGameOver: isWinner,
        winner: isWinner ? updatedPlayer : null,
        currentTurn: isWinner
          ? prev.currentTurn
          : steps === 6
          ? prev.currentTurn
          : (prev.currentTurn + 1) % prev.players.length,
      };
    });
  };

  // Computer player logic
  useEffect(() => {
    if (
      !gameState.isGameOver &&
      gameState.players[gameState.currentTurn]?.isComputer
    ) {
      // Add a delay to make the computer's move feel more natural
      const timeoutId = setTimeout(() => {
        rollDice();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [gameState.currentTurn, gameState.isGameOver]);

  const rollDice = async () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    const currentPlayer = gameState.players[gameState.currentTurn];

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

    movePlayer(currentPlayer.id, roll);

    // If it's a 6, show the notification
    if (roll === 6) {
      setShowRollSixNotification(true);
      setTimeout(() => {
        setShowRollSixNotification(false);
      }, 1500);
    }
  };

  const handleRollClick = async () => {
    setIsRolling(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Dice roll animation
    await rollDice();
    setIsRolling(false);
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
