import { NextResponse } from "next/server";
import { calculateSimilarity } from "@/lib/pronunciation";

export async function POST(req: Request) {
    const { expected, spoken } = await req.json();

    const score = calculateSimilarity(
        expected.toLowerCase(),
        spoken.toLowerCase()
    );

    let message = "";

    if (score > 0.9) {
        message = "Perfect Pronunciation!";
    } else if (score > 0.75) {
        message = " Almost Correct!";
    } else {
        message = "Try Again!";
    }

    return NextResponse.json({ score, message });
}