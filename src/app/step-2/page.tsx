"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { step2Schema } from "@/validations/schema"
import { useFormStore } from "@/store/formStore"
import { Step2Data } from "@/types/formTypes"
import { StepLayout } from "@/components/StepLayout"
import { Dropdown } from "@/components/Dropdown"
import { NavigationButtons } from "@/components/NavigationButtons"
import { useFormGuard } from "@/hooks/useFormGuard"

export default function Step2Page() {
    const isReady = useFormGuard(2)
    const router = useRouter()
    const { formData, setFormData, setCurrentStep } = useFormStore()

    const methods = useForm<Step2Data>({
        resolver: zodResolver(step2Schema),
        defaultValues: {
            location: formData.location || "" as any
        }
    })

    useEffect(() => {
        setCurrentStep(2)
    }, [setCurrentStep])

    const onSubmit = (data: Step2Data) => {
        setFormData(data)
        router.push("/step-3")
    }

    if (!isReady) return null

    return (
        <StepLayout
            title="Where are you located?"
            description="Choose your primary work location from the options below."
        >
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning>
                    <Dropdown
                        name="location"
                        label="Location"
                        options={["Home", "Office"]}
                        placeholder="Select your location"
                    />

                    <NavigationButtons prevHref="/" />
                </form>
            </FormProvider>
        </StepLayout>
    )
}
