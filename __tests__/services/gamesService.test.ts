import { fetchGenres, fetchGames, GamesApiResponse } from '@/services/gamesService';

// Mock fetch globally
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;

describe('gamesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchGenres', () => {
    it('fetches and returns genres', async () => {
      const mockResponse: GamesApiResponse = {
        games: [],
        availableFilters: ['Action', 'RPG', 'Adventure'],
        totalPages: 1,
        currentPage: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const genres = await fetchGenres();

      expect(mockFetch).toHaveBeenCalledWith('/api/games?page=1');
      expect(genres).toEqual(['Action', 'RPG', 'Adventure']);
    });

    it('returns empty array when availableFilters is missing', async () => {
      const mockResponse: GamesApiResponse = {
        games: [],
        availableFilters: [],
        totalPages: 1,
        currentPage: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const genres = await fetchGenres();

      expect(genres).toEqual([]);
    });

    it('throws error when request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(fetchGenres()).rejects.toThrow('Failed to fetch genres: Not Found');
    });

    it('throws error when network fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchGenres()).rejects.toThrow('Network error');
    });
  });

  describe('fetchGames', () => {
    const mockGamesResponse: GamesApiResponse = {
      games: [
        {
          id: '1',
          genre: 'Action',
          image: '/test.jpg',
          name: 'Test Game',
          description: 'Test Description',
          price: 59.99,
          isNew: true,
        },
      ],
      availableFilters: ['Action'],
      totalPages: 1,
      currentPage: 1,
    };

    it('fetches games without parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      });

      const result = await fetchGames();

      expect(mockFetch).toHaveBeenCalledWith('/api/games?page=1');
      expect(result).toEqual(mockGamesResponse);
    });

    it('fetches games with genre filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      });

      const result = await fetchGames({ genre: 'Action' });

      expect(mockFetch).toHaveBeenCalledWith('/api/games?genre=Action&page=1');
      expect(result).toEqual(mockGamesResponse);
    });

    it('fetches games with page number', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      });

      const result = await fetchGames({ page: 2 });

      expect(mockFetch).toHaveBeenCalledWith('/api/games?page=2');
      expect(result).toEqual(mockGamesResponse);
    });

    it('fetches games with both genre and page', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      });

      const result = await fetchGames({ genre: 'Action', page: 2 });

      expect(mockFetch).toHaveBeenCalledWith('/api/games?genre=Action&page=2');
      expect(result).toEqual(mockGamesResponse);
    });

    it('handles null genre', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      });

      const result = await fetchGames({ genre: null });

      expect(mockFetch).toHaveBeenCalledWith('/api/games?page=1');
      expect(result).toEqual(mockGamesResponse);
    });

    it('handles string page number', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      });

      const result = await fetchGames({ page: '3' });

      expect(mockFetch).toHaveBeenCalledWith('/api/games?page=3');
      expect(result).toEqual(mockGamesResponse);
    });

    it('throws error when request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Server Error',
      });

      await expect(fetchGames()).rejects.toThrow('Failed to fetch games: Server Error');
    });

    it('throws error when network fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchGames()).rejects.toThrow('Network error');
    });
  });
});

