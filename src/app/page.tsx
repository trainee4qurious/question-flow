"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFormStore } from "@/store/formStore"
import { StepLayout } from "@/components/StepLayout"
import { NavigationButtons } from "@/components/NavigationButtons"
import { useFormGuard } from "@/hooks/useFormGuard"
import { fetchQuestions } from "@/lib/api"

import { generateStepSchema, getDefaultValues } from "@/validations/dynamicSchema"
import { DynamicQuestion } from "@/components/DynamicQuestion"


export default function RootPage() {
  const { _hasHydrated, questions, isSubmitted, resetForm } = useFormStore()
  const router = useRouter()

  useEffect(() => {
    if (_hasHydrated && isSubmitted) {
      resetForm()
    }
  }, [_hasHydrated, isSubmitted, resetForm])

  useEffect(() => {
    if (_hasHydrated) {
      if (questions.length > 0) {
        router.replace("/step/1")
      }
    }
  }, [_hasHydrated, questions.length, router])

  // If we're already hydrated and have questions, don't show the loading state
  // as the redirect will happen almost immediately.
  if (_hasHydrated && questions.length > 0) {
    return null
  }

  return (
    <StepLayout title="Loading..." description="Preparing your form...">
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    </StepLayout>
  )
}


