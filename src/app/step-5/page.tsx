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
import { useFormGuard } from "@/hooks/useFormGuard"

export default function Step5Page() {
    const isReady = useFormGuard(5)
    const router = useRouter()
    const { formData, setFormData, setCurrentStep } = useFormStore()
    const [isSubmitting, setIsSubmitting] = useState(false)

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

        if (data.finalChoice === "Success") {
            router.push("/result/success")
        } else {
            router.push("/result/failure")
        }
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
                        optionImages={{
                            "Success": "/success.png",
                            "Failure": "/failure.png"
                        }}
                    />

                    <NavigationButtons prevHref="/step-4" nextLabel="Submit" isSubmitting={isSubmitting} />
                </form>
            </FormProvider>
        </StepLayout>
    )
}
