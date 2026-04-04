import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Clock, Award, Target, Zap, Calendar as CalendarIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, AreaChart, Area, YAxis } from "recharts";
import { Card, ChartContainer, ChartTooltip, ChartTooltipContent } from "@dupi/ui";

const spring = { type: "spring", stiffness: 260, damping: 30 };

const statCards = [
	{ title: "Study Streak", value: "12 Days", trend: "+2 from last week", icon: Zap, color: "text-brand-orange", bgColor: "bg-brand-orange/10" },
	{ title: "Average Score", value: "84%", trend: "+5% overall", icon: Target, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
	{ title: "Cards Mastered", value: "342", trend: "+45 this week", icon: Award, color: "text-brand-violet", bgColor: "bg-brand-violet/10" },
	{ title: "Time Studied", value: "24h 15m", trend: "This month", icon: Clock, color: "text-blue-400", bgColor: "bg-blue-400/10" },
];

const activityData = [
	{ day: "Mon", value: 65 }, { day: "Tue", value: 40 }, { day: "Wed", value: 85 },
	{ day: "Thu", value: 55 }, { day: "Fri", value: 90 }, { day: "Sat", value: 30 }, { day: "Sun", value: 75 },
];

const retentionData = [
	{ week: "Wk 1", retention: 38 }, { week: "Wk 2", retention: 52 }, { week: "Wk 3", retention: 45 },
	{ week: "Wk 4", retention: 61 }, { week: "Wk 5", retention: 58 }, { week: "Wk 6", retention: 74 },
	{ week: "Wk 7", retention: 70 }, { week: "Wk 8", retention: 82 },
];

const recentScores = [
	{ test: "Cellular Respiration", score: 85, date: "2 days ago" },
	{ test: "World War 2 History", score: 62, date: "4 days ago" },
	{ test: "Basic Mathematics", score: 100, date: "1 week ago" },
	{ test: "Advanced React Patterns", score: 45, date: "1 week ago" },
];

// Heatmap data — 7 rows (Mon–Sun), 16 weeks
const heatmapData = Array.from({ length: 7 }, (_, row) =>
	Array.from({ length: 16 }, (_, col) => {
		const seed = (row * 16 + col) % 17;
		if (seed < 4) return 0;
		if (seed < 8) return 1;
		if (seed < 12) return 2;
		if (seed < 15) return 3;
		return 4;
	})
);
const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
const heatIntensity = [
	"bg-muted/30 border-border/20",
	"bg-brand-orange/10 border-brand-orange/15",
	"bg-brand-orange/25 border-brand-orange/30",
	"bg-brand-orange/50 border-brand-orange/50",
	"bg-brand-orange border-brand-orange",
];

const activityChartConfig = { value: { label: "Activity", color: "#FF6F20" } };
const retentionChartConfig = { retention: { label: "Retention %", color: "#FF6F20" } };

const tabs = ["Overview", "Learning Curve", "Study Habits"] as const;
type Tab = typeof tabs[number];

const AnalyticsPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState<Tab>("Overview");

	return (
		<div className='flex-1 flex flex-col h-full bg-background overflow-y-auto custom-scrollbar relative'>
			{/* Ambient blurs */}
			<div className='absolute top-0 right-0 w-96 h-96 bg-brand-orange/4 rounded-full blur-[120px] pointer-events-none' />

			{/* Header */}
			<div className='px-4 md:px-8 pt-8 md:pt-10 pb-6 border-b border-border/40 bg-background/60 backdrop-blur-md sticky top-0 z-10'>
				<motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={spring}
					className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-widest mb-3'>
					Performance
				</motion.div>
				<motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.05 }}
					className='text-4xl md:text-5xl font-serif text-foreground tracking-tight mb-2'>
					Analytics
				</motion.h1>
				<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
					className='text-sm text-muted-foreground max-w-lg leading-relaxed'>
					Track your learning progress, see historical scores, and monitor spaced-repetition mastery over time.
				</motion.p>

				{/* Tab bar */}
				<div className='flex items-center gap-1 mt-6 overflow-x-auto hide-scrollbar pb-1'>
					{tabs.map((tab) => (
						<button key={tab} onClick={() => setActiveTab(tab)}
							className={`relative px-5 py-2 rounded-xl text-xs font-bold transition-colors ${activeTab === tab ? "text-brand-orange" : "text-muted-foreground hover:text-foreground"}`}>
							{activeTab === tab && (
								<motion.div layoutId="analyticsTab"
									className='absolute inset-0 bg-brand-orange/10 border border-brand-orange/20 rounded-xl -z-10'
									initial={false} transition={spring} />
							)}
							{tab}
						</button>
					))}
				</div>
			</div>

			{/* Tab content */}
			<div className='p-4 md:p-8 flex-1'>
				<AnimatePresence mode="wait">
					{activeTab === "Overview" && (
						<motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={spring} className='space-y-8'>
							{/* Stats grid */}
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
								{statCards.map((stat, i) => (
									<motion.div key={stat.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: i * 0.04 }}>
										<Card className='p-6 bg-card border-border/40 shadow-soft flex flex-col gap-4'>
											<div className='flex items-center justify-between'>
												<div className={`p-2.5 rounded-2xl ${stat.bgColor}`}>
													<stat.icon className={`size-4 ${stat.color}`} />
												</div>
												<span className='text-[10px] font-bold text-muted-foreground'>{stat.trend}</span>
											</div>
											<div>
												<p className='text-3xl font-black font-grotesk text-foreground'>{stat.value}</p>
												<p className='text-xs text-muted-foreground mt-0.5'>{stat.title}</p>
											</div>
										</Card>
									</motion.div>
								))}
							</div>

							{/* Chart + Scores */}
							<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
								<Card className='lg:col-span-2 p-6 bg-card border-border/40 shadow-soft'>
									<div className='flex items-center justify-between mb-6'>
										<div>
											<h3 className='font-serif text-lg text-foreground'>Study Activity</h3>
											<p className='text-xs text-muted-foreground mt-0.5'>Questions answered & cards reviewed</p>
										</div>
										<button className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/40 text-xs text-muted-foreground hover:text-foreground transition-colors'>
											<CalendarIcon className='size-3' />This Week
										</button>
									</div>
									<ChartContainer config={activityChartConfig} className='min-h-[180px] w-full'>
										<BarChart accessibilityLayer data={activityData} margin={{ top: 8, left: 0, right: 0, bottom: 0 }}>
											<CartesianGrid vertical={false} strokeDasharray='3 3' stroke='rgba(255,255,255,0.04)' />
											<XAxis dataKey='day' tickLine={false} axisLine={false} tickMargin={10} className='text-xs fill-muted-foreground' />
											<ChartTooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} content={<ChartTooltipContent hideLabel />} />
											<Bar dataKey='value' fill='var(--color-value)' radius={[8, 8, 0, 0]} barSize={32} opacity={0.8} />
										</BarChart>
									</ChartContainer>
								</Card>

								<Card className='p-6 bg-card border-border/40 shadow-soft'>
									<div className='flex items-center justify-between mb-5'>
										<h3 className='font-serif text-lg text-foreground'>Recent Scores</h3>
										<TrendingUp className='size-4 text-muted-foreground' />
									</div>
									<div className='space-y-4'>
										{recentScores.map((score, i) => (
											<div key={i}>
												<div className='flex items-center justify-between mb-1'>
													<p className='text-sm font-medium text-foreground truncate max-w-[140px]'>{score.test}</p>
													<span className={`text-sm font-black ${score.score >= 80 ? "text-emerald-500" : score.score >= 50 ? "text-brand-orange" : "text-destructive"}`}>
														{score.score}%
													</span>
												</div>
												<div className='h-1 w-full bg-muted rounded-full overflow-hidden'>
													<div className={`h-full rounded-full transition-all ${score.score >= 80 ? "bg-emerald-500" : score.score >= 50 ? "bg-brand-orange" : "bg-destructive"}`}
														style={{ width: `${score.score}%` }} />
												</div>
												<p className='text-[10px] text-muted-foreground mt-1'>{score.date}</p>
											</div>
										))}
									</div>
								</Card>
							</div>
						</motion.div>
					)}

					{activeTab === "Learning Curve" && (
						<motion.div key="curve" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={spring} className='space-y-6'>
							<div>
								<h2 className='font-serif text-2xl text-foreground mb-1'>Knowledge Retention</h2>
								<p className='text-sm text-muted-foreground'>How well your understanding holds over time, measured across spaced-repetition reviews.</p>
							</div>
							<Card className='p-6 bg-card border-border/40 shadow-soft'>
								<ChartContainer config={retentionChartConfig} className='min-h-[280px] w-full'>
									<AreaChart accessibilityLayer data={retentionData} margin={{ top: 12, left: 0, right: 0, bottom: 0 }}>
										<defs>
											<linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
												<stop offset="5%" stopColor="#FF6F20" stopOpacity={0.25} />
												<stop offset="95%" stopColor="#FF6F20" stopOpacity={0} />
											</linearGradient>
										</defs>
										<CartesianGrid vertical={false} strokeDasharray='3 3' stroke='rgba(255,255,255,0.04)' />
										<XAxis dataKey='week' tickLine={false} axisLine={false} tickMargin={10} className='text-xs fill-muted-foreground' />
										<YAxis tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} className='text-xs fill-muted-foreground' width={36} />
										<ChartTooltip cursor={{ stroke: "rgba(255,111,32,0.2)", strokeWidth: 1 }} content={<ChartTooltipContent hideLabel />} />
										<Area dataKey='retention' type='monotone' stroke='#FF6F20' strokeWidth={2} fill='url(#retentionGrad)' dot={{ fill: "#FF6F20", strokeWidth: 0, r: 4 }} />
									</AreaChart>
								</ChartContainer>
							</Card>
							<div className='grid grid-cols-3 gap-4'>
								{[{ label: "Start Retention", value: "38%" }, { label: "Current", value: "82%" }, { label: "Improvement", value: "+44%" }].map((m) => (
									<Card key={m.label} className='p-5 bg-card border-border/40 shadow-soft text-center'>
										<p className='text-2xl font-black font-grotesk text-foreground'>{m.value}</p>
										<p className='text-xs text-muted-foreground mt-1'>{m.label}</p>
									</Card>
								))}
							</div>
						</motion.div>
					)}

					{activeTab === "Study Habits" && (
						<motion.div key="habits" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={spring} className='space-y-6'>
							<div>
								<h2 className='font-serif text-2xl text-foreground mb-1'>Study Consistency</h2>
								<p className='text-sm text-muted-foreground'>Your activity log over the past 16 weeks — darker cells mean more questions answered.</p>
							</div>
							<Card className='p-6 bg-card border-border/40 shadow-soft overflow-x-auto'>
								<div className='flex gap-3 min-w-max'>
									{/* Weekday labels */}
									<div className='flex flex-col gap-1.5 pt-6'>
										{weekdays.map((d, i) => (
											<div key={i} className='h-4 w-4 flex items-center justify-center text-[10px] text-muted-foreground font-bold'>{d}</div>
										))}
									</div>
									{/* Grid */}
									<div className='flex flex-col gap-1'>
										{/* Week labels */}
										<div className='flex gap-1 mb-0.5'>
											{Array.from({ length: 16 }, (_, w) => (
												<div key={w} className='w-4 text-[9px] text-muted-foreground text-center'>{w % 4 === 0 ? `W${w + 1}` : ""}</div>
											))}
										</div>
										{heatmapData.map((row, rowIdx) => (
											<div key={rowIdx} className='flex gap-1'>
												{row.map((level, colIdx) => (
													<div key={colIdx} title={`Level ${level}`}
														className={`w-4 h-4 rounded-sm border transition-all hover:scale-110 cursor-default ${heatIntensity[level]}`} />
												))}
											</div>
										))}
									</div>
								</div>
								{/* Legend */}
								<div className='flex items-center gap-2 mt-5 text-[10px] text-muted-foreground'>
									<span>Less</span>
									{heatIntensity.map((cls, i) => (
										<div key={i} className={`w-4 h-4 rounded-sm border ${cls}`} />
									))}
									<span>More</span>
								</div>
							</Card>
							<div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
								{[{ label: "Active Weeks", value: "14 / 16" }, { label: "Best Streak", value: "12 days" }, { label: "Avg / Day", value: "34 items" }, { label: "Most Active", value: "Wednesday" }].map((s) => (
									<Card key={s.label} className='p-5 bg-card border-border/40 shadow-soft'>
										<p className='text-xl font-black font-grotesk text-foreground'>{s.value}</p>
										<p className='text-xs text-muted-foreground mt-1'>{s.label}</p>
									</Card>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default AnalyticsPage;
