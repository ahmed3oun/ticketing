import { z } from "zod";

export const SignupFormSchema = z.object({
    email: z
        .string()
        .email({ message: 'Please enter a valid email.' })
        .trim(),
    password: z
        .string()
        .min(6, { message: 'Be at least 6 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Contain at least one special character.',
        })
        .trim(),
})

export const LoginFormSchema = z.object({
    email: z
        .string()
        .email({ message: 'Please enter a valid email.' })
        .trim(),
    password: z
        .string()
        .min(6, { message: 'Be at least 6 characters long' })
        .trim(),
})

export const NewTicketFormSchema = z.object({
    title: z
        .string()
        .min(3, { message: 'Title should be at least 3 characters long.' })
        .max(100, { message: 'Title should be at most 100 characters long.' })
        .trim(),
    price: z
        .number({ invalid_type_error: 'Price must be a number.' })
        .min(1, { message: 'Price must be at least $1.' })
        .max(10000, { message: 'Price must be at most $10,000.' }),
})

export const NewOrderFormSchema = z.object({
    ticketId: z
        .string()
        .min(1, { message: 'Ticket ID is required.' })
        .trim(),
})

export const CancelOrderFormSchema = z.object({
    orderId: z
        .string()
        .min(1, { message: 'Order ID is required.' })
        .trim(),
})

export const PaymentFormSchema = z.object({
    orderId: z
        .string()
        .min(1, { message: 'Order ID is required.' })
        .trim(),
    token: z
        .string()
        .min(1, { message: 'Payment token is required.' })
        .trim(),
})