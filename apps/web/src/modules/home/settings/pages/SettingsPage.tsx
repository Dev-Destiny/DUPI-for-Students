import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bell, Shield, Palette, CreditCard } from "lucide-react";
import { SettingsSidebar } from "../components/SettingsSidebar";
import { ProfileSection } from "../components/ProfileSection";
import { AccountSection } from "../components/AccountSection";
import { BillingSection } from "../components/BillingSection";
import { PreferencesSection } from "../components/PreferencesSection";
import { NotificationsSection } from "../components/NotificationsSection";

const spring = { type: "spring", stiffness: 260, damping: 30 };

const settingsTabs = [
	{ id: "profile", label: "Profile", icon: User },
	{ id: "account", label: "Account", icon: Shield },
	{ id: "billing", label: "Billing", icon: CreditCard },
	{ id: "preferences", label: "Preferences", icon: Palette },
	{ id: "notifications", label: "Notifications", icon: Bell },
];

const SettingsPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState("profile");
	const [isSaving, setIsSaving] = useState(false);

	return (
		<div className='flex-1 flex flex-col h-full bg-background overflow-hidden'>
			{/* Header */}
			<div className='px-4 md:px-8 pt-8 md:pt-10 pb-6 border-b border-border/40 bg-background/60 backdrop-blur-md sticky top-0 z-10'>
				<motion.div
					initial={{ opacity: 0, y: -8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={spring}
					className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-widest mb-3'
				>
					Configuration
				</motion.div>
				<motion.h1
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ ...spring, delay: 0.05 }}
					className='text-4xl md:text-5xl font-serif text-foreground tracking-tight mb-2'
				>
					Settings
				</motion.h1>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.1 }}
					className='text-sm text-muted-foreground leading-relaxed'
				>
					Manage your account, billing, and study preferences.
				</motion.p>
			</div>

			<div className='flex-1 flex flex-col lg:flex-row overflow-hidden'>
				{/* Sidebar */}
				<SettingsSidebar tabs={settingsTabs} activeTab={activeTab} setActiveTab={setActiveTab} />

				{/* Content */}
				<div className='flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-12'>
					<AnimatePresence mode='wait'>
						<motion.div
							key={activeTab}
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -8 }}
							transition={spring}
							className='w-full'
						>
							{activeTab === "profile" && (
								<ProfileSection isSaving={isSaving} setIsSaving={setIsSaving} />
							)}
							{activeTab === "account" && (
								<AccountSection isSaving={isSaving} setIsSaving={setIsSaving} />
							)}
							{activeTab === "billing" && <BillingSection />}
							{activeTab === "preferences" && (
								<PreferencesSection isSaving={isSaving} setIsSaving={setIsSaving} />
							)}
							{activeTab === "notifications" && (
								<NotificationsSection isSaving={isSaving} setIsSaving={setIsSaving} />
							)}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

export default SettingsPage;
