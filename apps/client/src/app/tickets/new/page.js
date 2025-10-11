import ProtectedRoute from "@/components/protected-route";
import Link from "next/link";
import { Redo } from 'lucide-react'
import NewTicketForm from "./form";

export const metadata = {
    title: "Create New Ticket",
    description: "Create a new ticket",
};

export default function NewTicket() {

    return (
        <ProtectedRoute>
            <div className="flex flex-col p-4 lg:w-1/3 sm:w-1/2 w-full mx-auto">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Create New Ticket</h1>
                    <p className="text-gray-600 mb-2">Please enter your ticket details.</p>
                </div>
                <div className="mt-4">
                    <NewTicketForm />
                </div>
                <div className="mt-6 text-center text-sm">
                    <Link className="underline" href="/">
                        Back to home?{' '} <Redo className="inline-block ml-1 mb-1" size={14} />
                    </Link>
                </div>
            </div>
        </ProtectedRoute>
    );
}