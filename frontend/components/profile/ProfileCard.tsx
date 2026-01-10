import svg from '@/constants/svgs'
import React from 'react'
import Image from 'next/image'

const ProfileCard = () => {
    return (
        <div
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#1c1f27] p-8 rounded-2xl border border-[#282e39]">
            <div className="flex items-center gap-6">
                <div className="relative">

                    <div
                        className="size-24 rounded-full bg-cover bg-center border-4 border-[#282e39]
             bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuBOKoupCKiQEz52C0w8d-DoV5_JDaPEE2qqAQdYuLLsor-fjtUIMqSuWB4Gk4cSW0GPkpDY3sxh81Fvjk5ICsEiUi1ZKry-1X5eP9dmdEVcCAEqaitWM-yiarZD6p1dVHa2PD88zRQI2Y9ZgszWwe9ZMBJoxZ00Qd7WKKnMMEVWfA5saPyjT1Snj4laAEip3F_rFTh665TXAEliENf8dn02B7HW1r29lDIGbTbFzAxIyunw5WA3i9NqeyY7nk4aLZRBtsJ2JJipfMqW')]"/>
                    <div
                        className="absolute bottom-0 right-0 bg-[#135bec] p-1 rounded-full border-2 border-[#1c1f27]">
                        <Image src={svg.cameraSVG} alt='Profile Icon' />
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-white">Alex Morgan</h1>
                    <div className="flex items-center gap-3 text-[#9da6b9] text-sm">
                        <span className="flex items-center gap-1"><span
                            className="material-symbols-outlined text-[18px]">mail</span>
                            alex.morgan@example.com</span>
                        <span className="size-1 bg-[#3b4354] rounded-full"></span>
                        <span>Joined September 2023</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <span
                            className="px-2 py-0.5 rounded bg-[#282e39] border border-[#3b4354] text-xs font-bold text-white uppercase tracking-wide">Level:
                            B2 Intermediate</span>
                        <span
                            className="px-2 py-0.5 rounded bg-[#282e39] border border-[#3b4354] text-xs font-bold text-[#135bec] uppercase tracking-wide">Pro
                            Member</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
                <button
                    className="flex-1 md:flex-none items-center justify-center gap-2 bg-[#282e39] hover:bg-[#3b4354] text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors border border-[#3b4354] flex">
                    <Image src={svg.settingSVG} alt='setting icons' />
                    Settings
                </button>
                <button
                    className="flex-1 md:flex-none items-center justify-center gap-2 bg-[#135bec] hover:bg-[#1d64f2] text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors flex">
                    <Image src={svg.editSVG} alt='edit icons' />
                    Edit Profile
                </button>
            </div>
        </div>
    )
}

export default ProfileCard