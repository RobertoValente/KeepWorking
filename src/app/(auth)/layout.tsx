import "../../public/globals.css";

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
    description: "",
    keywords: [
        ""
    ],
    alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL!,
        languages: {
            "pt-PT": `${process.env.NEXT_PUBLIC_SITE_URL!}`,
            "en-US": `${process.env.NEXT_PUBLIC_SITE_URL!}`,
        }
    },
    //robots: {},
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