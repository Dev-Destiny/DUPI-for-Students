import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@dupi/ui";
import { Filter, Search, Layers } from "lucide-react";
import { FlashcardSetCard } from "../components/FlashcardSetCard";
import { flashcardService } from "@/services/flashcard.service";
import { GenerationModal } from "@/components/modals/GenerationModal";

const Tabs = ["All Decks", "Due for Review", "Mastered", "New"];

const FlashcardsPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState("All Decks");
	const [searchQuery, setSearchQuery] = useState("");
	const [flashcardSets, setFlashcardSets] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const fetchFlashcards = async () => {
		try {
			setIsLoading(true);
			const data = await flashcardService.getFlashcards();
			
			if (!data || !Array.isArray(data)) {
				setFlashcardSets([]);
				return;
			}

			const grouped: Record<string, any> = {};
			data.forEach((card: any) => {
				const docId = card.documentId || "standalone";
				if (!grouped[docId]) {
					grouped[docId] = {
						id: docId,
						title: card.document?.title || "Standalone Deck",
						documentName: card.document?.title || "Manual added",
						cardsCount: 0,
						mastery: 0,
						status: "learning",
						dueForReview: 0,
					};
				}
				grouped[docId].cardsCount++;
				if (card.nextReview && new Date(card.nextReview) < new Date()) {
					grouped[docId].dueForReview++;
				}
			});
			setFlashcardSets(Object.values(grouped));
		} catch (error) {
			console.error("Failed to fetch flashcards:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchFlashcards();
	}, []);

	const filteredSets = flashcardSets.filter((set) => {
		const matchesTab =
			activeTab === "All Decks" ||
			(activeTab === "Due for Review" && set.dueForReview > 0) ||
			(activeTab === "Mastered" && set.status === "mastered") ||
			(activeTab === "New" && set.status === "new");

		const matchesSearch =
			set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			set.documentName.toLowerCase().includes(searchQuery.toLowerCase());

		return matchesTab && matchesSearch;
	});

	return (
		<div className='flex-1 flex flex-col h-full bg-background overflow-hidden relative'>
			{/* Decorative ambient background blurs */}
			<div className='absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none' />
			<div className='absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-violet/5 rounded-full blur-[150px] pointer-events-none' />

			{/* Refined Header area */}
			<div className='px-4 md:px-8 pt-8 md:pt-10 pb-6 border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-10'>
				<div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
					<div className='relative z-10'>
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(255,111,32,0.15)]'
						>
							<Layers className='size-3.5 fill-current' /> Spaced
							Repetition
						</motion.div>
						<motion.h1
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							className='text-4xl md:text-5xl text-foreground font-serif tracking-tight mb-3 flex items-center gap-3 drop-shadow-lg'
						>
							Flashcards
						</motion.h1>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className='text-muted-foreground font-medium text-sm max-w-xl leading-relaxed'
						>
							Review your decks, use active recall, and let our
							spaced repetition algorithm optimize your
							memorization schedule.
						</motion.p>
					</div>

					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.15 }}
						className='flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10'
					>
						<div className='relative w-full sm:w-64'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
							<Input
								placeholder='Search decks...'
								className='pl-10 bg-card/50 border-border focus-visible:ring-brand-orange/50 rounded-xl h-11 transition-all focus:bg-card hover:bg-card/80 shadow-sm'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<button className='flex items-center justify-center gap-2 h-11 px-4 bg-card/50 border border-border rounded-xl text-muted-foreground hover:text-brand-orange hover:bg-brand-orange/5 hover:border-brand-orange/30 transition-all font-bold text-xs uppercase tracking-wider shrink-0 w-full sm:w-auto shadow-sm'>
							<Filter className='size-4' />
							Filter
						</button>
					</motion.div>
				</div>
			</div>

			{/* Filter Tabs */}
			<div className='px-4 md:px-8 py-4 md:py-5 border-b border-border/50 bg-background/30 backdrop-blur-sm sticky top-[180px] md:top-[160px] z-10'>
				<div className='flex items-center gap-2 overflow-x-auto pb-2 -mb-2 custom-scrollbar hide-scroll-indicator'>
					{Tabs.map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`relative px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors duration-300 z-10 ${
								activeTab === tab
									? "text-brand-orange"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							{activeTab === tab && (
								<motion.div
									layoutId="activeFilterTabFlashcards"
									className="absolute inset-0 bg-brand-orange/10 border border-brand-orange/20 rounded-xl flex shadow-soft -z-10"
									initial={false}
									transition={{ type: "spring", stiffness: 300, damping: 30 }}
								/>
							)}
							{tab}
						</button>
					))}
				</div>
			</div>

			{/* Dynamic Grid */}
			<div className='flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8'>
				<AnimatePresence mode='wait'>
					{isLoading ? (
						<div className='flex items-center justify-center py-24'>
							<p className='text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse'>Loading Flashcards...</p>
						</div>
					) : filteredSets.length > 0 ? (
						<motion.div
							key='grid'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
						>
							{filteredSets.map((set, i) => (
								<motion.div
									key={set.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.05 + 0.2 }}
								>
									<FlashcardSetCard set={set} />
								</motion.div>
							))}
						</motion.div>
					) : (
						<motion.div
							key='empty'
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className='h-full flex flex-col items-center justify-center text-center max-w-md mx-auto relative z-10'
						>
							<div className='w-24 h-24 mb-6 rounded-3xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 shadow-[0_0_30px_rgba(255,111,32,0.15)] ring-1 ring-brand-orange/30'>
								<Layers className='size-10 text-brand-orange' />
							</div>
							<h3 className='text-xl font-bold text-foreground mb-2'>
								No decks found
							</h3>
							<p className='text-sm text-muted-foreground mb-8'>
								We couldn't find any flashcards matching your
								current filters.
							</p>
							<button 
								onClick={() => setIsModalOpen(true)}
								className='px-6 py-3 bg-brand-orange text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-brand-orange/90 transition-all shadow-[0_0_20px_rgba(255,111,32,0.3)]'
							>
								Create a new Deck
							</button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<GenerationModal 
				isOpen={isModalOpen} 
				onClose={() => {
					setIsModalOpen(false);
					fetchFlashcards();
				}} 
				initialType='flashcard'
			/>
		</div>
	);
};

export default FlashcardsPage;
