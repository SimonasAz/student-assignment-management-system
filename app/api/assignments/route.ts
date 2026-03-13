import prisma from "@/prisma/lib/prisma";

export async function GET() {
  const assignments = await prisma.assignment.findMany()
  return Response.json(assignments)
}

export async function POST(req: Request) {
  const data = await req.json()

  const user = await prisma.user.findFirst()

  if (!user) {
    return new Response("No user found", { status: 400 })
  }

  const assignment = await prisma.assignment.create({
    data: {
      title: data.title,
      deadline: new Date(data.deadline),
      status: data.status,
      difficulty: parseInt(data.difficulty),
      user: {
        connect: { id: user!.id }
      }
    }
  })

  if (!data.difficulty) {
    return new Response("Difficulty required", {status: 400 })
  }

  return Response.json(assignment)
}