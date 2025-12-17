import { RenderSVGType } from "@/types/utils";
import { ChartNoAxesColumn, ChartNoAxesCombined, Lightbulb, NotepadText, BadgeCheck, Check } from "lucide-react";

export const ResultsTabList = [
    {
        lable: "Final Score",
        tabKey: "finalScore",
        icon: ChartNoAxesCombined
    },
    {
        lable: "Transcript",
        tabKey: "transcript",
        icon: NotepadText
    },
    {
        lable: "Suggesions",
        tabKey: "suggesions",
        icon: Lightbulb
    },
    {
        lable: "Metrics",
        tabKey: "metrics",
        icon: ChartNoAxesColumn
    },
]

export const metrics = [
    {
        label: 'Grammar Accuracy',
        value: 92,
        color: 'bg-green-500',
        icons: BadgeCheck
    },
    {
        label: 'Pronunciation',
        value: 88,
        color: 'bg-blue-500',
        icons: Check
    },
    {
        label: 'Fluency',
        value: 76,
        color: 'bg-yellow-500',
        icons: Check

    },
    {
        label: 'Pacing',
        value: 95,
        color: 'bg-purple-500',
        icons: Check

    },
    {
        label: 'Confidence',
        value: 82,
        color: 'bg-pink-500',
        icons: Check

    },
]

export const RenderSVG = ({ Icon, props }: RenderSVGType) => {
    return <Icon  {...props} />
}
