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
            console.log(`[LOGS] Rate limit exceeded for IP: ${ip}`);
            return NextResponse.json(
                { error: "Too many requests" },
                { status: 429 }
            );
        }

        const webhookId = (await params).idWebhook;
        
        const typeHeader = request.headers.get('X-KEEPWORKING-TYPE');
        const body = await request.text();

        if (typeHeader) {
            //-> Header exists - save request body as object with title and description
            const typeValidation = sanitizeAndValidate(typeHeader, 32);
            
            if (!typeValidation.isValid) {
                console.log(`[LOGS] Invalid type header`);
                return NextResponse.json(
                    { error: "Invalid type header" },
                    { status: 400 }
                );
            }

            let parsedBody;
            try {
                parsedBody = JSON.parse(body);
            } catch {
                console.log(`[LOGS] Invalid JSON in request body`);
                return NextResponse.json(
                    { error: "Invalid JSON in request body" },
                    { status: 400 }
                );
            }

            if (!parsedBody.title || !parsedBody.description) {
                console.log(`[LOGS] Missing title or description in request body`);
                return NextResponse.json(
                    { error: "Missing title or description in request body" },
                    { status: 400 }
                );
            }

            const titleValidation = sanitizeAndValidate(parsedBody.title, 200);
            const descriptionValidation = sanitizeAndValidate(parsedBody.description, 2000);

            if (!titleValidation.isValid || !descriptionValidation.isValid) {
                console.log(`[LOGS] Invalid title or description content`);
                return NextResponse.json(
                    { error: "Invalid title or description content" },
                    { status: 400 }
                );
            }

            await Query.createLog({
                content: JSON.stringify({
                    title: titleValidation.sanitized,
                    description: descriptionValidation.sanitized
                }),
                type: typeValidation.sanitized,
                webhookId,
                timestamp: new Date(),
            });
        } else {
            //-> Header doesn't exist - save whole body as content with type 'external'
            const contentValidation = sanitizeAndValidate(body, 5000);
            
            if (!contentValidation.isValid || !contentValidation.sanitized) {
                console.log(`[LOGS] Invalid or empty content`);
                return NextResponse.json(
                    { error: "Invalid or empty content" },
                    { status: 400 }
                );
            }

            await Query.createLog({
                content: contentValidation.sanitized,
                type: 'external',
                webhookId,
                timestamp: new Date(),
            });
        }

        console.log(`[LOGS] Log created successfully`);
        return NextResponse.json(
            { message: "Log created successfully" },
            { status: 201 }
        );

    } catch (error: unknown) {
        console.log(`[LOGS] Webhook endpoint error: ${error}`);
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