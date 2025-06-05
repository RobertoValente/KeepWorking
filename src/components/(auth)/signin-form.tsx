"use client"

import { SetStateAction, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                    <CardDescription>
                        To continue, please sign in to your account.
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

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/forgot-password" className="text-primary text-sm underline underline-offset-4">
                                    Forgot password?
                                </Link>
                            </div>

                            <PasswordInput
                                id="password"
                                placeholder="Password"
                                disabled={loading}
                                required
                                onChange={(e: { target: { value: SetStateAction<string>; }; }) => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>

                        <div className="">
                            <Button
                                type="submit"
                                className="w-full cursor-pointer"
                                disabled={loading}
                                onClick={async () => {
                                    if(!email || !password) return toast.error("Please fill all fields!");
                                    
                                    setLoading(true);
                                    await signIn.email({
                                        email,
                                        password,
                                    }, {
                                        onSuccess() {
                                            setLoading(false);
                                            router.push("/home");
                                        },
                                        onError(ctx) {
                                            setLoading(false);
                                            //console.log("Error:", ctx.error);
                                            if(ctx.error.status === 500) toast.error(ctx.error.statusText + "! Please contact support.");
                                            if(ctx.error.code === "INVALID_EMAIL") toast.error(ctx.error.message + "!");
                                            if(ctx.error.code === "INVALID_EMAIL_OR_PASSWORD") toast.error(ctx.error.message + "!");
                                            if(ctx.error.code === "EMAIL_NOT_VERIFIED") toast.error(ctx.error.message + "!");
                                        },
                                    });
                                }}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Wait...
                                    </>
                                ) : "Sign In"}
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
                                Sign in with Google
                            </Button>
                        </div>

                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
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