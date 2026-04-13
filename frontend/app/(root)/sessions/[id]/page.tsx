import ReportHeader from '@/components/reports/ReportHeader';
import { ResultsTabList } from '@/constants/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';
import clsx from 'clsx';
import FinalScore from '@/components/reports/FinalScore';
import Transcription from '@/components/reports/Transcription';
import { getSessionReport } from '@/https/sessions/sessionReports';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ReportPageProps {
    params: Promise<{
        id: number
    }>
}
const ReportPage = async ({ params }: ReportPageProps) => {
    const { id } = await params
    const session = await getServerSession(options);
    const response = await getSessionReport(session?.user.access_token!, id)

    return (
        <section className="container mx-auto px-45 py-6 sm:px-0 md:px-20 min-[100px]:px-0">
            <ReportHeader
                datetimeString={response.created_at}
                sessionId={response.session_id}
            />
            <Tabs defaultValue='finalScore'>
                <TabsList className="bg-transparent flex gap-2">
                    {ResultsTabList.map(tab => (
                        <TabsTrigger
                            value={tab.tabKey}
                            key={tab.lable}
                            className={clsx(
                                "bg-transparent border-0 rounded-none shadow-none",
                                "px-3 py-4 cursor-pointer border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500",

                            )}
                        >
                            <p className="inline-flex justify-center items-center gap-1">
                                <Image src={tab.icon} alt={`${tab.lable} icon`} priority />
                                {tab.lable}
                            </p>
                        </TabsTrigger>


                    ))}
                </TabsList>
                <TabsContent value="finalScore" className="border-t-4 py-5 px-2">
                    <FinalScore
                        transcriptions={response.transcriptions}
                        duration={response.duration}
                        report={response.report}
                    />
                </TabsContent>

                <TabsContent value="transcript">
                    <Transcription
                        transcriptions={response.transcriptions}
                        audioFileName={response.audio_file}
                        duration={response.duration}
                    />
                </TabsContent>
                <TabsContent value="suggesions">
                    <div className="markdown-body rounded-3xl border border-[#282e39] bg-[#151922] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-7">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {response.report.comprehensive_report_md}
                        </ReactMarkdown>
                    </div>
                </TabsContent>
            </Tabs>
        </section>
    );
};

export default ReportPage;
