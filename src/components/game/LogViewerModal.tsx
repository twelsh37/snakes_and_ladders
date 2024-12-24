import { useState, useEffect } from "react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { LoggingService } from "../../services/LoggingService";
import { format, parseISO } from "date-fns";

export const LogViewerModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [logFiles, setLogFiles] = useState<string[]>([]);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [logContent, setLogContent] = useState<string>("");

  useEffect(() => {
    const loadLogs = async () => {
      const files = await LoggingService.getLogFiles();
      setLogFiles(files.sort().reverse());
    };

    if (isOpen) {
      loadLogs();
    }
  }, [isOpen]);

  const handleLogSelect = async (filename: string) => {
    const content = await LoggingService.getLogContent(filename);
    setSelectedLog(filename);
    setLogContent(content);
  };

  const formatLogDate = (filename: string) => {
    // Extract date from snl_yyyyMMddHHmmss.txt
    const dateStr = filename.slice(4, 18);
    const date = parseISO(
      `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(
        6,
        8
      )}T${dateStr.slice(8, 10)}:${dateStr.slice(10, 12)}:${dateStr.slice(
        12,
        14
      )}`
    );
    return format(date, "PPpp");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Game Logs</h2>
            <div className="flex gap-4">
              <div className="w-1/3 border-r">
                <h3 className="font-semibold mb-2">Log Files</h3>
                <div className="space-y-2">
                  {logFiles.map((file) => (
                    <button
                      key={file}
                      onClick={() => handleLogSelect(file)}
                      className={`w-full text-left px-2 py-1 rounded ${
                        selectedLog === file
                          ? "bg-blue-100"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {formatLogDate(file)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-2/3">
                <h3 className="font-semibold mb-2">Log Content</h3>
                <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded h-96 overflow-y-auto">
                  {logContent || "Select a log file to view its contents"}
                </pre>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
