//import buildClient from "@/app/context/build-client"
import axios from "axios";
import { redirect } from "next/navigation";

export default async () => {

    //const client = buildClient();
    try {
        const resp = await axios.post('http://localhost:3000/api/v1/user/logout')

        if (resp.status === 204) {
            redirect('/login')
        }
    } catch (error) {
        redirect('/login')
    }
}