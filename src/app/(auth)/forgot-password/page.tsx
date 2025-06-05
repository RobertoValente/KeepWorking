import ForgotPasswordForm from "@/components/(auth)/forgot-password"
import { Toaster } from "sonner"

export default function ForgotPasswordPage() {
    return (
        <>
            <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <div className="flex w-full max-w-sm flex-col gap-6">
                    <ForgotPasswordForm />
                </div>
                <Toaster richColors closeButton theme="system" />
            </div>
        </>
    )
}