import React from "react";
import { motion } from "framer-motion";
import {
	ClipboardCheck,
	MoreVertical,
	Share2,
	Play,
	BarChart,
	FileText,
	Clock,
} from "lucide-react";
import {
	Card,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@dupi/ui";

import { useNavigate } from "react-router-dom";

interface Test {
	id: string;
	title: string;
	documentName: string;
	questionsCount: number;
	difficulty: "easy" | "medium" | "hard";
	status: "new" | "completed" | "in-progress";
	score?: number;
	lastAttempt?: string;
}

interface TestCardProps {
	test: Test;
}

export const TestCard: React.FC<TestCardProps> = ({ test }) => {
	const navigate = useNavigate();
	
	const handleStart = () => {
		navigate(`/tests/${test.id}`);
	};
	const getDifficultyColor = (diff: string) => {
		switch (diff) {
			case "easy":
				return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
			case "medium":
				return "text-brand-gold bg-brand-gold/10 border-brand-gold/20";
			case "hard":
				return "text-destructive bg-destructive/10 border-destructive/20";
			default:
				return "text-muted-foreground bg-muted";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "text-emerald-500";
			case "in-progress":
				return "text-brand-orange animate-pulse";
			default:
				return "text-muted-foreground";
		}
	};

	return (
		<motion.div
			layout
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			whileHover={{ y: -4 }}
			transition={{ type: "spring", stiffness: 300, damping: 25 }}
			className='h-full'
			onClick={handleStart}
		>
			<Card className='group relative cursor-pointer overflow-hidden h-full border-border bg-card shadow-lg shadow-black/5 hover:border-brand-orange/40 transition-all duration-300 flex flex-col'>
				<div className='p-5 flex-1 flex flex-col'>
					{/* Header Actions */}
					<div className='flex items-start justify-between mb-4'>
						<div
							className={`px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${getDifficultyColor(
								test.difficulty,
							)}`}
						>
							{test.difficulty}
						</div>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className='p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors'>
									<MoreVertical className='size-4' />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align='end'
								className='w-48 rounded-xl font-grotesk'
							>
								<DropdownMenuItem className='gap-2 text-xs font-bold'>
									<Play className='size-3.5 text-brand-orange' />{" "}
									{test.status === "completed"
										? "Retake Test"
										: "Start Test"}
								</DropdownMenuItem>
								<DropdownMenuItem className='gap-2 text-xs font-bold'>
									<Share2 className='size-3.5 text-brand-violet' />{" "}
									Share Link
								</DropdownMenuItem>
								{test.status === "completed" && (
									<DropdownMenuItem className='gap-2 text-xs font-bold'>
										<BarChart className='size-3.5 text-emerald-500' />{" "}
										View Results
									</DropdownMenuItem>
								)}
								<DropdownMenuSeparator />
								<DropdownMenuItem className='gap-2 text-xs font-bold text-destructive focus:text-destructive focus:bg-destructive/10'>
									Delete Test
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Title & Info */}
					<div className='mb-4 flex-1'>
						<h3 className='font-bold text-foreground text-sm leading-snug group-hover:text-brand-orange transition-colors duration-300 mb-2'>
							{test.title}
						</h3>
						<div className='flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>
							<FileText className='size-3' />
							<span className='truncate'>
								{test.documentName}
							</span>
						</div>
					</div>

					{/* Status Section */}
					<div className='pt-4 border-t border-border/50 mt-auto'>
						<div className='flex items-center justify-between mb-3'>
							<div className='flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-foreground'>
								<ClipboardCheck className='size-3.5 text-muted-foreground' />
								{test.questionsCount} Questions
							</div>

							{test.status === "completed" &&
								test.score !== undefined && (
									<div className='text-xs font-black font-grotesk text-brand-orange'>
										{test.score}%
									</div>
								)}
						</div>

						<div className='flex items-center justify-between'>
							<div
								className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${getStatusColor(
									test.status,
								)}`}
							>
								{test.status === "new"
									? "Not Started"
									: test.status === "completed"
										? "Completed"
										: "In Progress"}
							</div>

							{test.lastAttempt && (
								<div className='flex items-center gap-1 text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest'>
									<Clock className='size-3' />
									{test.lastAttempt}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Hover Highlight */}
				<div className='absolute bottom-0 left-0 w-full h-1 bg-brand-orange scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300' />
			</Card>
		</motion.div>
	);
};
