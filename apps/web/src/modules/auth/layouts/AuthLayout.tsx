import { type FC, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
	children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
	return (
		<div className='min-h-screen flex flex-col justify-center items-center bg-background auth-bg-pattern px-6 py-12 relative overflow-hidden'>
			{/* Decorative background elements - purely visual now */}
			<motion.div
				className='absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-brand-orange/5 rounded-full blur-[120px]'
				animate={{
					scale: [1, 1.1, 1],
					opacity: [0.2, 0.4, 0.2],
				}}
				transition={{
					duration: 15,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className='absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-brand-violet/5 rounded-full blur-[120px]'
				animate={{
					scale: [1.1, 1, 1.1],
					opacity: [0.2, 0.3, 0.2],
				}}
				transition={{
					duration: 18,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			{/* Main Logo - Simple & Elegant */}
			<motion.div
				initial={{ opacity: 0, y: -20, scale: 0.9 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{
					type: "spring",
					stiffness: 400,
					damping: 25,
					delay: 0.1,
				}}
				className='mb-10'
			>
				<Link to='/' className='flex items-center gap-3 group'>
					<span className='font-grotesk font-bold tracking-tighter text-foreground text-4xl flex items-center gap-[4px]'>
						dupi
						<span className='w-3 h-3 rounded-full bg-brand-orange shadow-[0_0_15px_rgba(255,111,32,0.5)]'></span>
					</span>
				</Link>
			</motion.div>

			{/* Form Container */}
			<motion.div
				className='w-full max-w-md relative z-10'
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{
					type: "spring",
					stiffness: 300,
					damping: 25,
					delay: 0.2,
				}}
			>
				<div className='bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl shadow-black/40 rounded-[2.5rem] p-8 md:p-10'>
					{children}
				</div>
			</motion.div>

			{/* Simplified Footer */}
			<motion.div
				className='mt-12 text-center text-xs text-muted-foreground/60'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.8, duration: 1 }}
			>
				<p className='mb-4'>© 2026 DUPI AI Technologies</p>
				<div className='flex justify-center gap-6'>
					<a
						href='#'
						className='hover:text-brand-orange transition-colors duration-200'
					>
						Help
					</a>
					<a
						href='#'
						className='hover:text-brand-orange transition-colors duration-200'
					>
						Security
					</a>
					<a
						href='#'
						className='hover:text-brand-orange transition-colors duration-200'
					>
						Contact
					</a>
				</div>
			</motion.div>
		</div>
	);
};

export default AuthLayout;
