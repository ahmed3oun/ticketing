
import { LoginFormSchema, SignupFormSchema } from "./definitions";
// import { useAuth } from '@/app/context/auth-context'
import { redirect } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import axios from "axios";


//const router = useRouter()

export async function signin(state, formData) {
    // const { login } = useContext(AuthContext);

    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    console.log("Login attempt with data:", validatedFields.data);
    // Simulate a login process

    try {
        const { data, status } = await login(formData.get("email"), formData.get("password"))
        console.log({
            data
        });
        if (status === 200) {
            // router.push('/')
            redirect('/')

        }
    } catch (error) {
        console.log({
            error
        });

        // return error.response.data;
    }
}

export async function signup(state, formData) {

    // const { register } = useContext(AuthContext);
    // const router = useRouter()

    const validatedFields = SignupFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    console.log("Sign up attempt with data:", validatedFields.data);
    // Simulate a sign up process

    try {
        const { data, status } = await register(formData.get("email"), formData.get("password"))
        console.log({
            data
        });

        if (status === 201) {
            // router.push('/')
            redirect('/')
        }
    } catch (error) {
        console.log({
            error
        });

        // return error.response.data;
    }
}

const login = async (email, password) => {
    try {
        const res = await axios.post('/api/v1/user/login', {
            email: email,
            password: password
        })

        return { data: res.data, status: res.status }
    } catch (error) {
        throw new Error(error.response.message);
    }
}

const register = async (email, password) => {
    try {
        const res = await axios.post('/api/v1/user/register', {
            email: email,
            password: password
        })

        return { data: res.data, status: res.status }
    } catch (error) {
        throw new Error(error.response.message);
    }
}