import axios from "axios";
import { NewTicketFormSchema } from "./definitions";
import toast from "react-hot-toast";



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

    // Simulate a sign up process
    const taostLoadingId = toast.loading('Creating ticket...')
    console.log({
        taostLoadingId
    });
    const { data, status } = await save(formData.get("title"), formData.get("price"))
    toast.dismiss(taostLoadingId)
    if (status === 201) {
        toast.success('Ticket created successfully!')
    }
    return {
        result: {
            status,
            data
        }
    }

}

const save = async (title, price) => {
    try {
        const res = await axios.post('/api/v1/tickets/create', {
            title,
            price
        })
        if (res.status === 201)
            return { data: res.data, status: res.status }
    } catch (error) {
        toast.error(`${error.response.data.error.message}`)
    }
}