import React, { useState } from "react";
import { Card } from "@studify/ui";
import { toast } from "sonner";
import { useAuthStore } from "../../../../store/auth.store";
import { UserNotifications } from "@studify/shared";
import { Toggle } from "./Toggle";

interface NotificationsSectionProps {
	isSaving: boolean;
	setIsSaving: (v: boolean) => void;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({ isSaving, setIsSaving }) => {
	const { user, updateSettings } = useAuthStore();
	const [notifications, setNotifications] = useState<UserNotifications>(
		(user?.notifications as UserNotifications) || {
			flashcardDue: true,
			testResults: true,
			weeklyReport: false,
			productUpdates: false,
		}
	);

	const handleSaveSettings = async () => {
		setIsSaving(true);
		try {
			await updateSettings({
				notifications,
			});
			toast.success("Notification settings saved.");
		} catch {
			toast.error("Failed to save settings.");
		} finally {
			setIsSaving(false);
		}
	};

	const notificationOptions = [
		{ key: "flashcardDue", label: "Flashcard Review Due", desc: "Notified when cards are scheduled for review" },
		{ key: "testResults", label: "Test Results Available", desc: "Receive a summary when a graded test is ready" },
		{ key: "weeklyReport", label: "Weekly Progress Report", desc: "A recap of your study activity each Sunday" },
		{ key: "productUpdates", label: "Product Updates", desc: "New features and improvements from Studify" },
	] as const;

	return (
		<div className='w-full space-y-5'>
			<h2 className='font-serif text-xl text-foreground mb-1'>Notifications</h2>
			<p className='text-sm text-muted-foreground mb-6'>Choose which email alerts you want to receive.</p>

			<Card className='divide-y divide-border/40 bg-card border-border/40 shadow-soft overflow-hidden'>
				{notificationOptions.map((item) => (
					<div key={item.key} className='flex items-center justify-between px-6 py-4'>
						<div>
							<p className='text-sm font-medium text-foreground'>{item.label}</p>
							<p className='text-xs text-muted-foreground mt-0.5'>{item.desc}</p>
						</div>
						<Toggle
							checked={notifications[item.key as keyof UserNotifications]}
							onChange={(v) => setNotifications((prev) => ({ ...prev, [item.key]: v }))}
						/>
					</div>
				))}
			</Card>
			<div className='flex justify-end'>
				<button
					onClick={handleSaveSettings}
					disabled={isSaving}
					className='px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all disabled:opacity-60'
				>
					{isSaving ? "Saving..." : "Save Notification Settings"}
				</button>
			</div>
		</div>
	);
};
