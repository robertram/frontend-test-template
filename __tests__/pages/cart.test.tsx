import { render, screen } from '@testing-library/react';
import ShoppingCart from '@/app/cart/page';

jest.mock('@/components/YourCart', () => {
  return function MockYourCart() {
    return <div>Your Cart Component</div>;
  };
});

describe('Cart Page', () => {
  it('renders the cart page', () => {
    render(<ShoppingCart />);
    expect(screen.getByText('Your Cart Component')).toBeInTheDocument();
  });

  it('has main element with correct styling', () => {
    render(<ShoppingCart />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('min-h-screen', 'p-8', 'lg:p-24');
  });

  it('renders YourCart component', () => {
    render(<ShoppingCart />);
    expect(screen.getByText('Your Cart Component')).toBeInTheDocument();
  });
});

