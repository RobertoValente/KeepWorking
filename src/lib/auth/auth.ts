import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../drizzle/index";
import { account, session, user, verification } from "../drizzle/schema";
import { sendResetPasswordEmail, sendConfirmEmail } from "@/lib/resend/index";

/**
 * Interesting things to check:
 * - https://www.better-auth.com/docs/plugins/admin
 * - https://www.better-auth.com/docs/plugins/api-key
 * - https://www.better-auth.com/docs/plugins/stripe
 * - https://www.better-auth.com/docs/guides/optimizing-for-performance
 */

export const auth = betterAuth({
    baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
    secret: process.env.BETTER_AUTH_SECRET!,
    database: drizzleAdapter(db, {
        provider: "mysql",
        schema: {
            account, session, user, verification
        }
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
        autoSignIn: true,
        sendResetPassword: async ({ user, url }) => {
            const sentResetPasswordEmail = await sendResetPasswordEmail(user.email, url);
            if(!sentResetPasswordEmail.status) console.error("[ERROR] Email not sent:", sentResetPasswordEmail.error);
        },
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            const sentConfirmEmail = await sendConfirmEmail(user.email, url);
            if(!sentConfirmEmail.status) console.error("[ERROR] Email not sent:", sentConfirmEmail.error);
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }
    },
});