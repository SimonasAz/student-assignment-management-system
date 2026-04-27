import prisma from "@/prisma/lib/prisma";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("sessionId")?.value

    if (sessionId) {
        await prisma.session.deleteMany({ 
            where: { id: sessionId } 
        })        
    }

     cookieStore.delete("sessionId")

     return Response.json({ message: "Logged out successfully" })
}