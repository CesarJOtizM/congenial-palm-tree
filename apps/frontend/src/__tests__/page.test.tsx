import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { vi } from 'vitest';
import Home from '../app/page';

// Mock de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('Home Component', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({
      push: mockPush,
    });
  });

  it('should redirect to dashboard on mount', () => {
    render(<Home />);

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it('should show loading spinner', () => {
    render(<Home />);

    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  it('should have correct styling classes', () => {
    render(<Home />);

    const container = screen.getByRole('main', { hidden: true });
    expect(container).toHaveClass(
      'min-h-screen',
      'bg-gray-50',
      'flex',
      'items-center',
      'justify-center'
    );
  });
});
