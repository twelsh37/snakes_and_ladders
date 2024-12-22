import { GameState, GameStatistics } from '../types/game.types';

const STORAGE_KEYS = {
  SAVED_GAME: 'snakes-and-ladders-save',
  STATISTICS: 'snakes-and-ladders-stats',
};

const isClient = typeof window !== 'undefined';

export const StorageService = {
  saveGame: (gameState: GameState): void => {
    if (!isClient) return;
    localStorage.setItem(STORAGE_KEYS.SAVED_GAME, JSON.stringify(gameState));
  },

  loadGame: (): GameState | null => {
    if (!isClient) return null;
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_GAME);
    return saved ? JSON.parse(saved) : null;
  },

  saveStatistics: (statistics: GameStatistics): void => {
    if (!isClient) return;
    localStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(statistics));
  },

  loadStatistics: (): GameStatistics => {
    if (!isClient) {
      return {
        gamesPlayed: 0,
        winLossRatio: 0,
        longestGame: 0,
        snakesHit: 0,
        laddersClimbed: 0,
      };
    }
    const saved = localStorage.getItem(STORAGE_KEYS.STATISTICS);
    return saved ? JSON.parse(saved) : {
      gamesPlayed: 0,
      winLossRatio: 0,
      longestGame: 0,
      snakesHit: 0,
      laddersClimbed: 0,
    };
  },

  clearSavedGame: (): void => {
    if (!isClient) return;
    localStorage.removeItem(STORAGE_KEYS.SAVED_GAME);
  },

  hasSavedGame: (): boolean => {
    if (!isClient) return false;
    return localStorage.getItem(STORAGE_KEYS.SAVED_GAME) !== null;
  },
}; 
