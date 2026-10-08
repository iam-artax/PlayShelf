export type Game = {
  id: number;
  name: string;
  slug: string;
  cover: string | null;
  released: string | null;
  rating: number | null;
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
  genres: {
    id: number;
    name: string;
  }[];
  platforms: {
    platform: {
      id: number;
      name: string;
    };
  }[];
};

export type RawgGamesResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgGame[];
};