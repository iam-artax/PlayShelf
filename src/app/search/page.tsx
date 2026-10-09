"use client";

import { useState } from "react";

import GameGrid from "@/components/GameGrid/GameGrid";
import SearchBar from "@/components/SearchBar/SearchBar";
import { searchRawgGames } from "@/lib/rawg-client";

import type { Game } from "@/types/game";

import styles from "./search.module.css";

export default function SearchPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(query: string) {
    setIsLoading(true);
    setError("");

    try {
      const results = await searchRawgGames(query);
      setGames(results);
    } catch (error) {
      console.error("Game search failed:", error);
      setGames([]);
      setError(
        "Search failed. Check your internet connection and RAWG API key.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>DISCOVER</p>

        <h1>Search Games</h1>

        <p>Find games to add to your library.</p>
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
          <span>Searching...</span>
        </div>
      ) : (
        <GameGrid games={games} />
      )}
    </main>
  );
}