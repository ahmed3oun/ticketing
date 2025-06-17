import { LoginFormSchema } from "./definitions";
import { useAuth } from '@/app/context/auth-context'
import { useRouter } from "next/router";


const { login } = useAuth();
const router = useRouter()

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

    console.log("Login attempt with email:", validatedFields.data);
    // Simulate a login process

    try {
        const { user } = await login(formData.get("email"), formData.get("password"))
        console.log({
            user
        });

        router.push('/')
    } catch (error) {
        console.log({
            error
        });

        return error.response.data;
    }
}