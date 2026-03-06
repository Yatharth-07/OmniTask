import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axios';
import { AuthResponse } from '../types';

// A simple function to decode the JWT payload (without a full library like jwt-decode)
const decodeToken = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (err) {
        return null;
    }
};

interface UserPayload {
    sub: string;
    role: 'user' | 'admin';
    exp: number;
}

interface AuthContextType {
    user: UserPayload | null;
    token: string | null;
    login: (data: AuthResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<UserPayload | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from local storage token
    useEffect(() => {
        if (token) {
            const decoded = decodeToken(token);
            if (decoded && decoded.exp * 1000 > Date.now()) {
                setUser(decoded);
            } else {
                // Token expired
                logout();
            }
        }
        setLoading(false);

        // Listen to global logout event triggered by axios interceptor
        const handleLogout = () => logout();
        window.addEventListener('auth:logout', handleLogout);
        return () => window.removeEventListener('auth:logout', handleLogout);
    }, [token]);

    const login = (data: AuthResponse) => {
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        setUser(decodeToken(data.access_token));
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token && !!user;
    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated,
                isAdmin,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
