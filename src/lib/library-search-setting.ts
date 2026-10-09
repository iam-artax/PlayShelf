const STORAGE_KEY = "playshelf-library-search-enabled";

export function getLibrarySearchEnabled(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  try {
    return localStorage.getItem(STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}

export function setLibrarySearchEnabled(
  enabled: boolean,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      STORAGE_KEY,
      String(enabled),
    );
  } catch (error) {
    console.error(
      "Failed to save library search setting:",
      error,
    );
  }
}