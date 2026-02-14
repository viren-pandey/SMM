"use client";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/store/authStore";
import Link from "next/link";
import { Users, Database, Layers, CreditCard, FileText, ChevronLeft, LogOut, Ticket, Wallet, LayoutDashboard } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";

export default function AdminLayout({ children }) {
    const { user, isAuthenticated, loading, loadUser, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        if (!loading) {
            console.log('Admin Access Check:', { isAuthenticated, role: user?.role });
            if (!isAuthenticated || user?.role !== 'admin') {
                console.log('Redirecting to dashboard: Not an admin');
                router.push("/dashboard");
            }
        }
    }, [isAuthenticated, loading, user]);

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shadow-xl">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <Link href="/dashboard" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                        <ChevronLeft size={20} />
                    </Link>
                    <span className="text-xl font-bold text-white">Admin Panel</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    <AdminSidebarItem icon={<LayoutDashboard size={20} />} label="Overview" href="/admin" pathname={pathname} />
                    <AdminSidebarItem icon={<Users size={20} />} label="Users" href="/admin/users" pathname={pathname} />
                    <AdminSidebarItem icon={<Layers size={20} />} label="Services" href="/admin/services" pathname={pathname} />
                    <AdminSidebarItem icon={<Database size={20} />} label="Providers" href="/admin/providers" pathname={pathname} />
                    <AdminSidebarItem icon={<CreditCard size={20} />} label="Payments" href="/admin/payments" pathname={pathname} />
                    <AdminSidebarItem icon={<Wallet size={20} />} label="Payment Methods" href="/admin/payment-providers" pathname={pathname} />
                    <AdminSidebarItem icon={<FileText size={20} />} label="Blogs" href="/admin/blogs" pathname={pathname} />
                    <AdminSidebarItem icon={<Ticket size={20} />} label="Tickets" href="/admin/tickets" pathname={pathname} />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all font-medium"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
                <DashboardHeader />
                {children}
            </main>
        </div>
    );
}

function AdminSidebarItem({ icon, label, href, pathname }) {
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive
                    ? 'bg-blue-500/10 text-blue-400 border-l-4 border-blue-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border-l-4 border-transparent'
                }`}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
