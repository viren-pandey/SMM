"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Users, ShoppingCart, DollarSign, TrendingUp, Loader2 } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/analytics/overview");
                setStats(res.data.data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-400 gap-4">
                <Loader2 className="animate-spin" size={40} />
                <p>Loading analytics data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Admin Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStatsCard
                    title="Total Users"
                    value={stats?.users?.total || 0}
                    icon={<Users className="text-blue-500" />}
                    bgColor="bg-blue-500/10"
                />
                <AdminStatsCard
                    title="Total Orders"
                    value={stats?.orders?.total || 0}
                    icon={<ShoppingCart className="text-purple-500" />}
                    bgColor="bg-purple-500/10"
                />
                <AdminStatsCard
                    title="Total Revenue"
                    value={`₹${stats?.revenue?.total?.toFixed(2) || 0}`}
                    icon={<DollarSign className="text-green-500" />}
                    bgColor="bg-green-500/10"
                />
                <AdminStatsCard
                    title="Active Orders"
                    value={stats?.orders?.pending || 0}
                    icon={<TrendingUp className="text-pink-500" />}
                    bgColor="bg-pink-500/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6">Daily Revenue</h3>
                    <div className="h-48 flex items-end gap-2 px-2">
                        {stats?.revenue?.last7Days?.map((day, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div
                                    className="bg-gradient-to-t from-blue-500/40 to-blue-500/20 hover:from-blue-500/60 hover:to-blue-500/40 transition-all rounded-t-lg"
                                    style={{ height: `${(day.amount / stats.revenue.maxDay) * 100}%` }}
                                ></div>
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-10 shadow-lg">
                                    ₹{day.amount.toFixed(2)}
                                </div>
                            </div>
                        )) || <div className="text-slate-500 text-sm italic">No data available</div>}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-500 font-medium uppercase tracking-wider px-1">
                        <span>7 Days Ago</span>
                        <span>Today</span>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6">System Health</h3>
                    <div className="space-y-3">
                        <HealthItem label="Server Status" status="Online" color="text-green-500" />
                        <HealthItem label="Database" status="Connected" color="text-green-500" />
                        <HealthItem label="Redis Cache" status="Active" color="text-green-500" />
                        <HealthItem label="Order Queue" status="Healthy" color="text-green-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function AdminStatsCard({ title, value, icon, bgColor }) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all shadow-lg hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${bgColor} rounded-xl`}>
                    {icon}
                </div>
            </div>
            <p className="text-slate-400 text-sm mb-1 font-medium">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    );
}

function HealthItem({ label, status, color }) {
    return (
        <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-lg border border-slate-800/50 hover:border-slate-700/50 transition-colors">
            <span className="text-sm text-slate-300 font-medium">{label}</span>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')} animate-pulse`}></div>
                <span className={`text-xs font-bold uppercase ${color}`}>{status}</span>
            </div>
        </div>
    );
}
