"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import Link from "next/link";
import { LayoutDashboard, ShoppingCart, List, CreditCard, Ticket, Settings, LogOut } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import useUiStore from "@/store/uiStore";
import { formatCurrency } from "@/utils/currency";

export default function DashboardLayout({ children }) {
    const { user, isAuthenticated, loading, loadUser, logout } = useAuthStore();
    const { currency, exchangeRate } = useUiStore();
    const router = useRouter();

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, loading]);

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
                <div className="p-6">
                    <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        SmartSMM
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" href="/dashboard" />
                    <SidebarItem icon={<ShoppingCart size={20} />} label="New Order" href="/dashboard/new-order" />
                    <SidebarItem icon={<List size={20} />} label="My Orders" href="/dashboard/orders" />
                    <SidebarItem icon={<CreditCard size={20} />} label="Add Funds" href="/dashboard/add-funds" />
                    <SidebarItem icon={<Ticket size={20} />} label="Support" href="/dashboard/tickets" />
                    <SidebarItem icon={<Settings size={20} />} label="Profile" href="/dashboard/profile" />
                    {user?.role === 'admin' && (
                        <SidebarItem icon={<Settings size={20} />} label="Admin Panel" href="/admin" />
                    )}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="mb-4 px-2">
                        <p className="text-sm font-medium text-white">{user?.username}</p>
                        <p className="text-xs text-slate-500">{formatCurrency(user?.balance || 0, currency, exchangeRate)}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
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

function SidebarItem({ icon, label, href }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
