"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { step1Schema } from "@/validations/schema"
import { useFormStore } from "@/store/formStore"
import { Step1Data } from "@/types/formTypes"
import { StepLayout } from "@/components/StepLayout"
import { FormInput } from "@/components/FormInput"
import { NavigationButtons } from "@/components/NavigationButtons"

export default function Step1Page() {
  const router = useRouter()
  const { formData, setFormData, setCurrentStep } = useFormStore()

  const methods = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: formData.name || "",
      email: formData.email || "",
      role: formData.role || ""
    }
  })

  useEffect(() => {
    setCurrentStep(1)
  }, [setCurrentStep])

  const onSubmit = (data: Step1Data) => {
    setFormData(data)
    router.push("/step-2")
  }

  return (
    <StepLayout
      title="Welcome! Let's get started"
      description="Tell us a bit about yourself to personalize your experience."
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning>
          <FormInput
            name="name"
            label="Full Name"
            placeholder="e.g. John Doe"
            capitalize
            minLength={2}
          />
          <FormInput
            name="email"
            label="Email Address"
            type="email"
            placeholder="john@example.com"
          />
          <FormInput
            name="role"
            label="Role"
            placeholder="e.g. Software Engineer"
            capitalize
            minLength={2}
          />

          <NavigationButtons />
        </form>
      </FormProvider>
    </StepLayout>
  )
}
