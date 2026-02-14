"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Ticket, MessageSquare, Clock, CheckCircle, XCircle, Search, Plus, Send } from "lucide-react";
import { toast } from "react-hot-toast";

export default function TicketsAdmin() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyMessage, setReplyMessage] = useState("");

    const fetchTickets = async () => {
        try {
            const res = await api.get("/tickets");
            setTickets(res.data.data);
        } catch (err) {
            toast.error("Failed to fetch tickets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/tickets/${id}/status`, { status });
            toast.success("Status updated");
            fetchTickets();
            if (selectedTicket?._id === id) {
                setSelectedTicket({ ...selectedTicket, status });
            }
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;

        try {
            await api.post(`/tickets/${selectedTicket._id}/reply`, { message: replyMessage });
            toast.success("Reply sent");
            setReplyMessage("");
            fetchTickets();
            // Refresh selected ticket
            const res = await api.get(`/tickets/${selectedTicket._id}`);
            setSelectedTicket(res.data.data);
        } catch (err) {
            toast.error("Failed to send reply");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this ticket?")) return;
        try {
            await api.delete(`/tickets/${id}`);
            toast.success("Ticket deleted");
            fetchTickets();
            if (selectedTicket?._id === id) {
                setSelectedTicket(null);
            }
        } catch (err) {
            toast.error("Failed to delete ticket");
        }
    };

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.user?.username?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || t.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "open": return "text-blue-500 bg-blue-500/10";
            case "answered": return "text-yellow-500 bg-yellow-500/10";
            case "closed": return "text-gray-500 bg-gray-500/10";
            default: return "text-slate-500 bg-slate-500/10";
        }
    };

    if (loading) return <div className="text-white">Loading tickets...</div>;

    return (
        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
            {/* Ticket List */}
            <div className="col-span-1 space-y-4 overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
                </div>

                <div className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl text-white p-2 focus:outline-none focus:border-blue-500"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="answered">Answered</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                <div className="space-y-2">
                    {filteredTickets.map(ticket => (
                        <div
                            key={ticket._id}
                            onClick={() => setSelectedTicket(ticket)}
                            className={`p-4 rounded-xl cursor-pointer transition-all ${selectedTicket?._id === ticket._id
                                ? "bg-blue-500/20 border-blue-500"
                                : "bg-slate-900 border-slate-800 hover:border-slate-700"
                                } border`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-bold text-white text-sm">{ticket.subject}</h3>
                                    <p className="text-xs text-slate-500 mt-1">{ticket.user?.username}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-lg ${getStatusColor(ticket.status)}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                <MessageSquare size={14} />
                                <span>{ticket.messages?.length || 0} messages</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ticket Detail */}
            <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
                {selectedTicket ? (
                    <>
                        <div className="flex justify-between items-start pb-4 border-b border-slate-800">
                            <div>
                                <h2 className="text-xl font-bold text-white">{selectedTicket.subject}</h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    {selectedTicket.user?.username} • {new Date(selectedTicket.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    className="bg-slate-800 border border-slate-700 rounded-lg text-white px-3 py-1 text-sm"
                                    value={selectedTicket.status}
                                    onChange={(e) => handleStatusChange(selectedTicket._id, e.target.value)}
                                >
                                    <option value="open">Open</option>
                                    <option value="answered">Answered</option>
                                    <option value="closed">Closed</option>
                                </select>
                                <button
                                    onClick={() => handleDelete(selectedTicket._id)}
                                    className="px-3 py-1 bg-red-500/10 text-red-500 rounded-lg text-sm hover:bg-red-500/20"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto py-4 space-y-4">
                            {selectedTicket.messages?.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender._id === selectedTicket.user._id ? "justify-start" : "justify-end"}`}>
                                    <div className={`max-w-[70%] p-3 rounded-xl ${msg.sender._id === selectedTicket.user._id
                                        ? "bg-slate-800 text-white"
                                        : "bg-blue-500 text-white"
                                        }`}>
                                        <p className="text-xs font-semibold mb-1">{msg.sender.username}</p>
                                        <p className="text-sm">{msg.message}</p>
                                        <p className="text-xs opacity-70 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Form */}
                        <form onSubmit={handleReply} className="pt-4 border-t border-slate-800">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type your reply..."
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2"
                                >
                                    <Send size={18} />
                                    Send
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500">
                        <div className="text-center">
                            <Ticket size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Select a ticket to view details</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
