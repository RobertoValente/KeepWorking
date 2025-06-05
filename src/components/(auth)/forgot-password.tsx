"use client"

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { forgetPassword } from "@/lib/auth/client";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                    <CardDescription>
                        To continue, please insert your email.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="roberto@gmail.com"
                                disabled={loading}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>

                        <div className="">
                            <Button
                                type="submit"
                                className="w-full cursor-pointer"
                                disabled={loading}
                                onClick={async () => {
                                    if(!email) return toast.error("Please fill all fields!");
                                    
                                    setLoading(true);
                                    await forgetPassword({
                                        email,
                                        redirectTo: "/reset-password"
                                    }, {
                                        onSuccess() {
                                            setLoading(false);
                                            setEmail("");
                                            toast.success("Check your email to continue!");
                                        },
                                        onError(ctx) {
                                            setLoading(false);
                                            if(ctx.error.status === 500) toast.error(ctx.error.statusText + "! Please contact support.");
                                            if(ctx.error.status === 400) toast.error("Invalid email!");
                                        },
                                    });
                                }}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Wait...
                                    </>
                                ) : "Reset Password"}
                            </Button>
                        </div>

                        <div className="flex gap-2 text-sm m-auto mt-2">
                            <Link href="/sign-in" className="text-primary underline underline-offset-4">
                                Sign In
                            </Link>
                            |
                            <Link href="/sign-up" className="text-primary underline underline-offset-4">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}