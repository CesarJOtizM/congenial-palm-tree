import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Home from '../app/page';

// Mock simple de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('Home Component', () => {
  it('should render loading spinner', () => {
    render(<Home />);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  it('should have correct container styling', () => {
    render(<Home />);

    const container = screen.getByRole('main');
    expect(container).toHaveClass(
      'min-h-screen',
      'bg-gray-50',
      'flex',
      'items-center',
      'justify-center'
    );
  });

  it('should have correct spinner styling', () => {
    render(<Home />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(
      'animate-spin',
      'rounded-full',
      'h-12',
      'w-12',
      'border-b-2',
      'border-blue-600'
    );
  });
});
