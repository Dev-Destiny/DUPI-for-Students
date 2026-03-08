import { type FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@dupi/ui/components/ui/button";
import { supabase } from "../lib/supabase";
import { Mail, ArrowLeft, Loader2, Sparkles, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useIsMobile } from "@dupi/ui";

const WaitlistPage: FC = () => {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const isMobile = useIsMobile();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setStatus("loading");
		try {
			const { error } = await supabase
				.from("waitlist")
				.insert([{ email }]);

			if (error) {
				if (
					error.code === "23505" ||
					error.message.includes("unique")
				) {
					toast.success("You're already on the waitlist! 🎉");
					setStatus("success");
				} else {
					throw error;
				}
			} else {
				setStatus("success");
			}
		} catch (err: any) {
			console.error("Waitlist Error:", err);
			setStatus("error");
			toast.error("Something went wrong. Please try again.");
		}
	};

	const springConfig = { type: "spring", stiffness: 400, damping: 25 };

	return (
		<main className='min-h-screen bg-background flex flex-col relative overflow-hidden'>
			{/* Decorative background blurs to keep it techy but clean */}
			<motion.div
				className='absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none'
				animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
				transition={{
					duration: 10,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className='absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-violet/5 rounded-full blur-[100px] pointer-events-none'
				animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
				transition={{
					duration: 12,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			{/* Header with back button */}
			<header className='w-full max-w-7xl mx-auto px-6 py-8 relative z-10 flex items-center justify-between'>
				<Link to='/' className='flex items-center gap-1 group'>
					<span className='font-grotesk font-bold tracking-tighter text-foreground text-3xl flex items-center gap-[4px] transition-transform group-hover:scale-105'>
						dupi
						<span className='w-2.5 h-2.5 rounded-full bg-brand-orange'></span>
					</span>
				</Link>
				<Link
					to='/'
					className='text-muted-foreground hover:text-brand-orange flex items-center gap-2 text-sm font-bold transition-colors'
				>
					<ArrowLeft className='w-4 h-4' />
					<span>Back to Home</span>
				</Link>
			</header>

			{/* Centered Content */}
			<div className='flex-1 flex flex-col items-center justify-center px-4 sm:px-6 relative z-10 pb-20'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={springConfig}
					className='w-full max-w-2xl mx-auto text-center'
				>
					<div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange mb-8 font-bold text-xs uppercase tracking-widest'>
						<Sparkles className='w-3 h-3' />
						<span>Early Access</span>
					</div>

					<h1 className='header-font text-5xl sm:text-6xl md:text-7xl leading-[1.1] mb-6 tracking-tighter text-foreground'>
						Study Smarter, <br className='hidden sm:block' />
						<span className='serif-accent italic text-brand-orange'>
							Not Harder.
						</span>
					</h1>

					<p className='text-lg text-muted-foreground mb-12 max-w-xl mx-auto leading-relaxed'>
						DUPI uses AI to instantly convert your lecture notes
						into interactive tests and flashcards. Join the
						exclusive waitlist to be instantly notified when we
						launch.
					</p>

					<div className='w-full max-w-md mx-auto relative'>
						<AnimatePresence mode='wait'>
							{status === "success" ? (
								<motion.div
									key='success'
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									className='bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl flex flex-col items-center justify-center gap-4 shadow-xl shadow-emerald-500/5 text-center'
								>
									<div className='w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-2'>
										<span className='material-symbols-outlined text-3xl'>
											task_alt
										</span>
									</div>
									<h3 className='text-2xl font-bold header-font text-emerald-500'>
										You're on the list!
									</h3>
									<p className='text-emerald-500/80 text-sm'>
										Keep an eye on your inbox. We'll be in
										touch soon.
									</p>
								</motion.div>
							) : (
								<motion.form
									key='form'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0, scale: 0.95 }}
									onSubmit={handleSubmit}
									className='relative group inline-block w-full'
								>
									{/* Dashed border wrapper matching hero CTA style */}
									<div className='absolute -inset-2 rounded-full pointer-events-none'>
										<svg
											className='absolute inset-0 w-full h-full overflow-visible'
											xmlns='http://www.w3.org/2000/svg'
										>
											<rect
												width='100%'
												height='100%'
												rx='36'
												fill='none'
												stroke='currentColor'
												strokeWidth='2'
												strokeDasharray='12 12'
												className={`text-brand-orange/30 transition-colors duration-300 ${status === "loading" ? "text-brand-orange animate-[dash-flow_1s_linear_infinite]" : "group-focus-within:[animation-play-state:running] group-hover:[animation-play-state:running] group-focus-within:text-brand-orange group-hover:text-brand-orange [animation-play-state:paused] animate-[dash-flow_1s_linear_infinite]"}`}
											/>
										</svg>
									</div>

									<div className='relative flex items-center bg-card rounded-full p-2 shadow-xl shadow-black/20 border border-border z-10 w-full overflow-hidden transition-shadow group-focus-within:shadow-black/40'>
										<div className='pl-4 pr-3 text-muted-foreground'>
											<Mail className='w-5 h-5 group-focus-within:text-brand-orange transition-colors' />
										</div>
										<input
											type='email'
											required
											placeholder='Enter your email address...'
											value={email}
											onChange={(e) =>
												setEmail(e.target.value)
											}
											disabled={status === "loading"}
											className='flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground font-medium py-3 h-11 w-full'
										/>
										<Button
											type='submit'
											disabled={status === "loading"}
											className='rounded-full shadow-none px-6 h-12 flex-shrink-0'
										>
											{status === "loading" ? (
												<Loader2 className='w-5 h-5 animate-spin' />
											) : isMobile ? (
												<span>
													{" "}
													<Check className='w-5 h-5' />{" "}
												</span>
											) : (
												<span>Join Waitlist</span>
											)}
										</Button>
									</div>
								</motion.form>
							)}
						</AnimatePresence>

						<motion.p
							className='text-xs text-muted-foreground mt-6 font-medium flex items-center justify-center gap-2'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
						>
							<span className='relative flex h-2 w-2'>
								<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75'></span>
								<span className='relative inline-flex rounded-full h-2 w-2 bg-brand-orange'></span>
							</span>
							Over 500+ students already waiting
						</motion.p>
					</div>
				</motion.div>
			</div>
		</main>
	);
};

export default WaitlistPage;
