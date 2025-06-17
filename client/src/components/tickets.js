// import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import buildClient from "@/app/context/build-client"


export default Tickets = async () => {
    let tickets = null
    try {
        const client = buildClient()
        const response = await client.get('/api/v1/ticket/find')

        tickets = response.data.tickets

    } catch (error) {
        tickets = [
            {
                'title': 'ticket concert',
                'price': 200
            },
            {
                'title': 'ticket ping pong',
                'price': 150
            },
            {
                'title': 'ticket cinema',
                'price': 120
            },
        ]
    }

    return (
        <>
            {
                tickets && tickets.map((ticket => (
                    <Card>
                        <CardHeader>
                            <CardTitle>{ticket.title}</CardTitle>
                            <CardDescription>{ticket.price}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>This is the content of the card.</p>
                        </CardContent>
                        <CardFooter>
                            <button className="btn btn-primary">Action</button>
                        </CardFooter>
                    </Card>
                )))
            }

        </>
    )

}