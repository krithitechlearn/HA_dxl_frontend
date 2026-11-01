import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';

/**
 * LoginPage
 * A page component for user authentication.
 * @related US-001
 */
const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (username: string, password: string) => {
        try {
            await login(username, password);
            navigate('/devices');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <LoginForm onSubmit={handleLogin} errorMessage={error} />
        </div>
    );
};

export default LoginPage;