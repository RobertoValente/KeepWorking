"use client"

import { createContext } from "react"
import { useTheme } from "next-themes"

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
            {children}
        </AppContext.Provider>
    );
}