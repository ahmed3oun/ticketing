import Link from "next/link";
import SignupForm from "./form";


export const metadata = {
    title: "Sign up",
    description: "Sign up to your account",
};

const Signup = () => {
    return (
        <>
            <div className="flex flex-col p-4 lg:w-1/3 sm:w-1/2 w-full mx-auto">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Register</h1>
                    <p className="text-gray-600 mb-2">Please enter your credentials to sign up.</p>
                </div>
                <div className="mt-4">
                    <SignupForm />
                </div>
                <div className="mt-6 text-center text-sm">
                    Already have an account?{' '}
                    <Link className="underline" href="/login">
                        Login
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Signup;