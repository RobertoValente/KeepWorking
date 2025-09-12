import type { NextConfig } from "next";
import { z, ZodError } from "zod";

const nextConfig: NextConfig = {
    /* config options here */
};

try {
    z.object({
        NEXT_PUBLIC_SITE_URL: z.string().min(1),
        DATABASE_URL: z.string().min(1),
        BETTER_AUTH_SECRET: z.string().min(1),
        GITHUB_CLIENT_ID: z.string().min(1),
        GITHUB_CLIENT_SECRET: z.string().min(1),
    }).parse(process.env);
} catch (error: unknown) {
    if (error instanceof ZodError) {
        error.errors.forEach((err) => {
            console.error(`[ENV] -> Validation error for: ${err.path} - ${err.message}`);
        });
        process.exit(1);
    }
}

export default nextConfig;