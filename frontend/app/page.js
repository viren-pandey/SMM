"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Reviews from "@/components/Reviews";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import RegisterModal from "@/components/RegisterModal";

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <main className="bg-slate-950 min-h-screen">
            <Navbar setModalOpen={setIsModalOpen} />
            <Hero setModalOpen={setIsModalOpen} />
            <Features />
            <Reviews />
            <CTA />
            <Footer />
            <RegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </main>
    );
}
