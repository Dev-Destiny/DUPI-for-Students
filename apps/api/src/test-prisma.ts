import prisma from "./lib/prisma";
async function check() {
  try {
    const docs = await prisma.document.findMany({ take: 1 });
    console.log("Docs:", docs);
  } catch (err) {
    console.error("Prisma error:", err);
  }
}
check();
