import type {
  Game,
  RawgGame,
  RawgGamesResponse,
} from "@/types/game";

const RAWG_API_URL = "https://api.rawg.io/api";

function getApiKey(): string {
  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    throw new Error("RAWG_API_KEY is not configured");
  }

  return apiKey;
}

function mapGame(game: RawgGame): Game {
  return {
    id: game.id,
    name: game.name,
    slug: game.slug,
    cover: game.background_image,
    released: game.released,
    rating: game.rating,
    genres: game.genres.map((genre) => genre.name),
    platforms: game.platforms.map(
      ({ platform }) => platform.name,
    ),
  };
}

export async function searchGames(
  query: string,
): Promise<Game[]> {
  const apiKey = getApiKey();

  const params = new URLSearchParams({
    key: apiKey,
    search: query,
    page_size: "10",
  });

  const response = await fetch(
    `${RAWG_API_URL}/games?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(
      `RAWG API request failed: ${response.status}`,
    );
  }

  const data: RawgGamesResponse = await response.json();

  return data.results.map(mapGame);
}