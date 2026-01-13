import dayjs from "dayjs";

export const formateDateTime = (dateString: string) => {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return {
        formattedDate,
        formattedTime
    }

}

export const formateDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return [
        hrs.toString().padStart(2, "0"),
        mins.toString().padStart(2, "0"),
        secs.toString().padStart(2, "0"),
    ].join(":");
};


export function getDaysOfYear(year: number) {
    const start = dayjs(`${year}-01-01`)
    const end = dayjs(`${year}-12-31`)
    const days = []

    let current = start
    while (current.isBefore(end) || current.isSame(end)) {
        days.push(current.format("YYYY-MM-DD").toString())
        current = current.add(1, "day")
    }
    return days
}