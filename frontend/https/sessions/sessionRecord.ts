import { UserStatisticsType } from "@/types/session";
import { baseURL } from "..";

const baseSessionURL = `${baseURL}/sessions`


export const postCreateNewSession = async (token: string, audioFile: File | Blob, duration: number) => {
    const formData = new FormData();
    const file = audioFile instanceof File ? audioFile : new File([audioFile], "recording.webm", { type: audioFile.type });
    formData.append("audio_file", file);
    formData.append("duration", duration.toString());
    const response = await fetch(`${baseSessionURL}/create/`, {
        method: "POST",
        body: formData,
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });
    if (!response.ok) {
        const err = await response.json()
        throw Error(err.detail ?? "Can't create the new Session now");
    }
    return response.json()
}

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