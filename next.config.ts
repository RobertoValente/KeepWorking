import type { NextConfig } from "next";
import { envSchema } from "@/lib/utils";
import { ZodError } from "zod";

const nextConfig: NextConfig = {
    /* config options here */
};

try {
    envSchema.parse(process.env);
} catch (error: unknown) {
    if (error instanceof ZodError) {
        error.errors.forEach((err) => {
            console.error(`[ENV] -> Validation error for: ${err.path} - ${err.message}`);
        });
        process.exit(1);
    }
}

export default nextConfig;