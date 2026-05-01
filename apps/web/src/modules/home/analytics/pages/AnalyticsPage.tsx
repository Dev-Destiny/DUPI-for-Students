import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/axios";

// Components
import StatCards from "../components/StatCards";
import ActivityChart from "../components/ActivityChart";
import RecentScores from "../components/RecentScores";
import RetentionChart from "../components/RetentionChart";
import HabitHeatmap from "../components/HabitHeatmap";
import HabitStats from "../components/HabitStats";

const spring = { type: "spring", stiffness: 260, damping: 30 };
const tabs = ["Overview", "Learning Curve", "Study Habits"] as const;
type Tab = (typeof tabs)[number];

const AnalyticsPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState<Tab>("Overview");
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState<any>(null);

	const fetchAnalytics = async () => {
		try {
			const response = await api.get("/analytics");
			setData(response.data);
		} catch (error) {
			console.error("Failed to fetch analytics:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchAnalytics();
	}, []);

	if (isLoading) {
		return (
			<div className='flex-1 flex items-center justify-center bg-background'>
				<motion.div
					className='size-10 border-4 border-brand-orange/20 border-t-brand-orange rounded-full'
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
				/>
			</div>
		);
	}

	return (
		<div className='flex-1 flex flex-col h-full bg-background overflow-y-auto custom-scrollbar relative'>
			{/* Ambient blurs */}
			<div className='absolute top-0 right-0 w-96 h-96 bg-brand-orange/4 rounded-full blur-[120px] pointer-events-none' />

			{/* Header */}
			<div className='px-4 md:px-8 pt-8 md:pt-10 pb-6 border-b border-border/40 bg-background/60 backdrop-blur-md sticky top-0 z-10'>
				<motion.div
					initial={{ opacity: 0, y: -8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={spring}
					className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-widest mb-3'
				>
					Performance
				</motion.div>
				<motion.h1
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ ...spring, delay: 0.05 }}
					className='text-4xl md:text-5xl font-serif text-foreground tracking-tight mb-2'
				>
					Analytics
				</motion.h1>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.1 }}
					className='text-sm text-muted-foreground max-w-lg leading-relaxed'
				>
					Track your learning progress, see historical scores, and monitor spaced-repetition mastery over time.
				</motion.p>

				{/* Tab bar */}
				<div className='flex items-center gap-1 mt-6 overflow-x-auto hide-scrollbar pb-1'>
					{tabs.map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`relative px-5 py-2 rounded-xl text-xs font-bold transition-colors ${activeTab === tab ? "text-brand-orange" : "text-muted-foreground hover:text-foreground"}`}
						>
							{activeTab === tab && (
								<motion.div
									layoutId='analyticsTab'
									className='absolute inset-0 bg-brand-orange/10 border border-brand-orange/20 rounded-xl -z-10'
									initial={false}
									transition={spring}
								/>
							)}
							{tab}
						</button>
					))}
				</div>
			</div>

			{/* Tab content */}
			<div className='p-4 md:p-8 flex-1'>
				<AnimatePresence mode='wait'>
					{activeTab === "Overview" && (
						<motion.div
							key='overview'
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={spring}
							className='space-y-8'
						>
							<StatCards stats={data?.stats} />
							<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
								<ActivityChart data={data?.activityData} />
								<RecentScores scores={data?.recentScores} />
							</div>
						</motion.div>
					)}

					{activeTab === "Learning Curve" && (
						<motion.div
							key='curve'
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={spring}
						>
							<RetentionChart data={data?.retentionData} />
						</motion.div>
					)}

					{activeTab === "Study Habits" && (
						<motion.div
							key='habits'
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={spring}
						>
							<HabitHeatmap data={data?.heatmapData} />
							<HabitStats stats={data?.habitStats} />
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default AnalyticsPage;
