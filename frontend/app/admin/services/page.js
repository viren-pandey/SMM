"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Layers, Edit3, Trash2, Search, Filter, Save, X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ServicesAdmin() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ margin: 0, status: "active" });

    const fetchServices = async () => {
        try {
            const res = await api.get("/services");
            setServices(res.data.data);
        } catch (err) {
            toast.error("Failed to fetch services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleEdit = (service) => {
        setEditingId(service._id);
        setEditForm({
            percentMargin: service.percentMargin,
            fixedMargin: service.fixedMargin,
            status: service.status
        });
    };

    const handleUpdate = async (id) => {
        try {
            await api.put(`/services/${id}`, editForm);
            toast.success("Service updated");
            setEditingId(null);
            fetchServices();
        } catch (err) {
            toast.error("Update failed");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        try {
            await api.delete(`/services/${id}`);
            toast.success("Service deleted");
            fetchServices();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-white">Loading services...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Service Management</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-800/50">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-400">Service Name</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-400">Category</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-400">Core Price</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-400">Margin (%)</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-400">Final Price</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-400">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredServices.map((service) => (
                            <tr key={service._id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-500">
                                            <Layers size={16} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-white max-w-xs truncate" title={service.name}>{service.name}</div>
                                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">{service.provider?.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-sm">
                                    {service.category?.name || "Uncategorized"}
                                </td>
                                <td className="px-6 py-4 text-slate-400 font-mono text-sm">
                                    ₹{service.providerRate.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    {editingId === service._id ? (
                                        <div className="flex flex-col gap-1">
                                            <input
                                                type="number"
                                                value={editForm.percentMargin}
                                                onChange={(e) => setEditForm({ ...editForm, percentMargin: parseFloat(e.target.value) })}
                                                className="w-20 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-white text-xs"
                                                placeholder="%"
                                            />
                                            <input
                                                type="number"
                                                value={editForm.fixedMargin}
                                                onChange={(e) => setEditForm({ ...editForm, fixedMargin: parseFloat(e.target.value) })}
                                                className="w-20 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-white text-xs"
                                                placeholder="Fixed"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-xs">
                                            <div className="text-blue-400 font-bold">{service.percentMargin}%</div>
                                            <div className="text-slate-500">+ ₹{service.fixedMargin}</div>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-white font-bold text-sm">
                                    ₹{service.sellingPrice.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    {editingId === service._id ? (
                                        <select
                                            value={editForm.status}
                                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                            className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-white text-sm outline-none"
                                        >
                                            <option value="active">Active</option>
                                            <option value="disabled">Disabled</option>
                                        </select>
                                    ) : (
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${service.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                            }`}>
                                            {service.status}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {editingId === service._id ? (
                                            <>
                                                <button onClick={() => handleUpdate(service._id)} className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg">
                                                    <Save size={18} />
                                                </button>
                                                <button onClick={() => setEditingId(null)} className="p-2 text-slate-400 hover:bg-slate-500/10 rounded-lg">
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(service)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg">
                                                    <Edit3 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(service._id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
