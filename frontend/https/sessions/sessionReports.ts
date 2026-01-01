import { SessionReportSchema } from "@/types/sessionReport";
import { baseURL } from "..";

const sessionReportBaseUrl = `${baseURL}/session-reports`

export const getSessionReport = async (accessToken: string, sessionId: number): Promise<SessionReportSchema> => {
    const response = await fetch(`${sessionReportBaseUrl}/${sessionId}/`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        }
    })
    if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || "Can't fetch the report ")
    }
    return response.json()
}