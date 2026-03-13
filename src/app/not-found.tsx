"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { FileQuestion, Home } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 text-center"
            >
                <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 text-blue-600">
                    <FileQuestion className="w-10 h-10" />
                </div>

                <h1 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Page Not Found</h1>
                <p className="text-slate-500 leading-relaxed mb-10">
                    The page you are looking for doesn't exist or has been moved to another location.
                </p>

                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-xl"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </Link>
            </motion.div>
        </div>
    )
}
