'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
    user: null,
    login: async (email, password) => { },
    register: async (email, password) => { },
    logout: async () => { },
    loading: true,
})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter()
    useEffect(() => {
        async function loadUser() {
            try {
                const response = await axios.get('/api/v1/user/get-current-user');
                const data = response.data.currentUser;
                return {
                    data,
                    status: response.status
                }
            } catch (error) {
                console.log(error);
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        loadUser().then(({ data, status }) => {
            if (status === 200) {
                setUser(data);
                router.push('/')
            }

        }).catch(err => {
            setUser(null);
            router.push('/login')
        })
    }, [])

    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/v1/user/login', {
                email: email,
                password: password
            })
            setUser(res.data)
            return { data: res.data, status: res.status }
        } catch (error) {
            throw error;
        }
    }

    const register = async (email, password) => {
        try {
            const res = await axios.post('/api/v1/user/register', {
                email: email,
                password: password
            })
            setUser(res.data)
            return { data: res.data, status: res.status }
        } catch (error) {
            throw error
        }
    }

    const logout = async () => {
        const res = await axios.post('api/v1/user/logout')
        if (res.status === 204) {
            setUser(null);
        }
        return {
            status: res.status
        }
    };


    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

