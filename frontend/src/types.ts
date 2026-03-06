export interface User {
    id: number;
    email: string;
    role: 'user' | 'admin';
    created_at: string;
}

export interface Task {
    id: number;
    title: string;
    description: string | null;
    status: 'pending' | 'completed';
    user_id: number;
    created_at: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}
