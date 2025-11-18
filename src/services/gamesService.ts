import { Game } from "@/utils/endpoint";

export interface GamesApiResponse {
  games: Game[];
  availableFilters: string[];
  totalPages: number;
  currentPage: number;
}

export interface FetchGamesParams {
  genre?: string | null;
  page?: string | number;
}

export async function fetchGenres(): Promise<string[]> {
  const query = new URLSearchParams();
  query.set('page', '1');

  const res = await fetch(`/api/games?${query.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch genres: ${res.statusText}`);
  }

  const data: GamesApiResponse = await res.json();
  return data.availableFilters || [];
}

export async function fetchGames(params?: FetchGamesParams): Promise<GamesApiResponse> {
  const query = new URLSearchParams();
  
  if (params?.genre) {
    query.set('genre', params.genre);
  }
  
  const page = params?.page || '1';
  query.set('page', page.toString());

  const res = await fetch(`/api/games?${query.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch games: ${res.statusText}`);
  }

  const data: GamesApiResponse = await res.json();
  return data;
}

