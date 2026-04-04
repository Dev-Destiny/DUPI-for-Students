import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2 } from "lucide-react";
import { Button, Input } from "@dupi/ui";
import { testService } from "@/services/test.service";
import { flashcardService } from "@/services/flashcard.service";
import { documentService } from "@/services/document.service";
import { toast } from "sonner";

interface Document {
	id: string;
	title: string;
}

interface GenerationModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialType?: "test" | "flashcard";
	documentId?: string;
}

const springConfig = { type: "spring", stiffness: 260, damping: 30 };

export const GenerationModal: React.FC<GenerationModalProps> = ({
	isOpen,
	onClose,
	initialType = "test",
	documentId
}) => {
	const [step, setStep] = useState<1 | 2 | 3>(1);
	const type = initialType; 
	const [selectedDocId, setSelectedDocId] = useState<string | undefined>(documentId);
	const [documents, setDocuments] = useState<Document[]>([]);
	const [isLoadingDocs, setIsLoadingDocs] = useState(false);
	
	// Options
	const [count, setCount] = useState(10);
	const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
	const [topic, setTopic] = useState("");
	
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (isOpen) {
			setStep(1);
			setError(null);
			if (!documentId) {
				fetchDocs();
			} else {
				setSelectedDocId(documentId);
				setStep(2); 
			}
		}
	}, [isOpen, documentId]);

	const fetchDocs = async () => {
		try {
			setIsLoadingDocs(true);
			const docs = await documentService.getDocuments();
			setDocuments(docs);
		} catch (err) {
			console.error("Failed to fetch documents", err);
		} finally {
			setIsLoadingDocs(false);
		}
	};

	const handleGenerate = async () => {
		if (!selectedDocId && !topic) {
			setError("Please select a document or provide a specific topic.");
			return;
		}

		setIsGenerating(true);
		setError(null);
		
		try {
			if (type === "test") {
				await testService.generateTest({
					documentId: selectedDocId,
					topic: topic || undefined,
					count,
					difficulty
				});
				toast.success("Practice test generated successfully!");
			} else {
				await flashcardService.generateFlashcards(selectedDocId!, count);
				toast.success("Flashcard deck generated successfully!");
			}
			setStep(3);
			setTimeout(() => {
				onClose();
			}, 2000);
		} catch (err: any) {
			console.error("Generation failed", err);
			setError(err.response?.data?.message || "Generation failed. Please try again.");
			toast.error("Generation failed. Please try again.");
		} finally {
			setIsGenerating(false);
		}
	};

	const handleClose = () => {
		if (isGenerating) return;
		onClose();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm'
				>
					<motion.div
						initial={{ scale: 0.95, opacity: 0, y: 10 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.95, opacity: 0, y: 10 }}
						transition={springConfig}
						className='relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-soft overflow-hidden flex flex-col'
					>
						{/* Progress Bar (Minimal) */}
						<div className='absolute top-0 left-0 w-full h-1 bg-muted'>
							<motion.div 
								className='h-full bg-foreground'
								animate={{ width: `${(step / 3) * 100}%` }}
								transition={springConfig}
							/>
						</div>

						{/* Header */}
						<div className='flex items-start justify-between p-8 pb-2'>
							<div>
								<h2 className='text-2xl font-serif text-foreground tracking-tight'>
									Generate {type === "test" ? "Practice Test" : "Flashcards"}
								</h2>
								<p className='text-muted-foreground text-sm mt-1 max-w-sm'>
									Configure parameters below to instruct the generation core.
								</p>
							</div>
							<button
								onClick={handleClose}
								className='p-2 -mr-2 -mt-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
								disabled={isGenerating}
							>
								<X className='size-5' />
							</button>
						</div>

						{/* Content Area */}
						<div className='p-8 pt-4 flex-1 min-h-[360px] relative'>
							<AnimatePresence mode="wait">
								{step === 1 && (
									<motion.div 
										key="step1"
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 10 }}
										transition={springConfig}
										className='space-y-6 h-full flex flex-col'
									>
										<div className='flex-1 flex flex-col space-y-3'>
											<label className='text-sm font-medium text-foreground'>
												Source Document
											</label>
											{isLoadingDocs ? (
												<div className='flex-1 flex items-center justify-center min-h-[150px]'>
													<Loader2 className='size-5 text-muted-foreground animate-spin' />
												</div>
											) : documents.length > 0 ? (
												<div className='grid grid-cols-1 gap-2 overflow-y-auto max-h-[220px] custom-scrollbar pr-2'>
													{documents.map((doc) => (
														<button
															key={doc.id}
															onClick={() => setSelectedDocId(doc.id)}
															className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
																selectedDocId === doc.id
																	? "border-brand-orange bg-brand-orange/5 text-brand-orange"
																	: "border-border bg-transparent hover:bg-muted/50 text-foreground"
															}`}
														>
															<span className='font-medium text-sm truncate'>{doc.title}</span>
															{selectedDocId === doc.id && (
																<Check className='size-4 shrink-0' />
															)}
														</button>
													))}
												</div>
											) : (
												<div className='flex-1 flex flex-col items-center justify-center min-h-[150px] border border-dashed border-border rounded-xl bg-muted/20'>
													<p className='text-sm text-muted-foreground'>No documents available.</p>
												</div>
											)}
										</div>
										
										<div className="pt-2">
											<Button
												disabled={!selectedDocId}
												onClick={() => setStep(2)}
												className='w-full h-12 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-all'
											>
												Continue Configuration
											</Button>
										</div>
									</motion.div>
								)}

								{step === 2 && (
									<motion.div 
										key="step2"
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 10 }}
										transition={springConfig}
										className='space-y-6 h-full flex flex-col'
									>
										<div className='flex-1 space-y-6'>
											{/* Count Slider */}
											<div className='space-y-3'>
												<div className="flex items-center justify-between">
													<label className='text-sm font-medium text-foreground'>Item Count</label>
													<span className='text-sm text-muted-foreground'>{count} items</span>
												</div>
												<input 
													type='range' 
													min='5' 
													max='50' 
													step='5'
													value={count}
													onChange={(e) => setCount(parseInt(e.target.value))}
													className='w-full accent-foreground h-1 bg-muted rounded-full appearance-none outline-none'
												/>
											</div>

											{/* Difficulty Pills */}
											<div className='space-y-3'>
												<label className='text-sm font-medium text-foreground'>
													Difficulty Level
												</label>
												<div className='flex p-1 rounded-xl bg-muted/50 relative'>
													{["easy", "medium", "hard"].map((d) => (
														<button
															key={d}
															onClick={() => setDifficulty(d as any)}
															className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors relative z-10 ${
																difficulty === d ? "text-background" : "text-muted-foreground hover:text-foreground"
															}`}
														>
															{d}
														</button>
													))}
													<motion.div 
														className='absolute inset-y-1 bg-foreground rounded-lg shadow-sm'
														initial={false}
														animate={{ 
															left: difficulty === "easy" ? "4px" : difficulty === "medium" ? "33.3%" : "66.6%",
															width: "calc(33.3% - 4px)"
														}}
														transition={springConfig}
													/>
												</div>
											</div>

											{/* Topic Input */}
											<div className='space-y-3'>
												<label className='text-sm font-medium text-foreground'>
													Refined Topic <span className="text-muted-foreground font-normal">(Optional)</span>
												</label>
												<Input 
													placeholder='e.g. World War II Causes...'
													value={topic}
													onChange={(e) => setTopic(e.target.value)}
													className='h-11 bg-background border-border rounded-xl focus-visible:ring-1 focus-visible:ring-foreground focus-visible:border-foreground transition-all'
												/>
											</div>

											{error && (
												<p className='text-sm text-destructive font-medium'>
													{error}
												</p>
											)}
										</div>

										<div className='flex gap-3 pt-4 border-t border-border/50'>
											{!documentId && (
												<Button 
													variant='outline'
													onClick={() => setStep(1)}
													disabled={isGenerating}
													className='flex-1 h-12 rounded-xl text-sm font-medium border-border hover:bg-muted'
												>
													Back
												</Button>
											)}
											<Button
												disabled={isGenerating}
												onClick={handleGenerate}
												className='flex-[2] h-12 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-all'
											>
												{isGenerating ? (
													<span className='flex items-center gap-2'>
														<Loader2 className='size-4 animate-spin' />
														Processing...
													</span>
												) : (
													<span>Synthesize</span>
												)}
											</Button>
										</div>
									</motion.div>
								)}

								{step === 3 && (
									<motion.div 
										key="step3"
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={springConfig}
										className='h-full flex flex-col items-center justify-center text-center space-y-4'
									>
										<div className='w-16 h-16 rounded-full bg-foreground/5 text-foreground flex items-center justify-center' >
											<Check className='size-8' />
										</div>
										<div className='space-y-1'>
											<h3 className='text-xl font-serif text-foreground'>
												Generation Complete
											</h3>
											<p className='text-muted-foreground text-sm'>
												Your {type === "test" ? "test" : "flashcard set"} is ready in the library.
											</p>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
