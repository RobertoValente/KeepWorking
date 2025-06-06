import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../drizzle/index";
import { account, session, user, verification } from "../drizzle/schema";

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
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }
    },
});