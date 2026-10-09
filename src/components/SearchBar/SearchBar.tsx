"use client";

import { FormEvent, useState } from "react";

import styles from "./SearchBar.module.css";

type SearchBarProps = {
  onSearch: (query: string) => void;
  isLoading?: boolean;
};

export default function SearchBar({
  onSearch,
  isLoading = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery || isLoading) {
      return;
    }

    onSearch(trimmedQuery);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="search"
        placeholder="Search games..."
        aria-label="Search games"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        disabled={isLoading}
      />

      <button
        className={styles.button}
        type="submit"
        aria-label={isLoading ? "Searching games" : "Search games"}
        title={isLoading ? "Searching..." : "Search"}
        disabled={isLoading || !query.trim()}
      >
        {isLoading ? (
          <i
            className={`bx bx-loader-alt bx-spin ${styles.icon}`}
            aria-hidden="true"
          />
        ) : (
          <i
            className={`bx bx-search ${styles.icon}`}
            aria-hidden="true"
          />
        )}
      </button>
    </form>
  );
}