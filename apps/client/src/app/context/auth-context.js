'use client';
import axios from 'axios';
import { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext({
    user: { email: "test@test.com", name: "test user" },
    login: async (email, password) => { },
    register: async (email, password) => { },
    logout: () => { },
    loading: true,
})

export function AuthProvider({ children }) {
    const [user, setUser] = useState({ email: "test@test.com", name: "test user" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                // const response = await axios.get('/api/v1/user/get-current-user');
                // const data = response.data.currentUser;
                const data = { email: "test@test.com", name: "test user" };
                setUser(data || null)
                console.log({
                    user
                });

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

            return { data: res.data, status: res.status }
        } catch (error) {
            throw new Error(error.response.message);
        }
    }

    const register = async (email, password) => {
        try {
            const res = await axios.post('/api/v1/user/register', {
                email: email,
                password: password
            })

            return { data: res.data, status: res.status }
        } catch (error) {
            throw new Error(error.response.message);
        }
    }

    const logout = async () => {
        await axios.post('api/v1/user/logout')
        setUser(null);
    };


    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

// export const useAuth = () => {
//     return useContext(AuthContext)
// }

