"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { User, Shield, ShieldOff, Ban, CheckCircle, Search, Mail, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "react-hot-toast";

export default function UsersAdmin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users");
            setUsers(res.data.data);
        } catch (err) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleUpdate = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            await api.put(`/users/${userId}`, { role: newRole });
            toast.success(`User role updated to ${newRole}`);
            fetchUsers();
        } catch (err) {
            toast.error("Failed to update role");
        }
    };

    const handleBanToggle = async (userId, currentBanStatus) => {
        try {
            await api.put(`/users/${userId}`, { isBanned: !currentBanStatus });
            toast.success(currentBanStatus ? "User unbanned" : "User banned");
            fetchUsers();
        } catch (err) {
            toast.error("Failed to update ban status");
        }
    };

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-white">Loading users...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Users</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="ID or login"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors w-64"
                        />
                    </div>
                    <button className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                        Export
                    </button>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/50">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Discount & Prices</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Referrals</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Spent</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Balance</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{user.username}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                                        Set
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-sm">
                                    —
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-slate-300 text-sm">
                                        <TrendingUp size={14} className="text-green-500" />
                                        $0
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-slate-300 text-sm font-medium">
                                        <DollarSign size={14} className="text-blue-500" />
                                        ${user.balance?.toFixed(2) || '0.00'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleRoleUpdate(user._id, user.role)}
                                            className={`p-2 rounded-lg transition-all ${user.role === 'admin'
                                                ? 'text-yellow-500 hover:bg-yellow-500/10'
                                                : 'text-purple-500 hover:bg-purple-500/10'
                                                }`}
                                            title={user.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                                        >
                                            {user.role === 'admin' ? <ShieldOff size={18} /> : <Shield size={18} />}
                                        </button>
                                        <button
                                            onClick={() => handleBanToggle(user._id, user.isBanned)}
                                            className={`p-2 rounded-lg transition-all ${user.isBanned
                                                ? 'text-green-500 hover:bg-green-500/10'
                                                : 'text-red-500 hover:bg-red-500/10'
                                                }`}
                                            title={user.isBanned ? "Unban User" : "Ban User"}
                                        >
                                            {user.isBanned ? <CheckCircle size={18} /> : <Ban size={18} />}
                                        </button>
                                        <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="1" />
                                                <circle cx="12" cy="5" r="1" />
                                                <circle cx="12" cy="19" r="1" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    No users found matching your search.
                </div>
            )}
        </div>
    );
}
