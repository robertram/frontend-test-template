import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GenreFilter from '@/components/GenreFilter';
import * as gamesService from '@/services/gamesService';
import * as nextNavigation from 'next/navigation';

jest.mock('@/services/gamesService');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(() => '/'),
}));

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

describe('GenreFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as ReturnType<typeof nextNavigation.useSearchParams>);
    (gamesService.fetchGenres as jest.Mock).mockResolvedValue(['Action', 'RPG', 'Adventure']);
  });

  it('renders loading state initially', () => {
    render(<GenreFilter />);
    expect(screen.getByText('Loading genres...')).toBeInTheDocument();
  });

  it('renders genres after loading', async () => {
    render(<GenreFilter />);
    
    await waitFor(() => {
      expect(screen.getByText('All Genres')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('RPG')).toBeInTheDocument();
    expect(screen.getByText('Adventure')).toBeInTheDocument();
  });

  it('calls fetchGenres on mount', async () => {
    render(<GenreFilter />);
    
    await waitFor(() => {
      expect(gamesService.fetchGenres).toHaveBeenCalledTimes(1);
    });
  });

  it('updates URL when genre is selected', async () => {
    render(<GenreFilter />);
    
    await waitFor(() => {
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Action' } });
    
    expect(mockRouter.push).toHaveBeenCalledWith('/?genre=Action&page=1');
  });

  it('removes genre from URL when "All Genres" is selected', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('genre=Action') as ReturnType<typeof nextNavigation.useSearchParams>);
    
    render(<GenreFilter />);
    
    await waitFor(() => {
      expect(screen.getByText('All Genres')).toBeInTheDocument();
    });
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '' } });
    
    expect(mockRouter.push).toHaveBeenCalledWith('/?page=1');
  });

  it('displays selected genre from URL params', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('genre=Action') as ReturnType<typeof nextNavigation.useSearchParams>);
    
    render(<GenreFilter />);
    
    await waitFor(() => {
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('Action');
    });
  });

  it('handles fetch error gracefully', async () => {
    (gamesService.fetchGenres as jest.Mock).mockRejectedValue(new Error('Fetch failed'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    render(<GenreFilter />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching genres:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });
});

