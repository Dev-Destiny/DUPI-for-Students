import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@dupi/ui";
import { Filter, Search, GraduationCap } from "lucide-react";
import { TestCard } from "../components/TestCard";

// Mock Data
const mockTests = [
	{
		id: "1",
		title: "Cellular Respiration Final Review",
		documentName: "Biology Ch 12.pdf",
		questionsCount: 20,
		difficulty: "medium" as const,
		status: "completed" as const,
		score: 85,
		lastAttempt: "2 hours ago",
	},
	{
		id: "2",
		title: "Node.js Fundamentals Quiz",
		documentName: "Intro to Node.js and Express.docx",
		questionsCount: 15,
		difficulty: "easy" as const,
		status: "in-progress" as const,
		lastAttempt: "Yesterday",
	},
	{
		id: "3",
		title: "Advanced React Context API",
		documentName: "React Advanced Patterns.txt",
		questionsCount: 10,
		difficulty: "hard" as const,
		status: "new" as const,
	},
	{
		id: "4",
		title: "SQL Joins Practice Test",
		documentName: "Database Schema Overview.pdf",
		questionsCount: 25,
		difficulty: "medium" as const,
		status: "new" as const,
	},
	{
		id: "5",
		title: "World War 2 History Dates",
		documentName: "WW2 History.pdf",
		questionsCount: 30,
		difficulty: "hard" as const,
		status: "completed" as const,
		score: 62,
		lastAttempt: "3 days ago",
	},
	{
		id: "6",
		title: "Basic Mathematics Algebra",
		documentName: "Algebra 101.pdf",
		questionsCount: 10,
		difficulty: "easy" as const,
		status: "completed" as const,
		score: 100,
		lastAttempt: "Last week",
	},
];

const Tabs = ["All Tests", "Completed", "In Progress", "Not Started"];

const TestsPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState("All Tests");
	const [searchQuery, setSearchQuery] = useState("");

	const filteredTests = mockTests.filter((test) => {
		const matchesTab =
			activeTab === "All Tests" ||
			(activeTab === "Completed" && test.status === "completed") ||
			(activeTab === "In Progress" && test.status === "in-progress") ||
			(activeTab === "Not Started" && test.status === "new");

		const matchesSearch =
			test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			test.documentName.toLowerCase().includes(searchQuery.toLowerCase());

		return matchesTab && matchesSearch;
	});

	return (
		<div className='flex-1 flex flex-col h-full bg-background overflow-hidden relative'>
			{/* Decorative ambient background blurs */}
			<div className='absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none' />
			<div className='absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-violet/5 rounded-full blur-[150px] pointer-events-none' />

			{/* Refined Header area */}
			<div className='px-8 pt-10 pb-6 border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-10'>
				<div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
					<div className='relative z-10'>
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(255,111,32,0.15)]'
						>
							<GraduationCap className='size-3.5 fill-current' />{" "}
							Study Hub
						</motion.div>
						<motion.h1
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							className='text-3xl md:text-5xl font-black text-foreground font-serif tracking-tight mb-3 flex items-center gap-3 drop-shadow-lg'
						>
							My Tests
						</motion.h1>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className='text-muted-foreground font-medium text-sm max-w-xl leading-relaxed'
						>
							Review your auto-generated practice tests, track
							your scores, and re-take quizzes to improve your
							retention.
						</motion.p>
					</div>

					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.15 }}
						className='flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10'
					>
						<div className='relative w-full sm:w-64'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
							<Input
								placeholder='Search tests...'
								className='pl-10 bg-card/50 border-border focus-visible:ring-brand-orange/50 rounded-xl h-11 transition-all focus:bg-card hover:bg-card/80 shadow-sm'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<button className='flex items-center justify-center gap-2 h-11 px-4 bg-card/50 border border-border rounded-xl text-muted-foreground hover:text-brand-orange hover:bg-brand-orange/5 hover:border-brand-orange/30 transition-all font-bold text-xs uppercase tracking-wider shrink-0 w-full sm:w-auto shadow-sm'>
							<Filter className='size-4' />
							Filter
						</button>
					</motion.div>
				</div>
			</div>

			{/* Filter Tabs */}
			<div className='px-8 py-5 border-b border-border/50 bg-background/30 backdrop-blur-sm sticky top-[180px] md:top-[160px] z-10'>
				<div className='flex items-center gap-2 overflow-x-auto pb-2 -mb-2 custom-scrollbar hide-scroll-indicator'>
					{Tabs.map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
								activeTab === tab
									? "bg-brand-orange text-white shadow-[0_4px_15px_-3px_rgba(255,111,32,0.4)] scale-105"
									: "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
							}`}
						>
							{tab}
						</button>
					))}
				</div>
			</div>

			{/* Dynamic Grid */}
			<div className='flex-1 overflow-y-auto custom-scrollbar p-8'>
				<AnimatePresence mode='wait'>
					{filteredTests.length > 0 ? (
						<motion.div
							key='grid'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
						>
							{filteredTests.map((test, i) => (
								<motion.div
									key={test.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.05 + 0.2 }}
								>
									<TestCard test={test} />
								</motion.div>
							))}
						</motion.div>
					) : (
						<motion.div
							key='empty'
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className='h-full flex flex-col items-center justify-center text-center max-w-md mx-auto relative z-10'
						>
							<div className='w-24 h-24 mb-6 rounded-3xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 shadow-[0_0_30px_rgba(255,111,32,0.15)] ring-1 ring-brand-orange/30'>
								<GraduationCap className='size-10 text-brand-orange' />
							</div>
							<h3 className='text-xl font-bold text-foreground mb-2'>
								No tests found
							</h3>
							<p className='text-sm text-muted-foreground mb-8'>
								We couldn't find any tests matching your current
								filters.
							</p>
							<button className='px-6 py-3 bg-brand-orange text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-brand-orange/90 transition-all shadow-[0_0_20px_rgba(255,111,32,0.3)]'>
								Generate a new Test
							</button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default TestsPage;
