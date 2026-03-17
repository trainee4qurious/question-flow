"use client"

import { Question } from "@/types/formTypes"
import { FormInput } from "./FormInput"
import { FormTextarea } from "./FormTextarea"
import { Dropdown } from "./Dropdown"
import { CheckboxGroup } from "./CheckboxGroup"
import { RadioGroup } from "./RadioGroup"

interface DynamicQuestionProps {
    question: Question
    hideLabel?: boolean
    hideDescription?: boolean
}

export function DynamicQuestion({ question, hideLabel, hideDescription }: DynamicQuestionProps) {
    const name = String(question.id)

    switch (question.questiontype) {
        case 'text':
        case 'email':
        case 'mail':
            return (
                <FormInput
                    name={name}
                    type={(question.questiontype === 'email' || question.questiontype === 'mail') ? 'email' : 'text'}
                    label={!hideLabel ? question.question : ""}
                    description={!hideDescription ? question.description : ""}
                    placeholder={question.placeholder}
                    required={question.required}
                    minLength={question.minlength}
                    maxLength={question.maxlength}
                />
            )
        case 'textarea':
            return (
                <FormTextarea
                    name={name}
                    label={!hideLabel ? question.question : ""}
                    description={!hideDescription ? question.description : ""}
                    placeholder={question.placeholder}
                    required={question.required}
                    minLength={question.minlength}
                    maxLength={question.maxlength}
                />
            )
        case 'dropdown':
        case 'select':
            return (
                <Dropdown
                    name={name}
                    label={!hideLabel ? question.question : ""}
                    description={!hideDescription ? question.description : ""}
                    options={question.options || []}
                    placeholder={question.placeholder}
                />
            )
        case 'checkbox':
        case 'multi':
            return (
                <CheckboxGroup
                    name={name}
                    label={!hideLabel ? question.question : ""}
                    description={!hideDescription ? question.description : ""}
                    options={question.options || []}
                />
            )
        case 'radio':
        case 'choice':
            return (
                <RadioGroup
                    name={name}
                    label={!hideLabel ? question.question : ""}
                    description={!hideDescription ? question.description : ""}
                    options={question.options || []}
                />
            )
        default:
            console.warn('Unknown question type:', question.questiontype, question)
            return null
    }
}
