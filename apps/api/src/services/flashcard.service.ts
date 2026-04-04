import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";

export const getFlashcardsByUser = async (userId: string) => {
  return prisma.flashcard.findMany({
    where: { userId },
    include: {
      document: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getFlashcardsDue = async (userId: string) => {
  const now = new Date();
  return prisma.flashcard.findMany({
    where: { 
      userId,
      OR: [
        { nextReview: { lte: now } },
        { nextReview: null } // New cards that haven't been reviewed yet
      ]
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 50,
  });
};

export const createFlashcard = async (userId: string, data: { front: string; back: string; documentId?: string }) => {
  return prisma.flashcard.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const updateFlashcard = async (id: string, userId: string, data: any) => {
  const flashcard = await prisma.flashcard.findFirst({ where: { id, userId } });
  if (!flashcard) throw new ApiError(404, "NOT_FOUND", "Flashcard not found.");

  return prisma.flashcard.update({
    where: { id },
    data,
  });
};

export const deleteFlashcard = async (id: string, userId: string) => {
  const flashcard = await prisma.flashcard.findFirst({ where: { id, userId } });
  if (!flashcard) throw new ApiError(404, "NOT_FOUND", "Flashcard not found.");

  return prisma.flashcard.delete({
    where: { id },
  });
};

export const recordReview = async (id: string, userId: string, quality: number) => {
  const flashcard = await prisma.flashcard.findFirst({ where: { id, userId } });
  if (!flashcard) throw new ApiError(404, "NOT_FOUND", "Flashcard not found.");

  let { repetitions, easeFactor, intervalDays } = flashcard;
  let ef = Number(easeFactor);

  if (quality >= 3) {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.ceil(intervalDays * ef);
    }
    repetitions++;
  } else {
    repetitions = 0;
    intervalDays = 1;
  }

  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ef < 1.3) ef = 1.3;

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + intervalDays);

  return prisma.$transaction([
    prisma.flashcard.update({
      where: { id },
      data: {
        repetitions,
        easeFactor: ef,
        intervalDays,
        nextReview,
      },
    }),
    prisma.flashcardReview.create({
      data: {
        flashcardId: id,
        userId,
        quality,
      },
    }),
  ]);
};
