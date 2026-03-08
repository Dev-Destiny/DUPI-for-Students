import { BookOpen, BookMarked, PenLine } from "lucide-react";

export const slide = {
	initial: { opacity: 0, x: 40 },
	animate: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
	},
	exit: {
		opacity: 0,
		x: -40,
		transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
	},
};

export const FIELDS = [
	"Computer Science",
	"Medicine",
	"Law",
	"Engineering",
	"Business",
	"Education",
	"Arts & Humanities",
	"Natural Sciences",
	"Social Sciences",
	"Other",
];

export const USE_CASES = [
	{ icon: BookOpen, label: "Lecture notes" },
	{ icon: BookMarked, label: "Textbook chapters" },
	{ icon: PenLine, label: "Study guides" },
];
