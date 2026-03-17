"use client"

import { useFormStore } from "@/store/formStore"
import { submitAnswers } from "@/lib/api"
import { RefreshCcw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function SubmissionStatus() {
    const {
        submissionStatus,
        submissionError,
        setSubmissionStatus,
        formData,
        questions,
        submissionId
    } = useFormStore()

    const handleRetry = async () => {
        if (!submissionId) return

        setSubmissionStatus('submitting')

        // Prepare single-row data: [ID, Timestamp, Answer1, Answer2, ...]
        const timestamp = new Date().toLocaleString()
        const sortedQuestions = [...questions].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))

        const submissionData = [
            submissionId,
            timestamp,
            ...sortedQuestions.map(q => {
                const answerValue = formData[q.id]
                return Array.isArray(answerValue) ? answerValue.join(", ") : String(answerValue || "")
            })
        ]

        try {
            await submitAnswers(submissionId, submissionData)
            setSubmissionStatus('success')
        } catch (error) {
            setSubmissionStatus('error', error instanceof Error ? error.message : 'Retry failed')
        }
    }

    if (submissionStatus === 'idle') return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-8 p-4 rounded-2xl border flex items-center justify-between gap-4"
                style={{
                    backgroundColor: submissionStatus === 'error' ? '#fef2f2' : submissionStatus === 'success' ? '#f0fdf4' : '#f8fafc',
                    borderColor: submissionStatus === 'error' ? '#fee2e2' : submissionStatus === 'success' ? '#dcfce7' : '#e2e8f0',
                }}
            >
                <div className="flex items-center gap-3">
                    {submissionStatus === 'submitting' && (
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    )}
                    {submissionStatus === 'success' && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {submissionStatus === 'error' && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    )}

                    <div className="text-sm">
                        <p className="font-medium text-slate-900">
                            {submissionStatus === 'submitting' && "Saving to Google Sheets..."}
                            {submissionStatus === 'success' && "Saved successfully"}
                            {submissionStatus === 'error' && "Save failed"}
                        </p>
                        {submissionStatus === 'error' && (
                            <p className="text-red-600 text-xs mt-0.5">{submissionError}</p>
                        )}
                        {submissionStatus === 'submitting' && (
                            <p className="text-slate-500 text-xs mt-0.5">Please don't close this window yet.</p>
                        )}
                    </div>
                </div>

                {submissionStatus === 'error' && (
                    <button
                        onClick={handleRetry}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors shadow-sm"
                    >
                        <RefreshCcw className="w-3.5 h-3.5" />
                        Retry
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    )
}
