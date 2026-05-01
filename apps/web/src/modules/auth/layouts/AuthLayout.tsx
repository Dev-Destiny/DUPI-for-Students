import { type FC, type ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
	children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
	return (
		<div className='min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background'>
			{/* Form Side */}
			<main className='flex items-center justify-center p-8 md:p-16 lg:p-24 relative overflow-hidden'>
				<motion.div 
					className='w-full max-w-md'
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					{children}
				</motion.div>
			</main>

			{/* Quote Side */}
			<aside className='hidden lg:flex flex-col items-center justify-center p-24 bg-card/30 border-l border-border/50 relative overflow-hidden'>
				<div className='absolute inset-0 bg-muted/10 pointer-events-none' />
				
				<motion.div 
					className='max-w-md text-center space-y-8 relative z-10'
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					<div className='w-12 h-0.5 bg-brand-orange mx-auto mb-10' />
					<h2 className='text-3xl font-serif italic text-foreground leading-relaxed'>
						"Education is the kindling of a flame, not the filling of a vessel."
					</h2>
					<div className='flex flex-col items-center gap-1'>
						<span className='text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground'>
							Socrates
						</span>
						<span className='text-[10px] text-muted-foreground/40 font-medium tracking-widest'>
							Ancient Greek Philosopher
						</span>
					</div>
					<div className='w-12 h-0.5 bg-brand-orange mx-auto mt-10' />
				</motion.div>

				{/* Subtle texture or motif */}
				<div className='absolute bottom-12 right-12 opacity-[0.03] select-none pointer-events-none'>
					<span className='text-[180px] font-serif font-black'>&para;</span>
				</div>
			</aside>
		</div>
	);
};

export default AuthLayout;
