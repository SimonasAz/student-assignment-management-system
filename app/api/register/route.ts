import prisma from "@/prisma/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
    try{

        const data = await req.json()
        const email = data.email.toLowerCase().trim()

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if(existingUser){
            return Response.json({error: "User already exists"}, {status: 400})
        }
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
    catch(err){
        return Response.json({error: "Something went wrong"}, {status: 500})
    }
}