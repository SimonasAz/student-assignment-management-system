import prisma from "@/prisma/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
    const data = await req.json()

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword
            
        }
        
    })
    return Response.json({
        id: user.id,
        name: user.name,
        email: user.email
    })
}