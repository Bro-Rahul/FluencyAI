import Image from 'next/image'
import svg from '@/constants/svgs'
import TranscriptionPlayer from './TranscriptionPlayer'
import PlainTranscriptionText from './PlainTranscriptionText'
import { TranscriptionSchema } from '@/types/sessionReport'

interface TranscriptionProps {
    transcriptions: TranscriptionSchema[]
    audioFileName: string
    duration: number
}

const Transcription = ({ transcriptions, audioFileName, duration }: TranscriptionProps) => {
    return (
        <div className="flex flex-col gap-6 px-4 pb-8">
            <TranscriptionPlayer
                audioFileName={audioFileName}
                duration={duration}
            />
            <div className="bg-[#1c1f27] rounded-xl border border-[#282e39] flex flex-col">
                <div className="p-6 md:p-8 flex flex-col gap-8 h-137.5 overflow-y-scroll scrollbar">
                    <PlainTranscriptionText transcriptions={transcriptions} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1c1f27] rounded-xl border border-[#282e39] p-6">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        <Image src={svg.warningSVG} alt='warning icon' />
                        <audio />
                        Frequent Errors
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="mt-1 size-1.5 rounded-full bg-red-500 block"></span>
                            <div>
                                <p className="text-white text-sm font-medium">Past Tense Confusion</p>
                                <p className="text-[#9da6b9] text-xs">Used "have went" instead of "went" 2
                                    times.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-1 size-1.5 rounded-full bg-red-500 block"></span>
                            <div>
                                <p className="text-white text-sm font-medium">Subject-Verb Agreement</p>
                                <p className="text-[#9da6b9] text-xs">Watch out for singular/plural matching.
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="bg-[#1c1f27] rounded-xl border border-[#282e39] p-6">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        <Image src={svg.glowingLightbulbSVG} alt='warning icon' />
                        Vocabulary Expansion
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="mt-1 size-1.5 rounded-full bg-yellow-500 block"></span>
                            <div>
                                <p className="text-white text-sm font-medium">Overused: "Good"</p>
                                <p className="text-[#9da6b9] text-xs">Try: <i>excellent, superb, fantastic,
                                    positive</i>.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-1 size-1.5 rounded-full bg-yellow-500 block"></span>
                            <div>
                                <p className="text-white text-sm font-medium">Overused: "Like"</p>
                                <p className="text-[#9da6b9] text-xs">Try to pause silently instead of using
                                    fillers.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Transcription