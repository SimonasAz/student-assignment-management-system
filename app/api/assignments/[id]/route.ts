import prisma from "@/prisma/lib/prisma";

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {

    const { id } =  await context.params
    try{
        const assignment = await prisma.assignment.delete({
        where: { id }
    })
    return Response.json(assignment)

    } catch{
        return Response.json(
            { error: "Assignment not found" },
            { status: 404 }
        )

    }
}
