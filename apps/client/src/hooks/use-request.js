import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"


export default ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null)

    const doRequest = async (props = {}) => {
        try {
            const response = await axios[method](url, { ...body, ...props });
            if (onSuccess) {
                onSuccess(response.data)
            }
            return response.data
        } catch (error) {
            toast.error('Something went wrong')
            setErrors(error.response.data.errors)
            throw new Error("Request failed");
        }
    }

    return { doRequest, errors };
}