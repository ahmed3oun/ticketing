export default function Footer() {
    return (
        <>
            <footer className="flex justify-center items-center w-full h-16 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                <p className="text-sm">© 2023 Ticketing App. All rights reserved.</p>
            </footer>
            <div className="flex justify-center items-center w-full h-16 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                <p className="text-sm">Made with ❤️ by the Ticketing Team</p>
            </div>
            <div className="flex justify-center items-center w-full h-16 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                <p className="text-sm">Contact us at
                    <a href="mailto:ahmedoun199@gmail.com" className="text-blue-500 hover:underline">
                    </a>
                </p>
            </div>
        </>
    )
}