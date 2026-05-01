import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Home, Loader2, Sparkles } from "lucide-react";
import { Button, Card } from "@studify/ui";
import { flashcardService } from "@/services/flashcard.service";
import { toast } from "sonner";

const spring = { type: "spring", stiffness: 260, damping: 30 };

interface Flashcard { id: string; front: string; back: string; masteryLevel?: number; }

const reviewOptions = [
	{ q: 1, label: "Forgot", color: "border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10 hover:shadow-destructive/10 hover:glow-red" },
	{ q: 2, label: "Hazy", color: "border-orange-500/30 bg-orange-500/5 text-orange-500 hover:bg-orange-500/10 hover:glow-orange" },
	{ q: 3, label: "Okay", color: "border-brand-gold/30 bg-brand-gold/5 text-brand-gold hover:bg-brand-gold/10 hover:glow-gold" },
	{ q: 4, label: "Clear", color: "border-brand-violet/30 bg-brand-violet/5 text-brand-violet hover:bg-brand-violet/10 hover:glow-violet" },
	{ q: 5, label: "Mastered", color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10 hover:glow-emerald" },
];

const FlashcardSessionPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [cards, setCards] = useState<Flashcard[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isFlipped, setIsFlipped] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [reviewedCount, setReviewedCount] = useState(0);
	const [hoveredQuality, setHoveredQuality] = useState<number | null>(null);

	useEffect(() => {
		const fetchCards = async () => {
			try {
				setIsLoading(true);
				const data = await flashcardService.getFlashcards();
				const filtered = id === "all" ? data : data.filter((c: any) => c.documentId === id);
				setCards(filtered);
				if (filtered.length === 0) { toast.info("No flashcards found."); navigate("/flashcards"); }
			} catch {
				toast.error("Could not load flashcards.");
				navigate("/flashcards");
			} finally { setIsLoading(false); }
		};
		fetchCards();
	}, [id, navigate]);

	const currentCard = cards[currentIndex];

	const handleReview = async (quality: number) => {
		if (!currentCard || isTransitioning) return;
		try {
			setIsTransitioning(true);
			await flashcardService.reviewFlashcard(currentCard.id, quality);
			setReviewedCount((p) => p + 1);
			if (currentIndex < cards.length - 1) {
				setIsFlipped(false);
				// Small delay to allow flip back transition before moving to next card
				setTimeout(() => {
					setCurrentIndex((p) => p + 1);
					setIsTransitioning(false);
				}, 400);
			} else { setIsComplete(true); setIsTransitioning(false); }
		} catch { 
			toast.error("Failed to save review."); 
			setIsTransitioning(false);
		}
	};

	if (isLoading) {
		return (
			<div className='flex h-screen w-full items-center justify-center bg-background flex-col gap-3'>
				<Loader2 className='size-6 text-muted-foreground animate-spin' />
				<p className='text-xs text-muted-foreground font-medium'>Loading your deck…</p>
			</div>
		);
	}

	if (isComplete) {
		return (
			<div className='min-h-screen w-full bg-background flex items-center justify-center p-6 text-center'>
				<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={spring} className='w-full max-w-md text-center space-y-8'>
					<div className='w-20 h-20 rounded-full bg-foreground/5 border border-border/40 flex items-center justify-center mx-auto'>
						<span className='text-3xl font-serif font-black text-foreground'>{reviewedCount}</span>
					</div>
					<div className='space-y-2'>
						<h2 className='text-4xl font-serif text-foreground'>Session Complete</h2>
						<p className='text-muted-foreground'>You reviewed {reviewedCount} concept{reviewedCount !== 1 ? "s" : ""}. Mastery is building.</p>
					</div>
					<div className='flex gap-3'>
						<button onClick={() => window.location.reload()}
							className='flex-1 h-11 rounded-2xl border border-border/40 text-sm font-medium text-foreground hover:bg-muted/30 transition-colors flex items-center justify-center gap-2'>
							<RotateCcw className='size-4' />Restart
						</button>
						<button onClick={() => navigate("/flashcards")}
							className='flex-1 h-11 rounded-2xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2'>
							<Home className='size-4' />Study Hub
						</button>
					</div>
				</motion.div>
			</div>
		);
	}

	return (
		<div className='min-h-screen w-full bg-background flex flex-col'>
			{/* Header */}
			<div className='border-b border-border/40 bg-background/60 backdrop-blur-md sticky top-0 z-20 flex justify-center'>
				<div className='w-full max-w-2xl px-6 py-4 flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<Button variant='outline' size='icon' onClick={() => navigate("/flashcards")} className='rounded-full border-border/40 h-8 w-8'>
							<ArrowLeft className='size-4' />
						</Button>
						<div>
							<p className='text-[10px] uppercase tracking-tighter text-muted-foreground font-black'>Studying</p>
							<h1 className='text-sm font-serif text-foreground truncate max-w-[150px] md:max-w-xs'>
								{id === "all" ? "Dynamic Review" : (cards[0]?.front ? cards[0].front.slice(0, 30) + "…" : "Study Session")}
							</h1>
						</div>
					</div>
					<div className='flex items-center gap-4'>
						<span className='text-xs text-muted-foreground font-medium tabular-nums'>{currentIndex + 1} / {cards.length}</span>
						<div className='w-20 md:w-32 h-1 bg-border/40 rounded-full overflow-hidden'>
							<motion.div className='h-full bg-foreground rounded-full' animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }} transition={spring} />
						</div>
					</div>
				</div>
			</div>

			{/* Background Glow */}
			<div className='fixed inset-0 pointer-events-none overflow-hidden -z-10 transition-colors duration-500'>
				<motion.div 
					className={`absolute inset-0 opacity-[0.03] transition-colors duration-500 ${
						hoveredQuality === 1 ? "bg-red-500" :
						hoveredQuality === 2 ? "bg-orange-500" :
						hoveredQuality === 3 ? "bg-brand-gold" :
						hoveredQuality === 4 ? "bg-brand-violet" :
						hoveredQuality === 5 ? "bg-emerald-500" : "bg-transparent"
					}`}
				/>
			</div>

			{/* Card Area */}
			<main className='flex-1 flex flex-col items-center justify-center px-6 py-8'>
				<AnimatePresence mode='wait'>
					<motion.div 
						key={currentIndex} 
						initial={{ opacity: 0, y: 20, scale: 0.95 }} 
						animate={{ opacity: 1, y: 0, scale: 1 }} 
						exit={{ opacity: 0, y: -20, scale: 0.95 }} 
						transition={spring}
						className='w-full max-w-xl perspective-1000'
					>
						<motion.div 
							className='relative w-full h-[400px] md:h-[480px] cursor-pointer preserve-3d group shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-[2.5rem]'
							animate={{ rotateY: isFlipped ? 180 : 0 }}
							transition={{ type: "spring", stiffness: 200, damping: 25 }}
							onClick={() => !isTransitioning && setIsFlipped(!isFlipped)}
						>
							{/* Floating Decorative Elements */}
							<div className='absolute -top-12 -right-12 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
							<div className='absolute -bottom-12 -left-12 w-32 h-32 bg-brand-violet/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
							{/* Front */}
							<Card className='absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 md:p-12 bg-card border-border/30 shadow-soft rounded-[2.5rem] text-center'>
								<span className='px-3 py-1 rounded-full bg-muted/30 border border-border/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-8'>
									Question
								</span>
								<h2 className='text-2xl md:text-3xl font-serif leading-snug text-foreground'>
									{currentCard?.front}
								</h2>
								<div className='mt-auto flex items-center gap-2 text-muted-foreground/30'>
									<RotateCcw className='size-3' />
									<p className='text-[10px] font-bold uppercase tracking-widest'>Tap to reveal</p>
								</div>
							</Card>

							{/* Back */}
							<Card className='absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 md:p-12 bg-foreground/5 border-foreground/10 shadow-soft rounded-[2.5rem] text-center border-2'>
								<span className='px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-[10px] font-black uppercase tracking-widest text-brand-orange mb-8'>
									Answer
								</span>
								<div className='max-h-[250px] overflow-y-auto custom-scrollbar pr-2'>
									<p className='text-lg md:text-xl font-serif leading-relaxed text-foreground'>
										{currentCard?.back}
									</p>
								</div>
								<div className='mt-8 pt-6 border-t border-border/10 w-full'>
									<button className='flex items-center gap-2 mx-auto px-4 py-2 rounded-xl bg-muted/30 border border-border/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted/50 transition-colors'>
										<Sparkles className='size-3 text-brand-orange' />
										View Source Reference
									</button>
								</div>
								<p className='mt-auto text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30'>Review below</p>
							</Card>
						</motion.div>
					</motion.div>
				</AnimatePresence>
			</main>

			{/* Review controls (Fixed height to prevent jitter) */}
			<div className='h-40 flex items-center justify-center border-t border-border/10 bg-muted/5'>
				<div className='w-full max-w-2xl flex flex-col items-center justify-center'>
					<AnimatePresence mode='wait'>
						{isFlipped ? (
							<motion.div 
								key="review" 
								initial={{ opacity: 0, y: 10 }} 
								animate={{ opacity: 1, y: 0 }} 
								exit={{ opacity: 0, y: -10 }} 
								transition={{ ...spring, stiffness: 400 }}
								className='flex flex-col items-center gap-4'
							>
								<p className='font-grotesk text-[10px] font-black uppercase tracking-widest text-muted-foreground/60'>
									Rate your understanding
								</p>
								<div className='flex gap-2 flex-wrap justify-center px-4'>
									{reviewOptions.map((opt) => (
										<motion.button 
											key={opt.q} 
											whileHover={{ y: -4, scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onMouseEnter={() => setHoveredQuality(opt.q)}
											onMouseLeave={() => setHoveredQuality(null)}
											onClick={() => handleReview(opt.q)}
											className={`px-5 py-2.5 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${opt.color}`}
										>
											{opt.label}
										</motion.button>
									))}
								</div>
							</motion.div>
						) : (
							<motion.div 
								key="hint" 
								initial={{ opacity: 0 }} 
								animate={{ opacity: 1 }} 
								exit={{ opacity: 0 }}
								className='flex flex-col items-center gap-2 text-muted-foreground/40'
							>
								<Sparkles className='size-4 animate-pulse' />
								<p className='text-[10px] font-black uppercase tracking-widest'>Think... then tap the card</p>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

export default FlashcardSessionPage;
