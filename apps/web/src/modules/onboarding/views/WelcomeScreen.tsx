import { type FC } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { OnboardingHeader } from "./OnboardingHeader";
import { slide } from "./constants";

export const WelcomeScreen: FC<{ onNext: () => void; onSkip: () => void }> = ({
	onNext,
	onSkip,
}) => (
	<motion.div
		key='welcome'
		variants={slide}
		initial='initial'
		animate='animate'
		exit='exit'
		className='flex flex-col min-h-screen bg-background relative overflow-hidden'
	>
		<OnboardingHeader step={1} onSkip={onSkip} />

		{/* Decorative background blurs */}
		<motion.div
			className='absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none'
			animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
			transition={{ duration: 10, repeat: Infinity }}
		/>
		<motion.div
			className='absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-brand-violet/5 rounded-full blur-[100px] pointer-events-none'
			animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
			transition={{ duration: 12, repeat: Infinity }}
		/>

		<div className='flex-1 flex flex-col items-center justify-center px-6 relative z-10'>
			<div className='text-center space-y-6 max-w-lg'>
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className='text-5xl md:text-6xl font-bold text-foreground tracking-tight font-grotesk'
				>
					Welcome to <span className='text-brand-orange'>DUPI</span>
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className='text-muted-foreground text-lg leading-relaxed font-medium'
				>
					Your AI-powered study companion designed for elite academic
					performance.
				</motion.p>
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className='pt-4'
				>
					<motion.button
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
						onClick={onNext}
						className='inline-flex items-center gap-2 px-10 py-4 rounded-full text-white font-bold text-base shadow-xl shadow-brand-orange/20 bg-brand-orange hover:bg-brand-orange/90 transition-all'
					>
						Get Started <ArrowRight className='w-4 h-4' />
					</motion.button>
				</motion.div>
			</div>
		</div>

		{/* Step dots */}
		<div className='flex justify-center gap-3 pb-12 relative z-10'>
			<span className='w-3 h-3 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(255,111,32,0.4)]' />
			<span className='w-3 h-3 rounded-full bg-muted transition-colors' />
			<span className='w-3 h-3 rounded-full bg-muted transition-colors' />
		</div>
	</motion.div>
);
