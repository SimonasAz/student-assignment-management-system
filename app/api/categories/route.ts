import prisma from "@/prisma/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
    const user = await getCurrentUser()
    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const categories = await prisma.category.findMany(
        {
            where: { userId: user.id }
        }
    )

    return Response.json(categories)
}

export async function POST(req: Request) {
    const user = await getCurrentUser()
    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const data = await req.json()
    if (!data.name) {
        return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 })
    }
    try{
        const category = await prisma.category.create({
            data: {
                name: data.name,
                userId: user.id
            }
        })
        return Response.json(category)
    } catch {
        return Response.json({error: "Category already exists"}, { status: 400 })
    }  

}