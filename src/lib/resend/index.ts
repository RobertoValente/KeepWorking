import { Resend } from 'resend';
import { ConfirmEmailTemplate } from '@/components/email/confirm-email';
import { ResetPasswordTemplate } from '@/components/email/reset-password';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmEmail(to: string, url: string): Promise<EmailResponse> {
    const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: to,
        subject: `Email Verification`,
        react: ConfirmEmailTemplate({ url: url }),
    });
    
    const response: EmailResponse = {
        status: error ? false : true,
        message: error ? error.message : 'Email sent successfully',
        error: error ? error.message : undefined,
    }
    
    return response;
}

export async function sendResetPasswordEmail(to: string, url: string): Promise<EmailResponse> {
    const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: to,
        subject: `Reset Password`,
        react: ResetPasswordTemplate({ url: url }),
    });
    
    const response: EmailResponse = {
        status: error ? false : true,
        message: error ? error.message : 'Email sent successfully',
        error: error ? error.message : undefined,
    }
    
    return response;
}

type EmailResponse = {
    status: boolean;
    message: string;
    error?: string;
}