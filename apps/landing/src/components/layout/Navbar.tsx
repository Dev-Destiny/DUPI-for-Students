import { Button } from "@dupi/ui/components/ui/button";
import { type FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const navLinks = [
	{ label: "How it Works", href: "#how-it-works" },
	{ label: "Features", href: "#features" },
	{ label: "Pricing", href: "#pricing" },
];

const Navbar: FC = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<nav className='sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16'>
					{/* Logo */}
					<motion.a
						href='/'
						className='flex items-center gap-2'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<span className='font-grotesk font-bold tracking-tighter text-foreground text-3xl flex items-center gap-[4px]'>
							dupi
							<img
								src='/image/dupi-mark.svg'
								alt='DUPI logo'
								className='h-6 w-6'
							/>
						</span>
					</motion.a>

					{/* Desktop Nav */}
					<div className='hidden md:flex items-center space-x-8 text-sm font-medium'>
						{navLinks.map((link) => (
							<motion.a
								key={link.label}
								href={link.href}
								className='relative text-muted-foreground hover:text-foreground transition-colors duration-300'
								whileHover={{ y: -2 }}
								whileTap={{ scale: 0.95 }}
							>
								{link.label}
								<motion.div
									className='absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-orange'
									initial={{ scaleX: 0 }}
									whileHover={{ scaleX: 1 }}
									transition={{ duration: 0.2 }}
								/>
							</motion.a>
						))}
						<motion.div
							whileHover={{ scale: 1.05, y: -2 }}
							whileTap={{ scale: 0.95 }}
						>
							<Link to='/waitlist'>
								<Button className='px-5 py-2.5 bg-primary text-white rounded-full font-semibold hover:bg-brand-violet hover:shadow-lg hover:shadow-brand-violet/20 transition-all duration-300'>
									Join Waitlist
								</Button>
							</Link>
						</motion.div>
					</div>

					{/* Mobile Menu Button */}
					<motion.button
						className='md:hidden'
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						whileTap={{ scale: 0.9 }}
					>
						<motion.span
							className='material-symbols-outlined'
							animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
							transition={{ duration: 0.3 }}
						>
							{isMobileMenuOpen ? "close" : "menu"}
						</motion.span>
					</motion.button>
				</div>

				{/* Mobile Menu */}
				<AnimatePresence>
					{isMobileMenuOpen && (
						<motion.div
							className='md:hidden py-4 border-t border-border'
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
						>
							<div className='flex flex-col gap-4'>
								{navLinks.map((link, index) => (
									<motion.a
										key={link.label}
										href={link.href}
										onClick={() =>
											setIsMobileMenuOpen(false)
										}
										className='py-2 text-muted-foreground hover:text-foreground transition-colors'
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.1 }}
										whileTap={{ scale: 0.95 }}
									>
										{link.label}
									</motion.a>
								))}

								<hr className='border-border' />
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.4 }}
									whileTap={{ scale: 0.95 }}
								>
									<Link to='/waitlist'>
										<Button className='w-full bg-primary text-white rounded-full font-semibold'>
											Join Waitlist
										</Button>
									</Link>
								</motion.div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</nav>
	);
};

export default Navbar;
