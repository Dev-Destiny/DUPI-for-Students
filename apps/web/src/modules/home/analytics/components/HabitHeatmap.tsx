import React from "react";
import { Card } from "@studify/ui";

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
const heatIntensity = [
	"bg-muted/30 border-border/20",
	"bg-brand-orange/10 border-brand-orange/15",
	"bg-brand-orange/25 border-brand-orange/30",
	"bg-brand-orange/50 border-brand-orange/50",
	"bg-brand-orange border-brand-orange",
];

interface HabitHeatmapProps {
	data: number[][];
}

const HabitHeatmap: React.FC<HabitHeatmapProps> = ({ data }) => {
	return (
		<div className='space-y-6'>
			<div>
				<h2 className='font-serif text-2xl text-foreground mb-1'>
					Study Consistency
				</h2>
				<p className='text-sm text-muted-foreground'>
					Your activity log over the past 16 weeks — darker cells mean more questions answered.
				</p>
			</div>
			<Card className='p-6 bg-card border-border/40 shadow-soft overflow-x-auto'>
				<div className='flex gap-3 min-w-max'>
					{/* Weekday labels */}
					<div className='flex flex-col gap-1.5 pt-6'>
						{weekdays.map((d, i) => (
							<div
								key={i}
								className='h-4 w-4 flex items-center justify-center text-[10px] text-muted-foreground font-bold'
							>
								{d}
							</div>
						))}
					</div>
					{/* Grid */}
					<div className='flex flex-col gap-1'>
						{/* Week labels */}
						<div className='flex gap-1 mb-0.5'>
							{Array.from({ length: 16 }, (_, w) => (
								<div
									key={w}
									className='w-4 text-[9px] text-muted-foreground text-center'
								>
									{w % 4 === 0 ? `W${w + 1}` : ""}
								</div>
							))}
						</div>
						{data.map((row, rowIdx) => (
							<div key={rowIdx} className='flex gap-1'>
								{row.map((level, colIdx) => (
									<div
										key={colIdx}
										title={`Level ${level}`}
										className={`w-4 h-4 rounded-sm border transition-all hover:scale-110 cursor-default ${heatIntensity[level]}`}
									/>
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
		</div>
	);
};

export default HabitHeatmap;
