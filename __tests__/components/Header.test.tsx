import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Header', () => {
  it('renders the header component', () => {
    render(<Header />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('displays the GameShop title', () => {
    render(<Header />);
    expect(screen.getByText('GameShop')).toBeInTheDocument();
  });

  it('contains a link to home page', () => {
    render(<Header />);
    const homeLink = screen.getByText('GameShop').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('contains a link to cart page', () => {
    render(<Header />);
    const cartLink = screen.getByAltText('test image').closest('a');
    expect(cartLink).toHaveAttribute('href', '/cart');
  });

  it('renders the cart icon', () => {
    render(<Header />);
    const cartImage = screen.getByAltText('test image');
    expect(cartImage).toBeInTheDocument();
  });
});

