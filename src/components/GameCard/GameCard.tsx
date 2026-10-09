"use client";

import CachedImage from "@/components/CachedImage/CachedImage";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  addToLibrary,
  getLibraryGame,
  updateLibraryStatus,
} from "@/lib/library";

import type {
  Game,
  GameStatus,
} from "@/types/game";

import styles from "./GameCard.module.css";

type GameCardProps = {
  game: Game;
};

const statusOptions: {
  value: GameStatus;
  label: string;
  icon: string;
}[] = [
  {
    value: "playing",
    label: "Playing",
    icon: "bx-play",
  },
  {
    value: "next-up",
    label: "Next Up",
    icon: "bx-time",
  },
  {
    value: "complete",
    label: "Complete",
    icon: "bx-check",
  },
  {
    value: "dropped",
    label: "Dropped",
    icon: "bx-x",
  },
];

export default function GameCard({
  game,
}: GameCardProps) {
  const cardRef =
    useRef<HTMLElement>(null);

  const [isAdded, setIsAdded] =
    useState(false);

  const [currentStatus, setCurrentStatus] =
    useState<GameStatus | null>(null);

  const [showStatuses, setShowStatuses] =
    useState(false);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [error, setError] =
    useState("");

  const releaseYear = game.released
    ? new Date(
        game.released,
      ).getFullYear()
    : null;

  useEffect(() => {
    async function checkLibrary() {
      try {
        const existingGame =
          await getLibraryGame(game.id);

        if (existingGame) {
          setIsAdded(true);
          setCurrentStatus(
            existingGame.status,
          );
        }
      } catch (error) {
        console.error(
          "Failed to check library:",
          error,
        );
      }
    }

    checkLibrary();
  }, [game.id]);

  useEffect(() => {
    if (!showStatuses) {
      return;
    }

    function handleOutsideClick(
      event: MouseEvent,
    ) {
      const target =
        event.target as Node;

      if (
        cardRef.current &&
        !cardRef.current.contains(
          target,
        )
      ) {
        setShowStatuses(false);
      }
    }

    document.addEventListener(
      "click",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "click",
        handleOutsideClick,
      );
    };
  }, [showStatuses]);

  async function handleStatusChange(
    status: GameStatus,
  ) {
    setIsUpdating(true);
    setError("");

    try {
      if (isAdded) {
        await updateLibraryStatus(
          game.id,
          status,
        );
      } else {
        await addToLibrary(
          game,
          status,
        );

        setIsAdded(true);
      }

      setCurrentStatus(status);
      setShowStatuses(false);
    } catch (error) {
      console.error(
        "Failed to update game:",
        error,
      );

      setError(
        "Failed to update game.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  function handleCardClick() {
    if (isUpdating) {
      return;
    }

    setError("");

    setShowStatuses(
      (current) => !current,
    );
  }

  return (
    <article
      ref={cardRef}
      className={`${styles.card} ${
        showStatuses
          ? styles.selected
          : ""
      }`}
      onClick={handleCardClick}
    >
      <div className={styles.cover}>
        {game.cover ? (
          <CachedImage
            src={game.cover}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, 180px"
          />
        ) : (
          <div className={styles.noCover}>
            <i
              className="bx bx-image-alt"
              aria-hidden="true"
            />
          </div>
        )}

        {showStatuses && (
          <div
            className={styles.statusOverlay}
          >
            <div
              className={styles.statusList}
            >
              {statusOptions.map(
                (option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`${
                      styles.statusButton
                    } ${
                      currentStatus ===
                      option.value
                        ? styles.current
                        : ""
                    }`}
                    onClick={(event) => {
                      event.stopPropagation();

                      handleStatusChange(
                        option.value,
                      );
                    }}
                    disabled={isUpdating}
                    aria-label={
                      option.label
                    }
                    title={
                      option.label
                    }
                  >
                    <i
                      className={`bx ${option.icon}`}
                      aria-hidden="true"
                    />
                  </button>
                ),
              )}
            </div>
          </div>
        )}

        <div
          className={styles.metadata}
        >
          <div className={styles.titleRow}>
            <h2 className={styles.title}>
              {game.name}
            </h2>

            {isAdded && (
              <span
                className={
                  styles.addedIndicator
                }
                aria-label="In library"
              >
                <i
                  className="bx bx-check"
                  aria-hidden="true"
                />
              </span>
            )}
          </div>

          <div className={styles.meta}>
            {releaseYear && (
              <span
                className={styles.year}
              >
                {releaseYear}
              </span>
            )}

            {game.metacritic !== null && (
              <span
                className={
                  styles.metacritic
                }
              >
                {game.metacritic}
              </span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className={styles.error}>
          {error}
        </p>
      )}
    </article>
  );
}