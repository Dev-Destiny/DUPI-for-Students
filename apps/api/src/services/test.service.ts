import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";

export const getTestsByUser = async (userId: string) => {
  return prisma.test.findMany({
    where: { userId },
    include: {
      document: {
        select: {
          title: true,
        },
      },
      testAttempts: {
        orderBy: {
          completedAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getTestById = async (id: string, userId: string) => {
  const test = await prisma.test.findFirst({
    where: { id, userId },
    include: {
      document: true,
      testAttempts: {
        orderBy: {
          completedAt: "desc",
        },
      },
    },
  });

  if (!test) {
    throw new ApiError(404, "TEST_NOT_FOUND", "Test not found or doesn't belong to you.");
  }

  return test;
};

export const createAttempt = async (testId: string, userId: string, data: { answers: any; timeSpentSeconds?: number }) => {
  const test = await getTestById(testId, userId);
  
  // Basic scoring logic (can be more complex)
  const questions = test.questions as any[];
  let correctCount = 0;
  const totalQuestions = questions.length;

  questions.forEach((q) => {
    if (data.answers[q.id] === q.answer) {
      correctCount++;
    }
  });

  const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

  return prisma.testAttempt.create({
    data: {
      testId,
      userId,
      score,
      answers: data.answers,
      timeSpentSeconds: data.timeSpentSeconds || 0,
    },
  });
};

export const deleteTest = async (id: string, userId: string) => {
  const test = await getTestById(id, userId);
  return prisma.test.delete({
    where: { id },
  });
};
