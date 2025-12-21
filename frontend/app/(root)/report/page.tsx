import svg from "@/constants/svgs"
import Image from "next/image"

const ReportListPage = () => {
    return (
        <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-240 flex-1">
                <div className="flex flex-wrap justify-between items-end gap-3 p-4">
                    <div className="flex flex-col gap-1">
                        <p className="text-white tracking-light text-[32px] font-bold leading-tight">Practice History
                        </p>
                        <p className="text-[#9da6b9] text-sm font-medium">Review your past sessions and track your
                            improvement over time.</p>
                    </div>
                    <button
                        className="flex items-center gap-2 bg-[#135bec] hover:bg-[#1d64f2] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                        <span>New Session</span>
                        <Image priority src={svg.addSVG} alt="add session icon" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 mb-8 mt-2">
                    <div className="bg-[#1c1f27] p-5 rounded-xl border border-[#282e39] flex items-center gap-4">
                        <div
                            className="size-12 rounded-full bg-[#282e39] flex items-center justify-center text-[#135bec]">
                            <Image priority src={svg.alarmSVG} alt="streak icon " />
                        </div>
                        <div>
                            <p className="text-[#9da6b9] text-xs font-bold uppercase tracking-wider">Total Sessions</p>
                            <p className="text-2xl font-bold text-white">42</p>
                        </div>
                    </div>
                    <div className="bg-[#1c1f27] p-5 rounded-xl border border-[#282e39] flex items-center gap-4">
                        <div
                            className="size-12 rounded-full bg-[#282e39] flex items-center justify-center text-[#22c55e]">
                            <Image priority src={svg.trendingUpSVG} alt="trending Up icons" />
                        </div>
                        <div>
                            <p className="text-[#9da6b9] text-xs font-bold uppercase tracking-wider">Average Score</p>
                            <p className="text-2xl font-bold text-white">78</p>
                        </div>
                    </div>
                    <div className="bg-[#1c1f27] p-5 rounded-xl border border-[#282e39] flex items-center gap-4">
                        <div
                            className="size-12 rounded-full bg-[#282e39] flex items-center justify-center text-orange-500">
                            <Image priority src={svg.streakSVG} alt="streak icon " />
                        </div>
                        <div>
                            <p className="text-[#9da6b9] text-xs font-bold uppercase tracking-wider">Current Streak</p>
                            <p className="text-2xl font-bold text-white">5 Days</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 px-4 mb-6">
                    <div
                        className="flex items-center gap-2 bg-[#1c1f27] border border-[#282e39] rounded-lg px-3 py-2 w-full md:w-auto md:min-w-[320px] focus-within:border-[#3b82f6] transition-colors">
                        <span className="material-symbols-outlined text-[#9da6b9]">search</span>
                        <input
                            className="bg-transparent border-none text-white placeholder-[#6b7280] text-sm focus:ring-0 w-full p-0"
                            placeholder="Search sessions by topic..." type="text" />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[#9da6b9] text-sm font-medium">Sort by:</span>
                        <select
                            className="bg-[#1c1f27] border border-[#282e39] text-white text-sm rounded-lg focus:ring-[#135bec] focus:border-[#135bec] py-2 px-3">
                            <option>Newest First</option>
                            <option>Oldest First</option>
                            <option>Highest Score</option>
                            <option>Lowest Score</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-col gap-4 px-4 pb-12">
                    <a className="group block relative" href="#">
                        <div
                            className="bg-[#1c1f27] hover:bg-[#222731] rounded-xl p-5 border border-[#282e39] group-hover:border-[#3b82f6] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                            <div className="flex items-start gap-4 flex-1">
                                <div
                                    className="size-12 rounded-full bg-[#135bec]/10 text-[#135bec] flex items-center justify-center shrink-0 mt-1 md:mt-0">
                                    <Image priority src={svg.micSVG} alt="microphone icons" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3
                                            className="text-white font-bold text-lg group-hover:text-[#3b82f6] transition-colors">
                                            Practice Session #42</h3>
                                        <span
                                            className="bg-[#282e39] text-[#9da6b9] text-xs px-2 py-0.5 rounded border border-[#3b4354]">Photography</span>
                                    </div>
                                    <p className="text-[#9da6b9] text-sm line-clamp-1">"Talk about my favorite hobby,
                                        photography, and why I started..."</p>
                                    <div className="flex items-center gap-3 text-xs text-[#6b7280] font-medium mt-1">
                                        <span className="flex items-center gap-1">
                                            <Image src={svg.calendarTodaySVG} alt="time and date icons" priority />
                                            Oct 26, 2023</span>
                                        <span className="flex items-center gap-1"><span
                                            className="material-symbols-outlined text-[14px]">schedule</span> 10:45
                                            AM</span>
                                        <span className="w-1 h-1 rounded-full bg-[#6b7280]"></span>
                                        <span>02:14 duration</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#282e39] pt-4 md:pt-0 pl-0 md:pl-6 md:border-l md:border-[#282e39]">
                                <div className="flex flex-col items-start md:items-end">
                                    <span
                                        className="text-xs font-bold text-[#9da6b9] uppercase tracking-wider mb-0.5">Score</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-3xl font-black text-white">85</span>
                                        <span
                                            className="text-xs font-bold text-[#135bec] bg-[#135bec]/10 px-2 py-1 rounded">Excellent</span>
                                    </div>
                                </div>
                                <div
                                    className="size-8 rounded-full bg-[#282e39] group-hover:bg-[#135bec] flex items-center justify-center text-[#9da6b9] group-hover:text-white transition-colors">
                                    <Image priority src={svg.arrowForwardSVG} alt="arrow forward" />
                                </div>
                            </div>
                        </div>
                    </a>
                    <a className="group block relative" href="#">
                        <div
                            className="bg-[#1c1f27] hover:bg-[#222731] rounded-xl p-5 border border-[#282e39] group-hover:border-[#3b82f6] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                            <div className="flex items-start gap-4 flex-1">
                                <div
                                    className="size-12 rounded-full bg-[#135bec]/10 text-[#135bec] flex items-center justify-center shrink-0 mt-1 md:mt-0">
                                    <Image priority src={svg.micSVG} alt="microphone icons" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3
                                            className="text-white font-bold text-lg group-hover:text-[#3b82f6] transition-colors">
                                            Business Meeting Simulation</h3>
                                        <span
                                            className="bg-[#282e39] text-[#9da6b9] text-xs px-2 py-0.5 rounded border border-[#3b4354]">Business</span>
                                    </div>
                                    <p className="text-[#9da6b9] text-sm line-clamp-1">"Presenting quarterly results to
                                        the board of directors..."</p>
                                    <div className="flex items-center gap-3 text-xs text-[#6b7280] font-medium mt-1">
                                        <span className="flex items-center gap-1">
                                            <Image src={svg.calendarTodaySVG} alt="time and date icons" priority />
                                            Oct 24, 2023</span>
                                        <span className="flex items-center gap-1"><span
                                            className="material-symbols-outlined text-[14px]">schedule</span> 03:20
                                            PM</span>
                                        <span className="w-1 h-1 rounded-full bg-[#6b7280]"></span>
                                        <span>05:42 duration</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#282e39] pt-4 md:pt-0 pl-0 md:pl-6 md:border-l md:border-[#282e39]">
                                <div className="flex flex-col items-start md:items-end">
                                    <span
                                        className="text-xs font-bold text-[#9da6b9] uppercase tracking-wider mb-0.5">Score</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-3xl font-black text-white">92</span>
                                        <span
                                            className="text-xs font-bold text-[#22c55e] bg-[#22c55e]/10 px-2 py-1 rounded">Perfect</span>
                                    </div>
                                </div>
                                <div
                                    className="size-8 rounded-full bg-[#282e39] group-hover:bg-[#135bec] flex items-center justify-center text-[#9da6b9] group-hover:text-white transition-colors">
                                    <Image priority src={svg.arrowForwardSVG} alt="arrow forward" />
                                </div>
                            </div>
                        </div>
                    </a>
                    <a className="group block relative" href="#">
                        <div
                            className="bg-[#1c1f27] hover:bg-[#222731] rounded-xl p-5 border border-[#282e39] group-hover:border-[#3b82f6] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                            <div className="flex items-start gap-4 flex-1">
                                <div
                                    className="size-12 rounded-full bg-[#135bec]/10 text-[#135bec] flex items-center justify-center shrink-0 mt-1 md:mt-0">
                                    <Image priority src={svg.micSVG} alt="microphone icons" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3
                                            className="text-white font-bold text-lg group-hover:text-[#3b82f6] transition-colors">
                                            Movie Review: Inception</h3>
                                        <span
                                            className="bg-[#282e39] text-[#9da6b9] text-xs px-2 py-0.5 rounded border border-[#3b4354]">Casual</span>
                                    </div>
                                    <p className="text-[#9da6b9] text-sm line-clamp-1">"Discussing the plot complexity
                                        and visual effects of Inception..."</p>
                                    <div className="flex items-center gap-3 text-xs text-[#6b7280] font-medium mt-1">
                                        <span className="flex items-center gap-1">
                                            <Image src={svg.calendarTodaySVG} alt="time and date icons" priority />
                                            Oct 20, 2023</span>
                                        <span className="flex items-center gap-1"><span
                                            className="material-symbols-outlined text-[14px]">schedule</span> 08:15
                                            PM</span>
                                        <span className="w-1 h-1 rounded-full bg-[#6b7280]"></span>
                                        <span>03:15 duration</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#282e39] pt-4 md:pt-0 pl-0 md:pl-6 md:border-l md:border-[#282e39]">
                                <div className="flex flex-col items-start md:items-end">
                                    <span
                                        className="text-xs font-bold text-[#9da6b9] uppercase tracking-wider mb-0.5">Score</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-3xl font-black text-white">76</span>
                                        <span
                                            className="text-xs font-bold text-[#eab308] bg-[#eab308]/10 px-2 py-1 rounded">Good</span>
                                    </div>
                                </div>
                                <div
                                    className="size-8 rounded-full bg-[#282e39] group-hover:bg-[#135bec] flex items-center justify-center text-[#9da6b9] group-hover:text-white transition-colors">
                                    <Image priority src={svg.arrowForwardSVG} alt="arrow forward" />

                                </div>
                            </div>
                        </div>
                    </a>
                    <a className="group block relative" href="#">
                        <div
                            className="bg-[#1c1f27] hover:bg-[#222731] rounded-xl p-5 border border-[#282e39] group-hover:border-[#3b82f6] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                            <div className="flex items-start gap-4 flex-1">
                                <div
                                    className="size-12 rounded-full bg-[#135bec]/10 text-[#135bec] flex items-center justify-center shrink-0 mt-1 md:mt-0">
                                    <Image priority src={svg.micSVG} alt="microphone icons" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3
                                            className="text-white font-bold text-lg group-hover:text-[#3b82f6] transition-colors">
                                            Travel Plans</h3>
                                        <span
                                            className="bg-[#282e39] text-[#9da6b9] text-xs px-2 py-0.5 rounded border border-[#3b4354]">Travel</span>
                                    </div>
                                    <p className="text-[#9da6b9] text-sm line-clamp-1">"Describing my upcoming trip to
                                        Japan and itinerary..."</p>
                                    <div className="flex items-center gap-3 text-xs text-[#6b7280] font-medium mt-1">
                                        <span className="flex items-center gap-1">
                                            <Image src={svg.calendarTodaySVG} alt="time and date icons" priority />
                                            Oct 18, 2023</span>
                                        <span className="flex items-center gap-1"><span
                                            className="material-symbols-outlined text-[14px]">schedule</span> 11:30
                                            AM</span>
                                        <span className="w-1 h-1 rounded-full bg-[#6b7280]"></span>
                                        <span>04:05 duration</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#282e39] pt-4 md:pt-0 pl-0 md:pl-6 md:border-l md:border-[#282e39]">
                                <div className="flex flex-col items-start md:items-end">
                                    <span
                                        className="text-xs font-bold text-[#9da6b9] uppercase tracking-wider mb-0.5">Score</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-3xl font-black text-white">88</span>
                                        <span
                                            className="text-xs font-bold text-purple-500 bg-purple-500/10 px-2 py-1 rounded">Great</span>
                                    </div>
                                </div>
                                <div
                                    className="size-8 rounded-full bg-[#282e39] group-hover:bg-[#135bec] flex items-center justify-center text-[#9da6b9] group-hover:text-white transition-colors">
                                    <Image priority src={svg.arrowForwardSVG} alt="arrow forward" />

                                </div>
                            </div>
                        </div>
                    </a>
                    <a className="group block relative" href="#">
                        <div
                            className="bg-[#1c1f27] hover:bg-[#222731] rounded-xl p-5 border border-[#282e39] group-hover:border-[#3b82f6] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                            <div className="flex items-start gap-4 flex-1">
                                <div
                                    className="size-12 rounded-full bg-[#135bec]/10 text-[#135bec] flex items-center justify-center shrink-0 mt-1 md:mt-0">
                                    <Image priority src={svg.micSVG} alt="microphone icons" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3
                                            className="text-white font-bold text-lg group-hover:text-[#3b82f6] transition-colors">
                                            Practice Session #38</h3>
                                        <span
                                            className="bg-[#282e39] text-[#9da6b9] text-xs px-2 py-0.5 rounded border border-[#3b4354]">Uncategorized</span>
                                    </div>
                                    <p className="text-[#9da6b9] text-sm line-clamp-1">"Trying to explain a complex
                                        technical concept..."</p>
                                    <div className="flex items-center gap-3 text-xs text-[#6b7280] font-medium mt-1">
                                        <span className="flex items-center gap-1">
                                            <Image src={svg.calendarTodaySVG} alt="time and date icons" priority />
                                            Oct 15, 2023</span>
                                        <span className="flex items-center gap-1"><span
                                            className="material-symbols-outlined text-[14px]">schedule</span> 09:10
                                            AM</span>
                                        <span className="w-1 h-1 rounded-full bg-[#6b7280]"></span>
                                        <span>01:45 duration</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#282e39] pt-4 md:pt-0 pl-0 md:pl-6 md:border-l md:border-[#282e39]">
                                <div className="flex flex-col items-start md:items-end">
                                    <span
                                        className="text-xs font-bold text-[#9da6b9] uppercase tracking-wider mb-0.5">Score</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-3xl font-black text-white">62</span>
                                        <span
                                            className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded">Needs
                                            Work</span>
                                    </div>
                                </div>
                                <div
                                    className="size-8 rounded-full bg-[#282e39] group-hover:bg-[#135bec] flex items-center justify-center text-[#9da6b9] group-hover:text-white transition-colors">
                                    <Image priority src={svg.arrowForwardSVG} alt="arrow forward" />

                                </div>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="flex justify-center items-center gap-4 border-t border-[#282e39] pt-6 mb-8">
                    <button
                        className="flex items-center gap-2 text-[#9da6b9] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#282e39]">
                        <Image priority src={svg.arrowForwardSVG} alt="arrow backword" className="rotate-180" />
                        Previous
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            className="size-8 flex items-center justify-center rounded-lg bg-[#135bec] text-white text-sm font-bold">1</button>
                        <button
                            className="size-8 flex items-center justify-center rounded-lg text-[#9da6b9] hover:text-white hover:bg-[#282e39] text-sm font-bold transition-colors">2</button>
                        <button
                            className="size-8 flex items-center justify-center rounded-lg text-[#9da6b9] hover:text-white hover:bg-[#282e39] text-sm font-bold transition-colors">3</button>
                        <span className="text-[#9da6b9]">...</span>
                        <button
                            className="size-8 flex items-center justify-center rounded-lg text-[#9da6b9] hover:text-white hover:bg-[#282e39] text-sm font-bold transition-colors">8</button>
                    </div>
                    <button
                        className="flex items-center gap-2 text-[#9da6b9] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#282e39]">
                        Next
                        <Image priority src={svg.arrowForwardSVG} alt="arrow forward" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReportListPage