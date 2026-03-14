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
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
){

  const { id } = await context.params
  const data = await req.json()

  try {

    const assignment = await prisma.assignment.update({
      where: { id },
      data: {
        title: data.title,
        deadline: new Date(data.deadline),
        status: data.status,
        difficulty: parseInt(data.difficulty)
      }
    })

    return Response.json(assignment)

  } catch {

    return Response.json(
      { error: "Assignment not found" },
      { status: 404 }
    )

  }

}
