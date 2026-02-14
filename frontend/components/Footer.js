"use client";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-slate-900 py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                            SmartSMM
                        </Link>
                        <p className="mt-4 text-slate-500 text-sm leading-relaxed">
                            Leading the industry with premium social media marketing solutions since 2020.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Platform</h4>
                        <ul className="space-y-4 text-slate-500 text-sm">
                            <li><Link href="/services" className="hover:text-blue-400 transition-colors">Services</Link></li>
                            <li><Link href="/api" className="hover:text-blue-400 transition-colors">API Docs</Link></li>
                            <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Our Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Support</h4>
                        <ul className="space-y-4 text-slate-500 text-sm">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Knowledge Base</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Ticket System</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Legal</h4>
                        <ul className="space-y-4 text-slate-500 text-sm">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Refund Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-900 flex flex-col md:row justify-between items-center text-slate-600 text-xs">
                    <p>© 2026 SmartSMM Panel. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <span>Built with 💙 by Antigravity</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
