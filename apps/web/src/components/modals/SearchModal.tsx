import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Layers, ChevronRight, Clock, FileUp, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearchStore } from "@/store/search.store";
import {
	groupFlashcardSets,
	useDocumentsQuery,
	useFlashcardsQuery,
	useTestsQuery,
} from "@/hooks/use-studify-query";

export const SearchModal: React.FC = () => {
	const navigate = useNavigate();
	const { isOpen, close } = useSearchStore();
	const [searchQuery, setSearchQuery] = useState("");
	const documentsQuery = useDocumentsQuery(isOpen);
	const testsQuery = useTestsQuery(isOpen);
	const flashcardsQuery = useFlashcardsQuery(isOpen);
	const isSearching =
		documentsQuery.isLoading || testsQuery.isLoading || flashcardsQuery.isLoading;
	const flashcardSets = useMemo(
		() =>
			Array.isArray(flashcardsQuery.data)
				? groupFlashcardSets(flashcardsQuery.data)
				: [],
		[flashcardsQuery.data],
	);

	useEffect(() => {
		if (isOpen) {
			setSearchQuery("");
		}
	}, [isOpen]);

	const filteredResults = {
		documents: ((documentsQuery.data ?? []) as any[]).filter((d: any) => d.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4),
		tests: ((testsQuery.data ?? []) as any[]).filter((t: any) => t.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4),
		flashcards: flashcardSets.filter((f: any) => f.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4)
	};

	const hasResults = searchQuery.length > 0 && (filteredResults.documents.length > 0 || filteredResults.tests.length > 0 || filteredResults.flashcards.length > 0);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className='fixed inset-0 z-[100] flex items-center justify-center'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					{/* Backdrop */}
					<button
						type='button'
						onClick={close}
						className='absolute inset-0 bg-black/60 backdrop-blur-md'
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, y: 20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.95 }}
						transition={{ type: "spring", stiffness: 350, damping: 28 }}
						className='relative z-50 w-full max-w-xl mx-4 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-brand-violet/10 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden'
					>
						<div className='absolute -top-32 -right-10 h-48 w-48 rounded-full bg-brand-orange/20 blur-3xl opacity-40 pointer-events-none' />
						<div className='absolute -bottom-32 -left-10 h-52 w-52 rounded-full bg-brand-violet/25 blur-3xl opacity-40 pointer-events-none' />

						<div className='relative p-6 border-b border-white/10'>
							<div className='flex items-center gap-3 rounded-2xl bg-black/40 px-4 py-3 border border-white/10 shadow-inner'>
								<Search className='size-5 text-muted-foreground' />
								<input
									autoFocus
									type='text'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder='Search your study hub...'
									className='h-8 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none'
								/>
								{isSearching ? (
									<Loader2 className="size-4 text-brand-orange animate-spin" />
								) : (
									<span className='hidden sm:inline-flex items-center gap-1 rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest'>
										Esc
									</span>
								)}
							</div>
						</div>

						<div className='relative px-6 pb-6 pt-4 max-h-[450px] overflow-y-auto custom-scrollbar'>
							<div className='space-y-6'>
								{searchQuery.length > 0 ? (
									hasResults ? (
										<div className="space-y-6">
											{filteredResults.documents.length > 0 && (
												<div className="space-y-3">
													<h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1">Documents</h3>
													<div className="grid grid-cols-1 gap-1">
														{filteredResults.documents.map((doc: any) => (
															<button
																key={doc.id}
																onClick={() => { navigate(`/documents/${doc.id}`); close(); }}
																className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-left group"
															>
																<div className="h-10 w-10 rounded-xl bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors">
																	<FileText className="size-5 text-brand-orange" />
																</div>
																<div className="flex-1 min-w-0">
																	<p className="text-sm font-bold truncate text-foreground/90">{doc.title}</p>
																	<p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Document</p>
																</div>
																<ChevronRight className="size-4 text-muted-foreground/20 group-hover:text-brand-orange transition-colors" />
															</button>
														))}
													</div>
												</div>
											)}

											{filteredResults.tests.length > 0 && (
												<div className="space-y-3">
													<h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1">Tests</h3>
													<div className="grid grid-cols-1 gap-1">
														{filteredResults.tests.map((test: any) => (
															<button
																key={test.id}
																onClick={() => { navigate(`/tests/${test.id}`); close(); }}
																className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-left group"
															>
																<div className="h-10 w-10 rounded-xl bg-brand-violet/10 flex items-center justify-center group-hover:bg-brand-violet/20 transition-colors">
																	<FileText className="size-5 text-brand-violet" />
																</div>
																<div className="flex-1 min-w-0">
																	<p className="text-sm font-bold truncate text-foreground/90">{test.title}</p>
																	<p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Practice Test</p>
																</div>
																<ChevronRight className="size-4 text-muted-foreground/20 group-hover:text-brand-violet transition-colors" />
															</button>
														))}
													</div>
												</div>
											)}

											{filteredResults.flashcards.length > 0 && (
												<div className="space-y-3">
													<h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1">Flashcards</h3>
													<div className="grid grid-cols-1 gap-1">
														{filteredResults.flashcards.map(set => (
															<button
																key={set.id}
																onClick={() => { navigate(`/flashcards/${set.id}`); close(); }}
																className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-left group"
															>
																<div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
																	<Layers className="size-5 text-emerald-500" />
																</div>
																<div className="flex-1 min-w-0">
																	<p className="text-sm font-bold truncate text-foreground/90">{set.title}</p>
																	<p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{set.cardsCount} cards</p>
																</div>
																<ChevronRight className="size-4 text-muted-foreground/20 group-hover:text-emerald-500 transition-colors" />
															</button>
														))}
													</div>
												</div>
											)}
										</div>
									) : (
										<div className="py-20 text-center">
											<div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
												<Search className="size-8 text-muted-foreground/20" />
											</div>
											<p className="text-sm font-bold text-muted-foreground mb-1">No results for "{searchQuery}"</p>
											<p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">Try a different keyword</p>
										</div>
									)
								) : (
									<>
										<div className='flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1'>
											<span>Suggested actions</span>
										</div>

										<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
											<button
												type='button'
												onClick={() => {
													navigate("/documents");
													close();
												}}
												className='group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-brand-orange/60 hover:bg-brand-orange/10'
											>
												<div className='flex items-center gap-4'>
													<div className='flex h-10 w-10 items-center justify-center rounded-xl bg-black/40 group-hover:bg-brand-orange/20 transition-colors'>
														<FileUp className='size-5 text-brand-orange' />
													</div>
													<div>
														<p className='text-xs font-bold'>
															Upload
														</p>
														<p className='text-[10px] text-muted-foreground font-medium'>
															Notes or PDF
														</p>
													</div>
												</div>
												<ChevronRight className='size-3 text-muted-foreground/30 group-hover:text-brand-orange transition-colors' />
											</button>

											<button
												type='button'
												onClick={() => {
													navigate("/tests");
													close();
												}}
												className='group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-brand-orange/60 hover:bg-brand-orange/10'
											>
												<div className='flex items-center gap-4'>
													<div className='flex h-10 w-10 items-center justify-center rounded-xl bg-black/40 group-hover:bg-brand-orange/20 transition-colors'>
														<FileText className='size-5 text-brand-orange' />
													</div>
													<div>
														<p className='text-xs font-bold'>
															Practice
														</p>
														<p className='text-[10px] text-muted-foreground font-medium'>
															View tests
														</p>
													</div>
												</div>
												<ChevronRight className='size-3 text-muted-foreground/30 group-hover:text-brand-orange transition-colors' />
											</button>
										</div>
									</>
								)}

								<div className='mt-4 flex items-center justify-between text-[10px] text-muted-foreground/60 font-medium px-1'>
									<div className='flex items-center gap-2'>
										<Clock className='size-3 text-brand-orange/50' />
										<span>
											{searchQuery.length > 0 ? `Showing top matches` : "Search across documents, tests and flashcards"}
										</span>
									</div>
									<div className="flex items-center gap-3">
										<span className="flex items-center gap-1">
											<span className="opacity-40">Move</span>
											<span className="bg-white/5 px-1 rounded border border-white/10 tracking-tighter">↑↓</span>
										</span>
										<span className="flex items-center gap-1">
											<span className="opacity-40">Select</span>
											<span className="bg-white/5 px-1 rounded border border-white/10 tracking-tighter">↵</span>
										</span>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
