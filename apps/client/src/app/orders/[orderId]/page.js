'use client'
import { AuthContext } from "@/app/context/auth-context";
import ProtectedRoute from "@/components/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useRequest from "@/hooks/use-request";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import StripeCheckout from 'react-stripe-checkout';

export default function OrderDetails() {
    const { orderId } = useParams()
    const [order, setOrder] = useState(null)
    const [isMounted, setIsMounted] = useState(false)
    const [timeLeft, setTimeLeft] = useState(0);
    const router = useRouter();
    const { user } = useContext(AuthContext);
    // Fetch order details
    const { doRequest: showOrder, errors } = useRequest({
        url: `/api/v1/orders/find/${orderId}`,
        method: 'get',
        onSuccess: (resData) => {
            const data = resData.data;
            console.log({
                data
            });
            setOrder(data);
            toast.success('Order fetched successfully');
            setIsMounted(true);
        }
    })
    const { doRequest: payOrder } = useRequest({
        url: `/api/v1/payments/create`,
        method: 'post',
        body: {
            orderId: order?.id,
            token: 'tok_visa'
        },
        onSuccess: (resData) => {
            toast.dismiss()
            toast.success('Order paid successfully!')
            router.push(`/orders`)
        }
    })
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                if (!isMounted) {
                    setIsMounted(true)
                    toast.loading('Fetching order...')
                    await showOrder()
                    toast.dismiss()
                }
            } catch (error) {
                toast.dismiss()
                toast.error(errors || 'Error fetching order')
            }
        }
        const findTimeLeft = () => {
            const msLeft = new Date(order?.expiresAt) - new Date()
            console.log({
                msLeft,
                expiresAt: order?.expiresAt
            });
            setTimeLeft(Math.round(msLeft / 1000));
            return Math.round(msLeft / 1000);
        }

        if (!isMounted) {
            fetchOrder()
        }

        const timeId = setInterval(findTimeLeft, 1000);
        return () => {
            clearInterval(timeId)
        }
    }, [timeLeft, isMounted]);



    if (timeLeft < 0) {
        return (
            <ProtectedRoute>
                <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-inter)]">
                    <h1 className="text-2xl font-bold text-center">
                        Order Expired
                    </h1>
                </div>
            </ProtectedRoute>
        );
    }
    return (
        <ProtectedRoute>
            <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-inter)]">
                <h1 className="text-2xl font-bold text-center">
                    Time left to pay: {timeLeft} seconds
                </h1>


                <Card className='w-full md:w-fit '>
                    <CardHeader>
                        <CardTitle>Order Details</CardTitle>
                        <CardDescription>Details for Order ID: {orderId}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-gray-700">Price : {order?.ticket.price * 100} $</p>
                        <p className="text-lg text-gray-700">Ticket Title : {order?.ticket.title}</p>
                        <p className="text-lg text-gray-700">Order Status : {order?.status}</p>
                        <p className="text-lg text-gray-700">Order expires at : {order?.expiresAt}</p>
                        {order &&
                            (<StripeCheckout
                                token={({ id }) => payOrder({ token: id })}
                                stripeKey="pk_test_JMdyKVvf8EGTB0Fl28GsN7YY"
                                amount={order ? order.ticket.price * 100 : 0}
                                email={user?.email}
                            />)}
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}