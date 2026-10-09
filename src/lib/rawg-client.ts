import type {
  Game,
  RawgGame,
  RawgGamesResponse,
} from "@/types/game";

const RAWG_API_URL = "https://api.rawg.io/api";

function getApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;

  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_RAWG_API_KEY is missing from .env.local",
    );
  }

  return apiKey;
}

function mapRawgGame(game: RawgGame): Game {
  return {
    id: game.id,
    name: game.name,
    slug: game.slug,
    cover: game.background_image,
    released: game.released,
    rating: game.rating,
    metacritic: game.metacritic,
    genres: game.genres?.map((genre) => genre.name) ?? [],
    platforms:
      game.platforms?.map(({ platform }) => platform.name) ?? [],
  };
}

export async function searchRawgGames(
  query: string,
): Promise<Game[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const params = new URLSearchParams({
    key: getApiKey(),
    search: normalizedQuery,
    page_size: "10",
  });

  let response: Response;

  try {
    response = await fetch(
      `${RAWG_API_URL}/games?${params.toString()}`,
    );
  } catch {
    throw new Error(
      "Could not connect to RAWG. Check your internet connection.",
    );
  }

  if (!response.ok) {
    throw new Error(
      `RAWG API returned HTTP ${response.status}.`,
    );
  }

  const data = (await response.json()) as RawgGamesResponse;

  return data.results.map(mapRawgGame);
}