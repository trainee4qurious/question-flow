"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useFormStore } from "@/store/formStore"

export function useFormGuard(step: number) {
    const router = useRouter()
    const pathname = usePathname()
    const { formData, _hasHydrated } = useFormStore()
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        // Skip guard check until store has hydrated from localStorage
        if (!_hasHydrated) return

        const checkGuard = () => {
            if (step === 1) {
                setIsReady(true)
                return
            }

            let isMissingData = false

            if (step >= 2 && (!formData.name || !formData.email || !formData.role)) {
                isMissingData = true
            }
            if (step >= 3 && !formData.location) {
                isMissingData = true
            }
            if (step >= 4 && (!formData.answer || formData.answer.length < 20)) {
                isMissingData = true
            }
            if (step >= 5 && (!formData.improvements || formData.improvements.length === 0)) {
                isMissingData = true
            }
            if (step === 6 && !formData.finalChoice) { // 6 for summary page
                isMissingData = true
            }

            if (isMissingData && pathname !== "/") {
                router.replace("/")
            } else {
                setIsReady(true)
            }
        }

        checkGuard()
    }, [step, formData, router, pathname, _hasHydrated])

    return isReady
}
