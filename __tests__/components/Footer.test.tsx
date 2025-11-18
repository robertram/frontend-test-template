import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Footer', () => {
  it('renders the footer component', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('contains a link to home page', () => {
    render(<Footer />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders the logo image', () => {
    render(<Footer />);
    const image = screen.getByAltText('test image');
    expect(image).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('w-full', 'bg-[#404040]', 'p-[64px]', 'flex', 'justify-center');
  });
});

