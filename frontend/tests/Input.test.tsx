import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { Input } from '../src/components/Input';

describe('Input Component', () => {
    it('renders label and input correctly', () => {
        render(<Input id="test-input" label="Test Label" />);
        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveAttribute('id', 'test-input');
    });

    it('displays error message when error prop is provided', () => {
        render(<Input id="error-input" label="Error Field" error="This field is required" />);
        expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('applies error styling when error is present', () => {
        render(<Input id="error-styled" label="Styled Field" error="Error" />);
        const input = screen.getByRole('textbox');
        expect(input.className).toContain('border-red-500');
    });
});
