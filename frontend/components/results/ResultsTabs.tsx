import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


import { ResultsTabList } from "@/constants/data"
import { Button } from "../ui/button"
const ResultsTabs = () => {
    return (
        <div className="flex gap-8 border-b border-[#282e39] px-4 mt-2 mb-6">
            <Tabs defaultValue="1">
                {ResultsTabList.map((tab, i) =>
                    <TabsList key={i}>
                        <Button
                            variant={'outline'}
                            key={i}

                            className={`pb-3 border-b-2 text-sm font-medium inline-flex items-end gap-2 ${i === 0
                                ? 'border-[#135bec] text-white'
                                : 'border-transparent text-[#9da6b9] hover:text-white'
                                }`}
                        >
                            {<tab.icon />} {tab.lable}
                        </Button>

                    </TabsList>
                )}
                <TabsContent value="account">Make changes to your account here.</TabsContent>
                <TabsContent value="password">Change your password here.</TabsContent>
            </Tabs>
        </div>
    )
}
export default ResultsTabs