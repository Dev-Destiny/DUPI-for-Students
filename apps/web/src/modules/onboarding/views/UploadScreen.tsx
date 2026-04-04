import { type FC, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Upload } from "lucide-react";
import { OnboardingHeader } from "./OnboardingHeader";
import { slide, USE_CASES } from "./constants";
import { documentService } from "@/services/document.service";

interface UploadScreenProps {
	onFinish: () => void;
	onSkip: () => void;
	onBack: () => void;
	isLoading: boolean;
}

export const UploadScreen: FC<UploadScreenProps> = ({
	onFinish,
	onSkip,
	onBack,
	isLoading,
}) => {
	const [dragging, setDragging] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setDragging(false);
		const f = e.dataTransfer.files[0];
		if (f) setFile(f);
	};

	const handleFinishSetup = async () => {
		if (file) {
			setIsUploading(true);
			try {
				await documentService.uploadDocument(file);
				
				// Upload successful, proceed to finish
				setIsUploading(false);
				onFinish();
			} catch (error) {
				console.error("Failed to upload document:", error);
				setIsUploading(false);
				// Depending on your error handling strategy, we can alert the user here
				// alert("Failed to upload file. Please try again.");
				return;
			}
		} else {
			// No file to upload, just finish
			onFinish();
		}
	};

	const isProcessing = isLoading || isUploading;

	return (
		<motion.div
			key='upload'
			variants={slide}
			initial='initial'
			animate='animate'
			exit='exit'
			className='flex flex-col min-h-screen w-full bg-background overflow-hidden relative'
		>
			<OnboardingHeader step={3} onSkip={onSkip} onBack={onBack} />

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

			{/* Content */}
			<div className='flex-1 flex flex-col items-center px-6 pt-10 space-y-8 relative z-10'>
				<div className='text-center space-y-3 max-w-sm'>
					<h2 className='text-4xl font-bold text-foreground font-grotesk tracking-tight'>
						Upload your first document
					</h2>
					<p className='text-sm text-muted-foreground font-medium'>
						We support PDFs, Word docs, and text files up to 50MB
					</p>
				</div>

				{/* Drop zone */}
				<div
					onDragOver={(e) => {
						e.preventDefault();
						setDragging(true);
					}}
					onDragLeave={() => setDragging(false)}
					onDrop={handleDrop}
					onClick={() => !isProcessing && inputRef.current?.click()}
					className={`w-full max-w-sm rounded-[2.5rem] border-2 border-dashed ${isProcessing ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} p-12 flex flex-col items-center gap-4 transition-all duration-500 shadow-2xl shadow-black/20 ${
						dragging
							? "border-brand-orange bg-brand-orange/10 scale-105"
							: file
								? "border-emerald-500/50 bg-emerald-500/5"
								: "border-border bg-card/50 hover:border-brand-orange/50 hover:bg-brand-orange/5"
					}`}
				>
					<input
						ref={inputRef}
						type='file'
						className='hidden'
						accept='.pdf,.doc,.docx,.txt'
						onChange={(e) => {
							if (e.target.files?.[0]) {
								setFile(e.target.files[0]);
							}
						}}
						disabled={isProcessing}
					/>
					<div className='w-16 h-16 rounded-2xl flex items-center justify-center bg-brand-orange/10 shadow-lg shadow-brand-orange/10'>
						{file ? (
							<FileText className='w-8 h-8 text-brand-orange' />
						) : (
							<Upload className='w-8 h-8 text-brand-orange' />
						)}
					</div>
					{file ? (
						<div className='text-center'>
							<p className='font-bold text-foreground text-sm uppercase tracking-wider truncate max-w-[200px]'>
								{file.name}
							</p>
							<p className='text-xs text-muted-foreground font-black uppercase tracking-widest mt-1'>
								{(file.size / 1024 / 1024).toFixed(2)} MB
							</p>
						</div>
					) : (
						<>
							<p className='font-bold text-foreground text-sm text-center uppercase tracking-widest'>
								Drop your file
							</p>
							<p className='text-xs text-muted-foreground font-medium'>
								or click to browse
							</p>
							<button
								type='button'
								disabled={isProcessing}
								className='mt-2 px-6 py-2 rounded-full border border-border text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all disabled:opacity-50'
							>
								Select File
							</button>
						</>
					)}
				</div>

				{/* Use cases */}
				<div className='w-full max-w-sm space-y-4'>
					<p className='text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 text-center'>
						Ready for
					</p>
					<div className='flex gap-2 justify-center flex-wrap'>
						{USE_CASES.map(({ icon: Icon, label }) => (
							<div
								key={label}
								className='flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted/20 border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 hover:text-brand-orange transition-colors cursor-default'
							>
								<Icon className='w-3 h-3' />
								{label}
							</div>
						))}
					</div>
				</div>

				{/* CTAs */}
				<div className='w-full max-w-sm flex items-center justify-between pt-6'>
					<button
						onClick={onSkip}
						disabled={isProcessing}
						className='text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
					>
						Skip tutorial
					</button>
					<motion.button
						whileHover={!isProcessing ? { scale: 1.05 } : {}}
						whileTap={!isProcessing ? { scale: 0.95 } : {}}
						onClick={handleFinishSetup}
						disabled={isProcessing}
						className='flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-bold text-sm shadow-xl shadow-brand-orange/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-brand-orange hover:bg-brand-orange/90'
					>
						{isUploading ? "Uploading..." : isLoading ? "Setting up..." : file ? "Upload & Finish" : "Finish Set Up"}
						{!isProcessing && <Upload className='w-4 h-4' />}
					</motion.button>
				</div>
			</div>

			{/* Dots */}
			<div className='flex justify-center gap-3 pb-12 relative z-10'>
				<span className='w-2.5 h-2.5 rounded-full bg-muted transition-colors' />
				<span className='w-2.5 h-2.5 rounded-full bg-muted transition-colors' />
				<span className='w-3 h-3 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(255,111,32,0.4)]' />
			</div>
		</motion.div>
	);
};
