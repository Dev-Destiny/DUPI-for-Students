import React, { useState } from "react";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, Card, Input } from "@studify/ui";
import { toast } from "sonner";
import { useAuthStore } from "../../../../store/auth.store";

interface ProfileSectionProps {
	isSaving: boolean;
	setIsSaving: (v: boolean) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ isSaving, setIsSaving }) => {
	const { user, updateProfile } = useAuthStore();
	const [displayName, setDisplayName] = useState(user?.displayName || "");
	const email = user?.email || "";

	const handleSaveProfile = async () => {
		setIsSaving(true);
		try {
			await updateProfile({ displayName });
			toast.success("Profile updated.");
		} catch {
			toast.error("Failed to save.");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className='w-full'>
			<h2 className='font-serif text-xl text-foreground mb-1'>Personal Information</h2>
			<p className='text-sm text-muted-foreground mb-6'>Update your profile details and photo.</p>
			<Card className='p-6 bg-card border-border/40 shadow-soft space-y-6'>
				<div className='flex items-center gap-5 pb-6 border-b border-border/40'>
					<div className='relative group cursor-pointer'>
						<Avatar className='h-20 w-20 rounded-3xl border-2 border-border/40'>
							<AvatarImage src={user?.profileImageUrl || ""} />
							<AvatarFallback className='rounded-3xl bg-brand-orange/10 text-brand-orange font-bold text-xl'>
								{(displayName || "DA").substring(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className='absolute inset-0 bg-black/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
							<Camera className='size-5 text-white' />
						</div>
					</div>
					<div className='space-y-1'>
						<p className='text-sm font-medium text-foreground'>Profile photo</p>
						<p className='text-xs text-muted-foreground'>JPG or PNG, minimum 400×400px</p>
						<button className='text-xs text-brand-orange hover:underline font-medium mt-1'>Upload new photo</button>
					</div>
				</div>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<label className='text-sm font-medium text-foreground'>Full Name</label>
						<Input
							value={displayName}
							onChange={(e) => setDisplayName(e.target.value)}
							className='h-11 bg-background border-border/40 rounded-2xl focus-visible:ring-1 focus-visible:ring-foreground'
							placeholder='Your name'
						/>
					</div>
					<div className='space-y-2'>
						<label className='text-sm font-medium text-foreground'>Email Address</label>
						<Input
							value={email}
							disabled
							type='email'
							className='h-11 bg-muted/30 border-border/40 rounded-2xl opacity-60 cursor-not-allowed'
						/>
						<p className='text-xs text-muted-foreground'>Contact support to change your email.</p>
					</div>
					<div className='space-y-2'>
						<label className='text-sm font-medium text-foreground'>
							Institution <span className='text-muted-foreground font-normal'>(Optional)</span>
						</label>
						<Input
							className='h-11 bg-background border-border/40 rounded-2xl focus-visible:ring-1 focus-visible:ring-foreground'
							placeholder='e.g. Harvard University'
						/>
					</div>
				</div>
				<div className='pt-4 border-t border-border/40 flex justify-end'>
					<button
						onClick={handleSaveProfile}
						disabled={isSaving}
						className='px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all disabled:opacity-60'
					>
						{isSaving ? "Saving..." : "Save Changes"}
					</button>
				</div>
			</Card>
		</div>
	);
};
