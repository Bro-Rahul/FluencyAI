import { metrics } from "@/constants/data"
import Image from "next/image"
import ScoreBoard from "./ScoreBoard";

interface SpeechScoreMatrixProps {
    score: number,
    description: string
}

const SpeechScoreMatrix = ({ score, description }: SpeechScoreMatrixProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            <div className="bg-[#1c1f27] rounded-xl p-6 border-t-2 border-2 border-t-[#135bec] border-[#282e39] flex flex-col items-center gap-6 relative">
                <h3 className="text-white font-bold text-lg self-center">Overall Score</h3>
                <ScoreBoard value={score} />
                <p className="text-[#d1d5db] text-sm text-center line-clamp-2">
                    {description}
                </p>
            </div>
            <div className="md:col-span-2">
                <div className="bg-[#1c1f27] rounded-xl p-6 border border-[#282e39]">
                    <h3 className="text-white font-bold mb-4">Performance Breakdown</h3>
                    {metrics.map(metric => (
                        <div key={metric.label} className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-white inline-flex gap-x-2 items-center">
                                    <Image
                                        src={metric.icons}
                                        alt="this is svg"
                                        width={20}
                                        height={20}
                                        priority
                                    />
                                    {metric.label}</span>
                                <span className="text-white">{metric.value}%</span>
                            </div>
                            <div className="h-2 bg-[#282e39] rounded-full">
                                <div
                                    className={`h-full ${metric.color} rounded-full`}
                                    style={{ width: `${metric.value}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SpeechScoreMatrix