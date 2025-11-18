import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from '@/components/CartItem';
import { Game } from '@/utils/endpoint';

const mockGame: Game = {
  id: '1',
  genre: 'Action',
  image: '/game-images/test.jpeg',
  name: 'Test Game',
  description: 'A test game description',
  price: 59.99,
  isNew: true,
};

describe('CartItem', () => {
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders game information correctly', () => {
    render(<CartItem game={mockGame} onRemove={mockOnRemove} />);
    
    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('A test game description')).toBeInTheDocument();
    expect(screen.getByText('$59.99')).toBeInTheDocument();
  });

  it('displays "New" badge when game is new', () => {
    render(<CartItem game={mockGame} onRemove={mockOnRemove} />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('does not display "New" badge when game is not new', () => {
    const oldGame = { ...mockGame, isNew: false };
    render(<CartItem game={oldGame} onRemove={mockOnRemove} />);
    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    render(<CartItem game={mockGame} onRemove={mockOnRemove} />);
    
    const removeButton = screen.getByLabelText('Remove item');
    fireEvent.click(removeButton);
    
    expect(mockOnRemove).toHaveBeenCalledWith(mockGame.id);
    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it('renders price aligned to the right', () => {
    render(<CartItem game={mockGame} onRemove={mockOnRemove} />);
    const priceElement = screen.getByText('$59.99');
    expect(priceElement).toHaveClass('text-right');
  });

  it('handles game without description', () => {
    const gameWithoutDescription = { ...mockGame, description: '' };
    render(<CartItem game={gameWithoutDescription} onRemove={mockOnRemove} />);
    
    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.queryByText('A test game description')).not.toBeInTheDocument();
  });
});

