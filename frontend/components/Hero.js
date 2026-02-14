"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero({ setModalOpen }) {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-950">
            {/* Background blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 text-center px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
                >
                    Scale Your Presence <br /> with SmartSMM
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-6 text-xl text-slate-400 max-w-2xl mx-auto"
                >
                    The most reliable, enterprise-grade SMM panel with 24/7 support and
                    lightning-fast delivery for all your social needs.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <button
                        onClick={() => setModalOpen(true)}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-blue-500/30 font-bold"
                    >
                        Get Started Now
                    </button>
                    <Link href="/services" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-semibold transition-all border border-slate-700 flex items-center justify-center font-bold">
                        View Services
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
