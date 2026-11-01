export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    user: {
        id: string;
        username: string;
        email: string;
    };
    role: 'ADMIN' | 'USER' | 'GUEST';
}