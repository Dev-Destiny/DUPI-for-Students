import React, { type FC, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronDown } from "lucide-react";
import { OnboardingHeader } from "./OnboardingHeader";
import { slide, FIELDS } from "./constants";

import { type User } from "@dupi/shared";

interface ProfileScreenProps {
	user: User | null;
	form: { displayName: string; field: string; avatarFile: File | null };
	onChange: (k: string, v: any) => void;
	onNext: () => void;
	onSkip: () => void;
	onBack: () => void;
}

export const ProfileScreen: FC<ProfileScreenProps> = ({
	user,
	form,
	onChange,
	onNext,
	onSkip,
	onBack,
}) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		user?.profileImageUrl || null,
	);

	useEffect(() => {
		if (form.avatarFile) {
			const url = URL.createObjectURL(form.avatarFile);
			setPreviewUrl(url);
			return () => URL.revokeObjectURL(url);
		} else if (user?.profileImageUrl) {
			setPreviewUrl(user.profileImageUrl);
		}
	}, [form.avatarFile, user?.profileImageUrl]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			onChange("avatarFile", file);
		}
	};

	return (
		<motion.div
			key='profile'
			variants={slide}
			initial='initial'
			animate='animate'
			exit='exit'
			className='flex flex-col min-h-screen w-full bg-background'
		>
			<OnboardingHeader step={2} onSkip={onSkip} onBack={onBack} />

			{/* Content */}
			<div className='flex-1 flex flex-col items-center px-6 pt-10 space-y-8 relative z-10'>
				<h2 className='text-4xl font-bold text-foreground text-center font-grotesk tracking-tight'>
					Tell us about yourself
				</h2>

				{/* Avatar circle */}
				<div className='flex flex-col items-center gap-3'>
					<input
						type='file'
						ref={fileInputRef}
						className='hidden'
						accept='image/*'
						onChange={handleFileChange}
					/>
					<div
						onClick={() => fileInputRef.current?.click()}
						className='w-28 h-28 rounded-[2rem] border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center cursor-pointer hover:border-brand-orange/50 hover:bg-muted/50 transition-all group overflow-hidden relative shadow-lg shadow-black/5'
					>
						{previewUrl ? (
							<img
								src={previewUrl}
								alt='Preview'
								className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
							/>
						) : (
							<>
								<Camera className='w-8 h-8 text-muted-foreground group-hover:text-brand-orange transition-colors' />
								<span className='text-[10px] uppercase tracking-widest font-black text-muted-foreground/40 mt-1'>
									Add Photo
								</span>
							</>
						)}
						{previewUrl && (
							<div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity'>
								<Camera className='w-8 h-8 text-white' />
							</div>
						)}
					</div>
					<span className='text-[10px] font-black uppercase tracking-widest text-muted-foreground/50'>
						{previewUrl ? "Change Photo" : "Optional"}
					</span>
				</div>

				{/* Full Name */}
				<div className='w-full max-w-sm space-y-2'>
					<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1'>
						Full Name
					</label>
					<input
						value={form.displayName}
						onChange={(e) =>
							onChange("displayName", e.target.value)
						}
						placeholder='Alex Johnson'
						className='w-full h-14 px-5 rounded-[1.25rem] border border-border bg-muted/20 text-foreground text-base placeholder:text-muted-foreground/30 focus:outline-none focus:ring-4 focus:ring-brand-orange/5 focus:border-brand-orange/50 transition-all font-medium'
					/>
				</div>

				{/* What are you studying */}
				<div className='w-full max-w-sm space-y-2 relative'>
					<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1'>
						What are you studying?
					</label>
					<button
						type='button'
						onClick={() => setDropdownOpen((o) => !o)}
						className='w-full h-14 px-5 rounded-[1.25rem] border border-border bg-muted/20 text-base flex items-center justify-between focus:outline-none focus:ring-4 focus:ring-brand-orange/5 focus:border-brand-orange/50 transition-all font-medium'
					>
						<span
							className={
								form.field
									? "text-foreground"
									: "text-muted-foreground/30"
							}
						>
							{form.field || "Select your field"}
						</span>
						<ChevronDown
							className={`w-5 h-5 text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
						/>
					</button>
					<AnimatePresence>
						{dropdownOpen && (
							<motion.ul
								initial={{ opacity: 0, y: -8, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: -8, scale: 0.95 }}
								className='absolute z-50 w-full mt-2 bg-card/95 backdrop-blur-xl border border-border rounded-[1.5rem] shadow-2xl shadow-black/50 overflow-hidden'
							>
								{FIELDS.map((f) => (
									<li key={f}>
										<button
											type='button'
											onClick={() => {
												onChange("field", f);
												setDropdownOpen(false);
											}}
											className={`w-full text-left px-5 py-4 text-sm font-bold uppercase tracking-wider hover:bg-brand-orange/10 transition-colors ${form.field === f ? "text-brand-orange" : "text-muted-foreground hover:text-foreground"}`}
										>
											{f}
										</button>
									</li>
								))}
							</motion.ul>
						)}
					</AnimatePresence>
				</div>

				{/* CTA */}
				<div className='w-full max-w-sm space-y-4 pt-4'>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.97 }}
						onClick={onNext}
						disabled={!form.displayName}
						className='w-full h-14 rounded-full text-white bg-brand-orange font-bold text-lg shadow-xl shadow-brand-orange/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all'
					>
						Continue
					</motion.button>
					<button
						onClick={onSkip}
						className='w-full text-center text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors py-2'
					>
						Skip for now
					</button>
				</div>
			</div>

			{/* Dots */}
			<div className='flex justify-center gap-3 pb-12 relative z-10'>
				<span className='w-2.5 h-2.5 rounded-full bg-muted transition-colors' />
				<span className='w-3 h-3 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(255,111,32,0.4)]' />
				<span className='w-2.5 h-2.5 rounded-full bg-muted transition-colors' />
			</div>
		</motion.div>
	);
};
