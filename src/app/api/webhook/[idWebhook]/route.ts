import { NextRequest, NextResponse } from "next/server";
import { Query } from "@/lib/drizzle/query";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ idWebhook: string }> },
) {
    try {
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: "Too many requests" },
                { status: 429 }
            );
        }

        const webhookId = (await params).idWebhook;
        
        const typeHeader = request.headers.get('X-KEEPWORKING-TYPE') || 'info';
        const typeValidation = sanitizeAndValidate(typeHeader, 32);
        
        if (!typeValidation.isValid) {
            return NextResponse.json(
                { error: "Invalid type header" },
                { status: 400 }
            );
        }

        const body = await request.text();
        const contentValidation = sanitizeAndValidate(body, 5000);
        
        if (!contentValidation.isValid || !contentValidation.sanitized) {
            return NextResponse.json(
                { error: "Invalid or empty content" },
                { status: 400 }
            );
        }

        await Query.createLog({
            content: contentValidation.sanitized,
            type: typeValidation.sanitized,
            webhookId,
            timestamp: new Date(),
        });

        return NextResponse.json(
            { message: "Log created successfully" },
            { status: 201 }
        );

    } catch (error: unknown) {
        console.error("Webhook endpoint error:", error);
        
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 400 }
        );
    }
}

function isRateLimited(ip: string, maxRequests = 100, windowMs = 60000): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);
    
    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
        return false;
    }
    
    if (record.count >= maxRequests) {
        return true;
    }
    
    record.count++;
    return false;
}

function sanitizeAndValidate(input: string, maxLength: number = 1000): { isValid: boolean; sanitized: string } {
    if (!input || typeof input !== 'string') {
        return { isValid: false, sanitized: '' };
    }

    const sanitized = input
        .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
        .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
        .replace(/expression\s*\(/gi, '') // Remove CSS expressions
        .trim();

    if (sanitized.length > maxLength) {
        return { isValid: false, sanitized: sanitized.substring(0, maxLength) };
    }

    return { isValid: true, sanitized };
}