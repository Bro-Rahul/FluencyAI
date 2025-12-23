import { baseURL } from "..";

export const getSessionRecords = async (token: string): Promise<SessionRecordsType[]> => {
    const response = await fetch(`${baseURL}/sessions/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (!response.ok) {
        const err = await response.json()
        throw Error(err.detail || " Can't fetch the Session Records!")
    }

    return response.json()
}