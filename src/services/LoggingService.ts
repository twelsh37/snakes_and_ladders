import { format } from "date-fns";

export interface GameLogEntry {
  timestamp: Date;
  playerName: string;
  isComputer: boolean;
  value: number;
  position: number;
}

export class LoggingService {
  private readonly STORAGE_KEY = "game_logs";
  private currentLogId: string;

  constructor() {
    // Only initialize if we're in a browser environment
    if (typeof window !== "undefined") {
      this.currentLogId = this.createNewLogId();
    } else {
      this.currentLogId = "";
    }
  }

  private createNewLogId(): string {
    return `game_log_${format(new Date(), "yyyy-MM-dd_HH-mm-ss")}`;
  }

  public async logRoll(entry: GameLogEntry): Promise<void> {
    try {
      const logs = this.getLogs();
      const logMessage = {
        id: this.currentLogId,
        timestamp: entry.timestamp,
        message: `[${format(entry.timestamp, "yyyy-MM-dd HH:mm:ss")}] ${
          entry.isComputer ? "Computer" : "Player"
        } ${entry.playerName} rolled ${entry.value} at position ${
          entry.position
        }`,
      };

      logs.push(logMessage);

      if (typeof window !== "undefined") {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
      }

      console.log("Log saved:", logMessage); // Debug logging
    } catch (error) {
      console.error("Failed to write to log storage:", error);
    }
  }

  public getLogs(): Array<{
    id: string;
    timestamp: Date;
    message: string;
  }> {
    try {
      if (typeof window === "undefined") return [];

      const storedLogs = localStorage.getItem(this.STORAGE_KEY);
      const logs = storedLogs ? JSON.parse(storedLogs) : [];
      console.log("Retrieved logs:", logs); // Debug logging
      return logs;
    } catch (error) {
      console.error("Failed to read from log storage:", error);
      return [];
    }
  }

  public clearLogs(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log("Logs cleared"); // Debug logging
    }
  }

  public startNewLog(): void {
    this.currentLogId = this.createNewLogId();
    console.log("New log started:", this.currentLogId); // Debug logging
  }
}

export const loggingService = new LoggingService();
