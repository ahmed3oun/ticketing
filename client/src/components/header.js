'use client'
import Link from "next/link";
import { MenuIcon } from "./ui/icons";
import { AuthContext, useAuth } from "@/app/context/auth-context";
import { useContext } from "react";


const Links = () => {
    const { user } = useContext(AuthContext)

    const links = [
        user && { name: 'Home', path: '/' },
        user && { name: 'New Ticket', path: '/tickets/new' },
        user && { name: 'New Order', path: '/orders/new' },
        user && { name: 'Orders', path: '/orders' },
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/signup' }
    ];

    return (
        <>
            {links.map((link) => (
                link && <Link
                    key={link.name}
                    className="text-gray-900 hover:text-gray-600 transition-colors"
                    href={link.path}
                    title={link.name}
                    aria-label={link.name}>
                    {link.name}
                </Link>
            ))}
        </>
    );
}

const Header = () => {
    return (
        <div className="border-b border-gray-100">
            <div className="container mx-auto flex max-w-xl items-center justify-end p-4 md:justify-between md:px-6">
                <nav className="hidden items-center space-x-4 text-sm md:flex">
                    <Links />
                </nav>
                <div className="hidden items-center space-x-4 md:flex">
                    <Link
                        className="rounded-md border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-black hover:text-white"
                        href="/login">
                        Login
                    </Link>
                    <button className="inline-flex rounded-md md:hidden" type="button">
                        <MenuIcon className="h-6 w-6" />
                        <span className="sr-only">Toggle Menu</span>
                    </button>
                </div>
            </div>
        </div >
    );
}

export default Header;