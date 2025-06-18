'use client';
import { AuthContext } from '@/app/context/auth-context';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

export default function ProtectedRoute({
    children,
}) {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}