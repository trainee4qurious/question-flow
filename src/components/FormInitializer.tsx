"use client"

import { useEffect, useRef } from 'react'
import { useFormStore } from '@/store/formStore'
import { fetchQuestions } from '@/lib/api'

export function FormInitializer() {
    const { setQuestions, _hasHydrated, isLoadingQuestions, setIsLoadingQuestions } = useFormStore()
    const syncInterval = useRef<NodeJS.Timeout | null>(null)

    const syncQuestions = async () => {
        if (isLoadingQuestions) return

        setIsLoadingQuestions(true)
        console.log('[FormInitializer] Syncing questions...')
        try {
            const qs = await fetchQuestions()
            if (qs.length > 0) {
                console.log(`[FormInitializer] Successfully synced ${qs.length} questions.`)
                setQuestions(qs)
            } else {
                console.warn('[FormInitializer] Fetched 0 questions or fetch failed.')
            }
        } catch (err) {
            console.error('[FormInitializer] Sync failed details:', {
                message: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : undefined
            })
        } finally {
            setIsLoadingQuestions(false)
        }
    }

    useEffect(() => {
        if (_hasHydrated) {
            // Initial sync on hydration/mount
            syncQuestions()

            // Setup background sync every 5 minutes
            syncInterval.current = setInterval(syncQuestions, 5 * 60 * 1000)
        }

        return () => {
            if (syncInterval.current) {
                clearInterval(syncInterval.current)
            }
        }
    }, [_hasHydrated]) // eslint-disable-line react-hooks/exhaustive-deps

    return null
}
