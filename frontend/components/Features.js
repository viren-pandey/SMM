"use client";
import { motion } from "framer-motion";
import { Code, Zap, Shield, Globe } from "lucide-react";

export default function Features() {
    const features = [
        {
            title: "Lightning Fast Delivery",
            desc: "Our automated system processes orders in milliseconds, ensuring your social growth never waits.",
            icon: <Zap className="text-yellow-400" />,
            code: "const delivery = await smartSMM.ship({ speed: 'instant' });"
        },
        {
            title: "Enterprise Security",
            desc: "Bank-grade encryption and secure payment gateways protect your data and transactions 24/7.",
            icon: <Shield className="text-blue-400" />,
            code: "auth.verify({ rbac: true, encryption: 'AES-256' });"
        },
        {
            title: "Developer First API",
            desc: "Robust API documentation and easy integration for resellers and custom board builders.",
            icon: <Code className="text-purple-400" />,
            code: "GET /v1/services?key=YOUR_API_KEY"
        },
        {
            title: "Global Reach",
            desc: "Access services for every major platform worldwide, from Instagram to Telegram and beyond.",
            icon: <Globe className="text-green-400" />,
            code: "regions.map(r => r.enableServices());"
        }
    ];

    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        Built for Scale & Performance
                    </motion.h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Experience the most advanced SMM infrastructure designed for professionals and high-volume resellers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-8 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-blue-500/50 transition-all relative overflow-hidden"
                        >
                            <div className="flex gap-6 items-start">
                                <div className="p-4 bg-slate-800 rounded-2xl group-hover:bg-blue-600/10 transition-colors">
                                    {f.icon}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-3">{f.title}</h3>
                                    <p className="text-slate-400 leading-relaxed mb-6">{f.desc}</p>

                                    {/* Floating Code Snippet */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        className="bg-black/50 p-4 rounded-xl border border-slate-800 font-mono text-xs text-blue-400"
                                    >
                                        {f.code}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
