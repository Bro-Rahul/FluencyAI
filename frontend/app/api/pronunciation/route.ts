import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { expected, spoken } = await req.json();
    const baseURL = process.env.NEXT_PUBLIC_BASEURL;

    if (!baseURL) {
        return NextResponse.json(
            { detail: "NEXT_PUBLIC_BASEURL is not configured." },
            { status: 500 }
        );
    }

    const response = await fetch(`${baseURL}/pronunciation/evaluate/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ expected, spoken }),
    });

    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json(
            { detail: data.detail ?? "Unable to evaluate pronunciation." },
            { status: response.status }
        );
    }

    return NextResponse.json(data);
}
