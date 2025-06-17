'use client';
import axios from 'axios';
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({
    user: null,
    login: async () => { },
    logout: () => { },
    loading: true,
})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const response = await axios.get('/api/v1/user/get-current-user');
                const data = response.data.currentUser;
                setUser(data || null)
            } catch (error) {
                console.log(error);
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        loadUser();
    }, [])

    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/v1/user/login', {
                email: email,
                password: password
            })

            return res.data
        } catch (error) {
            throw new Error(error.response.message);
        }
    }

    const logout = async () => {
        await axios.post('api/v1/user/logout')
        setUser(null);
    };


    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

