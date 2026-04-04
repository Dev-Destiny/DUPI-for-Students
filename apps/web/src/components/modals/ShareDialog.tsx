import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { Input } from "@dupi/ui";

const spring = { type: "spring", stiffness: 260, damping: 30 };

interface ShareDialogProps {
	isOpen: boolean;
	onClose: () => void;
	resourceTitle?: string;
	shareUrl?: string;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose, resourceTitle, shareUrl }) => {
	const [copied, setCopied] = useState(false);
	const [inviteEmail, setInviteEmail] = useState("");

	const url = shareUrl || window.location.href;

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch { /* fallback: select input */ }
	};

	const handleInvite = () => {
		if (!inviteEmail.trim()) return;
		setInviteEmail("");
		// TODO: wire to invite API
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
					className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm'
					onClick={onClose}>
					<motion.div initial={{ scale: 0.95, opacity: 0, y: 8 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 8 }} transition={spring}
						className='relative w-full max-w-md bg-card border border-border/40 rounded-3xl shadow-soft overflow-hidden'
						onClick={(e) => e.stopPropagation()}>

						{/* Header */}
						<div className='flex items-start justify-between p-7 pb-4'>
							<div>
								<h2 className='text-xl font-serif text-foreground'>Share resource</h2>
								{resourceTitle && <p className='text-sm text-muted-foreground mt-0.5 truncate max-w-[260px]'>{resourceTitle}</p>}
							</div>
							<button onClick={onClose} className='p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors -mr-1 -mt-1'>
								<X className='size-4' />
							</button>
						</div>

						<div className='px-7 pb-7 space-y-6'>
							{/* URL copy */}
							<div className='space-y-2'>
								<label className='text-xs font-medium text-muted-foreground'>Share link</label>
								<div className='flex items-center gap-2'>
									<Input value={url} readOnly
										className='h-10 bg-background border-border/40 rounded-xl text-sm text-muted-foreground select-all' />
									<button onClick={handleCopy}
										className='h-10 px-4 rounded-xl border border-border/40 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors shrink-0 flex items-center gap-1.5'>
										<AnimatePresence mode="wait">
											{copied ? (
												<motion.span key="copied" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
													className='flex items-center gap-1.5 text-emerald-500'>
													<Check className='size-3.5' />Copied
												</motion.span>
											) : (
												<motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
													Copy
												</motion.span>
											)}
										</AnimatePresence>
									</button>
								</div>
							</div>

							{/* Divider */}
							<div className='flex items-center gap-3'>
								<div className='flex-1 h-px bg-border/40' />
								<span className='text-[10px] text-muted-foreground font-medium uppercase tracking-widest'>or invite directly</span>
								<div className='flex-1 h-px bg-border/40' />
							</div>

							{/* Email invite */}
							<div className='space-y-2'>
								<label className='text-xs font-medium text-muted-foreground'>Invite by email</label>
								<div className='flex items-center gap-2'>
									<Input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
										onKeyDown={(e) => e.key === "Enter" && handleInvite()}
										type='email' placeholder='colleague@university.edu'
										className='h-10 bg-background border-border/40 rounded-xl text-sm' />
									<button onClick={handleInvite} disabled={!inviteEmail.trim()}
										className='h-10 px-4 rounded-xl bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-all shrink-0 disabled:opacity-40'>
										Invite
									</button>
								</div>
							</div>

							<p className='text-[11px] text-muted-foreground/60 italic text-center'>
								Only people with the link can view this resource
							</p>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
