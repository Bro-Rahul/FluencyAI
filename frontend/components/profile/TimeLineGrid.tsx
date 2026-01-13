"use client"
import TimeLineGridYearPicker from "./TimeLineGridYearPicker"
import { Suspense } from "react"
import useFetchHeatMap from "@/hooks/useFetchHeatMap"
import { useSession } from "next-auth/react"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "../ui/button"
import Grid from "./Grid"


interface TimeLineGridProps {
    profileCreated: string
}

const TimeLineGrid = ({ profileCreated }: TimeLineGridProps) => {
    const { data } = useSession();
    const { year, mapperRef, totalSession } = useFetchHeatMap(profileCreated, data?.user.access_token)

    return (
        <div className="bg-[#1c1f27] w-full rounded-xl">
            <TimeLineGridYearPicker
                totalSessions={totalSession.current}
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
