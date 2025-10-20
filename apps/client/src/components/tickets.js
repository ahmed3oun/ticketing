// import axios from "axios"
import Link from "next/link"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
// import buildClient from "@/app/context/build-client"
import { useEffect, useState } from "react"
import useRequest from "@/hooks/use-request"
import toast from "react-hot-toast"


const Tickets = () => {
    // const data = await fetch('https://api.vercel.app/blog')
    // const posts = await data.json()
    // const [posts, setPosts] = useState([]);
    const [tickets, setTickets] = useState([]);
    const { doRequest: showTickets, errors } = useRequest({
        url: `/api/v1/tickets/find`,
        method: 'get',
        body: {},
        onSuccess: (data) => console.log(data) && setTickets(data)
    })
    useEffect(() => {
        async function fetchData() {
            try {

                // const response = await client.get('https://api.vercel.app/blog')
                // const posts = response.data
                await showTickets()

                setTickets(tickets)
            } catch (error) {
                setTickets([
                    {
                        'id': 1,
                        'title': 'ticket concert',
                        'price': 200
                    },
                    {
                        'id': 2,
                        'title': 'ticket ping pong',
                        'price': 150
                    },
                    {
                        'id': 3,
                        'title': 'ticket cinema',
                        'price': 120
                    },
                ])
                console.error('Error fetching tickets:', error)
            }
        }
        if (!tickets.length)
            fetchData();
    }, []);

    return (
        <div className="flex flex-row gap-3 items-center justify-center overflow-auto">
            {
                tickets && tickets?.map(((ticket, index) => (
                    <Card key={index} className='w-fit'>
                        <CardHeader>
                            <CardTitle>{ticket.title}</CardTitle>
                            <CardDescription>{ticket.price} $</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="mt-2 p-2" variant={'outline'} size={'md'}>
                                <Link href={`/tickets/${ticket.id}`} className="btn btn-primary cursor-pointer">
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

export default Tickets;