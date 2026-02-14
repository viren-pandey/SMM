"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { FileText, Plus, Trash2, Edit3, Eye, Search, Save, X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function BlogsAdmin() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        excerpt: "",
        tags: "",
        status: "draft"
    });

    const fetchBlogs = async () => {
        try {
            const res = await api.get("/blogs");
            // API returns { success, message, data: blogs }
            setBlogs(res.data.data);
        } catch (err) {
            toast.error("Failed to fetch blogs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleOpenModal = (blog = null) => {
        if (blog) {
            setEditingBlog(blog);
            setFormData({
                title: blog.title,
                content: blog.content,
                excerpt: blog.excerpt || "",
                tags: blog.tags?.join(", ") || "",
                status: blog.status
            });
        } else {
            setEditingBlog(null);
            setFormData({
                title: "",
                content: "",
                excerpt: "",
                tags: "",
                status: "draft"
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean)
        };

        try {
            if (editingBlog) {
                await api.put(`/blogs/${editingBlog._id}`, payload);
                toast.success("Blog updated");
            } else {
                await api.post("/blogs", payload);
                toast.success("Blog created");
            }
            setShowModal(false);
            fetchBlogs();
        } catch (err) {
            toast.error(err.response?.data?.message || "Action failed");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/blogs/${id}`);
            toast.success("Blog deleted");
            fetchBlogs();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const filteredBlogs = blogs.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-white">Loading blogs...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Blog Management</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold transition-all"
                    >
                        <Plus size={20} />
                        New Post
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredBlogs.map(blog => (
                    <div key={blog._id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{blog.title}</h3>
                                <div className="flex gap-3 text-xs text-slate-500 mt-1">
                                    <span className="uppercase tracking-widest">{blog.status}</span>
                                    <span>•</span>
                                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{blog.views} views</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleOpenModal(blog)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg">
                                <Edit3 size={20} />
                            </button>
                            <button onClick={() => handleDelete(blog._id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <form onSubmit={handleSubmit} className="bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">{editingBlog ? "Edit Blog" : "New Blog Post"}</h2>
                            <button type="button" onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400">Title</label>
                            <input
                                required
                                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-blue-500"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400">Excerpt</label>
                            <textarea
                                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-blue-500 h-20 resize-none"
                                value={formData.excerpt}
                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400">Content (Markdown)</label>
                            <textarea
                                required
                                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-blue-500 h-64 font-mono"
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-400">Tags (comma separated)</label>
                                <input
                                    className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-blue-500"
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-400">Status</label>
                                <select
                                    className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-blue-500"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-700 transition-all">
                            {editingBlog ? "Update Post" : "Publish Post"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
