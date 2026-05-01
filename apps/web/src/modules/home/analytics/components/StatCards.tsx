import React from "react";
import { motion } from "framer-motion";
import { Zap, Target, Award, Clock } from "lucide-react";
import { Card } from "@studify/ui";

const spring = { type: "spring", stiffness: 260, damping: 30 };

interface StatCardProps {
	stats: {
		streak: string;
		averageScore: string;
		cardsMastered: number;
		timeStudied: string;
	};
}

const StatCards: React.FC<StatCardProps> = ({ stats }) => {
	const statCards = [
		{
			title: "Study Streak",
			value: stats.streak,
			trend: "Current",
			icon: Zap,
			color: "text-brand-orange",
			bgColor: "bg-brand-orange/10",
		},
		{
			title: "Average Score",
			value: stats.averageScore,
			trend: "Overall",
			icon: Target,
			color: "text-emerald-500",
			bgColor: "bg-emerald-500/10",
		},
		{
			title: "Cards Mastered",
			value: stats.cardsMastered,
			trend: "Total",
			icon: Award,
			color: "text-brand-violet",
			bgColor: "bg-brand-violet/10",
		},
		{
			title: "Time Studied",
			value: stats.timeStudied,
			trend: "Total",
			icon: Clock,
			color: "text-blue-400",
			bgColor: "bg-blue-400/10",
		},
	];

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
			{statCards.map((stat, i) => (
				<motion.div
					key={stat.title}
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ ...spring, delay: i * 0.04 }}
				>
					<Card className='p-6 bg-card border-border/40 shadow-soft flex flex-col gap-4'>
						<div className='flex items-center justify-between'>
							<div className={`p-2.5 rounded-2xl ${stat.bgColor}`}>
								<stat.icon className={`size-4 ${stat.color}`} />
							</div>
							<span className='text-[10px] font-bold text-muted-foreground'>
								{stat.trend}
							</span>
						</div>
						<div>
							<p className='text-3xl font-black font-grotesk text-foreground'>
								{stat.value}
							</p>
							<p className='text-xs text-muted-foreground mt-0.5'>
								{stat.title}
							</p>
						</div>
					</Card>
				</motion.div>
			))}
		</div>
	);
};

export default StatCards;
