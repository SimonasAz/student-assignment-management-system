import prisma from "@/prisma/lib/prisma";

export async function GET() {
    const assignments = await prisma.assignment.findMany()

    return Response.json(assignments)    
}

export async function POST(req:Request) {
    const data = await req.json()

    const assignment = await prisma.assignment.create({
        data: {
            title: data.title,
            description: data.description,
            deadline: new Date(data.deadline),
            status: data.status,
            difficulty: data.difficulty,
            userId: data.userId,
            categoryId: data.categoryId
        }
    })
    
    return Response.json(assignment)
}