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

    if (!trimmedQuery) {
      return;
    }

    onSearch(trimmedQuery);
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <input
        className={styles.input}
        type="search"
        placeholder="Search games..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        disabled={isLoading}
      />

      <button
        className={styles.button}
        type="submit"
        disabled={isLoading || !query.trim()}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}