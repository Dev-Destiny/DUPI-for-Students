import React from "react";
import { motion } from "framer-motion";
import {
	BarChart3,
	TrendingUp,
	Clock,
	Award,
	Calendar as CalendarIcon,
	Target,
	Zap,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
	Card,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@dupi/ui";

const statCards = [
	{
		title: "Study Streak",
		value: "12 Days",
		trend: "+2 from last week",
		icon: Zap,
		color: "text-brand-orange",
		bgColor: "bg-brand-orange/10",
	},
	{
		title: "Average Score",
		value: "84%",
		trend: "+5% overall",
		icon: Target,
		color: "text-emerald-500",
		bgColor: "bg-emerald-500/10",
	},
	{
		title: "Cards Mastered",
		value: "342",
		trend: "+45 this week",
		icon: Award,
		color: "text-brand-violet",
		bgColor: "bg-brand-violet/10",
	},
	{
		title: "Time Studied",
		value: "24h 15m",
		trend: "This month",
		icon: Clock,
		color: "text-blue-400",
		bgColor: "bg-blue-400/10",
	},
];

const mockActivityData = [
	{ day: "Mon", value: 65 },
	{ day: "Tue", value: 40 },
	{ day: "Wed", value: 85 },
	{ day: "Thu", value: 55 },
	{ day: "Fri", value: 90 },
	{ day: "Sat", value: 30 },
	{ day: "Sun", value: 75 },
];

const mockRecentScores = [
	{ test: "Cellular Respiration", score: 85, date: "2 days ago" },
	{ test: "World War 2 History", score: 62, date: "4 days ago" },
	{ test: "Basic Mathematics", score: 100, date: "1 week ago" },
	{ test: "Advanced React Patterns", score: 45, date: "1 week ago" },
];

const chartConfig = {
	value: {
		label: "Activity",
		color: "hsl(var(--brand-orange))",
	},
};

const AnalyticsPage: React.FC = () => {
	return (
		<div className='flex-1 flex flex-col h-full bg-background overflow-y-auto custom-scrollbar relative'>
			{/* Decorative ambient background blurs */}
			<div className='absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none' />
			<div className='absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-violet/5 rounded-full blur-[150px] pointer-events-none' />

			{/* Refined Header area */}
			<div className='px-8 pt-10 pb-6 border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-10'>
				<div className='relative z-10'>
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(255,111,32,0.15)]'
					>
						<BarChart3 className='size-3.5 fill-current' />{" "}
						Performance
					</motion.div>
					<motion.h1
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className='text-3xl md:text-5xl font-black text-foreground font-serif tracking-tight mb-3 flex items-center gap-3 drop-shadow-lg'
					>
						Analytics
					</motion.h1>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className='text-muted-foreground font-medium text-sm max-w-xl leading-relaxed'
					>
						Track your learning progress, view historical test
						scores, and monitor your spaced repetition mastery over
						time.
					</motion.p>
				</div>
			</div>

			<div className='p-8 space-y-8 flex-1'>
				{/* Top Stats Grid */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
				>
					{statCards.map((stat) => (
						<Card
							key={stat.title}
							className='p-6 bg-card border-border shadow-lg shadow-black/5 hover:border-brand-orange/40 transition-all duration-300 relative overflow-hidden group'
						>
							<div className='absolute -right-4 -top-4 w-20 h-20 bg-brand-orange/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500' />
							<div className='flex items-center justify-between mb-4 relative z-10'>
								<div
									className={`p-3 rounded-2xl ${stat.bgColor}`}
								>
									<stat.icon
										className={`size-5 ${stat.color}`}
									/>
								</div>
								<div className='px-2.5 py-1 rounded-full bg-background border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground'>
									{stat.trend}
								</div>
							</div>
							<div className='relative z-10'>
								<h3 className='text-3xl font-black text-foreground font-grotesk tracking-tight mb-1'>
									{stat.value}
								</h3>
								<p className='text-xs font-bold text-muted-foreground uppercase tracking-wider'>
									{stat.title}
								</p>
							</div>
						</Card>
					))}
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Main Chart Area */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.4 }}
						className='lg:col-span-2'
					>
						<Card className='p-6 h-full bg-card border-border shadow-xl shadow-black/10'>
							<div className='flex items-center justify-between mb-8'>
								<div>
									<h3 className='text-lg font-bold text-foreground font-serif'>
										Study Activity
									</h3>
									<p className='text-xs text-muted-foreground mt-1'>
										Questions answered & cards reviewed
									</p>
								</div>
								<button className='flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'>
									<CalendarIcon className='size-3.5' />
									This Week
								</button>
							</div>

							<ChartContainer
								config={chartConfig}
								className='min-h-[200px] w-full'
							>
								<BarChart
									accessibilityLayer
									data={mockActivityData}
									margin={{
										top: 20,
										left: 12,
										right: 12,
										bottom: 0,
									}}
								>
									<CartesianGrid
										vertical={false}
										strokeDasharray='3 3'
										stroke='rgba(255,255,255,0.1)'
									/>
									<XAxis
										dataKey='day'
										tickLine={false}
										axisLine={false}
										tickMargin={10}
										className='text-xs font-bold uppercase tracking-widest fill-muted-foreground'
									/>
									<ChartTooltip
										cursor={{
											fill: "rgba(255,255,255,0.05)",
										}}
										content={
											<ChartTooltipContent hideLabel />
										}
									/>
									<Bar
										dataKey='value'
										fill='var(--color-value)'
										radius={[6, 6, 0, 0]}
										className='drop-shadow-[0_0_8px_rgba(255,111,32,0.4)] hover:opacity-80 transition-opacity'
										barSize={40}
									/>
								</BarChart>
							</ChartContainer>
						</Card>
					</motion.div>

					{/* Recent Scores Sidebar */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.5 }}
						className='lg:col-span-1'
					>
						<Card className='p-6 h-full bg-card border-border shadow-xl shadow-black/10'>
							<div className='flex items-center justify-between mb-6'>
								<h3 className='text-lg font-bold text-foreground font-serif'>
									Recent Scores
								</h3>
								<TrendingUp className='size-4 text-brand-orange' />
							</div>

							<div className='space-y-4'>
								{mockRecentScores.map((score, i) => (
									<div
										key={i}
										className='p-4 rounded-2xl border border-border bg-background hover:border-brand-orange/30 transition-colors group cursor-pointer'
									>
										<div className='flex items-center justify-between mb-2'>
											<h4 className='font-bold text-sm text-foreground truncate max-w-[150px] group-hover:text-brand-orange transition-colors'>
												{score.test}
											</h4>
											<div
												className={`text-sm font-black font-grotesk ${
													score.score >= 80
														? "text-emerald-500"
														: score.score >= 50
															? "text-brand-orange"
															: "text-destructive"
												}`}
											>
												{score.score}%
											</div>
										</div>
										<div className='flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-muted-foreground'>
											<span>{score.date}</span>
											<div className='w-24 h-1.5 bg-muted rounded-full overflow-hidden'>
												<div
													className={`h-full ${
														score.score >= 80
															? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"
															: score.score >= 50
																? "bg-brand-orange shadow-[0_0_5px_rgba(255,111,32,0.5)]"
																: "bg-destructive shadow-[0_0_5px_rgba(239,68,68,0.5)]"
													}`}
													style={{
														width: `${score.score}%`,
													}}
												/>
											</div>
										</div>
									</div>
								))}
							</div>

							<button className='mt-6 w-full py-2.5 rounded-xl border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-widest hover:bg-brand-orange/10 transition-colors'>
								View All History
							</button>
						</Card>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default AnalyticsPage;
