"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { CreditCard, Check, X, Search, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PaymentsAdmin() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPayments = async () => {
        try {
            const res = await api.get("/payments");
            setPayments(res.data.data);
        } catch (err) {
            toast.error("Failed to fetch payments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/payments/${id}/status`, { status });
            toast.success(`Payment ${status}`);
            fetchPayments();
        } catch (err) {
            toast.error("Update failed");
        }
    };

    if (loading) return <div className="text-white">Loading payments...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Payment Requests</h1>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-800/50">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-400">User</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-400">Amount</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-400">Method</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-400">Reference</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-400">Date</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-400">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {payments.map((p) => (
                            <tr key={p._id} className="hover:bg-slate-800/30 transition-colors text-sm">
                                <td className="px-6 py-4">
                                    <div className="text-white font-medium">{p.user?.username || "Unknown"}</div>
                                    <div className="text-xs text-slate-500">{p.user?.email || "N/A"}</div>
                                </td>
                                <td className="px-6 py-4 text-white font-bold">₹{p.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 text-slate-400 uppercase text-xs">{p.paymentMethod}</td>
                                <td className="px-6 py-4 text-slate-400 font-mono text-xs">{p.referenceId}</td>
                                <td className="px-6 py-4 text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${p.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                            p.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                'bg-red-500/10 text-red-500'
                                        }`}>
                                        {p.status === 'pending' && <Clock size={10} />}
                                        {p.status === 'completed' && <CheckCircle size={10} />}
                                        {p.status === 'failed' && <XCircle size={10} />}
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {p.status === 'pending' && (
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleStatusUpdate(p._id, 'completed')}
                                                className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg"
                                                title="Approve"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(p._id, 'failed')}
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                                                title="Reject"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {payments.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        No payment requests found.
                    </div>
                )}
            </div>
        </div>
    );
}
