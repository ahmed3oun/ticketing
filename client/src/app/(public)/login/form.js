'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import { signin } from '@/app/auth/auth';
import { useActionState } from "react";


export default function SigninForm() {
    const [state, action] = useActionState(signin , undefined)

    return (
        <>
            <form action={action} className="space-y-4">
                <div className="flex flex-col gap-2">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" placeholder="john@example.com" />
                    </div>
                    {
                        state?.errors?.email && (
                            <p className="text-sm text-red-500">{state.errors.email}</p>
                        )
                    }
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                        />
                    </div>
                    {
                        state?.errors?.password && (
                            <p className="text-sm text-red-500">{state.errors.password}</p>
                        )
                    }
                    <LoginButton />
                </div>
            </form>
        </>
    );
}

export function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button className={'mt-2 cursor-pointer'} variant="outline" type="submit" role='button' disabled={pending}>
            {pending ? "Logging in..." : "Login"}
        </Button>
    )
}