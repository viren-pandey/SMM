"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { Plus, RefreshCcw, Database, Settings } from "lucide-react";

export default function AdminProviders() {
    const [providers, setProviders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newProvider, setNewProvider] = useState({ name: "", apiUrl: "", apiKey: "" });
    const [syncing, setSyncing] = useState(false);

    const fetchProviders = async () => {
        const res = await api.get("/providers");
        setProviders(res.data.data);
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        await api.post("/providers", newProvider);
        setShowModal(false);
        fetchProviders();
    };

    const handleSync = async (id) => {
        setSyncing(true);
        try {
            await api.post(`/providers/${id}/sync`);
            alert("Services synced successfully");
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Providers</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20"
                >
                    <Plus size={20} />
                    Add Provider
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map(p => (
                    <div key={p._id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 rounded-xl">
                                    <Database size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
                                    <p className="text-xs text-slate-500 truncate">{p.apiUrl}</p>
                                </div>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
                                    <span className="text-sm text-slate-400 font-medium">Status</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-green-500 font-bold uppercase text-xs">{p.status}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
                                    <span className="text-sm text-slate-400 font-medium">Balance</span>
                                    <span className="text-white font-mono font-bold">${p.balance.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleSync(p._id)}
                                disabled={syncing}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all text-sm font-medium border border-blue-500/20"
                            >
                                <RefreshCcw size={16} className={syncing ? "animate-spin" : ""} />
                                {syncing ? "Syncing..." : "Sync"}
                            </button>
                            <button className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all">
                                <Settings size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {providers.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                    <Database size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No providers configured yet</p>
                    <p className="text-sm mt-2">Click "Add Provider" to get started</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <form onSubmit={handleAdd} className="bg-slate-900 w-full max-w-md p-8 rounded-xl border border-slate-800 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Add New Provider</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2 font-medium">Provider Name</label>
                                <input
                                    placeholder="e.g., telegram.smm.org"
                                    className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    onChange={e => setNewProvider({ ...newProvider, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2 font-medium">API URL</label>
                                <input
                                    placeholder="https://api.example.com"
                                    className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    onChange={e => setNewProvider({ ...newProvider, apiUrl: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2 font-medium">API Key</label>
                                <input
                                    type="password"
                                    placeholder="Enter API key"
                                    className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    onChange={e => setNewProvider({ ...newProvider, apiKey: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors shadow-lg shadow-blue-500/20"
                            >
                                Add Provider
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
