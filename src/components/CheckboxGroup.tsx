"use client"

import { useFormContext } from "react-hook-form"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxGroupProps {
    name: string
    label: string
    options: string[]
}

export function CheckboxGroup({ name, label, options }: CheckboxGroupProps) {
    const { setValue, watch, formState: { errors } } = useFormContext()
    const selectedValues = watch(name) || []
    const error = errors[name]

    const toggleOption = (option: string) => {
        const newValues = selectedValues.includes(option)
            ? selectedValues.filter((v: string) => v !== option)
            : [...selectedValues, option]
        setValue(name, newValues, { shouldValidate: true })
    }

    return (
        <div className="space-y-4 w-full" role="group" aria-labelledby={`${name}-label`}>
            <label id={`${name}-label`} className="text-sm font-semibold text-slate-700 block ml-1">
                {label}
            </label>
            <div className="grid grid-cols-1 gap-3">
                {options.map((opt) => {
                    const isSelected = selectedValues.includes(opt)
                    return (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => toggleOption(opt)}
                            role="checkbox"
                            aria-checked={isSelected}
                            className={cn(
                                "flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20",
                                isSelected
                                    ? "border-blue-500 bg-blue-50/50 shadow-[0_0_15px_rgba(37,99,235,0.05)]"
                                    : "border-slate-100 bg-white hover:border-slate-200"
                            )}
                        >
                            <span className={cn(
                                "font-medium",
                                isSelected ? "text-blue-700" : "text-slate-600"
                            )}>
                                {opt}
                            </span>
                            <div className={cn(
                                "w-6 h-6 rounded-md border flex items-center justify-center transition-colors",
                                isSelected ? "bg-blue-600 border-blue-600" : "bg-white border-slate-200"
                            )}>
                                {isSelected && <Check className="w-4 h-4 text-white" />}
                            </div>
                        </button>
                    )
                })}
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    role="alert"
                    className="text-xs font-medium text-red-500 mt-2 ml-1"
                >
                    {error.message as string}
                </motion.p>
            )}
        </div>
    )
}
