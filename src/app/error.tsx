"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { AlertCircle, RotateCcw, Home } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 text-center"
            >
                <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-8 text-red-600">
                    <AlertCircle className="w-10 h-10" />
                </div>

                <h1 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Something went wrong!</h1>
                <p className="text-slate-500 leading-relaxed mb-10">
                    We apologized for the inconvenience. An unexpected error occurred while processing your request.
                </p>

                <div className="grid grid-cols-1 gap-4">
                    <button
                        onClick={() => reset()}
                        className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.href = "/"}
                        className="flex items-center justify-center gap-2 py-4 bg-white text-slate-600 border-2 border-slate-100 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <Home className="w-5 h-5" />
                        Go to Homepage
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
