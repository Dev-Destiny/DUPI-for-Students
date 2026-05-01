import React from "react";
import { Card } from "@studify/ui";

interface HabitStatsProps {
	stats: {
		activeWeeks: string;
		bestStreak: string;
		avgPerDay: string;
		mostActiveDay: string;
	};
}

const HabitStats: React.FC<HabitStatsProps> = ({ stats }) => {
	const statsList = [
		{ label: "Active Weeks", value: stats.activeWeeks },
		{ label: "Best Streak", value: stats.bestStreak },
		{ label: "Avg / Day", value: stats.avgPerDay },
		{ label: "Most Active", value: stats.mostActiveDay },
	];

	return (
		<div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6'>
			{statsList.map((s) => (
				<Card key={s.label} className='p-5 bg-card border-border/40 shadow-soft'>
					<p className='text-xl font-black font-grotesk text-foreground'>{s.value}</p>
					<p className='text-xs text-muted-foreground mt-1'>{s.label}</p>
				</Card>
			))}
		</div>
	);
};

export default HabitStats;
