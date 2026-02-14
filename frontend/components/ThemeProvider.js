"use client";
import React, { useEffect } from "react";
import useUiStore from "@/store/uiStore";

export default function ThemeProvider({ children }) {
    const { theme } = useUiStore();

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'light') {
            root.classList.remove('dark');
            root.classList.add('light');
        } else {
            root.classList.remove('light');
            root.classList.add('dark');
        }
    }, [theme]);

    return (
        <div className={theme}>
            {children}
        </div>
    );
}
