'use client';
import { AuthContext } from '@/app/context/auth-context';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import LoadingIndicator from './ui/loading-indicator';

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
        return <LoadingIndicator />;
    }

    return <>{children}</>;
}