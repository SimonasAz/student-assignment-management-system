import { getCurrentUser } from "@/lib/auth";
import prisma from "@/prisma/lib/prisma";

export async function GET() {
  const user = await getCurrentUser()  

  if (!user)  return new Response("Unauthorized", { status: 401 })
  
  const assignments = await prisma.assignment.findMany({
    where: { userId: user.id },
    include: {category : true},
    orderBy: { deadline: "asc" }
  });

  return Response.json(assignments)
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  
  if (!user)  return new Response("Unauthorized", { status: 401 })

  const data = await req.json()

  if (!data.title || !data.deadline || !data.status || !data.difficulty) {
  return new Response("Missing required fields", { status: 400 });
  }

  const assignment = await prisma.assignment.create({
    data: {
      title: data.title,
      description: data.description || null,
      deadline: new Date(data.deadline),
      status: data.status,
      difficulty: Number(data.difficulty),
      categoryId: data.categoryId || null,
      userId: user.id,      
    },
  });

  
  return Response.json(assignment)
}