import { useGame } from "../../contexts/GameContext";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export const PauseMenu = () => {
  const { togglePause, saveGame, resetGame, isPaused } = useGame();

  // Don't render if not paused
  if (!isPaused) return null;

  return (
    <Card className="absolute inset-0 m-4 bg-white/95 backdrop-blur-sm">
      <CardContent className="p-4 space-y-4">
        <Button onClick={togglePause} className="w-full" variant="primary">
          Resume Game
        </Button>
        <Button onClick={saveGame} className="w-full" variant="secondary">
          Save Game
        </Button>
        <Button
          onClick={() => {
            resetGame();
            togglePause();
          }}
          className="w-full"
          variant="destructive"
        >
          Exit Game
        </Button>
      </CardContent>
    </Card>
  );
};
