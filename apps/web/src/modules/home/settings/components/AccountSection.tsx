import React, { useState } from "react";
import { Card, Input } from "@studify/ui";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuthStore } from "../../../../store/auth.store";
import { Toggle } from "./Toggle";

interface AccountSectionProps {
	isSaving: boolean;
	setIsSaving: (v: boolean) => void;
}

export const AccountSection: React.FC<AccountSectionProps> = ({ isSaving, setIsSaving }) => {
	const { changePassword } = useAuthStore();
	const [currentPw, setCurrentPw] = useState("");
	const [newPw, setNewPw] = useState("");
	const [mfaEnabled, setMfaEnabled] = useState(false);

	const handleUpdatePassword = async () => {
		if (!currentPw || !newPw) return toast.error("Please fill all fields");
		setIsSaving(true);
		try {
			await changePassword({ currentPassword: currentPw, newPassword: newPw });
			toast.success("Password changed.");
			setCurrentPw("");
			setNewPw("");
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to change password.");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className='w-full space-y-5'>
			<h2 className='font-serif text-xl text-foreground mb-1'>Account Security</h2>
			<p className='text-sm text-muted-foreground mb-6'>Manage your password and multi-factor authentication.</p>

			<Card className='p-6 bg-card border-border/40 shadow-soft space-y-4'>
				<h3 className='text-sm font-medium text-foreground'>Change Password</h3>
				<div className='space-y-3'>
					<Input
						value={currentPw}
						onChange={(e) => setCurrentPw(e.target.value)}
						type='password'
						placeholder='Current password'
						className='h-11 bg-background border-border/40 rounded-2xl focus-visible:ring-1 focus-visible:ring-foreground'
					/>
					<Input
						value={newPw}
						onChange={(e) => setNewPw(e.target.value)}
						type='password'
						placeholder='New password'
						className='h-11 bg-background border-border/40 rounded-2xl focus-visible:ring-1 focus-visible:ring-foreground'
					/>
				</div>
				<div className='pt-3 border-t border-border/40 flex justify-end'>
					<button
						onClick={handleUpdatePassword}
						disabled={isSaving}
						className='px-5 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all disabled:opacity-60'
					>
						{isSaving ? "Updating..." : "Update Password"}
					</button>
				</div>
			</Card>

			<Card className='p-6 bg-card border-border/40 shadow-soft'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm font-medium text-foreground'>Two-Factor Authentication</p>
						<p className='text-xs text-muted-foreground mt-0.5'>Add an extra layer of security to your account.</p>
					</div>
					<Toggle checked={mfaEnabled} onChange={setMfaEnabled} />
				</div>
				{mfaEnabled && (
					<motion.p
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						className='text-xs text-muted-foreground mt-4 pt-4 border-t border-border/40'
					>
						A verification code will be required each time you sign in.
					</motion.p>
				)}
			</Card>
		</div>
	);
};
