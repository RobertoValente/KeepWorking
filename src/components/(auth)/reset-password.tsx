"use client"

import { SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Loader2 } from "lucide-react";
import { resetPassword } from "@/lib/auth/client";
import { toast } from "sonner";

export default function ResetPasswordForm() {
    const [gotToken, setGotToken] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const t = new URLSearchParams(window.location.search).get("token");
            setToken(t);
            setGotToken(true);
        }
    }, []);

    if(!gotToken) {
        return (
            <Loader2 className="w-6 h-6 animate-spin m-auto mt-10" />
        )
    }

    return (
        <div className="flex flex-col gap-6">
            {token ? (
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                        <CardDescription>
                            To continue, please insert your new password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    placeholder="Password"
                                    disabled={loading}
                                    required
                                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setPassword(e.target.value)}
                                    value={password}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="confirm-password"
                                    placeholder="Confirm Password"
                                    disabled={loading}
                                    required
                                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                />
                            </div>

                            <div className="">
                                <Button
                                    type="submit"
                                    className="w-full cursor-pointer"
                                    disabled={loading}
                                    onClick={async () => {
                                        if(!password || !confirmPassword) return toast.error("Please fill all fields!");
                                        if(password !== confirmPassword) return toast.error("Passwords do not match!");
                                        
                                        setLoading(true);
                                        await resetPassword({
                                            newPassword: password,
                                            token: token as string,
                                        }, {
                                            onSuccess() {
                                                setLoading(false);
                                                setPassword("");
                                                setConfirmPassword("");
                                                toast.success("Password changed successfully!");
                                            },
                                            onError(ctx) {
                                                setLoading(false);
                                                if(ctx.error.status === 500) toast.error(ctx.error.statusText + "! Please contact support.");
                                                if(ctx.error.code === "PASSWORD_TOO_SHORT") toast.error(ctx.error.message + "!");
                                                if(ctx.error.code === "INVALID_TOKEN") toast.error(ctx.error.message + "!");
                                                //console.log(ctx.error);
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
            ) : (
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">❌ Token is missing</CardTitle>
                        <CardDescription>
                            To continue, you should have a password token.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="flex gap-2 text-sm m-auto">
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
            )}
        </div>
    )
}