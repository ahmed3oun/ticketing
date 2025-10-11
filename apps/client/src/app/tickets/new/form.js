'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";
import { saveTicket } from '@/app/actions/ticket';
import { useActionState } from "react";
import { Save } from "lucide-react";


export default function NewTicketForm() {
    const [state, action] = useActionState(saveTicket, undefined)

    const onBlur = (e) => {
        const value = parseFloat(e.target.value);
        if (isNaN(value)) {
            return;
        }
        e.target.value = value.toFixed(2);
    }

    return (
        <>
            <form action={action} className="space-y-4">
                <div className="flex flex-col gap-2">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="Ticket title..." />
                    </div>
                    {
                        state?.errors?.title && (
                            <p className="text-sm text-red-500">{state.errors.title}</p>
                        )
                    }
                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            onBlur={onBlur}
                            step="0.01"
                            min="0"
                            placeholder="20.00$"
                        />
                    </div>
                    {
                        state?.errors?.price && (
                            <p className="text-sm text-red-500">{state.errors.price}</p>
                        )
                    }
                    <SaveButton />
                </div>
            </form>
        </>
    );
}

export function SaveButton() {
    const { pending } = useFormStatus();

    return (
        <Button className={'mt-2 cursor-pointer'} variant="outline" type="submit" role='button' disabled={pending}>
            {pending ? "Saving..." : "Save"} <Save className="mx-1" size={16} />
        </Button>
    )
}