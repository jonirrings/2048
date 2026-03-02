import type { PageProps, Metadata } from "rari";
import { Game } from "@/components/game/Game";

export default function HomePage(_params: PageProps) {
  return <Game />;
}

export const metadata: Metadata = {
  title: "2048 Game",
  description: "A feature-rich 2048 game with multiple animation modes and controls",
};
