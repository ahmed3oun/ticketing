import axios from "axios";
import { NewTicketFormSchema } from "./definitions";



export async function saveTicket(state, formData) {

    const validatedFields = NewTicketFormSchema.safeParse({
        title: formData.get("title"),
        price: formData.get("price"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    console.log("New ticket attempt with data:", validatedFields.data);
    // Simulate a sign up process

    try {
        const { data, status } = await save(formData.get("title"), formData.get("price"))
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

const save = async (title, price) => {
    try {
        const res = await axios.post('/api/v1/tickets/create', {
            title,
            price
        })

        return { data: res.data, status: res.status }
    } catch (error) {
        throw new Error(error.response.message);
    }
}