import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, ChartContainer, ChartTooltip, ChartTooltipContent } from "@studify/ui";

const retentionChartConfig = {
	retention: { label: "Retention %", color: "#FF6F20" },
};

interface RetentionChartProps {
	data: { week: string; retention: number }[];
}

const RetentionChart: React.FC<RetentionChartProps> = ({ data }) => {
	const startRetention = data[0]?.retention || 0;
	const currentRetention = data[data.length - 1]?.retention || 0;
	const improvement = currentRetention - startRetention;

	return (
		<div className='space-y-6'>
			<div>
				<h2 className='font-serif text-2xl text-foreground mb-1'>
					Knowledge Retention
				</h2>
				<p className='text-sm text-muted-foreground'>
					How well your understanding holds over time, measured across spaced-repetition reviews.
				</p>
			</div>
			<Card className='p-6 bg-card border-border/40 shadow-soft'>
				<ChartContainer
					config={retentionChartConfig}
					className='min-h-[280px] w-full'
				>
					<AreaChart
						accessibilityLayer
						data={data}
						margin={{
							top: 12,
							left: 0,
							right: 0,
							bottom: 0,
						}}
					>
						<defs>
							<linearGradient id='retentionGrad' x1='0' y1='0' x2='0' y2='1'>
								<stop offset='5%' stopColor='#FF6F20' stopOpacity={0.25} />
								<stop offset='95%' stopColor='#FF6F20' stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid
							vertical={false}
							strokeDasharray='3 3'
							stroke='rgba(255,255,255,0.04)'
						/>
						<XAxis
							dataKey='week'
							tickLine={false}
							axisLine={false}
							tickMargin={10}
							className='text-xs fill-muted-foreground'
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							domain={[0, 100]}
							tickFormatter={(v) => `${v}%`}
							className='text-xs fill-muted-foreground'
							width={36}
						/>
						<ChartTooltip
							cursor={{
								stroke: "rgba(255,111,32,0.2)",
								strokeWidth: 1,
							}}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Area
							dataKey='retention'
							type='monotone'
							stroke='#FF6F20'
							strokeWidth={2}
							fill='url(#retentionGrad)'
							dot={{ fill: "#FF6F20", strokeWidth: 0, r: 4 }}
						/>
					</AreaChart>
				</ChartContainer>
			</Card>
			<div className='grid grid-cols-3 gap-4'>
				{[
					{ label: "Start Retention", value: `${startRetention}%` },
					{ label: "Current", value: `${currentRetention}%` },
					{ label: "Improvement", value: `${improvement > 0 ? "+" : ""}${improvement}%` },
				].map((m) => (
					<Card key={m.label} className='p-5 bg-card border-border/40 shadow-soft text-center'>
						<p className='text-2xl font-black font-grotesk text-foreground'>{m.value}</p>
						<p className='text-xs text-muted-foreground mt-1'>{m.label}</p>
					</Card>
				))}
			</div>
		</div>
	);
};

export default RetentionChart;
