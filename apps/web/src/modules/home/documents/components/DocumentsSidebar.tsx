import React from "react";
import { motion } from "framer-motion";
import {
	HardDrive,
	Sparkles,
	Clock,
	Info,
	CheckCircle2,
	ChevronRight,
} from "lucide-react";

export const DocumentsSidebar: React.FC = () => {
	return (
		<aside className='w-[320px] h-full bg-background border-l border-border flex flex-col shrink-0 overflow-y-auto hidden xl:flex'>
			<div className='p-8 space-y-12'>
				{/* Storage Usage */}
				<div className='space-y-5'>
					<h3 className='text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2'>
						<HardDrive className='size-3.5 text-brand-orange' />{" "}
						Storage Usage
					</h3>

					<div className='relative group p-6 bg-card rounded-3xl border border-border overflow-hidden shadow-xl shadow-black/10'>
						<div className='absolute -top-10 -right-10 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl group-hover:bg-brand-orange/10 transition-colors duration-500' />

						<div className='relative flex flex-col items-center justify-center py-4'>
							<div className='relative size-32'>
								<svg className='size-full -rotate-90'>
									<circle
										cx='64'
										cy='64'
										r='58'
										fill='transparent'
										stroke='currentColor'
										strokeWidth='8'
										className='text-muted/50'
									/>
									<motion.circle
										cx='64'
										cy='64'
										r='58'
										fill='transparent'
										stroke='currentColor'
										strokeWidth='8'
										strokeDasharray={364}
										initial={{ strokeDashoffset: 364 }}
										animate={{
											strokeDashoffset: 364 - 364 * 0.42,
										}}
										transition={{
											duration: 1.5,
											ease: "easeOut",
										}}
										className='text-brand-orange'
									/>
								</svg>
								<div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
									<span className='text-3xl font-black text-foreground font-grotesk'>
										42%
									</span>
									<span className='text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest'>
										of 10GB
									</span>
								</div>
							</div>
							<div className='mt-6 text-center'>
								<p className='text-sm font-bold text-foreground'>
									4.2 GB used
								</p>
								<p className='text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1'>
									12 total documents
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Tips */}
				<div className='space-y-5'>
					<h3 className='text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2'>
						<Sparkles className='size-3.5 text-brand-orange' /> Pro
						Tips
					</h3>

					<div className='space-y-3'>
						{[
							{
								icon: Info,
								text: "PDF formats yield the best results for AI generation.",
								color: "text-brand-orange/80",
							},
							{
								icon: CheckCircle2,
								text: "Summarize large files to extract core concepts faster.",
								color: "text-brand-orange/90",
							},
							{
								icon: Clock,
								text: "Processing status updates in real-time.",
								color: "text-brand-orange",
							},
						].map((tip, i) => (
							<div
								key={i}
								className='flex gap-3 p-4 bg-card hover:bg-muted/50 rounded-2xl border border-border/50 transition-all group cursor-default shadow-md shadow-black/5'
							>
								<tip.icon
									className={`size-4 shrink-0 mt-0.5 ${tip.color}`}
								/>
								<p className='text-[11px] text-muted-foreground font-medium leading-relaxed italic'>
									{tip.text}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Recent Activity */}
				<div className='space-y-5'>
					<h3 className='text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2'>
						<Clock className='size-3.5 text-brand-orange' /> Recent
						Activity
					</h3>

					<div className='space-y-1'>
						{[
							{
								action: "Uploaded",
								file: "Bio Ch. 12",
								time: "2h ago",
							},
							{
								action: "Generated",
								file: "History Test",
								time: "5h ago",
							},
							{
								action: "Deleted",
								file: "Old Essay",
								time: "Yesterday",
							},
						].map((item, i) => (
							<div
								key={i}
								className='flex items-center justify-between p-3.5 hover:bg-muted/50 rounded-2xl transition-all cursor-pointer group'
							>
								<div className='flex flex-col'>
									<span className='text-xs font-bold text-foreground tracking-tight group-hover:text-brand-orange transition-colors'>
										{item.file}
									</span>
									<span className='text-[9px] text-muted-foreground/60 font-black uppercase tracking-widest mt-0.5'>
										{item.action} • {item.time}
									</span>
								</div>
								<ChevronRight className='size-3.5 text-muted-foreground/30 group-hover:translate-x-0.5 group-hover:text-brand-orange transition-all' />
							</div>
						))}
					</div>
				</div>
			</div>
		</aside>
	);
};
