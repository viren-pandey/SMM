"use client";
import React from "react";
import useUiStore from "@/store/uiStore";
import { Sun, Moon, Globe } from "lucide-react";

export default function DashboardHeader() {
    const { currency, setCurrency, theme, toggleTheme } = useUiStore();

    return (
        <div className="flex justify-end items-center gap-6 mb-8 px-2 py-4">
            {/* Currency Switcher */}
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 shadow-sm">
                <Globe size={16} className="text-slate-500" />
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-slate-300 outline-none cursor-pointer hover:text-white transition-colors"
                >
                    <option value="INR" className="bg-slate-900">INR (₹)</option>
                    <option value="USD" className="bg-slate-900">USD ($)</option>
                </select>
            </div>

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="p-2.5 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white hover:border-slate-700 transition-all shadow-sm"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>
    );
}
