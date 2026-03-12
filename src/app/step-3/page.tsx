"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { step3Schema } from "@/validations/schema"
import { useFormStore } from "@/store/formStore"
import { Step3Data } from "@/types/formTypes"
import { StepLayout } from "@/components/StepLayout"
import { FormTextarea } from "@/components/FormTextarea"
import { NavigationButtons } from "@/components/NavigationButtons"
import { useFormGuard } from "@/hooks/useFormGuard"

export default function Step3Page() {
    const isReady = useFormGuard(3)
    const router = useRouter()
    const { formData, setFormData, setCurrentStep } = useFormStore()

    const methods = useForm<Step3Data>({
        resolver: zodResolver(step3Schema),
        defaultValues: {
            answer: formData.answer || ""
        }
    })

    useEffect(() => {
        setCurrentStep(3)
    }, [setCurrentStep])

    const onSubmit = (data: Step3Data) => {
        setFormData(data)
        router.push("/step-4")
    }

    if (!isReady) return null

    return (
        <StepLayout
            title="Reading Comprehension"
            description="Read the paragraph below and answer the question."
        >
            <div className="mb-8 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                <p className="text-sm text-slate-600 leading-relaxed italic">
                    "Riya joined a small startup as an intern on Monday. Her manager gave her three tasks: fix a small bug in the login page, review a teammate’s code, and write documentation for a new feature. She decided to first review the teammate’s code because the teammate was waiting for feedback. After finishing the review, she spent two hours fixing the login bug and planned to complete the documentation the next day."
                </p>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning>
                    <FormTextarea
                        name="answer"
                        label="Which task did Riya choose to complete first, and why?"
                        placeholder="Write your answer here..."
                        capitalize
                        minLength={20}
                    />

                    <NavigationButtons prevHref="/step-2" />
                </form>
            </FormProvider>
        </StepLayout>
    )
}
