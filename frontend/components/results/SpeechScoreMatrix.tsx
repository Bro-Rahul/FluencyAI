import { metrics } from "@/constants/data"
import { RenderSVG } from "@/constants/data"
import { Check } from "lucide-react"


const RightSVG = () => {
    return <span className="bg-green-500 rounded-full w-4 h-4 inline-flex items-center justify-center">
        <Check color="black" size={10} />
    </span>
}

const SpeechScoreMatrix = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1c1f27] rounded-xl p-6 border border-[#282e39] flex flex-col items-center gap-6 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#135bec] to-[#3b82f6]" />
                <h3 className="text-white font-bold text-lg self-start">Overall Score</h3>

                <div className="relative size-44 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                        <circle cx="88" cy="88" r="76" stroke="#282e39" strokeWidth="12" fill="none" />
                        <circle
                            cx="88"
                            cy="88"
                            r="76"
                            stroke="#135bec"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray="477"
                            strokeDashoffset="71"
                            strokeLinecap="round"
                        />
                    </svg>

                    <div className="absolute text-center">
                        <p className="text-5xl font-black text-white">85</p>
                        <p className="text-sm font-bold text-[#135bec]">Excellent</p>
                    </div>
                </div>

                <p className="text-[#d1d5db] text-sm text-center">
                    Great performance! Focus on reducing pauses to improve fluency.
                </p>
            </div>
            <div className="md:col-span-2">
                <div className="bg-[#1c1f27] rounded-xl p-6 border border-[#282e39]">
                    <h3 className="text-white font-bold mb-4">Performance Breakdown</h3>
                    {metrics.map(metric => (
                        <div key={metric.label} className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <RightSVG />
                                <span className="text-white">{metric.label}</span>
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