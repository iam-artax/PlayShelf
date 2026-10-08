export type GameStatus =
  | "playing"
  | "next-up"
  | "complete"
  | "dropped";

export type Game = {
  id: number;
  name: string;
  slug: string;
  cover: string | null;
  released: string | null;
  rating: number | null;
  metacritic: number | null;
  genres: string[];
  platforms: string[];
};

export type RawgGame = {
  id: number;
  name: string;
  slug: string;
  background_image: string | null;
  released: string | null;
  rating: number;
  metacritic: number | null;
  genres: {
    id: number;
    name: string;
  }[] | null;
  platforms: {
    platform: {
      id: number;
      name: string;
    };
  }[] | null;
};

export type RawgGamesResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgGame[];
};