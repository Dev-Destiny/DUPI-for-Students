import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@dupi/ui";
import { documentService } from "@/services/document.service";

interface UploadModalProps {
	isOpen: boolean;
	onClose: () => void;
	onUploadComplete: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
	isOpen,
	onClose,
	onUploadComplete,
}) => {
	const [dragging, setDragging] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [status, setStatus] = useState<
		"idle" | "uploading" | "success" | "error"
	>("idle");
	const inputRef = useRef<HTMLInputElement>(null);

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setDragging(false);
		if (status !== "idle" && status !== "error") return;
		const f = e.dataTransfer.files[0];
		if (f) setFile(f);
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			setFile(e.target.files[0]);
			setStatus("idle");
		}
	};

	const handleUpload = async () => {
		if (!file) return;

		setStatus("uploading");
		try {
			await documentService.uploadDocument(file);

			setStatus("success");
			setTimeout(() => {
				onUploadComplete();
				handleClose();
			}, 1500); // Wait a bit to show success state before closing
		} catch (error) {
			console.error("Failed to upload document:", error);
			setStatus("error");
		}
	};

	const handleClose = () => {
		if (status === "uploading") return;
		setFile(null);
		setStatus("idle");
		onClose();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-grotesk'
				>
					<motion.div
						initial={{ scale: 0.95, y: 20, opacity: 0 }}
						animate={{ scale: 1, y: 0, opacity: 1 }}
						exit={{ scale: 0.95, y: 20, opacity: 0 }}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 25,
						}}
						className='relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden'
					>
						{/* Header */}
						<div className='flex items-center justify-between p-6 pb-2'>
							<h2 className='text-xl font-bold font-serif text-foreground'>
								Upload Document
							</h2>
							<button
								onClick={handleClose}
								className='p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-all disabled:opacity-50'
								disabled={status === "uploading"}
							>
								<X className='size-5' />
							</button>
						</div>

						{/* Content */}
						<div className='p-6 space-y-6'>
							{/* Dropzone */}
							<div
								onDragOver={(e) => {
									e.preventDefault();
									if (status !== "uploading")
										setDragging(true);
								}}
								onDragLeave={() => setDragging(false)}
								onDrop={handleDrop}
								onClick={() =>
									status !== "uploading" &&
									inputRef.current?.click()
								}
								className={`w-full rounded-[2rem] border-2 border-dashed p-10 flex flex-col items-center gap-4 transition-all duration-300 ${
									status === "uploading"
										? "cursor-wait opacity-70 border-border bg-card/50"
										: "cursor-pointer"
								} ${
									dragging
										? "border-brand-orange bg-brand-orange/10 scale-105"
										: file
											? status === "success"
												? "border-emerald-500/50 bg-emerald-500/10"
												: status === "error"
													? "border-destructive/50 bg-destructive/10"
													: "border-brand-orange/50 bg-brand-orange/5"
											: "border-border hover:border-brand-orange/50 hover:bg-brand-orange/5"
								}`}
							>
								<input
									ref={inputRef}
									type='file'
									className='hidden'
									accept='.pdf,.doc,.docx,.txt'
									onChange={handleFileSelect}
									disabled={status === "uploading"}
								/>

								<div className='w-16 h-16 rounded-2xl flex items-center justify-center bg-brand-orange/10 shadow-lg shadow-brand-orange/10 mb-2 relative'>
									{status === "success" ? (
										<CheckCircle2 className='size-8 text-emerald-500' />
									) : status === "error" ? (
										<AlertCircle className='size-8 text-destructive' />
									) : file ? (
										<FileText className='size-8 text-brand-orange' />
									) : (
										<Upload className='size-8 text-brand-orange relative z-10' />
									)}

									{/* Uploading ripple effect */}
									{status === "uploading" && (
										<motion.div
											className='absolute inset-0 border-2 border-brand-orange rounded-2xl'
											animate={{
												scale: [1, 1.5],
												opacity: [1, 0],
											}}
											transition={{
												duration: 1,
												repeat: Infinity,
											}}
										/>
									)}
								</div>

								<div className='text-center space-y-1'>
									{file ? (
										<>
											<p className='font-bold text-foreground text-sm truncate max-w-[200px]'>
												{file.name}
											</p>
											<p className='text-[10px] text-muted-foreground font-black uppercase tracking-widest'>
												{(
													file.size /
													1024 /
													1024
												).toFixed(2)}{" "}
												MB
											</p>
										</>
									) : (
										<>
											<p className='font-bold text-foreground text-sm'>
												Choose a file or drag & drop it
												here
											</p>
											<p className='text-xs text-muted-foreground font-medium'>
												PDF, DOCX, and TXT formats up to
												50MB
											</p>
										</>
									)}
								</div>
							</div>

							{/* Actions */}
							{status === "error" && (
								<div className='p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2'>
									<AlertCircle className='size-4 shrink-0' />
									<p>
										Failed to upload. Please check your file
										and try again.
									</p>
								</div>
							)}

							<div className='flex gap-3 justify-end pt-2'>
								<Button
									variant='outline'
									onClick={handleClose}
									disabled={status === "uploading"}
									className='rounded-full text-xs font-bold'
								>
									Cancel
								</Button>
								<Button
									onClick={handleUpload}
									disabled={
										!file ||
										status === "uploading" ||
										status === "success"
									}
									className='rounded-full text-xs font-bold bg-brand-orange hover:bg-brand-orange/90 text-white min-w-[120px]'
								>
									{status === "uploading" ? (
										<span className='animate-pulse'>
											Uploading...
										</span>
									) : status === "success" ? (
										"Done!"
									) : (
										"Upload File"
									)}
								</Button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
