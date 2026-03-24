import prisma from "@/prisma/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {

    const user = await getCurrentUser()

    if (!user)  return new Response("Unauthorized", { status: 401 });

    const { id } =  await context.params;
    
        const existingAssignment = await prisma.assignment.findUnique({
        where: { id },        
  });

    if (!existingAssignment)  
    return Response.json({ error: "Assignment not found" }, { status: 404 });
    
    if (existingAssignment.userId !== user.id) 
    return Response.json({ error: "Forbidden" }, { status: 403 });

    await prisma.assignment.delete({
        where: { id }
    });

   return Response.json({ message: "Assignment deleted" })
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
){

  
  const user = await getCurrentUser()

  if (!user)  return new Response("Unauthorized", { status: 401 });

  const { id } = await context.params
  const data = await req.json()

    if (!data.title || !data.deadline || !data.status || !data.difficulty) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existingAssignment = await prisma.assignment.findUnique({
    where: { id }
  })

  if (!existingAssignment) {
    return Response.json({ error: "Assignment not found" }, { status: 404 });
  }

  if (existingAssignment.userId !== user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  
    const updatedAssignment = await prisma.assignment.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || null,
        deadline: new Date(data.deadline),
        status: data.status,
        difficulty: Number(data.difficulty),
        categoryId: data.categoryId || null,
      },
    });

    return Response.json(updatedAssignment)
  }

  export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
  ) {
    const user = await getCurrentUser();
    if (!user)  return new Response("Unauthorized", { status: 401 });

    const { id } = await context.params;
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!assignment) {
      return Response.json({ error: "Assignment not found" }, { status: 404 });
    }

    if (assignment.userId !== user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json(assignment);

  }
  

