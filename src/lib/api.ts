import { Question } from '@/types/formTypes'

const API_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL

export async function fetchQuestions(): Promise<Question[]> {
    if (!API_URL) {
        console.error('API URL is not defined')
        return []
    }

    try {
        // Simple cache-busting or caching strategy could be added here if needed.
        // For now, we'll just ensure the request is efficient.
        // Aggressive cache-busting with a unique timestamp in URL.
        // Note: We avoid custom headers (Cache-Control/Pragma) because they trigger CORS preflight 
        // which Google Apps Script endpoints often don't support well for GET requests.
        const url = `${API_URL}?action=questions&t=${Date.now()}`
        console.log(`[api] Fetching questions from: ${url}`)

        const response = await fetch(url, {
            cache: 'no-store'
        } as any)


        if (!response.ok) {
            console.error(`Fetch error: ${response.status} ${response.statusText}`)
            throw new Error('Failed to fetch questions')
        }
        const data = await response.json()

        // Normalize keys to lowercase
        const normalizedData = data.map((q: any) => {
            const normalizedQuery: any = {}
            for (const key in q) {
                normalizedQuery[key.toLowerCase()] = q[key]
            }

            const pointsStr = String(normalizedQuery.points || '')
            const pointsArr = pointsStr.split(',').map((p: string) => parseInt(p.trim(), 10) || 0)
            const hasPointsColumn = pointsStr.trim().length > 0

            if (Array.isArray(normalizedQuery.options)) {
                normalizedQuery.options = normalizedQuery.options.map((opt: any, idx: number) => {
                    const baseOpt = typeof opt === 'string' ? { label: opt, value: opt } : opt

                    // Priority:
                    // 1. Points embedded in the option object (Option B)
                    // 2. Points from the comma-separated column (Option A)
                    // 3. 0 as default
                    let optionPoints = 0
                    if (baseOpt.points !== undefined) {
                        optionPoints = Number(baseOpt.points)
                    } else if (hasPointsColumn && pointsArr[idx] !== undefined) {
                        optionPoints = pointsArr[idx]
                    }

                    return {
                        ...baseOpt,
                        points: optionPoints
                    }
                })
            }

            return normalizedQuery as Question
        })

        return normalizedData
    } catch (error) {
        console.error('Error fetching questions:', error)
        return []
    }
}

export async function submitAnswers(submissionId: string, data: any[]) {
    if (!API_URL) {
        console.error('API URL is not defined')
        return { success: false, error: 'API URL missing' }
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            keepalive: true,
            body: JSON.stringify({ submissionId, data }),
            headers: {
                'Content-Type': 'application/json'
            }
        })



        // with no-cors, we can't read the response body or status.
        // If it reaches here without error, we consider it a success.
        console.log('Submission sent (no-cors mode)')
        return { success: true }
    } catch (error) {
        console.error('Error submitting answers:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }

}
