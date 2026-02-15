import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const PauseMenu = () => {
  const { togglePause, saveGame, resetGame, isPaused } = useGame();

  if (!isPaused) return null;

  return (
    <Card className="absolute inset-0 m-4 bg-card/95 backdrop-blur-sm border border-border">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Game paused</h2>
        <div className="space-y-2">
          <Button onClick={togglePause} className="w-full" variant="primary">
            Resume
          </Button>
          <Button onClick={saveGame} className="w-full" variant="secondary">
            Save & continue later
          </Button>
          <Button
            onClick={() => {
              resetGame();
              togglePause();
            }}
            className="w-full"
            variant="destructive"
          >
            Quit to menu
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
