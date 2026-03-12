"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { step4Schema } from "@/validations/schema"
import { useFormStore } from "@/store/formStore"
import { Step4Data } from "@/types/formTypes"
import { StepLayout } from "@/components/StepLayout"
import { CheckboxGroup } from "@/components/CheckboxGroup"
import { NavigationButtons } from "@/components/NavigationButtons"
import { useFormGuard } from "@/hooks/useFormGuard"

export default function Step4Page() {
    const isReady = useFormGuard(4)
    const router = useRouter()
    const { formData, setFormData, setCurrentStep } = useFormStore()

    const methods = useForm<Step4Data>({
        resolver: zodResolver(step4Schema),
        defaultValues: {
            improvements: formData.improvements || []
        }
    })

    useEffect(() => {
        setCurrentStep(4)
    }, [setCurrentStep])

    const onSubmit = (data: Step4Data) => {
        setFormData(data)
        router.push("/step-5")
    }

    if (!isReady) return null

    return (
        <StepLayout
            title="What would you like to improve?"
            description="Select one or more areas where you want to grow."
        >
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning>
                    <CheckboxGroup
                        name="improvements"
                        label="Choose what you want to improve"
                        options={["Logic", "Coding", "Attitude", "Behaviour"]}
                    />

                    <NavigationButtons prevHref="/step-3" />
                </form>
            </FormProvider>
        </StepLayout>
    )
}
