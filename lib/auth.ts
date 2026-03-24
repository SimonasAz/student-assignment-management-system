import prisma from "@/prisma/lib/prisma";
import { cookies } from "next/headers";

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
        return null;
    }

    const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { user: true }
    });

    if (!session) return null;

    if (session.expiresAt < new Date()) return null; 

    return session.user;
       
}
