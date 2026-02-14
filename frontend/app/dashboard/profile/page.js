"use client";
import React from "react";
import useAuthStore from "@/store/authStore";
import { User, Shield, Key } from "lucide-react";

export default function ProfilePage() {
    const { user } = useAuthStore();

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-blue-600/10 rounded-full">
                            <User className="text-blue-500" size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{user?.username}</h2>
                            <p className="text-slate-400">Account status: <span className="text-green-500 font-medium">Active</span></p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Username</label>
                            <input disabled value={user?.username} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Email Address</label>
                            <input disabled value={user?.email} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-500 outline-none" />
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="text-purple-500" size={24} />
                        <h3 className="text-xl font-bold text-white">Security</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                            <div className="flex items-center gap-3">
                                <Key className="text-slate-400" size={20} />
                                <div>
                                    <p className="text-white font-medium">Password</p>
                                    <p className="text-xs text-slate-400">Update your account password</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-all">
                                Change
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
