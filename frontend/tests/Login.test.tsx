import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../src/pages/Login';
import { AuthProvider } from '../src/contexts/AuthContext';
import api from '../src/api/axios';

// Mock the axios API module
vi.mock('../src/api/axios', () => {
    return {
        default: {
            post: vi.fn(),
            interceptors: {
                request: { use: vi.fn() },
                response: { use: vi.fn() }
            }
        }
    };
});

const renderWithProviders = (component: React.ReactNode) => {
    return render(
        <AuthProvider>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </AuthProvider>
    );
};

describe('Login Component', () => {
    it('renders login form correctly', () => {
        renderWithProviders(<Login />);

        expect(screen.getByText('Welcome back')).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });

    it('shows validation errors when submitting empty form', async () => {
        renderWithProviders(<Login />);

        const submitButton = screen.getByRole('button', { name: /Sign in/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Email is required')).toBeInTheDocument();
            expect(screen.getByText('Password is required')).toBeInTheDocument();
        });
    });

    it('calls API and logs in on valid submission', async () => {
        // Setup mock response
        (api.post as any).mockResolvedValueOnce({
            data: { access_token: 'fake.jwt.token', token_type: 'bearer' }
        });

        renderWithProviders(<Login />);

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/login', {
                email: 'test@example.com',
                password: 'password123'
            });
        });
    });
});
