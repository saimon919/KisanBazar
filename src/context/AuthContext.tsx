import { createContext, useState, useContext, type ReactNode } from 'react';

type UserRole = 'customer' | 'farmer' | 'admin';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    is_verified?: boolean;
    farm_location?: string;
    payment_qr?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, role: UserRole, password?: string) => Promise<void>;
    logout: () => void;
    register: (name: string, email: string, role: UserRole, phone?: string, password?: string, farmLocation?: string, citizenshipDoc?: string, paymentQr?: string) => Promise<void>;
    updateProfile: (data: { payment_qr?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = '/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('kb_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (email: string, _role: UserRole, password?: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: password || 'password123' }),
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setUser(data.user);
            localStorage.setItem('kb_user', JSON.stringify(data.user));
            localStorage.setItem('kb_token', data.token);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const register = async (name: string, email: string, role: UserRole, phone?: string, password?: string, farmLocation?: string, citizenshipDoc?: string, paymentQr?: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    role,
                    phone,
                    password,
                    farm_location: farmLocation,
                    citizenship_doc: citizenshipDoc,
                    payment_qr: paymentQr
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Registration failed');

            await login(email, role, password);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('kb_user');
        localStorage.removeItem('kb_token');
    };

    const updateProfile = async (updateData: { payment_qr?: string }) => {
        try {
            const token = localStorage.getItem('kb_token');
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify(updateData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Update failed');

            setUser(data.user);
            localStorage.setItem('kb_user', JSON.stringify(data.user));
            alert('Profile updated successfully!');
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateProfile }}>
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
