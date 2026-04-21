import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: "test@gmail.com" },
    });

    if (!user) {
        console.log("No users found. Create a user first")
        return
    }
    for (let i = 1; i <= 50; i++) {
        await prisma.assignment.create({
            data: {
                title: `Assignment ${i}`,
                description: `Test assignment ${i}`,
                deadline: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
                status: String(Math.floor(Math.random() * 3) + 1),
                difficulty: Math.floor(Math.random() * 3) + 1,
                priority: Math.floor(Math.random() * 3) + 1,
                userId: user.id,
            },
        });
    }
    console.log("Seeded 50 assignments for user");
}
main()
    
    .catch(console.error)
    .finally(() => prisma.$disconnect())
