"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { CreditCard, Plus, Edit3, Trash2, Upload, DollarSign, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PaymentProvidersAdmin() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProvider, setEditingProvider] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        type: "manual",
        logo: "",
        minimumAmount: 1,
        maximumAmount: 10000,
        isActive: true,
        instructions: "",
        displayOrder: 0
    });

    const fetchProviders = async () => {
        try {
            const res = await api.get("/payment-providers");
            setProviders(res.data.data);
        } catch (err) {
            toast.error("Failed to fetch providers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    const handleOpenModal = (provider = null) => {
        if (provider) {
            setEditingProvider(provider);
            setFormData({
                name: provider.name,
                type: provider.type,
                logo: provider.logo || "",
                minimumAmount: provider.minimumAmount,
                maximumAmount: provider.maximumAmount,
                isActive: provider.isActive,
                instructions: provider.instructions || "",
                displayOrder: provider.displayOrder
            });
        } else {
            setEditingProvider(null);
            setFormData({
                name: "",
                type: "manual",
                logo: "",
                minimumAmount: 1,
                maximumAmount: 10000,
                isActive: true,
                instructions: "",
                displayOrder: 0
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProvider) {
                await api.put(`/payment-providers/${editingProvider._id}`, formData);
                toast.success("Provider updated");
            } else {
                await api.post("/payment-providers", formData);
                toast.success("Provider created");
            }
            setShowModal(false);
            fetchProviders();
        } catch (err) {
            toast.error(err.response?.data?.message || "Action failed");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this provider?")) return;
        try {
            await api.delete(`/payment-providers/${id}`);
            toast.success("Provider deleted");
            fetchProviders();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const toggleActive = async (provider) => {
        try {
            await api.put(`/payment-providers/${provider._id}`, { isActive: !provider.isActive });
            toast.success("Status updated");
            fetchProviders();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    if (loading) return <div className="text-white">Loading providers...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Payment Providers</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold"
                >
                    <Plus size={20} />
                    Add Provider
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {providers.map(provider => (
                    <div key={provider._id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {provider.logo ? (
                                    <img src={provider.logo} alt={provider.name} className="w-12 h-12 rounded-lg object-cover" />
                                ) : (
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                                        <CreditCard size={24} />
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-lg font-bold text-white">{provider.name}</h3>
                                    <span className="text-xs text-slate-500 uppercase">{provider.type}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleActive(provider)}
                                className={`p-2 rounded-lg ${provider.isActive ? "text-green-500 bg-green-500/10" : "text-gray-500 bg-gray-500/10"}`}
                            >
                                {provider.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                            </button>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-slate-400">
                                <span>Min Amount:</span>
                                <span className="text-white font-semibold">${provider.minimumAmount}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Max Amount:</span>
                                <span className="text-white font-semibold">${provider.maximumAmount}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Status:</span>
                                <span className={provider.isActive ? "text-green-500" : "text-gray-500"}>
                                    {provider.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-800">
                            <button
                                onClick={() => handleOpenModal(provider)}
                                className="flex-1 p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg flex items-center justify-center gap-2"
                            >
                                <Edit3 size={18} />
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(provider._id)}
                                className="flex-1 p-2 text-red-500 hover:bg-red-500/10 rounded-lg flex items-center justify-center gap-2"
                            >
                                <Trash2 size={18} />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <form onSubmit={handleSubmit} className="bg-slate-900 w-full max-w-2xl p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
                        <h2 className="text-2xl font-bold text-white">{editingProvider ? "Edit Provider" : "Add Payment Provider"}</h2>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-400">Provider Name</label>
                                <input
                                    required
                                    className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-blue-500"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-400">Type</label>
                                <select
                                    className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-blue-500"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="manual">Manual</option>
                                    <option value="stripe">Stripe</option>
                                    <option value="paypal">PayPal</option>
                                    <option value="crypto">Crypto</option>
                                    <option value="razorpay">Razorpay</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400">Logo URL</label>
                            <input
                                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-blue-500"
                                placeholder="https://example.com/logo.png"
                                value={formData.logo}
                                onChange={e => setFormData({ ...formData, logo: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-400">Minimum Amount ($)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-blue-500"
                                    value={formData.minimumAmount}
                                    onChange={e => setFormData({ ...formData, minimumAmount: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-400">Maximum Amount ($)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-blue-500"
                                    value={formData.maximumAmount}
                                    onChange={e => setFormData({ ...formData, maximumAmount: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400">Instructions (for manual payments)</label>
                            <textarea
                                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-blue-500 h-24 resize-none"
                                placeholder="Enter payment instructions..."
                                value={formData.instructions}
                                onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isActive"
                                className="w-5 h-5"
                                checked={formData.isActive}
                                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                            />
                            <label htmlFor="isActive" className="text-white">Active</label>
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" className="flex-1 py-3 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-700">
                                {editingProvider ? "Update Provider" : "Add Provider"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-6 py-3 bg-slate-800 rounded-xl text-white hover:bg-slate-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
