"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/auth/register", formData);
            router.push("/login?registered=true");
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                    ></motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>

                        <h2 className="text-3xl font-bold text-white mb-2">Join SmartSMM</h2>
                        <p className="text-slate-400 mb-8 text-sm">Experience the future of social marketing.</p>

                        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-xs">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Username"
                                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Create Password"
                                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
                            >
                                {loading ? "Creating Account..." : "Create Free Account"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
