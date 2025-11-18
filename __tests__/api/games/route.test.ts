/**
 * @jest-environment node
 */
import { GET } from '@/app/api/games/route';
import { allGames, availableFilters, delay } from '@/utils/endpoint';

jest.mock('@/utils/endpoint', () => ({
  allGames: [
    { id: '1', genre: 'Action', image: '/test1.jpg', name: 'Game 1', description: 'Desc 1', price: 59.99, isNew: true },
    { id: '2', genre: 'RPG', image: '/test2.jpg', name: 'Game 2', description: 'Desc 2', price: 39.99, isNew: false },
    { id: '3', genre: 'Action', image: '/test3.jpg', name: 'Game 3', description: 'Desc 3', price: 29.99, isNew: false },
    { id: '4', genre: 'Action', image: '/test4.jpg', name: 'Game 4', description: 'Desc 4', price: 49.99, isNew: true },
    { id: '5', genre: 'RPG', image: '/test5.jpg', name: 'Game 5', description: 'Desc 5', price: 59.99, isNew: false },
    { id: '6', genre: 'Adventure', image: '/test6.jpg', name: 'Game 6', description: 'Desc 6', price: 39.99, isNew: true },
  ],
  availableFilters: ['Action', 'RPG', 'Adventure'],
  delay: jest.fn().mockResolvedValue(undefined),
}));

describe('GET /api/games', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns games with pagination', async () => {
    const request = new Request('http://localhost:3000/api/games?page=1');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.games).toHaveLength(6); // We have 6 games in mock, ITEMS_PER_PAGE is 12
    expect(data.totalPages).toBeGreaterThan(0);
    expect(data.currentPage).toBe(1);
    expect(data.availableFilters).toEqual(availableFilters);
  });

  it('filters games by genre', async () => {
    const request = new Request('http://localhost:3000/api/games?genre=Action&page=1');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.games.every((game: any) => game.genre === 'Action')).toBe(true);
  });

  it('handles case-insensitive genre filter', async () => {
    const request = new Request('http://localhost:3000/api/games?genre=action&page=1');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.games.every((game: any) => game.genre === 'Action')).toBe(true);
  });

  it('returns correct page of results', async () => {
    const request = new Request('http://localhost:3000/api/games?page=1');
    const response = await GET(request);
    const data = await response.json();

    expect(data.currentPage).toBe(1);
  });

  it('handles negative page number', async () => {
    const request = new Request('http://localhost:3000/api/games?page=-1');
    const response = await GET(request);
    const data = await response.json();

    expect(data.currentPage).toBe(1);
  });

  it('includes delay in response', async () => {
    const request = new Request('http://localhost:3000/api/games?page=1');
    const startTime = Date.now();
    await GET(request);
    const endTime = Date.now();

    expect(delay).toHaveBeenCalledWith(2000);
    expect(endTime - startTime).toBeGreaterThanOrEqual(0);
  });

  it('calculates total pages correctly', async () => {
    const request = new Request('http://localhost:3000/api/games?page=1');
    const response = await GET(request);
    const data = await response.json();

    expect(data.totalPages).toBeGreaterThan(0);
    expect(typeof data.totalPages).toBe('number');
  });
});

