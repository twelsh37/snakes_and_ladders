import type { AppProps } from "next/app";
import { GameProvider } from "@/contexts/GameContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GameProvider>
      <Component {...pageProps} />
    </GameProvider>
  );
} 
