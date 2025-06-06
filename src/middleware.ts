import { NextRequest, NextResponse } from "next/server";

//-> Check to verify if runtime: "nodejs" is active on non-canary version:
//  - https://github.com/rudrodip/titan/blob/main/src/middleware.ts

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    console.log("-> Middleware triggered for:", pathname);

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
}