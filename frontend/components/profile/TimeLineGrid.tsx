"use client"
import TimeLineGridYearPicker from "./TimeLineGridYearPicker"
import { Suspense, useState } from "react"
import useFetchHeatMap from "@/hooks/useFetchHeatMap"
import { useSession } from "next-auth/react"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "../ui/button"
import Grid from "./Grid"
import dayjs from "dayjs"


interface TimeLineGridProps {
    profileCreated: string
}

const TimeLineGrid = ({ profileCreated }: TimeLineGridProps) => {
    const { data } = useSession();
    const [year, setYear] = useState(dayjs().year())
    const { mapperRef, totalSession } = useFetchHeatMap(year, data?.user.access_token)

    const selectedYear = (selectedYear: number) => {
        setYear(selectedYear);
    }
    return (
        <div className="bg-[#1c1f27] w-full rounded-xl">
            <TimeLineGridYearPicker
                totalSessions={totalSession.current}
                selectYear={selectedYear}
                createdYear={dayjs(profileCreated).year()}
                year={year}
            />
            <Suspense
                fallback={
                    <Button disabled size="sm" variant={'outline'} className="w-full h-32">
                        <Spinner />
                        Loading...
                    </Button>
                }
            >
                <Grid
                    year={year}
                    heatMapData={mapperRef.current}
                />
            </Suspense>
        </div>
    )
}

export default TimeLineGrid;
