"use client"

import { createContext } from "react"
import { useTheme } from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 3,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 1,
        },
    },
});

export const AppContext = createContext({
    theme: '' as string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateTheme: (newTheme: string) => {},
});

export function AppContextProvider({ children }: { children: React.ReactNode }) {
    const { theme, setTheme } = useTheme();
    const updateTheme = (newTheme: string) => setTheme(newTheme);

    return (
        <AppContext.Provider value={{
            theme: theme || "system",
            updateTheme,
        }}>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </AppContext.Provider>
    );
}