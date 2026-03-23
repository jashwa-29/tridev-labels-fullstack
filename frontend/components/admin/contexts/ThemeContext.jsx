"use client";
import { createContext, useContext, useEffect, useState } from "react";

const initialState = {
    theme: "light",
    setTheme: () => null,
};

export const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({ children, defaultTheme = "light", storageKey = "admin-theme", ...props }) {
    const [theme, setTheme] = useState(defaultTheme);

    useEffect(() => {
        const stored = (typeof window !== "undefined" ? localStorage.getItem(storageKey) : null);
        if (stored) setTheme(stored);
    }, [storageKey]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.classList.add(systemTheme);
            return;
        }
        root.classList.add(theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
};







