import React from "react";
import { TrendingUp } from "lucide-react";
import { Card } from "@studify/ui";

interface RecentScoresProps {
	scores: { test: string; score: number; date: string }[];
}

const RecentScores: React.FC<RecentScoresProps> = ({ scores }) => {
	return (
		<Card className='p-6 bg-card border-border/40 shadow-soft'>
			<div className='flex items-center justify-between mb-5'>
				<h3 className='font-serif text-lg text-foreground'>
					Recent Scores
				</h3>
				<TrendingUp className='size-4 text-muted-foreground' />
			</div>
			<div className='space-y-4'>
				{scores.length > 0 ? (
					scores.map((score, i) => (
						<div key={i}>
							<div className='flex items-center justify-between mb-1'>
								<p className='text-sm font-medium text-foreground truncate max-w-[140px]'>
									{score.test}
								</p>
								<span
									className={`text-sm font-black ${score.score >= 80 ? "text-emerald-500" : score.score >= 50 ? "text-brand-orange" : "text-destructive"}`}
								>
									{score.score}%
								</span>
							</div>
							<div className='h-1 w-full bg-muted rounded-full overflow-hidden'>
								<div
									className={`h-full rounded-full transition-all ${score.score >= 80 ? "bg-emerald-500" : score.score >= 50 ? "bg-brand-orange" : "bg-destructive"}`}
									style={{
										width: `${score.score}%`,
									}}
								/>
							</div>
							<p className='text-[10px] text-muted-foreground mt-1'>
								{score.date}
							</p>
						</div>
					))
				) : (
					<div className='text-center py-8'>
						<p className='text-xs text-muted-foreground font-medium'>
							No recent test scores
						</p>
					</div>
				)}
			</div>
		</Card>
	);
};

export default RecentScores;
