import prisma from "@/prisma/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser()

    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const { id } = await context.params

    const category = await prisma.category.findUnique({
        where: { id }
    })

    if (!category) {
        return new Response(JSON.stringify({ error: "Category not found" }), { status: 404 })
    }

    await prisma.assignment.updateMany({
        where: { categoryId: id },
        data: { categoryId: null }
    })

    await prisma.category.delete({
        where: { id }
    })

    return new Response(JSON.stringify({ message: "Category deleted successfully" }), { status: 200 })

}