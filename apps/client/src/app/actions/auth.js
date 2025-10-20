'use client';
import { LoginFormSchema, SignupFormSchema } from "./definitions";
import axios from "axios";
import toast from "react-hot-toast";




export async function signin(state, formData) {
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    // Simulate a login process
    const { data, status } = await login(formData.get("email"), formData.get("password"))

    if (status === 200) {
        toast.success('Logged in successfully')
    }

    return {
        result: {
            status,
            data
        }
    }

}

export async function signup(state, formData) {
    const validatedFields = SignupFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    // Simulate a sign up process
    const { data, status } = await register(formData.get("email"), formData.get("password"))

    if (status === 201) {
        toast.success(`${data.message}`)
    }

    return {
        result: {
            status,
            data
        }
    }
}

const login = async (email, password) => {
    try {
        const res = await axios.post('/api/v1/user/login', {
            email: email,
            password: password
        })

        if (res.status === 200) {
            return { data: res.data, status: res.status }
        }

    } catch (error) {
        toast.error(`${error.response.data.error.message}`)
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
        toast.error(`${error.response.data.error.message}`)
    }
}