"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function NewOrder() {
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedService, setSelectedService] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await api.get("/services/categories");
            setCategories(res.data.data);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            const fetchServices = async () => {
                const res = await api.get("/services");
                const filtered = res.data.data.filter(s => s.category._id === selectedCategory);
                setServices(filtered);
            };
            fetchServices();
        }
    }, [selectedCategory]);

    const handleServiceChange = (e) => {
        const svc = services.find(s => s._id === e.target.value);
        setSelectedService(svc);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            await api.post("/orders", {
                serviceId: selectedService._id,
                link,
                quantity: parseInt(quantity)
            });
            setMessage({ type: 'success', text: 'Order placed successfully!' });
            setQuantity("");
            setLink("");
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Order failed' });
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = selectedService ? (selectedService.sellingPrice * (parseInt(quantity || 0) / 1000)).toFixed(4) : "0.00";

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Place New Order</h1>

            {message && (
                <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500' : 'bg-red-500/10 text-red-500 border border-red-500'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Category</label>
                        <select
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            value={selectedCategory}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Service</label>
                        <select
                            onChange={handleServiceChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Service</option>
                            {services.map(svc => (
                                <option key={svc._id} value={svc._id}>{svc.name} - ${svc.sellingPrice} per 1k</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Link</label>
                        <input
                            type="url"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Quantity</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Min: ${selectedService?.minOrder || 1} - Max: ${selectedService?.maxOrder || 10000}`}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !selectedService}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 mt-4 shadow-lg shadow-blue-500/20"
                    >
                        {loading ? "Processing..." : `Place Order (Total: $${totalPrice})`}
                    </button>
                </form>

                <div className="space-y-6">
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                        <h3 className="text-lg font-semibold text-white mb-4">Service Details</h3>
                        {selectedService ? (
                            <div className="space-y-3 text-sm">
                                <DetailItem label="Min Order" value={selectedService.minOrder} />
                                <DetailItem label="Max Order" value={selectedService.maxOrder} />
                                <DetailItem label="Price per 1k" value={`$${selectedService.sellingPrice}`} />
                                <div className="pt-3">
                                    <p className="text-slate-500 text-xs mb-1">Description</p>
                                    <p className="text-slate-300 leading-relaxed">{selectedService.description || "No description available."}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm text-center py-4">Select a service to see details</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value }) {
    return (
        <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded-lg">
            <span className="text-slate-400 font-medium">{label}</span>
            <span className="text-white font-bold">{value}</span>
        </div>
    );
}
