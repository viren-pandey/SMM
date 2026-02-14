"use client";
import React, { useState } from "react";
import api from "@/lib/api";
import { CheckCircle2, AlertCircle, Upload } from "lucide-react";

export default function AddFunds() {
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("UPI");
    const [refId, setRefId] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            await api.post("/payments/add-funds", {
                amount: parseFloat(amount),
                paymentMethod: method,
                referenceId: refId
            });
            setMessage({ type: 'success', text: 'Payment proof submitted! Please wait for admin approval.' });
            setAmount("");
            setRefId("");
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Submission failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Add Funds</h1>

            {message && (
                <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500' : 'bg-red-500/10 text-red-500 border border-red-500'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Payment Method</label>
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="UPI">UPI (GPay, PhonePe, Paytm)</option>
                            <option value="Crypto">Cryptocurrency (USDT, BTC)</option>
                            <option value="Bank">Bank Transfer</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Amount (USD)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Min: $10"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Transaction ID / Reference ID</label>
                        <input
                            type="text"
                            value={refId}
                            onChange={(e) => setRefId(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter the ID from your receipt"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 mt-4 shadow-lg shadow-blue-500/20"
                    >
                        {loading ? "Submitting..." : "Submit Payment Proof"}
                    </button>
                </form>

                <div className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
                        <h3 className="text-xl font-bold text-white mb-6">Payment Instructions</h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-blue-400 font-bold mb-2 uppercase text-xs tracking-widest">UPI Details</p>
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 border-dashed">
                                    <p className="text-slate-300 text-sm">VPA: <span className="text-white font-mono">smmpanel@upi</span></p>
                                    <p className="text-slate-500 text-xs mt-1">Accepts GPay, PhonePe, Paytm</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-amber-500 font-bold mb-2 uppercase text-xs tracking-widest">Crypto Details</p>
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 border-dashed">
                                    <p className="text-slate-300 text-sm">USDT (TRC20):</p>
                                    <p className="text-white font-mono text-xs break-all">TJX9vYm87yK6R6..."</p>
                                </div>
                            </div>

                            <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/20">
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    * Balance will be added after manual verification by our staff (usually within 15-30 minutes).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
