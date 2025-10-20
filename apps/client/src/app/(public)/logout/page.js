'use client'
import { useContext, useEffect } from "react";
import { AuthContext } from "@/app/context/auth-context";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default () => {


    const router = useRouter()
    const { logout } = useContext(AuthContext)

    //const client = buildClient();
    useEffect(() => {
        async function performLogout() {
            toast.loading('Logging you out...')
            const { status } = await logout();
            return status
        }
        performLogout().then(status => {
            if (status === 204) {
                toast.dismiss();
                toast.success('Logged out successfully')
                router.push('/login')
            } else {
                toast.error('Something gone wrong')
                router.push('/')
            }
        });
    }, [])
}