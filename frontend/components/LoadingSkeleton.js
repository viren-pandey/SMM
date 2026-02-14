"use client";

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function LoadingSkeleton({ className }) {
    return (
        <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className={twMerge(
                'bg-white/5 rounded-lg w-full h-8',
                className
            )}
        />
    );
}

export function OrderRowSkeleton() {
    return (
        <div className="flex items-center space-x-4 p-4 border-b border-white/5">
            <LoadingSkeleton className="w-12 h-4" />
            <LoadingSkeleton className="flex-1 h-4" />
            <LoadingSkeleton className="w-24 h-4" />
            <LoadingSkeleton className="w-20 h-6 rounded-full" />
        </div>
    );
}
