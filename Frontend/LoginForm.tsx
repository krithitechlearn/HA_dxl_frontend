import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface LoginFormProps {
    onSubmit: (username: string, password: string) => void;
    errorMessage?: string | null;
}

const loginSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, errorMessage }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const handleFormSubmit = (data: any) => {
        onSubmit(data.username, data.password);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div>
                <label htmlFor="username">Username</label>
                <input id="username" {...register('username')} />
                {errors.username && <span>{errors.username.message}</span>}
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" {...register('password')} />
                {errors.password && <span>{errors.password.message}</span>}
            </div>
            {errorMessage && <div>{errorMessage}</div>}
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;