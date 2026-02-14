"use client";
import useAuthStore from "@/store/authStore";
import useUiStore from "@/store/uiStore";
import { formatCurrency } from "@/utils/currency";

export default function DashboardHome() {
    const { user } = useAuthStore();
    const { currency, exchangeRate } = useUiStore();

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Account Balance" value={formatCurrency(user?.balance || 0, currency, exchangeRate)} color="bg-blue-600" />
                <StatsCard title="Total Orders" value="0" color="bg-purple-600" />
                <StatsCard title="Support Tickets" value="0" color="bg-pink-600" />
            </div>

            <div className="mt-12">
                <h2 className="text-xl font-semibold mb-4">Latest Announcements</h2>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-slate-400">
                    Welcome to SmartSMM! Explore our services and boost your social media presence today.
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, color }) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm mb-1">{title}</p>
            <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-white">{value}</p>
                <div className={`w-2 h-10 ${color} rounded-full`}></div>
            </div>
        </div>
    );
}
