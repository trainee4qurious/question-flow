import { z } from 'zod'

export const step1Schema = z.object({
    name: z.string()
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .regex(/^[a-zA-Z\s]*$/, 'Name should only contain alphabets and spaces'),
    email: z.string().trim().email('Invalid email address'),
    role: z.string()
        .trim()
        .min(2, 'Role must be at least 2 characters')
        .regex(/^[a-zA-Z\s]*$/, 'Role should only contain alphabets and spaces')
})

export const step2Schema = z.object({
    location: z.enum(['Home', 'Office'] as const, {
        message: 'Please select a location'
    })
})

export const step3Schema = z.object({
    answer: z.string()
        .trim()
        .min(1, 'Answer is required')
        .min(20, 'Answer must be at least 20 characters long')
})

export const step4Schema = z.object({
    improvements: z.array(z.string()).min(1, 'Please select at least one improvement')
})

export const step5Schema = z.object({
    finalChoice: z.enum(['Success', 'Failure'] as const, {
        message: 'Please make a selection'
    })
})
