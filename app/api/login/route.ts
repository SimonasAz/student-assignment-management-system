import prisma from "@/prisma/lib/prisma";
import bcrypt from  "bcrypt"
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const data = await req.json()

    const user = await prisma.user.findUnique({
        where: {email: data.email}
    })

    if (!user){
        return  Response.json({error: "User not found"}, {status: 400})
    }

    const valid = await bcrypt.compare(data.password, user.password)

    if(!valid){
        return  Response.json({error: "Invalid password"}, {status: 400})
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const session = await prisma.session.create({
        data: {
            userId: user.id,
            expiresAt
        }
    });

    const cookieStore = await cookies();
    cookieStore.set("sessionId", session.id,{
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        expires: expiresAt,
        path: "/"
    });

    return Response.json({
        id: user.id,
        email: user.email,
        name: user.name
    })
}