import { type FC } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, FileText, X } from "lucide-react";

export const OnboardingHeader: FC<{
	step: number;
	onSkip?: () => void;
	onBack?: () => void;
}> = ({ step, onSkip, onBack }) => (
	<div className='w-full'>
		<header className='flex items-center justify-between px-6 pt-6 pb-4'>
			<div className='flex items-center gap-2'>
				{onBack ? (
					<button
						onClick={onBack}
						className='w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors'
					>
						<ChevronLeft className='w-5 h-5 text-foreground' />
					</button>
				) : (
					<div className='w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center shadow-lg shadow-brand-orange/20'>
						<FileText className='w-4 h-4 text-white' />
					</div>
				)}
				<span className='font-bold text-foreground font-grotesk tracking-tight'>
					DUPI
				</span>
			</div>
			{onSkip && (
				<button
					onClick={onSkip}
					className='text-muted-foreground hover:text-foreground transition-colors'
				>
					<X className='w-5 h-5' />
				</button>
			)}
		</header>

		<div className='px-6 space-y-1.5'>
			<div className='flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60'>
				<span>Onboarding Progress</span>
				<span className='text-brand-orange'>Step {step} of 3</span>
			</div>
			<div className='h-1.5 bg-muted rounded-full overflow-hidden'>
				<motion.div
					initial={{ width: `${(step - 1) * 33}%` }}
					animate={{ width: `${step * 33.33}%` }}
					transition={{ duration: 0.8, ease: "circOut" }}
					className='h-full rounded-full bg-brand-orange shadow-[0_0_8px_rgba(255,111,32,0.4)]'
				/>
			</div>
		</div>
	</div>
);
