import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
	FilePlus2,
	Mic,
	FileUp,
	Globe,
	Search,
	FolderPlus,
	FileText,
	ChevronRight,
	MoreVertical
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@studify/ui";
import { useSearchStore } from "@/store/search.store";
import { toast } from "sonner";
import { useDocumentsQuery } from "@/hooks/use-studify-query";

const quickActions = [
	{
		title: "Blank document",
		subtitle: "Start from scratch",
		icon: FilePlus2,
		color: "text-brand-orange",
		bgColor: "bg-brand-orange/10",
	},
	{
		title: "Record or upload audio",
		subtitle: "Upload an audio file",
		icon: Mic,
		color: "text-brand-orange",
		bgColor: "bg-brand-orange/10",
	},
	{
		title: "Document upload",
		subtitle: "Any PDF, DOC, PPT, etc",
		icon: FileUp,
		color: "text-brand-orange",
		bgColor: "bg-brand-orange/10",
	},
	{
		title: "Website link",
		subtitle: "YouTube or website link",
		icon: Globe,
		color: "text-brand-orange",
		bgColor: "bg-brand-orange/10",
	},
];

const DashboardPage: React.FC = () => {
	const navigate = useNavigate();
	const { open } = useSearchStore();
	const { data = [], isLoading } = useDocumentsQuery();
	const recentNotes = useMemo(
		() =>
			(Array.isArray(data) ? data : []).slice(0, 3).map((doc: any) => {
				const ext = (doc.title.split(".").pop() || "doc").toUpperCase();
				let color = "bg-blue-500";
				if (ext === "PDF") color = "bg-red-500";
				if (ext === "TXT") color = "bg-emerald-500";

				return {
					id: doc.id,
					title: doc.title,
					lastOpened: `Added on ${new Date(doc.createdAt).toLocaleDateString()}`,
					type: ext,
					color,
				};
			}),
		[data],
	);

	return (
		<div className='flex-1 flex flex-col bg-background p-4 md:p-8 overflow-y-auto custom-scrollbar relative'>
			{/* Header */}
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10'>
				<div>
					<motion.h1
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className='text-4xl md:text-5xl text-foreground font-serif tracking-tight mb-2' 
					>
						Dashboard
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className='text-muted-foreground font-medium'
					>
						Create new notes
					</motion.p>
				</div>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					className='relative w-full md:w-auto'
				>
					<button
						type='button'
						onClick={open}
						className='w-full md:w-64 bg-card/80 border border-border/80 rounded-xl pl-10 pr-4 py-2 text-sm text-muted-foreground hover:text-foreground text-left focus:outline-none focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/50 transition-all shadow-sm backdrop-blur-md hover:bg-card'
					>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
						<span className='flex items-center justify-between'>
							<span>Search notes, tests, documents...</span>
							<span className='hidden md:inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] font-bold text-muted-foreground/80'>
								<span>/</span>
							</span>
						</span>
					</button>
				</motion.div>
			</div>

			{/* Quick Actions */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12'>
				{quickActions.map((action, i) => (
					<motion.button
						key={i}
						type='button'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 * i }}
						whileHover={{ y: -4, scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => {
							if (action.title === "Document upload") {
								navigate("/documents");
								return;
							}
							toast.info("This feature is coming soon");
						}}
						className='flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-brand-orange/40 hover:shadow-lg hover:shadow-brand-orange/5 transition-all group text-left'
					>
						<div
							className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${action.bgColor} group-hover:scale-110 transition-transform`}
						>
							<action.icon className={`size-5 ${action.color}`} />
						</div>
						<div className='flex-1 min-w-0'>
							<h3 className='font-bold text-foreground text-sm truncate mb-0.5 group-hover:text-brand-orange transition-colors'>
								{action.title}
							</h3>
							<p className='text-[11px] text-muted-foreground font-medium truncate'>
								{action.subtitle}
							</p>
						</div>
						<ChevronRight className='size-4 text-muted-foreground/50 group-hover:text-brand-orange group-hover:translate-x-1 transition-all shrink-0' />
					</motion.button>
				))}
			</div>

			{/* Tabs & Controls */}
			<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10'>
				<div className='flex items-center gap-1 bg-card border border-border rounded-xl p-1 shadow-sm'>
					<button className='px-5 py-2 rounded-lg bg-brand-orange/10 text-brand-orange text-xs font-bold transition-all'>
						My Notes
					</button>
					<button 
						onClick={() => toast.info("This feature is coming soon")}
						className='px-5 py-2 rounded-lg text-muted-foreground hover:text-foreground text-xs font-medium transition-all'
					>
						Shared with Me
					</button>
				</div>
				<Button
					variant='outline'
					onClick={() => toast.info("This feature is coming soon")}
					className='border-border bg-card text-foreground hover:bg-muted hover:text-foreground font-bold text-xs rounded-xl shadow-sm gap-2'
				>
					<FolderPlus className='size-4' />
					New Folder
				</Button>
			</div>

			{/* Recent Notes List */}
			<div className='space-y-6'>
				<div>
					<h3 className='text-xs font-bold text-muted-foreground mb-3 px-1'>
						Recent
					</h3>
					<div className='space-y-2'>
						{isLoading ? (
							<div className='py-8 text-center'>
								<p className='text-xs font-bold text-muted-foreground animate-pulse uppercase tracking-widest'>Loading your notes...</p>
							</div>
						) : recentNotes.length > 0 ? (
							recentNotes.map((note, i) => (
								<motion.div
									key={note.id}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.2 + i * 0.05 }}
									whileHover={{ scale: 1.005, x: 4 }}
									onClick={() => navigate(`/documents/${note.id}`)}
									className='flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-brand-orange/30 hover:shadow-md transition-all group cursor-pointer'
								>
									<div
										className={`w-10 h-12 rounded-lg flex flex-col items-center justify-center shrink-0 shadow-sm ${note.color} bg-opacity-10 border border-current`}
									>
										<span
											className={`text-[8px] font-black uppercase tracking-wider ${note.color.replace("bg-", "text-")}`}
										>
											{note.type}
										</span>
										<FileText
											className={`size-4 mt-0.5 ${note.color.replace("bg-", "text-")}`}
										/>
									</div>

									<div className='flex-1 min-w-0'>
										<h4 className='font-bold text-foreground text-sm truncate group-hover:text-brand-orange transition-colors duration-300'>
											{note.title}
										</h4>
										<p className='text-[11px] text-muted-foreground mt-1'>
											{note.lastOpened}
										</p>
									</div>

									<button 
										onClick={(e) => {
											e.stopPropagation();
											toast.info("This feature is coming soon");
										}}
										className='p-2 text-muted-foreground/50 hover:text-foreground hover:bg-muted rounded-lg opacity-0 group-hover:opacity-100 transition-all'
									>
										<MoreVertical className='size-4' />
									</button>
								</motion.div>
							))
						) : (
							<div className='py-8 text-center bg-card/30 border border-dashed border-border rounded-2xl'>
								<p className='text-xs font-bold text-muted-foreground uppercase tracking-widest'>No recent notes found</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Decorative Background Blur */}
			<div className='fixed top-1/4 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none -z-10' />
			<div className='fixed bottom-0 left-1/4 w-96 h-96 bg-brand-violet/5 rounded-full blur-[120px] pointer-events-none -z-10' />
		</div>
	);
};

export default DashboardPage;
