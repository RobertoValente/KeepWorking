"use client"

import { SetStateAction, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Loader2 } from "lucide-react";
import { signIn, signUp } from "@/lib/auth/client";
import { toast } from "sonner";

export default function SignUpForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
                    <CardDescription>
                        To continue, please create an account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input
                                    id="first-name"
                                    placeholder="Roberto"
                                    disabled={loading}
                                    required
                                    onChange={(e) => setFirstName(e.target.value)}
                                    value={firstName}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input
                                    id="last-name"
                                    placeholder="Dev"
                                    disabled={loading}
                                    required
                                    onChange={(e) => setLastName(e.target.value)}
                                    value={lastName}
                                />
                            </div>
                        </div>
                        
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
                            <Label htmlFor="password">Confirm Password</Label>
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
                                    if(!firstName || !lastName || !email || !password || !confirmPassword) return toast.error("Please fill all fields!");
                                    if(password !== confirmPassword) return toast.error("Passwords do not match!");
                                    
                                    setLoading(true);
                                    await signUp.email({
                                        email: email,
                                        name: `${firstName} ${lastName}`,
                                        password: password,
                                        callbackURL: "/home",
                                    }, {
                                        onSuccess() {
                                            setLoading(false);
                                            toast.success("Account created successfully! Please check your email to verify your account.");
                                        },
                                        onError(ctx) {
                                            setLoading(false);
                                            //console.log("Error:", ctx.error);
                                            if(ctx.error.status === 500) toast.error(ctx.error.statusText + "! Please contact support.");
                                            if(ctx.error.code === "INVALID_EMAIL") toast.error(ctx.error.message + "!");
                                            if(ctx.error.code === "PASSWORD_TOO_SHORT") toast.error(ctx.error.message + "! It must be at least 8 characters long.");
                                            if(ctx.error.code === "USER_ALREADY_EXISTS") toast.error(ctx.error.message + "!");
                                        },
                                    });
                                }}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Wait...
                                    </>
                                ) : "Sign Up"}
                            </Button>
                        </div>

                        <div>
                            <Button
                                variant="outline"
                                className="w-full cursor-pointer gap-2"
                                disabled={loading}
                                onClick={async () => {
                                    setLoading(true);
                                    await signIn.social({
                                        provider: "google",
                                        callbackURL: "/home"
                                    }, {
                                        onSuccess(ctx) {
                                            setLoading(false);
                                            console.log("Success:", ctx);
                                        },
                                        onError(ctx) {
                                            setLoading(false);
                                            if(ctx.error.status === 500) toast.error(ctx.error.statusText + "! Please contact support.");
                                            console.log("Error:", ctx.error);
                                        },
                                    });
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
                                    <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                                    <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                                    <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                                    <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                                </svg>
                                Sign up with Google
                            </Button>
                        </div>

                        <div className="text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/sign-in" className="text-primary underline underline-offset-4">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}