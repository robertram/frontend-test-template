import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/Button';

describe('Button', () => {
  it('renders with default text', () => {
    render(<Button />);
    expect(screen.getByText('SEE MORE')).toBeInTheDocument();
  });

  it('renders with custom children', () => {
    render(<Button>Custom Text</Button>);
    expect(screen.getByText('Custom Text')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} />);
    
    const button = screen.getByText('SEE MORE');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled />);
    const button = screen.getByText('SEE MORE');
    expect(button).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class" />);
    const button = screen.getByText('SEE MORE');
    expect(button).toHaveClass('custom-class');
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled />);
    
    const button = screen.getByText('SEE MORE');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
});

