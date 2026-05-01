import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, ChartContainer, ChartTooltip, ChartTooltipContent } from "@studify/ui";

const activityChartConfig = { value: { label: "Activity", color: "#FF6F20" } };

interface ActivityChartProps {
	data: { day: string; value: number }[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
	return (
		<Card className='lg:col-span-2 p-6 bg-card border-border/40 shadow-soft'>
			<div className='flex items-center justify-between mb-6'>
				<div>
					<h3 className='font-serif text-lg text-foreground'>
						Study Activity
					</h3>
					<p className='text-xs text-muted-foreground mt-0.5'>
						Questions answered & cards reviewed
					</p>
				</div>
				<button className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/40 text-xs text-muted-foreground hover:text-foreground transition-colors'>
					<CalendarIcon className='size-3' />
					This Week
				</button>
			</div>
			<ChartContainer
				config={activityChartConfig}
				className='min-h-[180px] w-full'
			>
				<BarChart
					accessibilityLayer
					data={data}
					margin={{
						top: 8,
						left: 0,
						right: 0,
						bottom: 0,
					}}
				>
					<CartesianGrid
						vertical={false}
						strokeDasharray='3 3'
						stroke='rgba(255,255,255,0.04)'
					/>
					<XAxis
						dataKey='day'
						tickLine={false}
						axisLine={false}
						tickMargin={10}
						className='text-xs fill-muted-foreground'
					/>
					<ChartTooltip
						cursor={{
							fill: "rgba(255,255,255,0.03)",
						}}
						content={<ChartTooltipContent hideLabel />}
					/>
					<Bar
						dataKey='value'
						fill='var(--color-value)'
						radius={[8, 8, 0, 0]}
						barSize={32}
						opacity={0.8}
					/>
				</BarChart>
			</ChartContainer>
		</Card>
	);
};

export default ActivityChart;
