export type FilterType = "Oldest" | "Newest" | "lowest_score" | "highest_score"


export interface SessionRecordsType {
    id: number,
    task_id: string,
    user_id: number,
    title: string,
    description: string,
    duration: number
    status: "finish" | "pending",
    score: string | null
    created_at: string
}


export interface UserStatisticsType {
    total: number,
    avg: number,
    streak: number
}


export interface UserProfileSummaryType extends UserStatisticsType {
    total_duration: number,
    best_score: number,
    practice_days: number,
    weekly_duration: number,
    weekly_sessions: number,
    monthly_sessions: number,
    monthly_active_days: number,
    monthly_elapsed_days: number,
    weekly_duration_share: number,
    monthly_sessions_share: number,
    monthly_active_days_share: number,
    last_session_at: string | null
}
