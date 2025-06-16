import { LoginFormSchema } from "./definitions";


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

    console.log("Login attempt with email:", validatedFields.data.email);
    // Simulate a login process
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Here you would typically check the credentials against a database

    return {
        success: true,
        message: "Login successful",
    };
}