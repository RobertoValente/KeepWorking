"use client";

import { SparklesText } from "@/components/magicui/sparkles-text";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    if(isPending) {
        return (
            <div className="text-center mt-6">
                <SparklesText className="text-center mt-6 text-4xl">Loading...</SparklesText>
            </div>
        )
    }

    return (
        <>
            <SparklesText className="text-center mt-6 text-4xl">Hello World :D</SparklesText>
            <div className="text-center mt-6">
                <Button variant={"link"} className="cursor-pointer">
                    <a href="/sign-in">Sign In</a>
                </Button>
                <Button variant={"link"} className="cursor-pointer">
                    <a href="/home">Home</a>
                </Button>
                { session && (
                    <Button
                        variant={"link"}
                        className="cursor-pointer"
                        onClick={async () => {
                            await signOut({
                                fetchOptions: {
                                    onSuccess() {
                                        //console.log("Sign out success:", ctx);
                                        router.push("/");
                                    },
                                    onError(ctx) {
                                        //console.error("Sign out error:", ctx);
                                        toast.error(ctx.error.message + "! Please contact support.");
                                    },
                                }
                            });
                        }}
                    >
                        Sign Out
                    </Button>
                )}
            </div>
        </>
    )
}