import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

//-> Check to verify if runtime: "nodejs" is active on non-canary version:
//  - https://github.com/rudrodip/titan/blob/main/src/middleware.ts

const authRoutes = ["/sign-in", "/sign-up"];
const protectedRoutes = ["/home"];

export function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const { pathname } = request.nextUrl;

    if(sessionCookie && authRoutes.some(authRoute => pathname.startsWith(authRoute))) {
        return NextResponse.redirect(new URL("/home", request.url));
    }

    if(!sessionCookie && protectedRoutes.some(protectedRoute => pathname.startsWith(protectedRoute))) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
}