const STORAGE_KEY = "playshelf-rawg-api-key";

export function getRawgApiKey(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(STORAGE_KEY)?.trim() ?? "";
}

export function saveRawgApiKey(apiKey: string): void {
  if (typeof window === "undefined") {
    throw new Error("API key storage is unavailable.");
  }

  const normalizedKey = apiKey.trim();

  if (!normalizedKey) {
    throw new Error("Enter a valid RAWG API key.");
  }

  localStorage.setItem(STORAGE_KEY, normalizedKey);
}

export function removeRawgApiKey(): void {
  if (typeof window === "undefined") {
    throw new Error("API key storage is unavailable.");
  }

  localStorage.removeItem(STORAGE_KEY);
}