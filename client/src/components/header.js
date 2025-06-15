import Link from "next/link";

const Header = ({}) => {

    const links = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Tickets', path: '/tickets' },
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' }
    ];


    return (
        <header className="bg-gray-800 text-white p-4">
            <h1 className="text-2xl font-bold">Ticketing</h1>
            <nav className="mt-2">
                <ul className="flex space-x-4">
                    {links.map((link) => (
                        <li key={link.name}>
                            <Link href={link.path} className="hover:underline">
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}

export default Header;