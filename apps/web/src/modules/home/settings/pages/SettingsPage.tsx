import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bell, Shield, Palette, Camera, LogOut, CreditCard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, Card, Input } from "@dupi/ui";
import { useAuthStore } from "../../../../store/auth.store";
import { toast } from "sonner";

const spring = { type: "spring", stiffness: 260, damping: 30 };

const settingsTabs = [
	{ id: "profile", label: "Profile", icon: User },
	{ id: "account", label: "Account", icon: Shield },
	{ id: "billing", label: "Billing", icon: CreditCard },
	{ id: "preferences", label: "Preferences", icon: Palette },
	{ id: "notifications", label: "Notifications", icon: Bell },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
	return (
		<button onClick={() => onChange(!checked)} role="switch" aria-checked={checked}
			className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${checked ? "bg-foreground" : "bg-muted"}`}>
			<motion.div animate={{ x: checked ? 22 : 2 }} transition={spring}
				className='absolute top-1 w-4 h-4 rounded-full bg-background shadow-sm' />
		</button>
	);
}

function SliderPill({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
	return (
		<div className='flex p-1 rounded-xl bg-muted/50 relative'>
			{options.map((opt) => (
				<button key={opt} onClick={() => onChange(opt)}
					className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors relative z-10 ${value === opt ? "text-background" : "text-muted-foreground hover:text-foreground"}`}>
					{opt}
				</button>
			))}
			<motion.div className='absolute inset-y-1 bg-foreground rounded-lg' initial={false}
				animate={{
					left: `calc(${options.indexOf(value)} * ${100 / options.length}% + 4px)`,
					width: `calc(${100 / options.length}% - 8px)`
				}} transition={spring} />
		</div>
	);
}

