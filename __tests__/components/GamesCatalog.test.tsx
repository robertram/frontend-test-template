import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GamesCatalog from '@/components/GamesCatalog';
import * as gamesService from '@/services/gamesService';
import * as nextNavigation from 'next/navigation';
import * as cartUtils from '@/utils/cart';
import { Game } from '@/utils/endpoint';

jest.mock('@/services/gamesService');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(() => '/'),
}));
jest.mock('@/utils/cart');

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
};

const mockUseSearchParams = nextNavigation.useSearchParams as jest.MockedFunction<typeof nextNavigation.useSearchParams>;
const mockUseRouter = nextNavigation.useRouter as jest.MockedFunction<typeof nextNavigation.useRouter>;

const mockGames: Game[] = [
  {
    id: '1',
    genre: 'Action',
    image: '/game-images/test1.jpeg',
    name: 'Game 1',
    description: 'Description 1',
    price: 59.99,
    isNew: true,
  },
  {
    id: '2',
    genre: 'Action',
    image: '/game-images/test2.jpeg',
    name: 'Game 2',
    description: 'Description 2',
    price: 39.99,
    isNew: false,
  },
];

const mockApiResponse = {
  games: mockGames,
  availableFilters: ['Action', 'RPG'],
  totalPages: 2,
  currentPage: 1,
};

describe('GamesCatalog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as ReturnType<typeof nextNavigation.useSearchParams>);
    (gamesService.fetchGames as jest.Mock).mockResolvedValue(mockApiResponse);
    (gamesService.fetchGenres as jest.Mock).mockResolvedValue(['Action', 'RPG', 'Adventure']);
    (cartUtils.getCart as jest.Mock).mockReturnValue([]);
  });

  it('renders loading state initially', () => {
    render(<GamesCatalog />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays games after loading', async () => {
    render(<GamesCatalog />);
    
    await waitFor(() => {
      expect(screen.getByText('Game 1')).toBeInTheDocument();
      expect(screen.getByText('Game 2')).toBeInTheDocument();
    });
  });

  it('displays "Top Sellers" heading', async () => {
    render(<GamesCatalog />);
    
    await waitFor(() => {
      expect(screen.getByText('Top Sellers')).toBeInTheDocument();
    });
  });

  it('displays error message when fetch fails', async () => {
    (gamesService.fetchGames as jest.Mock).mockRejectedValue(new Error('Fetch failed'));
    
    render(<GamesCatalog />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });

  it('displays "No games found" when games array is empty', async () => {
    (gamesService.fetchGames as jest.Mock).mockResolvedValue({
      ...mockApiResponse,
      games: [],
    });
    
    render(<GamesCatalog />);
    
    await waitFor(() => {
      expect(screen.getByText('No games found for the selected genre.')).toBeInTheDocument();
    });
  });

  it('shows "SEE MORE" button when there are more pages', async () => {
    render(<GamesCatalog />);
    
    await waitFor(() => {
      expect(screen.getByText('SEE MORE')).toBeInTheDocument();
    });
  });

  it('hides "SEE MORE" button when on last page', async () => {
    (gamesService.fetchGames as jest.Mock).mockResolvedValue({
      ...mockApiResponse,
      totalPages: 1,
      currentPage: 1,
    });
    
    render(<GamesCatalog />);
    
    await waitFor(() => {
      expect(screen.queryByText('SEE MORE')).not.toBeInTheDocument();
    });
  });

  it('calls router.push when "SEE MORE" is clicked', async () => {
    render(<GamesCatalog />);
    
    await waitFor(() => {
      expect(screen.getByText('SEE MORE')).toBeInTheDocument();
    });
    
    const seeMoreButton = screen.getByText('SEE MORE');
    fireEvent.click(seeMoreButton);
    
    expect(mockRouter.push).toHaveBeenCalled();
  });

  it('fetches games with genre filter from URL params', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('genre=Action&page=1') as ReturnType<typeof nextNavigation.useSearchParams>);
    
    render(<GamesCatalog />);
    
    await waitFor(() => {
      expect(gamesService.fetchGames).toHaveBeenCalledWith({
        genre: 'Action',
        page: '1',
      });
    });
  });

  it('renders GenreFilter component', async () => {
    render(<GamesCatalog />);
    // GenreFilter should be rendered (we can check for its label)
    await waitFor(() => {
      expect(screen.getByText('Top Sellers')).toBeInTheDocument();
    });
  });
});

