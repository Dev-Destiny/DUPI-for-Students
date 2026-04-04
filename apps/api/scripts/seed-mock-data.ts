import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();

  if (!user) {
    console.error("No user found. Please register a user first.");
    return;
  }

  console.log(`Seeding data for user: ${user.email} (${user.id})`);

  // 1. Create a mock Document
  const document = await prisma.document.create({
    data: {
      userId: user.id,
      title: "Cell Biology Fundamentals",
      fileUrl: "https://example.com/cell-bio.pdf",
      fileType: "pdf",
      fileSizeBytes: 1024 * 1024 * 2, // 2MB
      processed: true,
      chunkCount: 15,
    },
  });

  console.log(`Created document: ${document.id}`);

  // 2. Create a mock Test
  const test = await prisma.test.create({
    data: {
      userId: user.id,
      documentId: document.id,
      title: "Cell Biology Quiz - Chapter 1",
      topic: "Cell Structure and Organelles",
      difficulty: "medium",
      questions: [
        {
          id: "q1",
          question: "Which organelle is known as the powerhouse of the cell?",
          options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Apparatus"],
          answer: "Mitochondria",
          type: "mcq"
        },
        {
          id: "q2",
          question: "What is the primary function of the cell membrane?",
          options: ["Energy production", "Protein synthesis", "Selective permeability", "Waste storage"],
          answer: "Selective permeability",
          type: "mcq"
        },
        {
          id: "q3",
          question: "Describe the role of the Golgi Apparatus in a sentence.",
          type: "short_answer",
          answer: "It modifies, sorts, and packages proteins for secretion."
        }
      ],
    },
  });

  console.log(`Created test: ${test.id}`);

  // 3. Create mock Flashcards
  await prisma.flashcard.createMany({
    data: [
      {
        userId: user.id,
        documentId: document.id,
        front: "Mitochondria",
        back: "Organelle that generates ATP through cellular respiration.",
      },
      {
        userId: user.id,
        documentId: document.id,
        front: "Ribosome",
        back: "The site of protein synthesis in the cell.",
      },
      {
        userId: user.id,
        documentId: document.id,
        front: "Cytoplasm",
        back: "The jelly-like substance that fills the cell and surrounds organelles.",
      },
      {
        userId: user.id,
        documentId: document.id,
        front: "ATP",
        back: "Adenosine Triphosphate — the primary energy currency of the cell.",
      }
    ],
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
