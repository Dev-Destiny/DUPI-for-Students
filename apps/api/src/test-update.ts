import prisma from "./lib/prisma";

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No user found");
    return;
  }

  console.log("Found user:", user.email, "isOnboarded:", (user as any).isOnboarded);

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      isOnboarded: true
    } as any
  });

  console.log("Updated user isOnboarded:", (updated as any).isOnboarded);
}

main().catch(console.error);
