import { UserStatisticsType } from "@/types/session";
import { baseURL } from "..";

const baseSessionURL = `${baseURL}/sessions`

export const getUserStatistics = async (token: string): Promise<UserStatisticsType> => {
    const response = await fetch(`${baseSessionURL}/get-statistics/`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });
    if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || " Can't get user Stats")
    }
    return response.json()
}