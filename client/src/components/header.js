import Link from "next/link";
import { MenuIcon } from "./ui/icons";


const Links = ({ links }) => {
    return (
        <>
            {links.map((link) => (
                <Link
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

    const links = [
        { name: 'Home', path: '/' },
        { name: 'Orders', path: '/orders' },
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' }
    ];


    return (
        <div className="border-b border-gray-100">
            <div className="container mx-auto flex max-w-xl items-center justify-end p-4 md:justify-between md:px-6">
                <nav className="hidden items-center space-x-4 text-sm md:flex">
                    <Links links={links} />
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