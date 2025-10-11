'use client'
import ProtectedRoute from "@/components/protected-route";
import useRequest from "@/hooks/use-request";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function TicketDetails() {
    const { ticketId } = useParams()
    const [ticket, setTicket] = useState(null)
    // Fetch ticket details
    const { doRequest: showTicket, errors } = useRequest({
        url: `/api/v1/tickets/find/${ticketId}`,
        method: 'get',
        body: {},
        onSuccess: (data) => setTicket(data) && toast.success('Ticket fetched successfully')
    })
    // Purchase ticket
    const { doRequest: purchaseTicket } = useRequest({
        url: `/api/v1/orders/create`,
        method: 'post',
        body: { ticketId },
        onSuccess: (data) => console.log(data) && toast.success('Ticket purchased successfully!')
    })

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                toast.loading('Fetching ticket...')
                await showTicket()
                toast.dismiss()
                toast.success('Ticket fetched successfully')
            } catch (error) {
                console.log(error);
                toast.dismiss()
                toast.error('Error fetching ticket')
                // For demo purposes, set a sample ticket
                setTicket({
                    id: ticketId,
                    title: 'Sample Ticket',
                    price: 100.00
                })
            }
        }
        ticket ?? fetchTicket()
    }, [])

    const orderTicket = async (e) => {
        e.preventDefault();
        try {
            toast.loading('Purchasing ticket...')
            await purchaseTicket()
            toast.dismiss()
            toast.success('Ticket purchased successfully!')
        } catch (error) {
            toast.dismiss()
            toast.error('Error purchasing ticket')
            console.log(error);
        }
    }

    return (
        <ProtectedRoute>
            <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-inter)]">
                <h1 className="text-2xl font-bold text-gray-800 text-center mt-2">
                    Details for Ticket ID: {ticketId}
                </h1>
                <Card className='w-fit'>
                    <CardHeader>
                        <CardTitle>Ticket Details</CardTitle>
                        <CardDescription>Details for ticket ID: {ticketId}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-gray-700">Title : {ticket?.title}.</p>
                        <p className="text-lg text-gray-700">Price : {ticket?.price}.</p>
                        <Button className="mt-4" onClick={orderTicket} variant={"default"}>
                            Purchase Ticket
                        </Button>
                        {errors && errors.map((err, index) => (
                            <p key={index} className="text-sm text-red-500">{err.message}</p>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}