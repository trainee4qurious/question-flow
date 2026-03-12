"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { step5Schema } from "@/validations/schema"
import { useFormStore } from "@/store/formStore"
import { Step5Data } from "@/types/formTypes"
import { StepLayout } from "@/components/StepLayout"
import { RadioGroup } from "@/components/RadioGroup"
import { NavigationButtons } from "@/components/NavigationButtons"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle } from "lucide-react"
import { useFormGuard } from "@/hooks/useFormGuard"

export default function Step5Page() {
    const isReady = useFormGuard(5)
    const router = useRouter()
    const { formData, setFormData, setCurrentStep } = useFormStore()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showResultAnimation, setShowResultAnimation] = useState<"Success" | "Failure" | null>(null)

    const methods = useForm<Step5Data>({
        resolver: zodResolver(step5Schema),
        defaultValues: {
            finalChoice: formData.finalChoice || "" as any
        }
    })

    useEffect(() => {
        setCurrentStep(5)
    }, [setCurrentStep])

    const onSubmit = async (data: Step5Data) => {
        setIsSubmitting(true)
        setFormData(data)

        // Simulate brief processing (snappier)
        await new Promise(resolve => setTimeout(resolve, 300))

        setShowResultAnimation(data.finalChoice)

        // Wait for animation, then redirect (shorter duration)
        setTimeout(() => {
            router.push("/result/summary")
        }, 1500)
    }

    if (!isReady) return null

    return (
        <StepLayout
            title="Final Step"
            description="Choose one final option to complete your submission."
        >
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning>
                    <RadioGroup
                        name="finalChoice"
                        label="Make your choice"
                        options={["Success", "Failure"]}
                    />

                    <NavigationButtons prevHref="/step-4" nextLabel="Submit" isSubmitting={isSubmitting} />
                </form>
            </FormProvider>

            <AnimatePresence>
                {showResultAnimation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: "spring",
                                damping: 12,
                                stiffness: 200,
                                delay: 0.2
                            }}
                            className="flex flex-col items-center text-center p-8"
                        >
                            {showResultAnimation === "Success" ? (
                                <>
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Submission Successful!</h2>
                                    <p className="text-slate-500">Your information has been securely saved.</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                        <XCircle className="w-12 h-12 text-red-600" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Validation Failure</h2>
                                    <p className="text-slate-500">Something went wrong. Redirecting to review...</p>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </StepLayout>
    )
}
