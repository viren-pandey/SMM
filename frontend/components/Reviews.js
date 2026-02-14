"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Reviews() {
    const reviews = [
        { name: "Alex Johnson", role: "Digital Agency CEO", msg: "SmartSMM transformed how we handle client social growth. The API is flawless.", initial: "AJ" },
        { name: "Sarah Chen", role: "SMM Reseller", msg: "Fastest delivery I've ever seen. The margin control system is a game changer for my business.", initial: "SC" },
        { name: "Marcus Thorne", role: "Influencer", msg: "Reliable, secure, and discrete. Best support team in the industry.", initial: "MT" }
    ];

    return (
        <section className="py-24 bg-slate-950">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-white text-center mb-16 underline decoration-blue-500 decoration-4 underline-offset-8">
                    Trusted by 10,000+ Users
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((r, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="p-8 bg-slate-900 border border-slate-800 rounded-2xl relative"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, j) => (
                                    <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-slate-300 italic mb-8 italic">"{r.msg}"</p>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
                                    {r.initial}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">{r.name}</h4>
                                    <p className="text-slate-500 text-sm">{r.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
