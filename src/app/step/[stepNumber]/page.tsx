"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFormStore } from "@/store/formStore"
import { StepLayout } from "@/components/StepLayout"
import { NavigationButtons } from "@/components/NavigationButtons"
import { useFormGuard } from "@/hooks/useFormGuard"
import { generateStepSchema, getDefaultValues } from "@/validations/dynamicSchema"
import { DynamicQuestion } from "@/components/DynamicQuestion"
import { submitAnswers } from "@/lib/api"

export default function DynamicStepPage() {
    const params = useParams()
    const stepNumber = Number(params.stepNumber)
    const isReady = useFormGuard(stepNumber)
    const router = useRouter()

    const {
        formData,
        setFormData,
        setCurrentStep,
        questions,
        submissionId,
        setSubmissionId,
        formSessionId,
        setSubmissionStatus,
        setTotalScore
    } = useFormStore()

    const [isSubmitting, setIsSubmitting] = useState(false)

    // Calculate total steps
    const maxStep = useMemo(() => {
        return Math.max(...questions.map(q => Number(q.step)), 0)
    }, [questions])

    const isLastStep = stepNumber === maxStep

    const stepQuestions = useMemo(() =>
        questions.filter(q =>
            Number(q.step) === stepNumber &&
            (String(q.active).toLowerCase() === 'true' || q.active === true)
        ).sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)),
        [questions, stepNumber]
    )

    const schema = useMemo(() => generateStepSchema(stepQuestions), [stepQuestions])
    const defaultValues = useMemo(() => getDefaultValues(stepQuestions, formData), [stepQuestions, formData])

    const methods = useForm({
        resolver: zodResolver(schema),
        defaultValues
    })

    // Reset form values when step changes to ensure correct defaults
    // We removed defaultValues from the dependency array to prevent clears during background updates
    useEffect(() => {
        methods.reset(defaultValues)
    }, [stepNumber, methods]) // eslint-disable-line react-hooks/exhaustive-deps


    useEffect(() => {
        if (isReady) {
            setCurrentStep(stepNumber)
        }
    }, [isReady, stepNumber, setCurrentStep])

    const calculateScore = (data: any, allQuestions: any[]) => {
        let total = 0
        allQuestions.forEach(q => {
            const answer = data[q.id]
            if (!answer) return

            if (q.questiontype === 'checkbox' || q.questiontype === 'multi') {
                const selectedValues = Array.isArray(answer) ? answer : [answer]
                selectedValues.forEach((val: string) => {
                    const option = q.options?.find((opt: any) => (opt.value || opt.label) === val)
                    if (option?.points) total += Number(option.points)
                })
            } else if (q.questiontype === 'radio' || q.questiontype === 'dropdown' || q.questiontype === 'select' || q.questiontype === 'choice') {
                const option = q.options?.find((opt: any) => (opt.value || opt.label) === String(answer))
                if (option?.points) total += Number(option.points)
            } else {
                // For other types, maybe use base question points
                if (q.points) total += Number(q.points)
            }
        })
        return total
    }

    const onSubmit = async (data: any) => {
        setFormData(data)
        const updatedFormData = { ...formData, ...data }

        if (isLastStep) {
            setIsSubmitting(true)
            const sId = submissionId || `sub_${Date.now()}`
            if (!submissionId) setSubmissionId(sId)

            const totalScore = calculateScore(updatedFormData, questions)
            const SCORE_THRESHOLD = 50 // Defined threshold
            setTotalScore(totalScore)
            console.log(`[Submission] Total Score: ${totalScore}, Threshold: ${SCORE_THRESHOLD}`)

            // Prepare single-row data: [ID, Timestamp, Answer1, Answer2, ..., Score]
            const timestamp = new Date().toLocaleString()
            const sortedQuestions = [...questions].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))

            const submissionData = [
                sId,
                timestamp,
                ...sortedQuestions.map(q => {
                    const answerValue = updatedFormData[q.id]
                    return Array.isArray(answerValue) ? answerValue.join(", ") : String(answerValue || "")
                }),
                totalScore // Append score to the submission data
            ]

            setSubmissionStatus('submitting')
            try {
                await submitAnswers(sId, submissionData)
                setSubmissionStatus('success')

                if (totalScore >= SCORE_THRESHOLD) {
                    router.replace("/result/success")
                } else {
                    router.replace("/result/failure")
                }
            } catch (error) {
                console.error("Submission failed", error)
                setSubmissionStatus('error', error instanceof Error ? error.message : 'Network error')
                router.replace("/result/failure")
            } finally {
                // Keep isSubmitting true to prevent flash during redirect
            }
        } else {
            router.push(`/step/${stepNumber + 1}`)
        }
    }

    if (!isReady || (questions.length > 0 && stepQuestions.length === 0)) {
        return (
            <StepLayout title="Loading..." description="Preparing your questions...">
                <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </StepLayout>
        )
    }

    if (isSubmitting) {
        return (
            <StepLayout title="Submitting..." description="Securely recording your responses. Please wait.">
                <div className="flex flex-col items-center justify-center p-12 space-y-6">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 bg-blue-50 rounded-full animate-ping"></div>
                        </div>
                    </div>
                    <p className="text-slate-400 font-bold tracking-widest uppercase text-xs animate-pulse">Syncing Data...</p>
                </div>
            </StepLayout>
        )
    }

    const title = stepQuestions.length === 1 ? stepQuestions[0].question : `Step ${stepNumber}`
    const description = stepQuestions.length === 1 ? stepQuestions[0].description : "Please answer the questions below."

    return (
        <StepLayout title={title} description={description}>
            <FormProvider {...methods} key={`${formSessionId}-${stepNumber}`}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning>
                    {stepQuestions.map(q => (
                        <DynamicQuestion
                            key={q.id}
                            question={q}
                            hideLabel={stepQuestions.length === 1}
                            hideDescription={stepQuestions.length === 1}
                        />
                    ))}

                    <NavigationButtons
                        prevHref={stepNumber > 1 ? `/step/${stepNumber - 1}` : "/"}
                        nextLabel={isLastStep ? "Submit" : "Next"}
                        isSubmitting={isSubmitting}
                    />
                </form>
            </FormProvider>
        </StepLayout>
    )
}
