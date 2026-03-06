import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/Card';
import { Alert } from '../components/Alert';
import { useState } from 'react';
import { AuthResponse } from '../types';

const loginSchema = yup.object({
    email: yup.string().email('Must be a valid email').required('Email is required'),
    password: yup.string().required('Password is required'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError(null);
            const response = await api.post<AuthResponse>('/auth/login', data);
            login(response.data);
            navigate('/');
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError('Incorrect email or password');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        OmniTask
                    </h1>
                    <p className="text-slate-500 mt-2">Manage your tasks effortlessly.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Welcome back</CardTitle>
                        <CardDescription>Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && <Alert type="error" message={error} className="mb-6" />}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Input
                                id="email"
                                label="Email"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                error={errors.email?.message}
                                {...register('email')}
                            />
                            <Input
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                error={errors.password?.message}
                                {...register('password')}
                            />
                            <div className="pt-2">
                                <Button type="submit" fullWidth isLoading={isSubmitting}>
                                    Sign in
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};
