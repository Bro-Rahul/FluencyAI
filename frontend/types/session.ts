export interface SessionRecordsType {
    id: number,
    task_id: string,
    user_id: number,
    title: string,
    description: string,
    duration: number
    status: string,
    score: string | null
    created_at: string
}

export type FilterType = "Oldest" | "Newest" | "lowest_score" | "highest_score"
