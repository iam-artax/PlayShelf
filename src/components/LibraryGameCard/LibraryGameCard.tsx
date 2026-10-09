
"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import {
  removeFromLibrary,
  updateLibraryFavorite,
  updateLibraryStatus,
} from "@/lib/library";

import type { GameStatus } from "@/types/game";
import type { LibraryGame } from "@/types/library";

import styles from "./LibraryGameCard.module.css";

type LibraryGameCardProps = {
  game: LibraryGame;
  onChange: () => void;
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

export default function LibraryGameCard({
  game,
  onChange,
}: LibraryGameCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const dialogTitleId = useId();

  const [showStatuses, setShowStatuses] = useState(false);
  const [isFavorite, setIsFavorite] = useState(game.isFavorite);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [error, setError] = useState("");

  const releaseYear = game.released
    ? new Date(game.released).getFullYear()
    : null;

  useEffect(() => {
    if (!showStatuses) {
      return;
    }

    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (
        cardRef.current &&
        !cardRef.current.contains(target)
      ) {
        setShowStatuses(false);
      }
    }

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showStatuses]);

  useEffect(() => {
    if (!showRemoveDialog) {
      return;
    }

    cancelButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isUpdating) {
        setShowRemoveDialog(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showRemoveDialog, isUpdating]);

  async function handleStatusChange(status: GameStatus) {
    if (status === game.status) {
      setShowStatuses(false);
      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      await updateLibraryStatus(game.gameId, status);
      setShowStatuses(false);
      onChange();
    } catch (error) {
      console.error("Failed to update status:", error);
      setError("Failed to update status.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleFavorite(event: React.MouseEvent) {
    event.stopPropagation();

    setIsUpdating(true);
    setError("");

    const nextFavorite = !isFavorite;

    try {
      await updateLibraryFavorite(game.gameId, nextFavorite);
      setIsFavorite(nextFavorite);
    } catch (error) {
      console.error("Failed to update favorite:", error);
      setError("Failed to update favorite.");
    } finally {
      setIsUpdating(false);
    }
  }

  function handleRemove(event: React.MouseEvent) {
    event.stopPropagation();

    if (isUpdating) {
      return;
    }

    setError("");
    setShowStatuses(false);
    setShowRemoveDialog(true);
  }

  async function confirmRemove() {
    if (isUpdating) {
      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      await removeFromLibrary(game.gameId);
      setShowRemoveDialog(false);
      onChange();
    } catch (error) {
      console.error("Failed to remove game:", error);
      setError("Failed to remove game.");
    } finally {
      setIsUpdating(false);
    }
  }

  function handleCardClick() {
    if (isUpdating || showRemoveDialog) {
      return;
    }

    setError("");
    setShowStatuses((current) => !current);
  }

  return (
    <>
      <article
        ref={cardRef}
        className={`${styles.card} ${
          showStatuses ? styles.selected : ""
        }`}
        onClick={handleCardClick}
      >
        <div className={styles.cover}>
          {game.cover ? (
            <Image
              src={game.cover}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, 180px"
            />
          ) : (
            <div className={styles.noCover}>
              <i className="bx bx-image-alt" aria-hidden="true" />
            </div>
          )}

          <button
            type="button"
            className={`${styles.favoriteButton} ${
              isFavorite ? styles.favoriteActive : ""
            }`}
            onClick={handleFavorite}
            disabled={isUpdating}
            aria-label={
              isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
            title={
              isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            <i
              className={`bx ${
                isFavorite ? "bxs-heart" : "bx-heart"
              }`}
              aria-hidden="true"
            />
          </button>

          {showStatuses && (
            <div className={styles.statusOverlay}>
              <div className={styles.statusList}>
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`${styles.statusButton} ${
                      game.status === option.value
                        ? styles.current
                        : ""
                    }`}
                    onClick={(event) => {
                      event.stopPropagation();
                      void handleStatusChange(option.value);
                    }}
                    disabled={isUpdating}
                    aria-label={option.label}
                    title={option.label}
                  >
                    <i
                      className={`bx ${option.icon}`}
                      aria-hidden="true"
                    />
                  </button>
                ))}

                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={handleRemove}
                  disabled={isUpdating}
                  aria-label="Remove from library"
                  title="Remove from library"
                >
                  <i className="bx bx-trash" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          <div className={styles.metadata}>
            <h2 className={styles.title}>{game.name}</h2>

            <div className={styles.meta}>
              {releaseYear && (
                <span className={styles.year}>{releaseYear}</span>
              )}

              {game.metacritic !== null && (
                <span className={styles.metacritic}>
                  {game.metacritic}
                </span>
              )}
            </div>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </article>

      {showRemoveDialog && (
        <div
          className={styles.dialogBackdrop}
          onClick={(event) => {
            event.stopPropagation();

            if (event.target === event.currentTarget && !isUpdating) {
              setShowRemoveDialog(false);
            }
          }}
        >
          <section
            className={styles.dialog}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.dialogIcon}>
              <i className="bx bx-trash" aria-hidden="true" />
            </div>

            <h2
              id={dialogTitleId}
              className={styles.dialogTitle}
            >
              Remove game?
            </h2>

            <p className={styles.dialogMessage}>
              Are you sure you want to remove{" "}
              <strong>{game.name}</strong> from your library?
              This action cannot be undone.
            </p>

            <div className={styles.dialogActions}>
              <button
                ref={cancelButtonRef}
                type="button"
                className={styles.cancelButton}
                onClick={() => setShowRemoveDialog(false)}
                disabled={isUpdating}
              >
                Cancel
              </button>

              <button
                type="button"
                className={styles.confirmRemoveButton}
                onClick={() => void confirmRemove()}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <i
                      className="bx bx-loader-alt bx-spin"
                      aria-hidden="true"
                    />
                    Removing...
                  </>
                ) : (
                  <>
                    <i className="bx bx-trash" aria-hidden="true" />
                    Remove
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}