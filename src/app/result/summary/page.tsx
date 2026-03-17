"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useFormStore } from "@/store/formStore"
import { CheckCircle2, RotateCcw, HelpCircle } from "lucide-react"
import { useFormGuard } from "@/hooks/useFormGuard"
import { useMemo, useEffect } from "react"
import { SubmissionStatus } from "@/components/SubmissionStatus"



export default function SummaryPage() {
    const isReady = useFormGuard(999) // 999 for result summary
    const router = useRouter()
    const { formData, resetForm, questions, setIsSubmitted } = useFormStore()

    useEffect(() => {
        setIsSubmitted(true)
    }, [setIsSubmitted])

    const handleRestart = () => {

        resetForm()
        router.push("/")
    }

    const groupedAnswers = useMemo(() => {
        const groups: Record<number, any[]> = {}
        questions.forEach(q => {
            if (!groups[q.step]) groups[q.step] = []
            groups[q.step].push({
                question: q,
                answer: formData[q.id]
            })
        })
        return groups
    }, [questions, formData])

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
                    {Object.entries(groupedAnswers).sort(([a], [b]) => Number(a) - Number(b)).map(([step, qAnswers]) => (
                        <motion.div key={step} variants={item} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                                    {step}
                                </span>
                                Step {step}
                            </h2>
                            <div className="space-y-6">
                                {qAnswers.map(({ question, answer }) => (
                                    <div key={question.id} className="space-y-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{question.question}</p>
                                        <div className="text-slate-900 font-medium">
                                            {Array.isArray(answer) ? (
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {answer.map((val: string) => (
                                                        <span key={val} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                                                            {val}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p>{answer || <span className="text-slate-400 italic">No answer provided</span>}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}

                    <motion.div variants={item} className="pt-4 flex flex-col items-center gap-6">
                        <SubmissionStatus />

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

