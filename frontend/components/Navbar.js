"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import useUiStore from "@/store/uiStore";
import { Sun, Moon, Globe } from "lucide-react";

export default function Navbar({ setModalOpen }) {
    const [scrolled, setScrolled] = useState(false);
    const { currency, setCurrency, theme, toggleTheme } = useUiStore();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/80 backdrop-blur-md py-4 border-b border-slate-800" : "bg-transparent py-6"}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    SmartSMM
                </Link>

                <div className="hidden md:flex gap-8 items-center text-slate-300 font-medium">
                    <Link href="/services" className="hover:text-blue-400 transition-colors">Services</Link>
                    <Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link>

                    {/* Currency Switcher */}
                    <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-full px-3 py-1">
                        <Globe size={14} className="text-slate-500" />
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="bg-transparent text-xs font-bold text-slate-400 outline-none cursor-pointer"
                        >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>

                    {/* Theme Toggle */}
                    <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-white transition-colors">
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <Link href="/login" className="hover:text-slate-100 transition-colors">Login</Link>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all"
                    >
                        Join Now
                    </button>
                </div>
            </div>
        </nav>
    );
}
