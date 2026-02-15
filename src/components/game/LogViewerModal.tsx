import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { loggingService } from "@/services/LoggingService";
import { useState, useEffect } from "react";
import { format } from "date-fns";

interface LogViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
}

export const LogViewerModal = ({ isOpen, onClose }: LogViewerModalProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      const storedLogs = loggingService.getLogs();
      setLogs(storedLogs);
    }
  }, [isOpen]);

  const handleClearLogs = () => {
    loggingService.clearLogs();
    setLogs([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Game Logs</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end mb-4">
          <Button
            variant="destructive"
            onClick={handleClearLogs}
            className="text-xs"
          >
            Clear Logs
          </Button>
        </div>
        <ScrollArea className="h-[60vh]">
          <div className="space-y-2 p-4">
            {logs.map((log, index) => (
              <div
                key={`${log.id}-${index}`}
                className="text-sm border-b border-border pb-2"
              >
                <span className="text-muted-foreground">
                  {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                </span>{" "}
                — {log.message}
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No logs yet. Game events will appear here.</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
