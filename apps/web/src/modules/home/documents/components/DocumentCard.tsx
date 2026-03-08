import React from "react";
import { motion } from "framer-motion";
import {
	FileText,
	MoreVertical,
	Trash2,
	Sparkles,
	Layers,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";
import {
	Card,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@dupi/ui";

interface Document {
	id: string;
	title: string;
	size: string;
	pages: number | null;
	status: string;
	uploadedAt: string;
	type: string;
	progress?: number;
}

interface DocumentCardProps {
	doc: Document;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ doc }) => {
	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.95 }}
			whileHover={{ y: -8 }}
			transition={{ type: "spring", stiffness: 300, damping: 25 }}
		>
			<Card className='group relative overflow-hidden h-full border-border bg-card shadow-lg shadow-black/5 hover:border-brand-orange/40 transition-all duration-300'>
				<div className='p-5'>
					{/* Header */}
					<div className='flex items-start justify-between mb-4'>
						<div
							className={`p-3 rounded-2xl ${
								doc.status === "error"
									? "bg-destructive/10 text-destructive"
									: doc.status === "analyzing"
										? "bg-brand-orange/20 text-brand-orange"
										: "bg-muted text-muted-foreground"
							}`}
						>
							<FileText className='size-6' />
						</div>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className='p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors'>
									<MoreVertical className='size-4' />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align='end'
								className='w-48 rounded-xl font-grotesk'
							>
								<DropdownMenuItem className='gap-2 text-xs font-bold'>
									<Sparkles className='size-3.5 text-brand-orange' />{" "}
									Generate Test
								</DropdownMenuItem>
								<DropdownMenuItem className='gap-2 text-xs font-bold'>
									<Layers className='size-3.5 text-brand-orange/80' />{" "}
									Create Flashcards
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem className='gap-2 text-xs font-bold text-destructive focus:text-destructive focus:bg-destructive/10'>
									<Trash2 className='size-3.5' /> Delete
									Document
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Title & Info */}
					<div className='space-y-1.5 mb-5'>
						<h3 className='font-bold text-foreground text-sm truncate group-hover:text-brand-orange transition-colors duration-300'>
							{doc.title}
						</h3>
						<div className='flex items-center gap-2.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest'>
							<span>{doc.size}</span>
							{doc.pages && (
								<>
									<span className='size-1 rounded-full bg-border' />
									<span>{doc.pages} Pages</span>
								</>
							)}
						</div>
					</div>

					{/* Status Section */}
					<div className='pt-4 border-t border-border/50'>
						{doc.status === "processed" && (
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-1.5 text-[10px] font-black text-brand-orange uppercase tracking-widest'>
									<CheckCircle2 className='size-3.5' />
									Ready
								</div>
								<span className='text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest'>
									{doc.uploadedAt}
								</span>
							</div>
						)}

						{doc.status === "analyzing" && (
							<div className='space-y-3'>
								<div className='flex justify-between items-center text-[10px] font-black uppercase tracking-widest'>
									<span className='text-brand-orange animate-pulse'>
										Analyzing...
									</span>
									<span className='text-muted-foreground'>
										{doc.progress}%
									</span>
								</div>
								<div className='h-1.5 w-full bg-muted rounded-full overflow-hidden'>
									<motion.div
										initial={{ width: 0 }}
										animate={{ width: `${doc.progress}%` }}
										className='h-full bg-brand-orange shadow-[0_0_8px_rgba(255,111,32,0.3)]'
									/>
								</div>
							</div>
						)}

						{doc.status === "error" && (
							<div className='flex items-center gap-1.5 text-[10px] font-black text-destructive uppercase tracking-widest'>
								<AlertCircle className='size-3.5' />
								Upload Failed
							</div>
						)}
					</div>
				</div>

				{/* Hover Highlight */}
				<div className='absolute top-0 left-0 w-1 h-full bg-brand-orange scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300' />
			</Card>
		</motion.div>
	);
};
