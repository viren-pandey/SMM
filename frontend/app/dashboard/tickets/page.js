"use client";
import React from "react";
import { Plus, MessageSquare } from "lucide-react";

export default function TicketsPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Support Tickets</h1>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-semibold">
                    <Plus size={20} />
                    Open New Ticket
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-slate-800 rounded-full mb-4">
                        <MessageSquare size={32} className="text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">No tickets found</h2>
                    <p className="text-slate-400 max-w-sm mx-auto">
                        If you have any issues with your orders or account, please open a support ticket.
                    </p>
                </div>
            </div>
        </div>
    );
}
