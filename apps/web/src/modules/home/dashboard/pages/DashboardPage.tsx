import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	FilePlus2,
	Mic,
	FileUp,
	Globe,
	Search,
	FolderPlus,
	FileText,
	MoreVertical,
	ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@dupi/ui";
import { documentService } from "@/services/document.service";

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
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [recentNotes, setRecentNotes] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchRecentNotes = async () => {
		try {
			setIsLoading(true);
			const docs = await documentService.getDocuments();
			// Take last 3 and format for the UI
			const formatted = docs.slice(0, 3).map((doc: any) => {
				const ext = (doc.title.split('.').pop() || "doc").toUpperCase();
				let color = "bg-blue-500";
				if (ext === "PDF") color = "bg-red-500";
				if (ext === "TXT") color = "bg-emerald-500";
				
				return {
					id: doc.id,
					title: doc.title,
					lastOpened: `Added on ${new Date(doc.createdAt).toLocaleDateString()}`,
					type: ext,
					color: color,
				};
			});
			setRecentNotes(formatted);
		} catch (error) {
			console.error("Failed to fetch recent notes:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchRecentNotes();
	}, []);

	const openSearch = useCallback(() => {
		setIsSearchOpen(true);
	}, []);

	const closeSearch = useCallback(() => {
		setIsSearchOpen(false);
	}, []);

	// Optional: basic CMD/CTRL + K keyboard shortcut for search
	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			const isMac = navigator.platform.toUpperCase().includes("MAC");
			const isModKey = isMac ? event.metaKey : event.ctrlKey;
			if (isModKey && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setIsSearchOpen(true);
			}
		};

		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, []);

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
						onClick={openSearch}
						className='w-full md:w-64 bg-card/80 border border-border/80 rounded-xl pl-10 pr-4 py-2 text-sm text-muted-foreground hover:text-foreground text-left focus:outline-none focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/50 transition-all shadow-sm backdrop-blur-md hover:bg-card'
					>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
						<span className='flex items-center justify-between'>
							<span>Search notes, tests, documents...</span>
							<span className='hidden md:inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/80'>
								<span className='font-sans'>⌘</span>
								<span>K</span>
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
					<button className='px-5 py-2 rounded-lg text-muted-foreground hover:text-foreground text-xs font-medium transition-all'>
						Shared with Me
					</button>
				</div>
				<Button
					variant='outline'
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

									<button className='p-2 text-muted-foreground/50 hover:text-foreground hover:bg-muted rounded-lg opacity-0 group-hover:opacity-100 transition-all'>
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

			{/* Glassmorphic Search Modal */}
			<AnimatePresence>
				{isSearchOpen && (
					<motion.div
						className='fixed inset-0 z-40 flex items-center justify-center'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						{/* Backdrop */}
						<button
							type='button'
							onClick={closeSearch}
							className='absolute inset-0 bg-black/50 backdrop-blur-sm'
						/>

						{/* Modal */}
						<motion.div
							initial={{ opacity: 0, y: 12, scale: 0.98 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 8, scale: 0.98 }}
							transition={{ type: "spring", stiffness: 320, damping: 30 }}
							className='relative z-50 w-full max-w-xl mx-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-brand-violet/10 bg-clip-padding text-foreground shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl'
						>
							<div className='absolute -top-32 -right-10 h-48 w-48 rounded-full bg-brand-orange/25 blur-3xl opacity-40 pointer-events-none' />
							<div className='absolute -bottom-32 -left-10 h-52 w-52 rounded-full bg-brand-violet/30 blur-3xl opacity-40 pointer-events-none' />

							<div className='relative p-4 border-b border-white/10'>
								<div className='flex items-center gap-2 rounded-2xl bg-black/20 px-3 py-2 border border-white/10'>
									<Search className='size-4 text-muted-foreground' />
									<input
										autoFocus
										type='text'
										placeholder='Search documents, tests, flashcards...'
										className='h-8 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none'
									/>
									<span className='hidden sm:inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/80'>
										<span className='font-sans'>Esc</span>
										<span>to close</span>
									</span>
								</div>
							</div>

							<div className='relative px-4 pb-4 pt-3'>
								<div className='space-y-3'>
									<div className='flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80'>
										<span>Quick jumps</span>
										<span className='rounded-full border border-white/5 bg-black/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/70'>
											Preview · WIP
										</span>
									</div>

									<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
										<button
											type='button'
											onClick={() => {
												navigate("/documents");
												closeSearch();
											}}
											className='group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left text-xs text-foreground/90 hover:border-brand-orange/60 hover:bg-brand-orange/15 transition-all'
										>
											<div className='flex items-center gap-3'>
												<div className='flex h-8 w-8 items-center justify-center rounded-xl bg-black/30'>
													<FileUp className='size-4 text-brand-orange' />
												</div>
												<div>
													<p className='font-semibold'>
														Upload document
													</p>
													<p className='text-[10px] text-muted-foreground/80'>
														Send PDF, DOCX, or notes into DUPI.
													</p>
												</div>
											</div>
											<span className='rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-muted-foreground/80'>
												G
											</span>
										</button>

										<button
											type='button'
											onClick={() => {
												navigate("/tests");
												closeSearch();
											}}
											className='group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left text-xs text-foreground/90 hover:border-brand-orange/60 hover:bg-brand-orange/15 transition-all'
										>
											<div className='flex items-center gap-3'>
												<div className='flex h-8 w-8 items-center justify-center rounded-xl bg-black/30'>
													<FileText className='size-4 text-brand-orange' />
												</div>
												<div>
													<p className='font-semibold'>
														Browse tests
													</p>
													<p className='text-[10px] text-muted-foreground/80'>
														See generated assessments & attempts.
													</p>
												</div>
											</div>
											<span className='rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-muted-foreground/80'>
												T
											</span>
										</button>
									</div>

									<div className='mt-2 flex items-center justify-between text-[10px] text-muted-foreground/70'>
										<div className='flex items-center gap-2'>
											<div className='h-1 w-1 rounded-full bg-brand-orange/70' />
											<span>
												Real AI-powered search across your study hub is coming soon.
											</span>
										</div>
										<button
											type='button'
											onClick={closeSearch}
											className='rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/80 hover:border-brand-orange/60 hover:text-brand-orange transition-colors'
										>
											Close
										</button>
									</div>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default DashboardPage;
