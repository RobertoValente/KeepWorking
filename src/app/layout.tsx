import "@/app/globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/components/ui/theme-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    creator: 'Roberto Valente',
    authors: [{ name: "Roberto Valente", url: "https://robertovalente.pt" }],
    
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
    publisher: "Roberto Valente",
    applicationName: "KeepWorking",
    title: {
        default: "KeepWorking by Roberto",
        template: "%s | KeepWorking",
    },
    description: "Simple and efficient task management and notes app to help you stay organized and focused.",
    keywords: [
        "roberto valente",
        "roberto valente keepworking",
        "keepworking",
        "task management",
        "task app",
        "todo app",
        "productivity",
        "task tracker",
        "notes app",
        "notes management",
        "notes",
    ],
    alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL!,
        languages: {
            "pt-PT": `${process.env.NEXT_PUBLIC_SITE_URL!}`,
            "en-US": `${process.env.NEXT_PUBLIC_SITE_URL!}`,
        }
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-video-preview': -1,
            'max-snippet': -1,
            noimageindex: false,
            'notranslate': false,
        },
    },
    verification: {
        google: 'google-site-verification-code',
    },
    other: {
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'black-translucent',
        'format-detection': 'telephone=no',
    },
    //manifest: "",
    //verification: {},

};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}