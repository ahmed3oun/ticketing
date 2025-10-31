

'use client'
import ProtectedRoute from "@/components/protected-route";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import useRequest from "@/hooks/use-request"
import toast from "react-hot-toast"


export default function Orders() {

    return (
        <ProtectedRoute>
            <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-inter)]">
                <OrderList />
            </div>
        </ProtectedRoute>
    );
}

const OrderList = () => {
    const [orders, setOrders] = useState(null);
    const { doRequest: showOrders, errors } = useRequest({
        url: `/api/v1/orders/find`,
        method: 'get',
        onSuccess: (resData) => setOrders(resData.data)
    })
    useEffect(() => {
        async function fetchData() {
            try {
                if (!Array.isArray(orders).valueOf()) {
                    const res = await showOrders()
                    if (res.status === 200)
                        toast.success('Fetched successfully!')
                }
            } catch (error) {
                toast.error(errors)
            }
        }
        if (!Array.isArray(orders).valueOf())
            fetchData();
    }, []);

    return (
        <div className="flex flex-row gap-3 items-center justify-center flex-wrap">
            {
                orders && orders?.map(((order, index) => (
                    <Card key={index} className='w-fit'>
                        <CardHeader>
                            <CardTitle>Order ID : {order.id}</CardTitle>
                            <CardDescription>PRICE : {order?.ticket.price} $</CardDescription>
                            <CardDescription>PRICE : {order?.ticket.title}</CardDescription>
                            <CardDescription>STATUS : {order?.status} $</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Created At : {new Date(order?.createdAt).toLocaleString()}
                            </CardDescription>

                            <Button className="mt-2 p-2" variant={'outline'} size={'md'}>
                                <Link href={`/orders/${order.id}`} className="btn btn-primary cursor-pointer">
                                    View Details
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )))
            }

        </div >
    )

}

