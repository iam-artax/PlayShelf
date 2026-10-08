import type { Game } from "@/types/game";

import GameCard from "@/components/GameCard/GameCard";

import styles from "./GameGrid.module.css";

type GameGridProps = {
  games: Game[];
};

export default function GameGrid({
  games,
}: GameGridProps) {
  if (games.length === 0) {
    return (
      <p className={styles.empty}>
        No games found.
      </p>
    );
  }

  return (
    <div className={styles.grid}>
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
        />
      ))}
    </div>
  );
}