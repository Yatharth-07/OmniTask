import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Task, User } from '../types';
import api from '../api/axios';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import { Alert } from '../components/Alert';
import { Loader } from '../components/Loader';
import { PlusCircle, Search, Trash2, Edit2, UserMinus } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '../components/Input';

const taskSchema = yup.object({
    title: yup.string().required('Title is required'),
    description: yup.string().nullable(),
    status: yup.string().oneOf(['pending', 'completed']).default('pending'),
});

type TaskFormData = yup.InferType<typeof taskSchema>;

export const Dashboard = () => {
    const { isAdmin } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TaskFormData>({
        resolver: yupResolver(taskSchema),
        defaultValues: { status: 'pending' }
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const tasksRes = await api.get<Task[]>('/tasks/');
            setTasks(tasksRes.data);

            if (isAdmin) {
                const usersRes = await api.get<User[]>('/users/');
                setUsers(usersRes.data);
            }
        } catch (err) {
            setError('Failed to load dashboard data. Please refresh.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isAdmin]);

    const openAddModal = () => {
        setEditingTask(null);
        reset({ title: '', description: '', status: 'pending' });
        setIsTaskModalOpen(true);
    };

    const openEditModal = (task: Task) => {
        setEditingTask(task);
        reset({ title: task.title, description: task.description, status: task.status });
        setIsTaskModalOpen(true);
    };

    const onTaskSubmit = async (data: TaskFormData) => {
        try {
            if (editingTask) {
                await api.put(`/tasks/${editingTask.id}`, data);
            } else {
                await api.post('/tasks/', data);
            }
            setIsTaskModalOpen(false);
            fetchData();
        } catch (err) {
            setError('Failed to save task.');
        }
    };

    const handleDeleteTask = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t.id !== id));
        } catch (err) {
            setError('Failed to delete task.');
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this user? All their tasks will also be removed.')) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
            // Refresh tasks as some might have belonged to deleted user
            const tasksRes = await api.get<Task[]>('/tasks/');
            setTasks(tasksRes.data);
        } catch (err) {
            setError('Failed to delete user.');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-8">
            {error && <Alert type="error" message={error} />}

            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        {isAdmin ? 'Admin Dashboard' : 'My Tasks'}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {isAdmin ? 'Manage all system tasks and users.' : 'Keep track of your daily tasks.'}
                    </p>
                </div>
                <Button onClick={openAddModal} className="shrink-0">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Task
                </Button>
            </div>

            {/* Tasks Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Task List</CardTitle>
                            <CardDescription>
                                {isAdmin ? 'Showing tasks across all users' : 'Your personal task list'}
                            </CardDescription>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium px-3 py-1 rounded-full text-sm">
                            {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {tasks.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                                <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-lg font-medium text-slate-900 dark:text-slate-100">No tasks found</p>
                            <p className="mt-1">Create your first task to get started.</p>
                            <Button onClick={openAddModal} variant="secondary" className="mt-6">Create Task</Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {tasks.map((task) => (
                                <div key={task.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                    <div className="space-y-1 flex-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className={`font-medium text-lg leading-none ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'}`}>
                                                {task.title}
                                            </h4>
                                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${task.status === 'completed'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                        {task.description && (
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">{task.description}</p>
                                        )}
                                        <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                                            {isAdmin && <span>User ID: {task.user_id}</span>}
                                            <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button variant="secondary" size="sm" onClick={() => openEditModal(task)}>
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDeleteTask(task.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Admin Users Section */}
            {isAdmin && (
                <Card className="border-indigo-100 dark:border-indigo-900 shadow-indigo-100/20 dark:shadow-none">
                    <CardHeader className="bg-indigo-50/50 dark:bg-indigo-950/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-indigo-900 dark:text-indigo-100">User Management</CardTitle>
                                <CardDescription>Adminise registered users on the system.</CardDescription>
                            </div>
                            <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium px-3 py-1 rounded-full text-sm">
                                {users.length} Users
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {users.map((u) => (
                                <div key={u.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
                                            <span className="font-bold text-indigo-700 dark:text-indigo-300">
                                                {u.email.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-900 dark:text-slate-100">{u.email}</h4>
                                            <div className="flex gap-3 text-xs text-slate-500 mt-1">
                                                <span className="capitalize text-slate-600 dark:text-slate-400 font-medium px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">{u.role}</span>
                                                <span>ID: {u.id}</span>
                                                <span>Joined: {new Date(u.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                                        onClick={() => handleDeleteUser(u.id)}
                                        disabled={u.role === 'admin'} // Prevent self/admin deletion to be safe visually
                                    >
                                        <UserMinus className="w-4 h-4 mr-2" />
                                        Delete User
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Task Modal Container */}
            <Modal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                title={editingTask ? 'Edit Task' : 'Create New Task'}
            >
                <form onSubmit={handleSubmit(onTaskSubmit as any)} className="space-y-4">
                    <Input
                        id="title"
                        label="Task Title"
                        placeholder="What needs to be done?"
                        error={errors.title?.message}
                        {...register('title')}
                    />
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Description (Optional)
                        </label>
                        <textarea
                            id="description"
                            {...register('description')}
                            className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/30 text-slate-900 dark:text-slate-100 min-h-[100px] resize-y"
                            placeholder="Add extra details here..."
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="status" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Status
                        </label>
                        <select
                            id="status"
                            {...register('status')}
                            className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/30 text-slate-900 dark:text-slate-100"
                        >
                            <option value="pending">Pending</option>
                            {editingTask && <option value="completed">Completed</option>}
                        </select>
                        {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsTaskModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isSubmitting}>
                            {editingTask ? 'Save Changes' : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
