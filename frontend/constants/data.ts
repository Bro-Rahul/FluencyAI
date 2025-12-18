import svg from "./svgs";

export const ResultsTabList = [
    {
        lable: "Final Score",
        tabKey: "finalScore",
        icon: svg.analyticsSVG
    },
    {
        lable: "Transcript",
        tabKey: "transcript",
        icon: svg.descriptionSVG
    },
    {
        lable: "Suggesions",
        tabKey: "suggesions",
        icon: svg.lightBulbSVG
    },
    {
        lable: "Metrics",
        tabKey: "metrics",
        icon: svg.equalizerSVG
    },
]

export const metrics = [
    {
        label: 'Grammar Accuracy',
        value: 92,
        color: 'bg-green-500',
        icons: svg.grammerSVG
    },
    {
        label: 'Pronunciation',
        value: 88,
        color: 'bg-blue-500',
        icons: svg.pronunciationSVG
    },
    {
        label: 'Fluency',
        value: 76,
        color: 'bg-yellow-500',
        icons: svg.fluencySVG

    },
    {
        label: 'Pacing',
        value: 95,
        color: 'bg-purple-500',
        icons: svg.pacingSVG

    },
    {
        label: 'Confidence',
        value: 82,
        color: 'bg-pink-500',
        icons: svg.confidenceSVG

    },
]