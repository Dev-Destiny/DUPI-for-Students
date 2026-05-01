import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowLeft, ArrowRight, Timer, Trophy, RotateCcw, Home, Loader2 } from "lucide-react";
import { Button, Card } from "@studify/ui";
import { testService } from "@/services/test.service";
import { toast } from "sonner";

const spring = { type: "spring", stiffness: 260, damping: 30 };

interface QuestionOption { label: string; text: string; }
interface Question { id: string; question: string; options?: QuestionOption[]; type: "mcq" | "short_answer"; }
interface TestData { id: string; title: string; questions: Question[]; }
interface TestResults { score: number; totalQuestions: number; correctAnswers: number; timeSpent: number; }

const TestRunnerPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [test, setTest] = useState<TestData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [secondsElapsed, setSecondsElapsed] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [results, setResults] = useState<TestResults | null>(null);
	const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	useEffect(() => {
		const fetchTest = async () => {
			if (!id) return;
			try {
				setIsLoading(true);
				const data = await testService.getTestById(id);
				setTest(data);
			} catch {
				toast.error("Could not load the test.");
				navigate("/tests");
			} finally { setIsLoading(false); }
		};
		fetchTest();
	}, [id, navigate]);

	useEffect(() => {
		let interval: ReturnType<typeof setInterval>;
		if (!isLoading && !results && !isSubmitting) {
			interval = setInterval(() => {
				setSecondsElapsed((prev) => prev + 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isLoading, results, isSubmitting]);

	const handleAnswer = (qId: string, answer: string) => setAnswers((p) => ({ ...p, [qId]: answer }));

	const toggleFlag = (qId: string) => {
		setFlaggedQuestions((prev) => {
			const next = new Set(prev);
			if (next.has(qId)) next.delete(qId);
			else next.add(qId);
			return next;
		});
	};

	const resetTest = () => {
		setResults(null);
		setCurrentIndex(0);
		setAnswers({});
		setFlaggedQuestions(new Set());
		setSecondsElapsed(0);
	};

	const submitTest = async () => {
		if (!id) return;
		setIsSubmitting(true);
		try {
			const data = await testService.submitAttempt(id, answers, secondsElapsed);
			setResults(data);
		} catch { toast.error("Failed to submit."); }
		finally { setIsSubmitting(false); }
	};

	if (isLoading) {
		return (
			<div className='flex h-screen w-full items-center justify-center bg-background flex-col gap-3'>
				<Loader2 className='size-6 text-muted-foreground animate-spin' />
				<p className='text-xs text-muted-foreground font-medium'>Loading your test…</p>
			</div>
		);
	}

	if (results) {
		return (
			<div className='min-h-screen w-full bg-background flex items-center justify-center p-6'>
				<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={spring} className='w-full max-w-lg'>
					<Card className='p-12 text-center space-y-8 border-border/40 bg-card shadow-soft rounded-3xl'>
						<motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ ...spring, delay: 0.1 }}
							className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-foreground/5 border border-border/40 mx-auto'>
							<Trophy className='size-10 text-foreground' />
						</motion.div>

						<div className='space-y-2'>
							<h1 className='text-4xl font-serif text-foreground'>Test Complete</h1>
							<p className='text-muted-foreground'>Here is how you did</p>
						</div>

						<div className='grid grid-cols-2 gap-3'>
							{[
								{ label: "Score", value: `${results.score || 0}%` },
								{ label: "Correct Answers", value: `${Math.round((results.score / 100) * (test?.questions?.length ?? 0))} / ${test?.questions?.length}` },
							].map((s) => (
								<div key={s.label} className='p-5 rounded-2xl bg-muted/30 border border-border/30'>
									<p className='text-xs text-muted-foreground mb-1'>{s.label}</p>
									<p className='text-3xl font-serif font-black text-foreground'>{s.value}</p>
								</div>
							))}
						</div>

						<div className='flex gap-3'>
							<Button variant='outline' onClick={resetTest}
								className='flex-1 h-12 rounded-2xl border-border/40 text-sm font-medium'>
								<RotateCcw className='size-4 mr-2' />Retake
							</Button>
							<Button onClick={() => navigate("/tests")}
								className='flex-1 h-12 rounded-2xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90'>
								<Home className='size-4 mr-2' />Back to Tests
							</Button>
						</div>
					</Card>
				</motion.div>
			</div>
		);
	}

	return (
		<div className='min-h-screen w-full bg-background flex flex-col'>
			{/* Top bar */}
			<div className='border-b border-border/40 bg-background/60 backdrop-blur-md sticky top-0 z-20 flex justify-center'>
				<div className='w-full max-w-6xl px-6 py-4 flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<Button variant='outline' size='icon' onClick={() => navigate("/tests")} className='rounded-full border-border/40 h-8 w-8'>
							<ArrowLeft className='size-4' />
						</Button>
						<div>
							<h1 className='text-base font-serif text-foreground truncate max-w-[150px] md:max-w-sm'>{test?.title}</h1>
							<p className='text-xs text-muted-foreground'>Question {currentIndex + 1} of {test?.questions?.length}</p>
						</div>
					</div>
					<div className='flex items-center gap-2'>
						<div className='hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/40 bg-card/50'>
							<Timer className='size-3.5 text-muted-foreground' />
							<span className='text-xs text-muted-foreground font-medium tabular-nums'>
								{Math.floor(secondsElapsed / 60).toString().padStart(2, '0')}:{ (secondsElapsed % 60).toString().padStart(2, '0') }
							</span>
						</div>
						<Button 
							variant='outline' 
							size='sm' 
							onClick={() => setIsSidebarOpen(!isSidebarOpen)}
							className='rounded-xl border-border/40 md:hidden'
						>
							Nav
						</Button>
					</div>
				</div>
			</div>

			{/* Main Content Layout */}
			<div className='flex-1 flex max-w-6xl mx-auto w-full relative h-[calc(100vh-140px)]'>
				{/* Sidebar Navigator */}
				<aside className={`
					fixed inset-y-0 left-0 w-64 bg-background border-r border-border/40 z-30 transition-transform duration-300 md:relative md:translate-x-0
					${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
				`}>
					<div className='p-6 h-full overflow-y-auto custom-scrollbar flex flex-col gap-8'>
						<div className='space-y-4'>
							<h3 className='text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground'>Navigator</h3>
							<div className='grid grid-cols-4 gap-2'>
								{test?.questions.map((q, i) => {
									const isCurrent = i === currentIndex;
									const isAnswered = !!answers[q.id];
									const isFlagged = flaggedQuestions.has(q.id);
									return (
										<button 
											key={q.id}
											onClick={() => { setCurrentIndex(i); setIsSidebarOpen(false); }}
											className={`
												w-full aspect-square rounded-xl text-[10px] font-black transition-all border
												${isCurrent ? "bg-foreground text-background border-foreground shadow-[0_0_15px_rgba(0,0,0,0.1)]" : 
												  isFlagged ? "bg-brand-orange/10 text-brand-orange border-brand-orange/30" :
												  isAnswered ? "bg-muted text-foreground border-border/40" : 
												  "bg-transparent text-muted-foreground border-border/20"}
											`}
										>
											{i + 1}
										</button>
									);
								})}
							</div>
						</div>

						<div className='mt-auto space-y-4 pt-6 border-t border-border/10 opacity-60'>
							<div className='flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest'>
								<div className='w-2 h-2 rounded-full bg-brand-orange' /> Flagged
							</div>
							<div className='flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest'>
								<div className='w-2 h-2 rounded-full bg-muted border border-border/40' /> Answered
							</div>
						</div>
					</div>
				</aside>

				{/* Question area */}
				<main className='flex-1 flex flex-col overflow-y-auto custom-scrollbar p-6 md:p-12'>
					<div className='max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center'>
						<AnimatePresence mode='wait'>
							<motion.div 
								key={currentIndex} 
								initial={{ opacity: 0, x: 20 }} 
								animate={{ opacity: 1, x: 0 }} 
								exit={{ opacity: 0, x: -20 }} 
								transition={spring} 
								className='space-y-12'
							>
								<div className='space-y-6'>
									<div className='flex justify-between items-center'>
										<span className='px-3 py-1 rounded-full border border-border/40 bg-muted/30 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground'>
											{test?.questions[currentIndex]?.type === "mcq" ? "Multiple Choice" : "Open Response"}
										</span>
										<button 
											onClick={() => test?.questions[currentIndex] && toggleFlag(test.questions[currentIndex].id)}
											className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${flaggedQuestions.has(test?.questions[currentIndex]?.id ?? "") ? "text-brand-orange" : "text-muted-foreground hover:text-foreground"}`}
										>
											{flaggedQuestions.has(test?.questions[currentIndex]?.id ?? "") ? "Question Flagged" : "Flag Question"}
										</button>
									</div>
									<h2 className='text-3xl md:text-4xl font-serif leading-[1.2] text-foreground'>
										{test?.questions[currentIndex]?.question}
									</h2>
								</div>

								{test?.questions[currentIndex]?.type === "mcq" ? (
									<div className='grid grid-cols-1 gap-3'>
										{test.questions[currentIndex].options?.map((option, i) => {
											const isSelected = answers[test.questions[currentIndex].id] === option.label;
											return (
												<motion.button 
													key={i} 
													whileTap={{ scale: 0.995 }}
													onClick={() => handleAnswer(test.questions[currentIndex].id, option.label)}
													className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 relative group
														${isSelected ? "border-foreground bg-foreground/5" : "border-border/10 bg-card/30 hover:border-border/40 hover:bg-card/50"}`}
												>
													<div className='flex items-center gap-4 relative z-10'>
														<span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-colors 
															${isSelected ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground group-hover:bg-muted"}`}>
															{option.label}
														</span>
														<span className='text-base font-medium text-foreground'>{option.text}</span>
														{isSelected && (
															<motion.div layoutId='check' className='ml-auto shrink-0'>
																<CheckCircle2 className='size-5 text-foreground' />
															</motion.div>
														)}
													</div>
												</motion.button>
											);
										})}
									</div>
								) : (
									<textarea 
										value={answers[test?.questions[currentIndex]?.id ?? ""] || ""}
										onChange={(e) => handleAnswer(test!.questions[currentIndex].id, e.target.value)}
										placeholder='Formulate your response here…'
										className='w-full h-64 p-8 rounded-3xl bg-card/30 border border-border/20 focus:border-foreground/30 focus:bg-card/50 outline-none transition-all text-lg font-serif italic resize-none placeholder:text-muted-foreground/20' 
									/>
								)}
							</motion.div>
						</AnimatePresence>
					</div>
				</main>
			</div>

			{/* Footer */}
			<div className='px-6 md:px-10 py-5 border-t border-border/10 bg-background/60 backdrop-blur-md sticky bottom-0 z-20 flex justify-center'>
				<div className='w-full max-w-6xl flex items-center justify-between'>
					<Button variant='outline' onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))} disabled={currentIndex === 0}
						className='h-12 px-8 rounded-2xl border-border/40 text-[10px] font-black uppercase tracking-widest'>
						<ArrowLeft className='size-4 mr-3' />Back
					</Button>
					<div className='hidden md:flex flex-col items-center gap-1 opacity-40'>
						<span className='text-[9px] font-black uppercase tracking-widest'>Step</span>
						<span className='text-xs tabular-nums font-bold'>{currentIndex + 1} / {test?.questions.length}</span>
					</div>
					<Button onClick={() => (currentIndex === (test?.questions.length ?? 0) - 1) ? submitTest() : setCurrentIndex((p) => p + 1)} 
						disabled={!answers[test?.questions[currentIndex]?.id ?? ""] || isSubmitting}
						className='h-12 px-10 rounded-2xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:bg-foreground/90 transition-all'>
						{isSubmitting ? <Loader2 className='size-4 animate-spin' /> :
							(currentIndex === (test?.questions.length ?? 0) - 1) ? <>Finalize Attempt<CheckCircle2 className='size-4 ml-3' /></> :
								<>Continue<ArrowRight className='size-4 ml-3' /></>
						}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default TestRunnerPage;
