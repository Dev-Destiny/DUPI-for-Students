import prisma from "../lib/prisma.js";
import { startOfDay, subDays, format, isSameDay, differenceInDays } from "date-fns";
import { TestAttempt, FlashcardReview, Flashcard } from "@prisma/client";

export const getUserAnalytics = async (userId: string) => {
	// 1. Get all Test Attempts and Flashcard Reviews
	const [testAttempts, flashcardReviews, flashcards] = await Promise.all([
		prisma.testAttempt.findMany({
			where: { userId },
			orderBy: { completedAt: "desc" },
			include: { test: true },
		}) as Promise<Array<TestAttempt & { test: any }>>,
		prisma.flashcardReview.findMany({
			where: { userId },
			orderBy: { reviewedAt: "desc" },
		}) as Promise<Array<FlashcardReview>>,
		prisma.flashcard.findMany({
			where: { userId },
		}) as Promise<Array<Flashcard>>,
	]);

	// --- 2. Calculate Streak ---
	const activityDates = new Set<string>();
	testAttempts.forEach((a) => activityDates.add(format(a.completedAt, "yyyy-MM-dd")));
	flashcardReviews.forEach((r) => activityDates.add(format(r.reviewedAt, "yyyy-MM-dd")));

	const sortedDates = Array.from(activityDates)
		.map((d) => new Date(d))
		.sort((a, b) => b.getTime() - a.getTime());

	let streak = 0;
	if (sortedDates.length > 0) {
		const today = startOfDay(new Date());
		const mostRecent = startOfDay(sortedDates[0]);
		
		// If last activity was today or yesterday, start counting
		if (differenceInDays(today, mostRecent) <= 1) {
			streak = 1;
			for (let i = 0; i < sortedDates.length - 1; i++) {
				const current = startOfDay(sortedDates[i]);
				const next = startOfDay(sortedDates[i + 1]);
				if (differenceInDays(current, next) === 1) {
					streak++;
				} else {
					break;
				}
			}
		}
	}

	// --- 3. Calculate Average Score ---
	const validScores = testAttempts
		.map((a) => Number(a.score))
		.filter((s) => !isNaN(s));
	const averageScore = validScores.length > 0
		? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
		: 0;

	// --- 4. Cards Mastered ---
	// Cards with ease factor > 2.5 and repetitions > 3
	const cardsMastered = flashcards.filter(
		(f) => Number(f.easeFactor) >= 2.5 && f.repetitions >= 3
	).length;

	// --- 5. Time Studied ---
	const totalSeconds = testAttempts.reduce((acc, curr) => acc + (curr.timeSpentSeconds || 0), 0);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const timeStudied = `${hours}h ${minutes}m`;

	// --- 6. Last 7 Days Activity (Questions/Cards) ---
	const last7Days = Array.from({ length: 7 }, (_, i) => {
		const date = subDays(new Date(), 6 - i);
		const dateStr = format(date, "yyyy-MM-dd");
		const dayName = format(date, "EEE");

		const attemptsCount = testAttempts.filter(
			(a) => format(a.completedAt, "yyyy-MM-dd") === dateStr
		).length;
		const reviewsCount = flashcardReviews.filter(
			(r) => format(r.reviewedAt, "yyyy-MM-dd") === dateStr
		).length;

		return {
			day: dayName,
			value: attemptsCount + reviewsCount,
		};
	});

	// --- 7. Recent Scores ---
	const recentScores = testAttempts.slice(0, 5).map((a) => ({
		test: a.test.title || "Untitled Test",
		score: Number(a.score),
		date: formatRelativeDate(a.completedAt),
	}));

	// --- 8. Habit Stats ---
	// All-time best streak
	let bestStreak = streak;
	let tempStreak = 0;
	for (let i = 0; i < sortedDates.length - 1; i++) {
		const current = startOfDay(sortedDates[i]);
		const next = startOfDay(sortedDates[i + 1]);
		if (differenceInDays(current, next) === 1) {
			tempStreak = tempStreak === 0 ? 2 : tempStreak + 1;
		} else {
			bestStreak = Math.max(bestStreak, tempStreak);
			tempStreak = 0;
		}
	}
	bestStreak = Math.max(bestStreak, tempStreak);

	const activeWeeksCount = new Set(
		Array.from(activityDates).map(d => format(new Date(d), "yyyy-ww"))
	).size;

	const dayCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
	Array.from(activityDates).forEach(d => {
		dayCounts[new Date(d).getDay()]++;
	});
	const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const mostActiveDay = dayNames[dayCounts.indexOf(Math.max(...dayCounts))];

	const avgPerDay = sortedDates.length > 0 
		? Math.round((testAttempts.length + flashcardReviews.length) / sortedDates.length)
		: 0;

	const now = new Date();

	// --- 9. Learning Curve (Retention) ---
	// Calculate avg score per week for the last 8 weeks
	const retentionData = Array.from({ length: 8 }, (_, i) => {
		const startOfWeek = subDays(now, (7 - i) * 7 + now.getDay());
		const endOfWeek = subDays(startOfWeek, -7);
		
		const weekAttempts = testAttempts.filter(
			a => a.completedAt >= startOfWeek && a.completedAt < endOfWeek
		);
		
		const avg = weekAttempts.length > 0
			? Math.round(weekAttempts.reduce((acc, curr) => acc + Number(curr.score), 0) / weekAttempts.length)
			: 0;
		
		return {
			week: `Wk ${i + 1}`,
			retention: avg || (i > 0 ? 0 : 40) // Default starting point if no data
		};
	});

	// --- 10. Heatmap Data (16 weeks) ---
	const heatmapData = Array.from({ length: 7 }, (_, dayIdx) => {
		return Array.from({ length: 16 }, (_, weekIdx) => {
			const date = subDays(now, (15 - weekIdx) * 7 + (now.getDay() === 0 ? 6 : now.getDay() - 1) - dayIdx);
			const dateStr = format(date, "yyyy-MM-dd");
			
			const count = 
				testAttempts.filter((a) => format(a.completedAt, "yyyy-MM-dd") === dateStr).length +
				flashcardReviews.filter((r) => format(r.reviewedAt, "yyyy-MM-dd") === dateStr).length;

			if (count === 0) return 0;
			if (count < 5) return 1;
			if (count < 10) return 2;
			if (count < 20) return 3;
			return 4;
		});
	});

	return {
		stats: {
			streak: `${streak} Days`,
			averageScore: `${averageScore}%`,
			cardsMastered,
			timeStudied,
		},
		habitStats: {
			activeWeeks: `${activeWeeksCount} / 16`,
			bestStreak: `${bestStreak} days`,
			avgPerDay: `${avgPerDay} items`,
			mostActiveDay,
		},
		activityData: last7Days,
		recentScores,
		retentionData,
		heatmapData,
	};
};

function formatRelativeDate(date: Date) {
	const diff = differenceInDays(new Date(), date);
	if (diff === 0) return "Today";
	if (diff === 1) return "Yesterday";
	if (diff < 7) return `${diff} days ago`;
	return format(date, "MMM d, yyyy");
}
