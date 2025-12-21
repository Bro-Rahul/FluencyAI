import Link from "next/link"

const page = () => {
    return (
        <main className="flex items-center justify-center h-screen p-4 lg:p-8">
            <div
                className="w-full max-w-120 bg-[#192233] rounded-2xl border border-[#232f48] shadow-2xl overflow-hidden relative">
                <div className="h-32 w-full bg-cover bg-center relative banner">
                    <div className="absolute inset-0 bg-linear-to-t from-[#192233] to-transparent"></div>
                </div>
                <div className="px-8 pb-8 -mt-6 relative z-10">
                    <h1 className="text-3xl font-bold text-white text-center mb-8 drop-shadow-lg">Create an account</h1>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white pl-1">Username</label>
                            <input
                                className="w-full h-12 px-4 bg-[#111722] border border-[#324467] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent text-white placeholder-[#586c91] transition-all"
                                placeholder="Enter Username" type="text" />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white pl-1">Email</label>
                            <input
                                className="w-full h-12 px-4 bg-[#111722] border border-[#324467] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent text-white placeholder-[#586c91] transition-all"
                                placeholder="Enter Email" type="text" />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white pl-1">Password</label>
                            <input
                                className="w-full h-12 px-4 bg-[#111722] border border-[#324467] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent text-white placeholder-[#586c91] transition-all"
                                placeholder="Create a password" type="password" />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white pl-1">Comfirm Password</label>
                            <input
                                className="w-full h-12 px-4 bg-[#111722] border border-[#324467] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent text-white placeholder-[#586c91] transition-all"
                                placeholder="Comfirm password" type="password" />
                        </div>

                        <button
                            className="w-full h-12 bg-[#135bec] hover:bg-[#1149bc] text-white text-sm font-bold rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-200 mt-2 cursor-pointer">
                            Register
                        </button>
                    </div>
                    <div className="mt-8 text-center text-sm text-[#92a4c9]">
                        Already have an account?
                        <Link className="text-[#135bec] hover:text-white font-semibold transition-colors ml-1" href="/auth/login">Sign
                            IN</Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default page