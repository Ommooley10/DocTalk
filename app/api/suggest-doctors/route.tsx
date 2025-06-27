import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { notes } = await req.json();

    try {
        const completion = await openai.chat.completions.create({
            model: "mistralai/mistral-small-3.2-24b-instruct-2506:free",
            messages: [
                { role: "system", content: JSON.stringify(AIDoctorAgents) },
                { role: "user", content: `User Notes/Symptoms: ${notes}. Based on this, please suggest a list of doctors. Return object in JSON only.` }
            ],
        });

        const rawResp = completion.choices[0].message?.content || '';
        const cleaned = rawResp.trim().replace('```json', '').replace('```', '');
        const JSONResp = JSON.parse(cleaned);

        return NextResponse.json(JSONResp);

    } catch (error: any) {
        console.error("AI Error:", error);
        return NextResponse.json({
            error: "Model response failed",
            message: error?.message || "Unknown error",
        }, { status: 400 });
    }
}
