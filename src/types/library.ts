import type { GameStatus } from "@/types/game";

export type LibraryGame = {
  gameId: number;
  name: string;
  cover: string | null;
  released: string | null;
  metacritic: number | null;
  status: GameStatus;
  isFavorite: boolean;
  addedAt: string;
};