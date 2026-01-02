import ScoreBoard from "./ScoreBoard";
import PerformanceMetrix from "./PerformanceMetrix";
import svg from "@/constants/svgs";
import { KeyMetric } from "@/types/sessionReport";

interface SpeechScoreMatrixProps {
    score: number,
    description: string,
    performanceMetrix: KeyMetric
}

const SpeechScoreMatrix = ({ score, description, performanceMetrix }: SpeechScoreMatrixProps) => {
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
                    <PerformanceMetrix
                        label="Grammar Accuracy"
                        value={performanceMetrix.grammar_accuracy}
                        color="bg-green-500"
                        icon={svg.grammerSVG}
                    />
                    <PerformanceMetrix
                        label="Fluency"
                        value={performanceMetrix.fluency}
                        color="bg-yellow-500"
                        icon={svg.fluencySVG}
                    />
                    <PerformanceMetrix
                        label="Pacing"
                        value={performanceMetrix.pacing}
                        color="bg-purple-500"
                        icon={svg.pacingSVG}
                    />
                    <PerformanceMetrix
                        label="Confidence"
                        value={performanceMetrix.confidence}
                        color="bg-pink-500"
                        icon={svg.confidenceSVG}
                    />
                </div>
            </div>
        </div>
    )
}

export default SpeechScoreMatrix