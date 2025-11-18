import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import YourCart from '@/components/YourCart';
import * as cartUtils from '@/utils/cart';
import { Game } from '@/utils/endpoint';

jest.mock('@/utils/cart');
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

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
    genre: 'RPG',
    image: '/game-images/test2.jpeg',
    name: 'Game 2',
    description: 'Description 2',
    price: 39.99,
    isNew: false,
  },
];

describe('YourCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (cartUtils.getCart as jest.Mock).mockReturnValue(mockGames);
  });

  it('renders empty cart message when cart is empty', () => {
    (cartUtils.getCart as jest.Mock).mockReturnValue([]);
    
    render(<YourCart />);
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  it('displays cart items when cart has items', async () => {
    localStorage.setItem('cart', JSON.stringify(mockGames));
    
    render(<YourCart />);
    
    await waitFor(() => {
      // Game names appear in both cart items and order summary, so use getAllByText
      expect(screen.getAllByText('Game 1')).toHaveLength(2);
      expect(screen.getAllByText('Game 2')).toHaveLength(2);
    });
  });

  it('calculates and displays order total correctly', async () => {
    localStorage.setItem('cart', JSON.stringify(mockGames));
    
    render(<YourCart />);
    
    await waitFor(() => {
      const total = mockGames[0].price + mockGames[1].price;
      expect(screen.getByText(`$${total.toFixed(2)}`)).toBeInTheDocument();
    });
  });

  it('calls removeFromCart when remove button is clicked', async () => {
    localStorage.setItem('cart', JSON.stringify(mockGames));
    
    render(<YourCart />);
    
    await waitFor(() => {
      expect(screen.getAllByLabelText('Remove item')).toHaveLength(2);
    });
    
    const removeButtons = screen.getAllByLabelText('Remove item');
    fireEvent.click(removeButtons[0]);
    
    expect(cartUtils.removeFromCart).toHaveBeenCalledWith(mockGames[0].id);
  });

  it('displays "Back to Catalog" link', () => {
    render(<YourCart />);
    const backLink = screen.getByText('Back to Catalog').closest('a');
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('renders order summary section', async () => {
    localStorage.setItem('cart', JSON.stringify(mockGames));
    
    render(<YourCart />);
    
    await waitFor(() => {
      expect(screen.getByText('Order Summary')).toBeInTheDocument();
      expect(screen.getByText('Order Total')).toBeInTheDocument();
    });
  });

  it('disables checkout button when cart is empty', () => {
    (cartUtils.getCart as jest.Mock).mockReturnValue([]);
    
    render(<YourCart />);
    
    const checkoutButton = screen.getByText('Checkout');
    expect(checkoutButton).toBeDisabled();
  });

  it('enables checkout button when cart has items', async () => {
    localStorage.setItem('cart', JSON.stringify(mockGames));
    
    render(<YourCart />);
    
    await waitFor(() => {
      const checkoutButton = screen.getByText('Checkout');
      expect(checkoutButton).not.toBeDisabled();
    });
  });
});

