'use client'
import ProtectedRoute from "@/components/protected-route";
import { useParams } from "next/navigation";

export default function OrderDetails() {
    const { orderId } = useParams()

    console.log("Ticket ID:", orderId);
    return (
        <ProtectedRoute>
            <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-inter)]">
                <h1 className="text-2xl font-bold text-center">
                    Welcome to order details {orderId}
                </h1>
                <h1 className="text-2xl font-bold text-gray-800 text-center mt-2">Details for Order ID: {orderId}</h1>
            </div>
        </ProtectedRoute>
    );
}