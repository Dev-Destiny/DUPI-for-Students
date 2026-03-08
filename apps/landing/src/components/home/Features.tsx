import { type FC } from "react";
import { motion } from "framer-motion";

const Features: FC = () => {
	const springConfig = { type: "spring", stiffness: 500, damping: 20 };

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const cardVariants = {
		hidden: { opacity: 0, scale: 0.9, y: 30 },
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: springConfig,
		},
	};

	return (
		<section className='py-24 bg-background' id='features'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={springConfig}
					viewport={{ once: true, margin: "-100px" }}
					className='mb-16 text-center'
				>
					<motion.h2 className='header-font text-4xl md:text-6xl mb-4 uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground'>
						Studying, Reimagined
					</motion.h2>
					<p className='text-muted-foreground font-medium text-lg'>
						A suite of AI tools designed for academic success.
					</p>
				</motion.div>

				{/* Bento Grid */}
				<motion.div
					className='grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:min-h-[600px]'
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: "-100px" }}
				>
					{/* Large Card - AI Generation */}
					<motion.div
						variants={cardVariants}
						whileHover={{ y: -10, scale: 1.01 }}
						transition={springConfig}
						className='md:col-span-2 md:row-span-2 bg-card p-10 rounded-[2.5rem] shadow-xl shadow-black/20 border border-border hover:border-brand-orange/20 hover:shadow-2xl transition-all flex flex-col justify-between group overflow-hidden relative cursor-pointer'
					>
						<div className='relative z-10'>
							<motion.div
								className='w-14 h-14 bg-brand-gold/20 text-[#B8860B] rounded-2xl flex items-center justify-center mb-6 shadow-sm'
								whileHover={{ rotate: 15, scale: 1.1 }}
								transition={springConfig}
							>
								<span className='material-symbols-outlined text-3xl'>
									auto_awesome
								</span>
							</motion.div>
							<h3 className='text-3xl font-bold mb-4 text-foreground tracking-tight leading-tight'>
								AI-Powered Question Generation
							</h3>
							<p className='text-muted-foreground max-w-sm text-lg leading-relaxed'>
								Not just flashcards. DUPI creates
								multiple-choice, open-ended, and scenario-based
								questions that test deep understanding.
							</p>
						</div>

						<motion.div className='mt-12 relative h-56 rounded-3xl overflow-hidden border border-border shadow-inner bg-muted group-hover:scale-[1.02] transition-transform duration-500'>
							<div className='absolute inset-0 flex items-center justify-center'>
								<div className='text-center'>
									<motion.div
										animate={{ y: [0, -10, 0] }}
										transition={{
											duration: 1,
											repeat: Infinity,
											ease: "easeInOut",
										}}
									>
										<span className='material-symbols-outlined text-7xl text-brand-violet/20'>
											quiz
										</span>
									</motion.div>
									<p className='text-xs font-bold text-slate-400 mt-4 uppercase tracking-widest'>
										Live Engine Preview
									</p>
								</div>
							</div>
						</motion.div>
					</motion.div>

					{/* Wide Card - PDF Support */}
					<motion.div
						variants={cardVariants}
						whileHover={{ y: -10, scale: 1.01 }}
						transition={springConfig}
						className='md:col-span-2 bg-brand-violet text-white p-10 rounded-[2.5rem] shadow-xl shadow-brand-violet/20 hover:shadow-brand-violet/30 flex flex-col justify-center relative overflow-hidden group cursor-pointer'
					>
						<div className='relative z-10'>
							<h3 className='text-3xl font-bold mb-2 tracking-tight'>
								Full PDF & Notes Support
							</h3>
							<p className='text-white/80 text-lg max-w-md'>
								Textbooks, lecture notes, or even napkin
								sketches. We process everything in seconds.
							</p>
						</div>
						<motion.span
							className='material-symbols-outlined absolute -bottom-8 -right-8 text-[180px] opacity-[0.05]'
							animate={{ rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
							transition={{ duration: 6, repeat: Infinity }}
						>
							description
						</motion.span>
					</motion.div>

					{/* Small Card - Instant Feedback */}
					<motion.div
						variants={cardVariants}
						whileHover={{ y: -10, rotate: 1 }}
						transition={springConfig}
						className='bg-card p-8 rounded-[2.5rem] shadow-lg border border-border hover:border-emerald-500/30 hover:shadow-2xl transition-all flex flex-col justify-between cursor-pointer group relative'
					>
						<motion.div
							className='w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center shadow-sm'
							whileHover={{ rotate: [0, -20, 20, 0] }}
							transition={{ duration: 0.4 }}
						>
							<span className='material-symbols-outlined text-2xl'>
								bolt
							</span>
						</motion.div>
						<div>
							<h3 className='text-xl font-bold mb-1 text-foreground'>
								Instant Feedback
							</h3>
							<p className='text-sm text-muted-foreground leading-relaxed font-medium'>
								Get explanations for every answer, exactly when
								you need them.
							</p>
						</div>
					</motion.div>

					{/* Small Card - Progress Tracking */}
					<motion.div
						variants={cardVariants}
						whileHover={{ y: -10, rotate: -1 }}
						transition={springConfig}
						className='bg-card text-foreground p-8 rounded-[2.5rem] shadow-lg border border-border hover:border-brand-orange/30 hover:shadow-2xl transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden'
					>
						<motion.div
							className='w-12 h-12 bg-muted text-foreground rounded-2xl flex items-center justify-center border border-border'
							whileHover={{ scale: 1.2, rotate: 180 }}
							transition={springConfig}
						>
							<span className='material-symbols-outlined text-2xl'>
								analytics
							</span>
						</motion.div>
						<div>
							<h3 className='text-xl font-bold mb-1'>
								Deep Analytics
							</h3>
							<p className='text-sm text-muted-foreground leading-relaxed'>
								Visualize your growth and identify knowledge
								gaps.
							</p>
						</div>
						<div className='absolute top-0 right-0 w-full h-full bg-gradient-to-br from-brand-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

export default Features;
