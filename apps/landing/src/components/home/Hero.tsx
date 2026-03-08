import { type FC, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@dupi/ui/components/ui/button";
import toast from "react-hot-toast";

const Hero: FC = () => {
	const [isDragging, setIsDragging] = useState(false);
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files[0];
		if (file) {
			processFile(file);
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			processFile(file);
		}
	};

	const processFile = (file: File) => {
		setUploadedFile(file);
		setIsProcessing(true);

		// Simulate processing
		setTimeout(() => {
			setIsProcessing(false);
		}, 2000);
	};

	const resetUpload = () => {
		setUploadedFile(null);
		setIsProcessing(false);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const springConfig = { type: "spring", stiffness: 400, damping: 25 };

	return (
		<header className='relative pt-20 pb-16 lg:pt-32 lg:pb-32 overflow-hidden bg-background'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
				<div className='grid lg:grid-cols-2 gap-16 items-center'>
					{/* Left: Text Content */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={springConfig}
						className='text-center lg:text-left max-w-xl mx-auto lg:mx-0'
					>
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ ...springConfig, delay: 0.1 }}
						>
							<h1 className='header-font text-[44px] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] md:leading-[1] mb-6 uppercase tracking-tighter'>
								Turn your study materials into{" "}
								<motion.span
									className='serif-accent italic text-brand-orange inline-block'
									whileHover={{ scale: 1.05, rotate: -1 }}
									transition={springConfig}
								>
									interactive mastery tests.
								</motion.span>
							</h1>
						</motion.div>

						<motion.p
							className='text-lg text-muted-foreground mb-10 leading-relaxed'
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ ...springConfig, delay: 0.2 }}
						>
							DUPI uses advanced AI to analyze your PDFs, lecture
							notes, and slides to create personalized practice
							exams that actually help you learn.
						</motion.p>

						<motion.div
							className='flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4'
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ ...springConfig, delay: 0.3 }}
						>
							<motion.div
								className='w-full sm:w-auto'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								transition={springConfig}
							>
								<div className='relative group inline-block w-full'>
									{/* Dashed border moving along path */}
									<div className='absolute -inset-1.5 rounded-full pointer-events-none'>
										<svg
											className='absolute inset-0 w-full h-full overflow-visible'
											xmlns='http://www.w3.org/2000/svg'
										>
											<rect
												width='100%'
												height='100%'
												rx='34'
												fill='none'
												stroke='currentColor'
												strokeWidth='2'
												strokeDasharray='12 12'
												className='text-brand-orange/40 group-hover:text-brand-orange transition-colors duration-300 [animation-play-state:paused] group-hover:[animation-play-state:running] animate-[dash-flow_1s_linear_infinite]'
											/>
										</svg>
									</div>

									{/* Core button */}
									<Link
										to='/waitlist'
										className='block w-full'
									>
										<button className='relative w-full overflow-hidden bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 px-10 h-14 text-lg font-bold rounded-full shadow-sm'>
											<span className='material-symbols-outlined text-xl group-hover:scale-110 transition-transform'>
												diamond
											</span>
											<span>Join Waitlist</span>
										</button>
									</Link>
								</div>
							</motion.div>

							<motion.div
								whileHover={{ scale: 1.05, y: -4 }}
								whileTap={{ scale: 0.95 }}
								transition={springConfig}
								className='w-full sm:w-auto'
								onClick={() =>
									toast(
										"The interactive demo is coming soon! ✨",
										{
											style: {
												borderRadius: "100px",
												background: "#333",
												color: "#fff",
											},
										},
									)
								}
							>
								<Button
									variant='outline'
									className='w-full px-10 py-6 h-auto rounded-full text-lg font-bold border-border bg-background text-foreground hover:bg-accent'
								>
									View Demo
								</Button>
							</motion.div>
						</motion.div>
					</motion.div>

					{/* Right: Interactive Upload Drop Zone */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{ ...springConfig, delay: 0.2 }}
						className='relative'
					>
						<input
							ref={fileInputRef}
							type='file'
							accept='.pdf,.docx,.txt'
							onChange={handleFileSelect}
							className='hidden'
							id='file-upload'
						/>

						<motion.div
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							onClick={() =>
								!uploadedFile && fileInputRef.current?.click()
							}
							whileHover={{ scale: 1.02 }}
							transition={springConfig}
							className={`aspect-[4/3] rounded-[2.5rem] border-2 border-dashed ${
								isDragging
									? "border-primary bg-primary/10 scale-105"
									: uploadedFile
										? "border-emerald-500 bg-emerald-500/10"
										: "border-border bg-card hover:border-brand-violet/50 hover:bg-brand-violet/5"
							} flex flex-col items-center justify-center p-8 transition-all cursor-pointer shadow-xl shadow-black/20 relative overflow-hidden`}
						>
							<AnimatePresence mode='wait'>
								{!uploadedFile ? (
									<motion.div
										key='upload'
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										transition={springConfig}
										className='flex flex-col items-center'
									>
										<motion.div
											className='w-24 h-24 bg-muted rounded-3xl shadow-lg shadow-black/5 flex items-center justify-center mb-6'
											animate={{
												y: isDragging
													? [-5, 5]
													: [0, -8, 0],
											}}
											transition={{
												duration: isDragging ? 0.3 : 1,
												repeat: Infinity,
												ease: "easeInOut",
											}}
										>
											<span className='material-symbols-outlined text-5xl text-primary'>
												upload_file
											</span>
										</motion.div>
										<p className='text-2xl font-bold mb-2 text-foreground'>
											{isDragging
												? "Drop it now!"
												: "Drop any file"}
										</p>
										<p className='text-slate-400 text-sm font-medium'>
											PDF, Notes, or Slides
										</p>
									</motion.div>
								) : (
									<motion.div
										key='uploaded'
										initial={{ opacity: 0, scale: 0.5 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.5 }}
										transition={springConfig}
										className='flex flex-col items-center w-full'
									>
										{isProcessing ? (
											<div className='flex flex-col items-center'>
												<motion.div
													className='w-20 h-20 rounded-full border-4 border-primary border-t-transparent mb-6'
													animate={{ rotate: 360 }}
													transition={{
														duration: 0.8,
														repeat: Infinity,
														ease: "linear",
													}}
												/>
												<p className='text-xl font-bold text-foreground'>
													AI is thinking...
												</p>
											</div>
										) : (
											<div className='flex flex-col items-center'>
												<motion.div
													initial={{
														scale: 0,
														rotate: -45,
													}}
													animate={{
														scale: 1,
														rotate: 0,
													}}
													transition={springConfig}
													className='w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-6 shadow-lg shadow-green-200'
												>
													<span className='material-symbols-outlined text-white text-4xl'>
														check
													</span>
												</motion.div>
												<p className='text-xl font-bold text-foreground mb-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]'>
													Ready to optimize!
												</p>
												<div className='flex gap-4 mt-4'>
													<motion.button
														whileHover={{
															scale: 1.05,
															y: -2,
														}}
														whileTap={{
															scale: 0.95,
														}}
														transition={
															springConfig
														}
														className='px-8 py-3 bg-brand-violet text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-violet/20'
													>
														Generate Test
													</motion.button>
													<motion.button
														whileHover={{
															scale: 1.05,
														}}
														whileTap={{
															scale: 0.95,
														}}
														onClick={(e) => {
															e.stopPropagation();
															resetUpload();
														}}
														className='px-8 py-3 border border-border rounded-2xl text-sm font-bold bg-card text-muted-foreground hover:bg-muted'
													>
														Change
													</motion.button>
												</div>
											</div>
										)}
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</header>
	);
};

export default Hero;
