import prisma from "@/prisma/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
    const user = await getCurrentUser()

    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    return Response.json({
        id: user.id,
        name: user.name,
        email: user.email
    })
}

export async function PUT(req: Request) {
    const user = await getCurrentUser()

    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const data = await req.json()

    const cleanName = data.name?.trim()
    const cleanEmail = data.email?.trim()

    if (!cleanName || !cleanEmail) {
        return new Response(
            JSON.stringify({ error: "All fields are required" }),
            { status: 400 }
        )
    }

    if (!cleanEmail.includes("@")) {
        return new Response(
            JSON.stringify({ error: "Invalid email format" }),
            { status: 400 }
        )
    }

    try {
        const updated = await prisma.user.update({
            where: { id: user.id },
            data: {
                name: cleanName,
                email: cleanEmail
            }
        })

        return Response.json(updated)

    } catch (err: any) {
        if (err.code === "P2002") {
            return new Response(
                JSON.stringify({ error: "Email already in use" }),
                { status: 400 }
            )
        }

        return new Response(
            JSON.stringify({ error: "Something went wrong" }),
            { status: 500 }
        )
    }
}