const SettingsPage: React.FC = () => {
	const { user, logout, updateProfile } = useAuthStore();
	const [activeTab, setActiveTab] = useState("profile");
	const [isSaving, setIsSaving] = useState(false);

	// Profile state
	const [displayName, setDisplayName] = useState(user?.displayName || "");
	const [email] = useState(user?.email || "");

	// Account state
	const [currentPw, setCurrentPw] = useState("");
	const [newPw, setNewPw] = useState("");
	const [mfaEnabled, setMfaEnabled] = useState(false);

	// Preferences state
	const [aiTone, setAiTone] = useState("Academic");
	const [responseLength, setResponseLength] = useState("Balanced");

	// Notification state
	const [notifications, setNotifications] = useState({
		flashcardDue: true, testResults: true, weeklyReport: false, productUpdates: false,
	});

	const handleSaveProfile = async () => {
		setIsSaving(true);
		try { await updateProfile({ displayName }); toast.success("Profile updated."); }
		catch { toast.error("Failed to save."); }
		finally { setIsSaving(false); }
	};

	return (
		<div className='flex-1 flex flex-col h-full bg-background overflow-hidden'>
			{/* Header */}
			<div className='px-4 md:px-8 pt-8 md:pt-10 pb-6 border-b border-border/40 bg-background/60 backdrop-blur-md sticky top-0 z-10'>
				<motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={spring}
					className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-widest mb-3'>
					Configuration
				</motion.div>
				<motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.05 }}
					className='text-4xl md:text-5xl font-serif text-foreground tracking-tight mb-2'>
					Settings
				</motion.h1>
				<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
					className='text-sm text-muted-foreground leading-relaxed'>
					Manage your account, billing, and study preferences.
				</motion.p>
			</div>

			<div className='flex-1 flex flex-col md:flex-row overflow-hidden'>
				{/* Sidebar */}
				<div className='w-full md:w-56 border-r border-border/40 bg-card/20 shrink-0 flex md:flex-col overflow-x-auto hide-scrollbar md:overflow-visible border-b md:border-b-0'>
					<div className='flex md:flex-col p-3 gap-1 min-w-max md:w-full'>
						{settingsTabs.map((tab) => (
							<button key={tab.id} onClick={() => setActiveTab(tab.id)}
								className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors w-full text-left ${activeTab === tab.id ? "text-brand-orange" : "text-muted-foreground hover:text-foreground"}`}>
								{activeTab === tab.id && (
									<motion.div layoutId="settingsTab"
										className='absolute inset-0 bg-brand-orange/10 border border-brand-orange/20 rounded-xl -z-10'
										initial={false} transition={spring} />
								)}
								<tab.icon className='size-4 shrink-0' />
								{tab.label}
							</button>
						))}
						<div className='mt-auto hidden md:block pt-6'>
							<button onClick={() => logout()}
								className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold w-full text-left text-destructive hover:bg-destructive/5 transition-colors'>
								<LogOut className='size-4' />Log out
							</button>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className='flex-1 overflow-y-auto custom-scrollbar p-4 md:p-10'>
					<AnimatePresence mode="wait">

						{/* PROFILE */}
						{activeTab === "profile" && (
							<motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={spring} className='max-w-xl'>
								<h2 className='font-serif text-xl text-foreground mb-1'>Personal Information</h2>
								<p className='text-sm text-muted-foreground mb-6'>Update your profile details and photo.</p>
								<Card className='p-6 bg-card border-border/40 shadow-soft space-y-6'>
									{/* Avatar */}
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
									{/* Fields */}
									<div className='space-y-4'>
										<div className='space-y-2'>
											<label className='text-sm font-medium text-foreground'>Full Name</label>
											<Input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
												className='h-11 bg-background border-border/40 rounded-2xl focus-visible:ring-1 focus-visible:ring-foreground' placeholder='Your name' />
										</div>
										<div className='space-y-2'>
											<label className='text-sm font-medium text-foreground'>Email Address</label>
											<Input value={email} disabled type='email'
												className='h-11 bg-muted/30 border-border/40 rounded-2xl opacity-60 cursor-not-allowed' />
											<p className='text-xs text-muted-foreground'>Contact support to change your email.</p>
										</div>
										<div className='space-y-2'>
											<label className='text-sm font-medium text-foreground'>Institution <span className='text-muted-foreground font-normal'>(Optional)</span></label>
											<Input className='h-11 bg-background border-border/40 rounded-2xl focus-visible:ring-1 focus-visible:ring-foreground' placeholder='e.g. Harvard University' />
										</div>
									</div>
									<div className='pt-4 border-t border-border/40 flex justify-end'>
										<button onClick={handleSaveProfile} disabled={isSaving}
											className='px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all disabled:opacity-60'>
											{isSaving ? "Saving..." : "Save Changes"}
										</button>
									</div>
								</Card>
							</motion.div>
						)}

						{/* ACCOUNT */}
						{activeTab === "account" && (
							<motion.div key="account" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={spring} className='max-w-xl space-y-5'>
								<h2 className='font-serif text-xl text-foreground mb-1'>Account Security</h2>
								<p className='text-sm text-muted-foreground mb-6'>Manage your password and multi-factor authentication.</p>

								<Card className='p-6 bg-card border-border/40 shadow-soft space-y-4'>
									<h3 className='text-sm font-medium text-foreground'>Change Password</h3>
									<div className='space-y-3'>
										<Input value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} type='password'
											placeholder='Current password' className='h-11 bg-background border-border/40 rounded-2xl focus-visible:ring-1 focus-visible:ring-foreground' />
										<Input value={newPw} onChange={(e) => setNewPw(e.target.value)} type='password'
											placeholder='New password' className='h-11 bg-background border-border/40 rounded-2xl focus-visible:ring-1 focus-visible:ring-foreground' />
									</div>
									<div className='pt-3 border-t border-border/40 flex justify-end'>
										<button className='px-5 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all'>
											Update Password
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
										<motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className='text-xs text-muted-foreground mt-4 pt-4 border-t border-border/40'>
											A verification code will be required each time you sign in.
										</motion.p>
									)}
								</Card>
							</motion.div>
						)}

						{/* BILLING */}
						{activeTab === "billing" && (
							<motion.div key="billing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={spring} className='max-w-xl space-y-5'>
								<h2 className='font-serif text-xl text-foreground mb-1'>Billing & Plan</h2>
								<p className='text-sm text-muted-foreground mb-6'>Your current plan and upgrade options.</p>

								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									{/* Free Plan */}
									<Card className='p-6 bg-card border-border/40 shadow-soft'>
										<div className='flex items-center justify-between mb-3'>
											<span className='text-xs font-black uppercase tracking-widest text-muted-foreground'>Current Plan</span>
											<span className='px-2 py-0.5 rounded-full bg-foreground/10 border border-foreground/20 text-[10px] font-black text-foreground'>Active</span>
										</div>
										<p className='text-3xl font-serif font-black text-foreground'>Free</p>
										<p className='text-xs text-muted-foreground mt-1 mb-5'>Up to 10 documents, 3 tests/month</p>
										<ul className='space-y-2 text-xs text-muted-foreground'>
											{["10 documents", "3 AI tests / month", "Basic flashcards", "Community support"].map(f => (
												<li key={f} className='flex items-center gap-2'><span className='w-1.5 h-1.5 rounded-full bg-muted-foreground/50' />{f}</li>
											))}
										</ul>
									</Card>

									{/* Pro Plan */}
									<Card className='p-6 bg-foreground/5 border-foreground/20 shadow-soft relative overflow-hidden backdrop-blur-sm'>
										<div className='absolute inset-0 bg-gradient-to-br from-brand-orange/8 via-transparent to-brand-violet/8 pointer-events-none' />
										<div className='relative'>
											<div className='flex items-center justify-between mb-3'>
												<span className='text-xs font-black uppercase tracking-widest text-brand-orange'>Pro Plan</span>
												<span className='px-2 py-0.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-[10px] font-black text-brand-orange'>Recommended</span>
											</div>
											<p className='text-3xl font-serif font-black text-foreground'>$12<span className='text-base font-medium text-muted-foreground'>/mo</span></p>
											<p className='text-xs text-muted-foreground mt-1 mb-5'>Everything you need to master any subject</p>
											<ul className='space-y-2 text-xs text-muted-foreground mb-5'>
												{["Unlimited documents", "Unlimited AI generation", "Advanced spaced repetition", "Priority support"].map(f => (
													<li key={f} className='flex items-center gap-2'><span className='w-1.5 h-1.5 rounded-full bg-brand-orange' />{f}</li>
												))}
											</ul>
											<button className='w-full py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all'>
												Upgrade Now
											</button>
										</div>
									</Card>
								</div>
							</motion.div>
						)}

						{/* PREFERENCES */}
						{activeTab === "preferences" && (
							<motion.div key="preferences" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={spring} className='max-w-xl space-y-5'>
								<h2 className='font-serif text-xl text-foreground mb-1'>AI Preferences</h2>
								<p className='text-sm text-muted-foreground mb-6'>Configure how DUPI communicates and generates content for you.</p>

								<Card className='p-6 bg-card border-border/40 shadow-soft space-y-6'>
									<div className='space-y-3'>
										<label className='text-sm font-medium text-foreground'>AI Communication Tone</label>
										<SliderPill options={["Academic", "Professional", "Socratic"]} value={aiTone} onChange={setAiTone} />
										<p className='text-xs text-muted-foreground'>
											{aiTone === "Academic" && "Formal, precise, and citation-aware. Best for exam preparation."}
											{aiTone === "Professional" && "Clear, concise, and business-oriented. Best for professional certifications."}
											{aiTone === "Socratic" && "Question-driven and exploratory. Best for deep conceptual understanding."}
										</p>
									</div>
									<div className='space-y-3 pt-4 border-t border-border/40'>
										<label className='text-sm font-medium text-foreground'>Default Response Length</label>
										<SliderPill options={["Brief", "Balanced", "Detailed"]} value={responseLength} onChange={setResponseLength} />
									</div>
									<div className='pt-4 border-t border-border/40 flex justify-end'>
										<button className='px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all'>
											Save Preferences
										</button>
									</div>
								</Card>
							</motion.div>
						)}

						{/* NOTIFICATIONS */}
						{activeTab === "notifications" && (
							<motion.div key="notifications" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={spring} className='max-w-xl space-y-5'>
								<h2 className='font-serif text-xl text-foreground mb-1'>Notifications</h2>
								<p className='text-sm text-muted-foreground mb-6'>Choose which email alerts you want to receive.</p>

								<Card className='divide-y divide-border/40 bg-card border-border/40 shadow-soft overflow-hidden'>
									{([
										{ key: "flashcardDue", label: "Flashcard Review Due", desc: "Notified when cards are scheduled for review" },
										{ key: "testResults", label: "Test Results Available", desc: "Receive a summary when a graded test is ready" },
										{ key: "weeklyReport", label: "Weekly Progress Report", desc: "A recap of your study activity each Sunday" },
										{ key: "productUpdates", label: "Product Updates", desc: "New features and improvements from DUPI" },
									] as const).map((item) => (
										<div key={item.key} className='flex items-center justify-between px-6 py-4'>
											<div>
												<p className='text-sm font-medium text-foreground'>{item.label}</p>
												<p className='text-xs text-muted-foreground mt-0.5'>{item.desc}</p>
											</div>
											<Toggle
												checked={notifications[item.key]}
												onChange={(v) => setNotifications((prev) => ({ ...prev, [item.key]: v }))}
											/>
										</div>
									))}
								</Card>
							</motion.div>
						)}

					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

export default SettingsPage;
