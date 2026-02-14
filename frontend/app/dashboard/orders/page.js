"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { Search, Filter } from "lucide-react";

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get("/orders");
                setOrders(res.data.data);
            } catch (err) {
                console.error("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-500/10 text-green-500 border-green-500';
            case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500';
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500';
            case 'cancelled':
            case 'refunded': return 'bg-red-500/10 text-red-500 border-red-500';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">My Orders</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition-all">
                        <Filter size={18} />
                        Filter
                    </button>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-800/50">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300">ID</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300">Service</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300">Quantity</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300">Price</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500">Loading orders...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500">No orders found.</td></tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order._id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-slate-400">#{order._id.slice(-6)}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-white">{order.service?.name}</td>
                                    <td className="px-6 py-4 text-sm text-slate-400">{order.quantity}</td>
                                    <td className="px-6 py-4 text-sm text-slate-400">${order.charge.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)} uppercase tracking-wider`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
