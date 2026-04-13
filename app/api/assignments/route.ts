import { getCurrentUser } from "@/lib/auth";
import prisma from "@/prisma/lib/prisma";

export async function GET(req: Request) {
  const user = await getCurrentUser()  
  const { searchParams } = new URL(req.url)

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = Number(searchParams.get("page") || 1)
  const limit = Number(searchParams.get("limit") || 10)

  const skip = (page - 1) * limit
 
  const assignments = await prisma.assignment.findMany({
    where: { userId: user.id },
    include: {category : true},
    orderBy: { deadline: "asc" },
    skip,
    take: limit
  });

  const total = await prisma.assignment.count({
    where: { userId: user.id }
  })
  
  return Response.json({ assignments, total })
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  
  if (!user)  return Response.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json()

  if (!data.title || !data.deadline || !data.status || !data.difficulty) {
  return Response.json({ error: "Missing required fields" }, { status: 400 });
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