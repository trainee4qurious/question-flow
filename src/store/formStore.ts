import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FormStore } from '@/types/formTypes'

export const useFormStore = create<FormStore>()(
    persist(
        (set) => ({
            formData: {
                improvements: []
            },
            currentStep: 1,
            _hasHydrated: false,
            setFormData: (data) =>
                set((state) => ({
                    formData: { ...state.formData, ...data }
                })),
            setCurrentStep: (step) => set({ currentStep: step }),
            setHasHydrated: (status) => set({ _hasHydrated: status }),
            resetForm: () => set({ formData: { improvements: [] }, currentStep: 1 })
        }),
        {
            name: 'form-storage',
            onRehydrateStorage: (state) => {
                return () => state.setHasHydrated(true)
            }
        }
    )
)
