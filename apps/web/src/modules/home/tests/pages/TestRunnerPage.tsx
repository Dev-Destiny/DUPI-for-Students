import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowLeft, ArrowRight, Timer, Trophy, RotateCcw, Home, Loader2 } from "lucide-react";
import { Button, Card } from "@dupi/ui";
import { testService } from "@/services/test.service";
import { toast } from "sonner";

const spring = { type: "spring", stiffness: 260, damping: 30 };

interface Question { id: string; question: string; options: string[]; type: "mcq" | "short_answer"; }
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

	const currentQuestion = test?.questions?.[currentIndex];
	const isLastQuestion = currentIndex === (test?.questions?.length ?? 0) - 1;
	const handleAnswer = (qId: string, answer: string) => setAnswers((p) => ({ ...p, [qId]: answer }));
	const goToNext = () => isLastQuestion ? submitTest() : setCurrentIndex((p) => p + 1);
	const goToPrev = () => setCurrentIndex((p) => Math.max(0, p - 1));

	const resetTest = () => {
		setResults(null);
		setCurrentIndex(0);
		setAnswers({});
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
				<div className='w-full max-w-2xl px-6 py-4 flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<Button variant='outline' size='icon' onClick={() => navigate("/tests")} className='rounded-full border-border/40 h-8 w-8'>
							<ArrowLeft className='size-4' />
						</Button>
						<div>
							<h1 className='text-base font-serif text-foreground truncate max-w-[200px] md:max-w-sm'>{test?.title}</h1>
							<p className='text-xs text-muted-foreground'>Question {currentIndex + 1} of {test?.questions?.length}</p>
						</div>
					</div>
					<div className='hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/40 bg-card/50'>
						<Timer className='size-3.5 text-muted-foreground' />
						<span className='text-xs text-muted-foreground font-medium tabular-nums'>
							{Math.floor(secondsElapsed / 60).toString().padStart(2, '0')}:{ (secondsElapsed % 60).toString().padStart(2, '0') }
						</span>
					</div>
				</div>
			</div>

			{/* Progress bar */}
			<div className='flex justify-center'>
				<div className='w-full max-w-2xl h-0.5 bg-border/40'>
					<motion.div className='h-full bg-foreground' animate={{ width: `${((currentIndex + 1) / (test?.questions?.length ?? 1)) * 100}%` }} transition={spring} />
				</div>
			</div>

			{/* Question area */}
			<main className='flex-1 flex flex-col items-center justify-center px-6 py-12'>
				<AnimatePresence mode='wait'>
					<motion.div 
						key={currentIndex} 
						initial={{ opacity: 0, y: 20, scale: 0.98 }} 
						animate={{ opacity: 1, y: 0, scale: 1 }} 
						exit={{ opacity: 0, y: -20, scale: 0.98 }} 
						transition={spring} 
						className='w-full max-w-2xl'
					>
						<div className='space-y-10'>
							<div className='text-center space-y-4'>
								<span className='inline-block px-3 py-1 rounded-full border border-border/40 bg-muted/30 text-xs text-muted-foreground font-medium'>
									{currentQuestion?.type === "mcq" ? "Multiple Choice" : "Open Response"}
								</span>
								<h2 className='text-2xl md:text-3xl font-serif leading-snug text-foreground'>
									{currentQuestion?.question}
								</h2>
							</div>

							{currentQuestion?.type === "mcq" ? (
								<motion.div 
									variants={{
										hidden: { opacity: 0 },
										visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
									}}
									initial="hidden"
									animate="visible"
									className='grid grid-cols-1 md:grid-cols-2 gap-3'
								>
									{currentQuestion.options.map((option, i) => {
										const isSelected = answers[currentQuestion.id] === option;
										return (
											<motion.button 
												key={i} 
												variants={{
													hidden: { opacity: 0, y: 10 },
													visible: { opacity: 1, y: 0 }
												}}
												whileTap={{ scale: 0.98 }}
												whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
												onClick={() => handleAnswer(currentQuestion.id, option)}
												className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 ${isSelected ? "border-foreground bg-foreground/5 shadow-soft" : "border-border/40 bg-card/50 hover:border-border hover:bg-card"}`}
											>
												<div className='flex items-center gap-3'>
													<span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-colors ${isSelected ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground"}`}>
														{String.fromCharCode(65 + i)}
													</span>
													<span className='text-sm font-medium text-foreground'>{option}</span>
													{isSelected && <CheckCircle2 className='size-4 text-foreground ml-auto shrink-0' />}
												</div>
											</motion.button>
										);
									})}
								</motion.div>
							) : (
								<textarea value={answers[currentQuestion?.id ?? ""] || ""}
									onChange={(e) => handleAnswer(currentQuestion!.id, e.target.value)}
									placeholder='Write your answer here…'
									className='w-full h-40 p-5 rounded-2xl bg-card border-2 border-border/40 focus:border-foreground/30 outline-none transition-all text-sm font-medium resize-none placeholder:text-muted-foreground/40' />
							)}
						</div>
					</motion.div>
				</AnimatePresence>
			</main>

			{/* Footer */}
			<div className='px-6 md:px-10 py-4 border-t border-border/40 bg-background/60 backdrop-blur-md sticky bottom-0 flex justify-center'>
				<div className='w-full max-w-2xl flex items-center justify-between'>
					<Button variant='outline' onClick={goToPrev} disabled={currentIndex === 0}
						className='h-11 px-6 rounded-2xl border-border/40 text-sm font-medium'>
						<ArrowLeft className='size-4 mr-2' />Previous
					</Button>
					<Button onClick={goToNext} disabled={!answers[currentQuestion?.id ?? ""] || isSubmitting}
						className='h-11 px-8 rounded-2xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all'>
						{isSubmitting ? <Loader2 className='size-4 animate-spin' /> :
							isLastQuestion ? <>Submit<CheckCircle2 className='size-4 ml-2' /></> :
								<>Next<ArrowRight className='size-4 ml-2' /></>
						}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default TestRunnerPage;
