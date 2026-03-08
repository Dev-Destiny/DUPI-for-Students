import React from "react";
import { motion } from "framer-motion";
import {
	Layers,
	MoreVertical,
	Share2,
	Play,
	Clock,
	FileText,
	GraduationCap,
} from "lucide-react";
import {
	Card,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@dupi/ui";

interface FlashcardSet {
	id: string;
	title: string;
	documentName: string;
	cardsCount: number;
	mastery: number; // percentage
	status: "new" | "learning" | "mastered";
	lastReviewed?: string;
	dueForReview: number; // number of cards due
}

interface FlashcardSetCardProps {
	set: FlashcardSet;
}

export const FlashcardSetCard: React.FC<FlashcardSetCardProps> = ({ set }) => {
	const getMasteryColor = (mastery: number) => {
		if (mastery >= 80) return "text-emerald-500 bg-emerald-500/10";
		if (mastery >= 40) return "text-brand-orange bg-brand-orange/10";
		return "text-muted-foreground bg-muted";
	};

	const getMasteryBarColor = (mastery: number) => {
		if (mastery >= 80)
			return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]";
		if (mastery >= 40)
			return "bg-brand-orange shadow-[0_0_8px_rgba(255,111,32,0.3)]";
		return "bg-brand-violet shadow-[0_0_8px_rgba(98,16,159,0.3)]";
	};

	return (
		<motion.div
			layout
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			whileHover={{ y: -4 }}
			transition={{ type: "spring", stiffness: 300, damping: 25 }}
			className='h-full'
		>
			<Card className='group relative overflow-hidden h-full border-border bg-card shadow-lg shadow-black/5 hover:border-brand-orange/40 transition-all duration-300 flex flex-col'>
				<div className='p-5 flex-1 flex flex-col'>
					{/* Header Actions */}
					<div className='flex items-start justify-between mb-4'>
						<div
							className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${getMasteryColor(
								set.mastery,
							)}`}
						>
							<GraduationCap className='size-3' />
							{set.mastery}% Mastery
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
									Review Due Cards
								</DropdownMenuItem>
								<DropdownMenuItem className='gap-2 text-xs font-bold'>
									<Layers className='size-3.5 text-brand-violet' />{" "}
									Study Entire Set
								</DropdownMenuItem>
								<DropdownMenuItem className='gap-2 text-xs font-bold'>
									<Share2 className='size-3.5 text-emerald-500' />{" "}
									Share Deck
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem className='gap-2 text-xs font-bold text-destructive focus:text-destructive focus:bg-destructive/10'>
									Delete Set
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Title & Info */}
					<div className='mb-4 flex-1'>
						<h3 className='font-bold text-foreground text-sm leading-snug group-hover:text-brand-orange transition-colors duration-300 mb-2'>
							{set.title}
						</h3>
						<div className='flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>
							<FileText className='size-3' />
							<span className='truncate'>{set.documentName}</span>
						</div>
					</div>

					{/* Status Section */}
					<div className='pt-4 border-t border-border/50 mt-auto'>
						<div className='flex items-center justify-between mb-3'>
							<div className='flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-foreground'>
								<Layers className='size-3.5 text-muted-foreground' />
								{set.cardsCount} Cards
							</div>

							{set.dueForReview > 0 && (
								<div className='px-2 py-0.5 rounded bg-brand-orange/20 text-brand-orange text-[9px] font-black uppercase tracking-widest animate-pulse'>
									{set.dueForReview} Due
								</div>
							)}
						</div>

						{/* Progress Bar */}
						<div className='space-y-1.5 mb-3'>
							<div className='h-1.5 w-full bg-muted rounded-full overflow-hidden'>
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: `${set.mastery}%` }}
									className={`h-full ${getMasteryBarColor(set.mastery)}`}
								/>
							</div>
						</div>

						<div className='flex items-center justify-between'>
							<div className='text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
								{set.status === "new"
									? "Not Started"
									: set.status === "mastered"
										? "Mastered"
										: "Learning"}
							</div>

							{set.lastReviewed && (
								<div className='flex items-center gap-1 text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest'>
									<Clock className='size-3' />
									{set.lastReviewed}
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
