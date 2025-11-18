import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Card from '@/components/Card';
import { Game } from '@/utils/endpoint';
import * as cartUtils from '@/utils/cart';

jest.mock('@/utils/cart');

const mockGame: Game = {
  id: '1',
  genre: 'Action',
  image: '/game-images/test.jpeg',
  name: 'Test Game',
  description: 'A test game',
  price: 59.99,
  isNew: true,
};

describe('Card', () => {
  const mockAddToCart = jest.fn();
  const mockRemoveFromCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (cartUtils.getCart as jest.Mock).mockReturnValue([]);
  });

  it('renders game information correctly', () => {
    render(<Card game={mockGame} handleAddToCart={mockAddToCart} handleRemoveFromCart={mockRemoveFromCart} />);
    
    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('$59.99')).toBeInTheDocument();
  });

  it('displays "New" badge when game is new', () => {
    render(<Card game={mockGame} handleAddToCart={mockAddToCart} handleRemoveFromCart={mockRemoveFromCart} />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('does not display "New" badge when game is not new', () => {
    const oldGame = { ...mockGame, isNew: false };
    render(<Card game={oldGame} handleAddToCart={mockAddToCart} handleRemoveFromCart={mockRemoveFromCart} />);
    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('shows "ADD TO CART" when item is not in cart', () => {
    (cartUtils.getCart as jest.Mock).mockReturnValue([]);
    render(<Card game={mockGame} handleAddToCart={mockAddToCart} handleRemoveFromCart={mockRemoveFromCart} />);
    
    expect(screen.getByText('ADD TO CART')).toBeInTheDocument();
  });

  it('shows "REMOVE" when item is in cart', () => {
    (cartUtils.getCart as jest.Mock).mockReturnValue([mockGame]);
    render(<Card game={mockGame} handleAddToCart={mockAddToCart} handleRemoveFromCart={mockRemoveFromCart} />);
    
    expect(screen.getByText('REMOVE')).toBeInTheDocument();
  });

  it('calls handleAddToCart when clicking "ADD TO CART"', async () => {
    (cartUtils.getCart as jest.Mock).mockReturnValue([]);
    render(<Card game={mockGame} handleAddToCart={mockAddToCart} handleRemoveFromCart={mockRemoveFromCart} />);
    
    const button = screen.getByText('ADD TO CART');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith(mockGame);
    });
  });

  it('calls handleRemoveFromCart when clicking "REMOVE"', async () => {
    (cartUtils.getCart as jest.Mock).mockReturnValue([mockGame]);
    render(<Card game={mockGame} handleAddToCart={mockAddToCart} handleRemoveFromCart={mockRemoveFromCart} />);
    
    const button = screen.getByText('REMOVE');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockRemoveFromCart).toHaveBeenCalledWith(mockGame.id);
    });
  });

  it('updates button text when cart status changes via event', async () => {
    render(
      <Card game={mockGame} handleAddToCart={mockAddToCart} handleRemoveFromCart={mockRemoveFromCart} />
    );
    
    expect(screen.getByText('ADD TO CART')).toBeInTheDocument();
    
    // Simulate cart status change
    (cartUtils.getCart as jest.Mock).mockReturnValue([mockGame]);
    
    // Simulate cart update event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    await waitFor(() => {
      expect(screen.getByText('REMOVE')).toBeInTheDocument();
    });
  });
});

