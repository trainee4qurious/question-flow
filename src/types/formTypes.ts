export type Step1Data = {
    name: string
    email: string
    role: string
}

export type Step2Data = {
    location: 'Home' | 'Office'
}

export type Step3Data = {
    answer: string
}

export type Step4Data = {
    improvements: string[]
}

export type Step5Data = {
    finalChoice: 'Success' | 'Failure'
}

export type FormData = Step1Data & Step2Data & Step3Data & Step4Data & Step5Data

export type FormStore = {
    formData: Partial<FormData>
    currentStep: number
    _hasHydrated: boolean
    setFormData: (data: Partial<FormData>) => void
    setCurrentStep: (step: number) => void
    setHasHydrated: (status: boolean) => void
    resetForm: () => void
}
