"use client"
import ReportHeader from '@/components/results/ReportHeader'
import { ResultsTabList } from '@/constants/data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'
import { useState } from 'react'
import clsx from 'clsx'
import FinalScore from '@/components/results/FinalScore'
import Transcription from '@/components/results/Transcription'


const ReportPage = () => {
    const [selectedTab, setSelectedTab] = useState<string>("finalScore");
    return (
        <section className="container mx-auto px-45 py-6">
            <ReportHeader />
            <Tabs value={selectedTab} onValueChange={e => setSelectedTab(e)} >
                <TabsList className='bg-transparent flex gap-2'>
                    {ResultsTabList.map(tab =>
                        <TabsTrigger value={`${tab.tabKey}`} key={tab.lable} className='px-3 py-4 border-none cursor-pointer'>
                            <p
                                className={clsx('inline-flex justify-center items-center gap-1 p-2 ', selectedTab === tab.tabKey && 'border-b-2 border-[#135bec] ')}>
                                <Image src={tab.icon} alt={`${tab.lable} icon`} priority />
                                {tab.lable}
                            </p>

                        </TabsTrigger>
                    )}
                </TabsList>
                <TabsContent
                    value="finalScore"
                    className='border-t-4 py-5 px-2'>
                    <FinalScore />
                </TabsContent>
                <TabsContent
                    value="transcript">
                    <Transcription />
                </TabsContent>
            </Tabs>
        </section>
    )
}

export default ReportPage
