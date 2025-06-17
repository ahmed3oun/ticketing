'use client'
import ProtectedRoute from "@/components/protected-route";
import { useAuth } from "./context/auth-context";
import Tickets from "@/components/tickets";


export default function Home() {
    const { user } = useAuth();
    //const data = await fetch('https://api.vercel.app/blog')
    //const posts = await data.json()

    return (
        <ProtectedRoute>
            <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-inter)]">
                <h1 className="text-2xl font-bold text-center mt-2">
                    Welcome to HOME of the Ticketing App!
                </h1>
                <h1 className="text-2xl font-bold text-gray-800 text-center mt-2">Welcome, {user?.email}!</h1>
                <Tickets />
            </div>
        </ProtectedRoute>
    );
}