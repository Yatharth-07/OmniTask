import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../api/axios';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/Card';
import { Alert } from '../components/Alert';
import { useState } from 'react';
import { User } from '../types';

const registerSchema = yup.object({
    email: yup.string().email('Must be a valid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    role: yup.string().oneOf(['user', 'admin']).default('user'),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

export const Register = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema),
        defaultValues: { role: 'user' }
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setError(null);
            await api.post<User>('/auth/register', data);
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        } catch (err: any) {
            if (err.response?.status === 400) {
                setError(err.response.data.detail || 'Email already registered');
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
                    <p className="text-slate-500 mt-2">Create an account to get started.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create Account</CardTitle>
                        <CardDescription>Sign up for a new account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && <Alert type="error" message={error} className="mb-6" />}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Input
                                id="email"
                                label="Email"
                                type="email"
                                placeholder="you@example.com"
                                error={errors.email?.message}
                                {...register('email')}
                            />
                            <Input
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="6+ characters"
                                error={errors.password?.message}
                                {...register('password')}
                            />
                            <div className="flex flex-col gap-1 w-full">
                                <label htmlFor="role" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Account Type
                                </label>
                                <select
                                    id="role"
                                    {...register('role')}
                                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/30 text-slate-900 dark:text-slate-100"
                                >
                                    <option value="user">Standard User</option>
                                    <option value="admin">Administrator (For Testing)</option>
                                </select>
                                {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>}
                            </div>

                            <div className="pt-2">
                                <Button type="submit" fullWidth isLoading={isSubmitting}>
                                    Create Account
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};
