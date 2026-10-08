"use client";

import {
  useState,
} from "react";

import GameGrid from "@/components/GameGrid/GameGrid";
import SearchBar from "@/components/SearchBar/SearchBar";

import type { Game } from "@/types/game";

import styles from "./search.module.css";

export default function SearchPage() {
  const [games, setGames] =
    useState<Game[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSearch(
    query: string,
  ) {
    setIsLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          `/api/games/search?q=${encodeURIComponent(
            query,
          )}`,
        );

      if (!response.ok) {
        throw new Error(
          "Search failed",
        );
      }

      const data: {
        results: Game[];
      } = await response.json();

      setGames(data.results);
    } catch {
      setGames([]);

      setError(
        "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>
          DISCOVER
        </p>

        <h1>Search Games</h1>

        <p>
          Find games to add to your
          library.
        </p>
      </header>

      <SearchBar
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      {error && (
        <p className={styles.error}>
          {error}
        </p>
      )}

      {isLoading ? (
        <div className={styles.loading}>
          <i
            className="bx bx-loader-alt bx-spin"
            aria-hidden="true"
          />

          <span>
            Searching...
          </span>
        </div>
      ) : (
        <GameGrid games={games} />
      )}
    </main>
  );
}