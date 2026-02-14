import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Premium SMM Panel | Social Media Marketing",
    description: "Enterprise-Grade Social Media Marketing Panel.",
};

import ThemeProvider from "@/components/ThemeProvider";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
