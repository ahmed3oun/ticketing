import { cookies } from "next/headers";
import { NextResponse } from "next/server";
//import buildClient from "./api/build-client";
import axios from "axios";

// 1. Specify protected and public routes
const protectedRoutes = ['/', '/tickets/new', 'tickets/[id]', '/orders'];
const publicRoutes = ['/login', '/signup'];


export default async (req) => {

    const path = req.nextUrl.pathname

    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const cookieSession = (await cookies()).get('session')?.value
    // console.log({
    //     cookieSession
    // });
    // console.log({
    //     req
    // });


    // try {
    //     //const client = buildClient({ req })
    //     const client = axios.create({
    //         // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    //         baseURL: 'http://auth-srv',
    //         headers: req?.headers
    //     })
    //     const response = await client.get('/api/v1/user/get-current-user')

    //     console.log({
    //         data: response.data
    //     });


    //     return NextResponse.next()
    // } catch (error) {
    //     console.log({
    //         error
    //     });
    // }

    // if (!cookieSession && isProtectedRoute) {

    // }

    // if (!cookieSession && isPublicRoute) {
    // }



}