"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-blue-600 to-purple-700 p-12 rounded-[3rem] shadow-2xl shadow-blue-500/20 relative"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <div className="w-32 h-32 border-4 border-white rounded-full"></div>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Supercharge Your Social Media?</h2>
                    <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
                        Join thousands of satisfied agencies and resellers today. It only takes 60 seconds to get started.
                    </p>

                    <Link
                        href="/register"
                        className="inline-block px-12 py-5 bg-white text-blue-700 font-bold rounded-full hover:bg-slate-100 transition-all text-xl shadow-lg"
                    >
                        Create Your Account
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
