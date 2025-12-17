"use client"
import ReportHeader from '@/components/results/ReportHeader'
import { ResultsTabList, RenderSVG } from '@/constants/data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from 'react'
import clsx from 'clsx'
import SpeechScoreMatrix from '@/components/results/SpeechScoreMatrix'


const ReportPage = () => {
    const [selectedTab, setSelectedTab] = useState<string>("finalScore");
    return (
        <section className="container mx-auto px-5 py-6">
            <ReportHeader />
            <Tabs value={selectedTab} onValueChange={e => setSelectedTab(e)} >
                <TabsList className='bg-transparent flex gap-2'>
                    {ResultsTabList.map(tab =>
                        <TabsTrigger value={`${tab.tabKey}`} key={tab.lable} className='px-3 py-4 border-none cursor-pointer'>
                            <p
                                className={clsx('inline-flex justify-center items-center gap-1 p-2 ', selectedTab === tab.tabKey && 'border-b-2 border-[#135bec] ')}>
                                <RenderSVG
                                    Icon={tab.icon}
                                    props={{
                                        strokeWidth: selectedTab === tab.tabKey ? 3 : 1,
                                        stroke: "white",
                                    }}
                                />
                                {tab.lable}
                            </p>

                        </TabsTrigger>
                    )}
                </TabsList>
                <TabsContent
                    value="finalScore"
                    className='border-t-4 p-5'>
                    <SpeechScoreMatrix />
                </TabsContent>
                <TabsContent
                    value="password">
                    Change your password here.
                </TabsContent>
            </Tabs>
            {/*  <SpeechScoreMatrix />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <StatCard label="Duration" value="02:14" />
                <StatCard label="Avg Pace" value="120 wpm" />
                <StatCard label="Fillers" value="3 detected" />
                <StatCard label="Streak" value="5 Days" />
            </div> */}
        </section>
    )
}

export default ReportPage
