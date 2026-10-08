"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import LibraryGameCard from "@/components/LibraryGameCard/LibraryGameCard";

import { getLibrary } from "@/lib/library";

import type { GameStatus } from "@/types/game";
import type { LibraryGame } from "@/types/library";

import styles from "./LibraryView.module.css";

const sections: {
  status: GameStatus;
  title: string;
  icon: string;
}[] = [
  {
    status: "playing",
    title: "Playing",
    icon: "bx-play",
  },
  {
    status: "next-up",
    title: "Next Up",
    icon: "bx-time",
  },
  {
    status: "complete",
    title: "Complete",
    icon: "bx-check",
  },
  {
    status: "dropped",
    title: "Dropped",
    icon: "bx-x",
  },
];

type Filter =
  | "all"
  | GameStatus
  | "favorite";

export default function LibraryView() {
  const [games, setGames] =
    useState<LibraryGame[]>([]);

  const [filter, setFilter] =
    useState<Filter>("all");

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadLibrary() {
    setIsLoading(true);
    setError("");

    try {
      const library =
        await getLibrary();

      setGames(library);
    } catch (error) {
      console.error(
        "Failed to load library:",
        error,
      );

      setError(
        "Failed to load your library.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadLibrary();
  }, []);

  const filteredGames = useMemo(() => {
    if (filter === "all") {
      return games;
    }

    if (filter === "favorite") {
      return games.filter(
        (game) => game.isFavorite,
      );
    }

    return games.filter(
      (game) =>
        game.status === filter,
    );
  }, [games, filter]);

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>
          <i
            className="bx bx-loader-alt bx-spin"
            aria-hidden="true"
          />

          <span>Loading library</span>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            YOUR COLLECTION
          </p>

          <h1>Library</h1>

          <p className={styles.count}>
            {games.length}{" "}
            {games.length === 1
              ? "game"
              : "games"}
          </p>
        </div>

        <Link
          href="/search"
          className={styles.addButton}
          aria-label="Search games"
        >
          <i
            className="bx bx-plus"
            aria-hidden="true"
          />
        </Link>
      </header>

      {error && (
        <p className={styles.error}>
          {error}
        </p>
      )}

      {games.length > 0 && (
        <div className={styles.filters}>
          <button
            type="button"
            className={`${styles.filterButton} ${
              filter === "all"
                ? styles.active
                : ""
            }`}
            onClick={() =>
              setFilter("all")
            }
          >
            All
          </button>

          {sections.map((section) => (
            <button
              key={section.status}
              type="button"
              className={`${styles.filterButton} ${
                filter === section.status
                  ? styles.active
                  : ""
              }`}
              onClick={() =>
                setFilter(
                  section.status,
                )
              }
            >
              <i
                className={`bx ${section.icon}`}
                aria-hidden="true"
              />

              {section.title}
            </button>
          ))}

          <button
            type="button"
            className={`${styles.filterButton} ${
              filter === "favorite"
                ? styles.active
                : ""
            }`}
            onClick={() =>
              setFilter("favorite")
            }
          >
            <i
              className="bx bxs-heart"
              aria-hidden="true"
            />

            Favorites
          </button>
        </div>
      )}

      {!error &&
        games.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <i
                className="bx bx-library"
                aria-hidden="true"
              />
            </div>

            <h2>
              Your library is empty
            </h2>

            <p>
              Search for a game and
              add it to your collection.
            </p>

            <Link
              href="/search"
              className={styles.emptyButton}
            >
              Search Games
            </Link>
          </div>
        )}

      {games.length > 0 &&
        filteredGames.length === 0 && (
          <div className={styles.emptyFilter}>
            <i
              className="bx bx-filter-alt"
              aria-hidden="true"
            />

            <p>
              No games in this
              category.
            </p>
          </div>
        )}

      {filter === "all" ? (
        <div className={styles.sections}>
          {sections.map(
            (section) => {
              const sectionGames =
                games.filter(
                  (game) =>
                    game.status ===
                    section.status,
                );

              if (
                sectionGames.length ===
                0
              ) {
                return null;
              }

              return (
                <section
                  key={section.status}
                  className={
                    styles.section
                  }
                >
                  <div
                    className={
                      styles.sectionHeader
                    }
                  >
                    <div>
                      <i
                        className={`bx ${section.icon}`}
                        aria-hidden="true"
                      />

                      <h2>
                        {section.title}
                      </h2>
                    </div>

                    <span>
                      {
                        sectionGames.length
                      }
                    </span>
                  </div>

                  <div
                    className={
                      styles.grid
                    }
                  >
                    {sectionGames.map(
                      (game) => (
                        <LibraryGameCard
                          key={
                            game.gameId
                          }
                          game={game}
                          onChange={
                            loadLibrary
                          }
                        />
                      ),
                    )}
                  </div>
                </section>
              );
            },
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredGames.map(
            (game) => (
              <LibraryGameCard
                key={game.gameId}
                game={game}
                onChange={
                  loadLibrary
                }
              />
            ),
          )}
        </div>
      )}
    </main>
  );
}