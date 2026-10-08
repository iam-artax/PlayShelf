"use client";

import {
  RecordId,
  Table,
} from "surrealdb";

import type {
  Game,
  GameStatus,
} from "@/types/game";

import type {
  LibraryGame,
} from "@/types/library";

import { getDatabase } from "@/lib/db";

const LIBRARY_TABLE = new Table("library");

const VALID_STATUSES: GameStatus[] = [
  "playing",
  "next-up",
  "complete",
  "dropped",
];

function normalizeLibraryGame(
  game: LibraryGame,
): LibraryGame {
  return {
    ...game,
    isFavorite: game.isFavorite ?? false,
  };
}

export async function getLibrary(): Promise<
  LibraryGame[]
> {
  const db = await getDatabase();

  const games = await db.select<LibraryGame>(
    LIBRARY_TABLE,
  );

  return games.map(normalizeLibraryGame);
}

export async function getLibraryGame(
  gameId: number,
): Promise<LibraryGame | undefined> {
  const db = await getDatabase();

  const game = await db.select<LibraryGame>(
    new RecordId("library", gameId),
  );

  if (!game) {
    return undefined;
  }

  return normalizeLibraryGame(game);
}

export async function addToLibrary(
  game: Game,
  status: GameStatus,
): Promise<LibraryGame> {
  const db = await getDatabase();

  const existingGame =
    await getLibraryGame(game.id);

  if (existingGame) {
    throw new Error(
      "Game is already in your library",
    );
  }

  const result = await db
    .create<LibraryGame>(
      new RecordId("library", game.id),
    )
    .content({
      gameId: game.id,
      name: game.name,
      cover: game.cover,
      released: game.released,
      metacritic: game.metacritic,
      status,
      isFavorite: false,
      addedAt: new Date().toISOString(),
    });

  return normalizeLibraryGame(result);
}

export async function updateLibraryStatus(
  gameId: number,
  status: GameStatus,
): Promise<LibraryGame | undefined> {
  const db = await getDatabase();

  const result = await db
    .update<LibraryGame>(
      new RecordId("library", gameId),
    )
    .merge({
      status,
    });

  if (!result) {
    return undefined;
  }

  return normalizeLibraryGame(result);
}

export async function updateLibraryFavorite(
  gameId: number,
  isFavorite: boolean,
): Promise<LibraryGame | undefined> {
  const db = await getDatabase();

  const result = await db
    .update<LibraryGame>(
      new RecordId("library", gameId),
    )
    .merge({
      isFavorite,
    });

  if (!result) {
    return undefined;
  }

  return normalizeLibraryGame(result);
}

export async function removeFromLibrary(
  gameId: number,
): Promise<void> {
  const db = await getDatabase();

  await db.delete(
    new RecordId("library", gameId),
  );
}

export async function exportLibrary(): Promise<
  LibraryGame[]
> {
  return getLibrary();
}

export async function importLibrary(
  games: LibraryGame[],
): Promise<number> {
  const db = await getDatabase();

  let importedCount = 0;

  for (const game of games) {
    if (
      typeof game.gameId !== "number" ||
      typeof game.name !== "string" ||
      !VALID_STATUSES.includes(
        game.status,
      )
    ) {
      continue;
    }

    const importedGame: LibraryGame = {
      gameId: game.gameId,
      name: game.name,
      cover:
        typeof game.cover === "string"
          ? game.cover
          : null,
      released:
        typeof game.released === "string"
          ? game.released
          : null,
      metacritic:
        typeof game.metacritic === "number"
          ? game.metacritic
          : null,
      status: game.status,
      isFavorite:
        game.isFavorite === true,
      addedAt:
        typeof game.addedAt === "string"
          ? game.addedAt
          : new Date().toISOString(),
    };

    await db
      .upsert<LibraryGame>(
        new RecordId(
          "library",
          importedGame.gameId,
        ),
      )
      .content(importedGame);

    importedCount += 1;
  }

  return importedCount;
}