"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useFormStore } from "@/store/formStore"
import { CheckCircle2, User, Mail, Briefcase, MapPin, FileText, Target, Award, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFormGuard } from "@/hooks/useFormGuard"

export default function SummaryPage() {
    const isReady = useFormGuard(6) // 6 for result
    const router = useRouter()
    const { formData, resetForm } = useFormStore()

    const handleRestart = () => {
        resetForm()
        router.push("/")
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    if (!isReady) return null

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                <div className="flex flex-col items-center mb-10 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-4"
                    >
                        <CheckCircle2 className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-slate-900">Submission Summary</h1>
                    <p className="text-slate-500 mt-2">Here is a review of all the information you provided.</p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 gap-6"
                >
                    {/* Personal Info */}
                    <motion.div variants={item} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                <User className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Name</p>
                                <p className="text-slate-900 font-medium">{formData.name || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</p>
                                <p className="text-slate-900 font-medium">{formData.email || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role</p>
                                <p className="text-slate-900 font-medium">{formData.role || "N/A"}</p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Location */}
                        <motion.div variants={item} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800">Work Location</h2>
                            </div>
                            <p className="text-slate-900 font-medium bg-slate-50 px-4 py-2 rounded-xl inline-block">
                                {formData.location || "N/A"}
                            </p>
                        </motion.div>

                        {/* Final Choice */}
                        <motion.div variants={item} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                    <Award className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800">Final Outcome</h2>
                            </div>
                            <div className={cn(
                                "px-4 py-2 rounded-xl inline-flex items-center gap-2 font-bold",
                                formData.finalChoice === "Success"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-700"
                            )}>
                                <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    formData.finalChoice === "Success" ? "bg-green-600" : "bg-red-600"
                                )} />
                                {formData.finalChoice || "N/A"}
                            </div>
                        </motion.div>
                    </div>

                    {/* Reading Comprehension */}
                    <motion.div variants={item} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Comprehension Answer</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                            "{formData.answer || "No answer provided."}"
                        </p>
                    </motion.div>

                    {/* Improvements */}
                    <motion.div variants={item} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                <Target className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Focus Areas</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {formData.improvements?.length ? (
                                formData.improvements.map((improvement) => (
                                    <span
                                        key={improvement}
                                        className="px-4 py-2 bg-blue-50 text-blue-700 font-bold rounded-xl text-sm border border-blue-100"
                                    >
                                        {improvement}
                                    </span>
                                ))
                            ) : (
                                <p className="text-slate-400 italic">No areas selected.</p>
                            )}
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="pt-4 flex justify-center">
                        <button
                            onClick={handleRestart}
                            className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all active:scale-95 group"
                        >
                            <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            Restart Form
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            <p className="text-center mt-12 text-slate-400 text-sm font-medium">
                © 2026 QuestionFlow • Production Ready
            </p>
        </div>
    )
}
