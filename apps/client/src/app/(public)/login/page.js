import Link from "next/link";
import SigninForm from "./form";


export const metadata = {
    title: "Login",
    description: "Login to your account",
};

const Login = () => {
    return (
        <>
            <div className="flex flex-col p-4 lg:w-1/3 sm:w-1/2 w-full mx-auto">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Login</h1>
                    <p className="text-gray-600 mb-2">Please enter your credentials to login.</p>
                </div>
                <div className="mt-4">
                    <SigninForm />
                </div>
                <div className="mt-6 text-center text-sm">
                    Didn't have an account?{' '}
                    <Link className="underline" href="/signup">
                        Register
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Login;