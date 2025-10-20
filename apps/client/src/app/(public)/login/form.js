'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";
import { signin } from '@/app/actions/auth';
import { useActionState, useEffect } from "react";
import { LogIn } from "lucide-react";
import { redirect, useRouter } from "next/navigation";



export default function SigninForm() {
    const [state, action] = useActionState(signin, undefined);
    const router = useRouter()
    useEffect(() => {
        console.log({
            state
        });

        if (state?.result?.status === 201 || state?.result?.status === 200) {
            // reload window
            window.location.reload()
            router.push('/')

        }
    }, [state, action])

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
            {pending ? "Logging in..." : "Login"} <LogIn className="mx-1" size={16} />
        </Button>
    )
}