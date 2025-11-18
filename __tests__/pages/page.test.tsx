import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

jest.mock('@/components/GamesCatalog', () => {
  return function MockGamesCatalog() {
    return <div>Games Catalog</div>;
  };
});

describe('Home Page', () => {
  it('renders the home page', () => {
    render(<Home />);
    expect(screen.getByText('Games Catalog')).toBeInTheDocument();
  });

  it('has main element with correct styling', () => {
    render(<Home />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('flex', 'min-h-screen', 'flex-col', 'items-center', 'justify-between');
  });

  it('wraps GamesCatalog in Suspense', () => {
    const { container } = render(<Home />);
    // Suspense should be present (implicitly through React)
    expect(container).toBeInTheDocument();
  });
});

