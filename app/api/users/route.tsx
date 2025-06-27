import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const user = await currentUser();

    try {
        // Check if user already exists
        const users = await db.select().from(usersTable)
            // @ts-ignore
            .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress));

        // If not then create new user
        if (users?.length == 0) {
            const result = await db.insert(usersTable).values({
                name: user?.fullName ?? "",
                email: user?.primaryEmailAddress?.emailAddress ?? "",
                credits: 20
            }).returning();

            return NextResponse.json(result[0]);
        }

        return NextResponse.json(users[0]);
    } catch (e: any) {
        console.error("ERROR in /api/users:", e);
        return NextResponse.json(e, { status: 500 });
    }
}
