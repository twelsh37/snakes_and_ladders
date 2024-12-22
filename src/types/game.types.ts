export interface Player {
  id: string;
  name: string;
  color: "blue" | "red";
  position: number;
  hasStarted: boolean;
  snakesHit: number;
  laddersClimbed: number;
  isComputer?: boolean;
}

export type GameMode = "single" | "multiplayer";

export type GameState = {
  players: Player[];
  currentTurn: number;
  gameMode: GameMode;
  isGameOver: boolean;
  winner: Player | null;
  diceHistory: {
    value: number;
    playerId: string;
  }[];
};

export type GameStatistics = {
  gamesPlayed: number;
  winLossRatio: number;
  longestGame: number;
  snakesHit: number;
  laddersClimbed: number;
};
