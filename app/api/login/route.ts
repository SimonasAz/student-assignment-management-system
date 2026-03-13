import prisma from "@/prisma/lib/prisma";
import bcrypt from  "bcrypt"

export async function POST(req: Request) {
    const data = await req.json()

    const user = await prisma.user.findUnique({
        where: {email: data.email}
    })

    if (!user){
        return new Response("User not found", {status: 400})
    }

    const valid = await bcrypt.compare(data.password, user.password)

    if(!valid){
        return new Response("Invalid password", {status: 400})
    }

    return Response.json({
        id: user.id,
        email: user.email,
        name: user.name
    })
}