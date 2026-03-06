import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '../src/components/Button';

describe('Button Component', () => {
    it('renders correctly with children', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('shows loading spinner when isLoading is true', () => {
        const { container } = render(<Button isLoading>Loading</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
        // Assuming our Loader has the animate-spin class
        expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('applies danger variant classes correctly', () => {
        render(<Button variant="danger">Delete</Button>);
        const button = screen.getByRole('button', { name: /delete/i });
        expect(button.className).toContain('bg-red-600');
    });
});
