import { Game } from "../components/Game";
import { GameProvider } from "../contexts/GameContext";

export default function HomePage() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}
