import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	User,
	Bell,
	Shield,
	Palette,
	Camera,
	Save,
	CreditCard,
	LogOut,
	Settings as SettingsIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, Card, Input } from "@dupi/ui";
import { useAuthStore } from "../../../../store/auth.store";

const Tabs = [
	{ id: "profile", label: "Profile", icon: User },
	{ id: "account", label: "Account Setup", icon: Shield },
	{ id: "billing", label: "Billing", icon: CreditCard },
	{ id: "preferences", label: "Preferences", icon: Palette },
	{ id: "notifications", label: "Notifications", icon: Bell },
];

const SettingsPage: React.FC = () => {
	const { user, logout } = useAuthStore();
	const [activeTab, setActiveTab] = useState("profile");
	const [isSaving, setIsSaving] = useState(false);

	// Form State for Profile
	const [displayName, setDisplayName] = useState(
		user?.displayName || "Sodiq Adesina",
	);
	const [email, setEmail] = useState(user?.email || "sodiq@dupi.ai");

	const handleSave = () => {
		setIsSaving(true);
		setTimeout(() => setIsSaving(false), 1000);
	};

	return (
		<div className='flex-1 flex flex-col h-full bg-background overflow-hidden relative'>
			{/* Decorative ambient background blurs */}
			<div className='absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none' />
			<div className='absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-violet/5 rounded-full blur-[150px] pointer-events-none' />

			{/* Refined Header area */}
			<div className='px-8 pt-10 pb-6 border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-10'>
				<div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
					<div className='relative z-10'>
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(255,111,32,0.15)]'
						>
							<SettingsIcon className='size-3.5 fill-current' />{" "}
							Configuration
						</motion.div>
						<motion.h1
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							className='text-3xl md:text-5xl font-black text-foreground font-serif tracking-tight mb-3 flex items-center gap-3 drop-shadow-lg'
						>
							Settings
						</motion.h1>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className='text-muted-foreground font-medium text-sm max-w-xl leading-relaxed'
						>
							Manage your account preferences, update your
							personal information, and configure your study
							experience.
						</motion.p>
					</div>
				</div>
			</div>

			<div className='flex-1 flex flex-col md:flex-row overflow-hidden relative z-10'>
				{/* Settings Sidebar Tabs */}
				<div className='w-full md:w-64 border-r border-border/50 bg-card/30 md:overflow-y-auto custom-scrollbar flex shrink-0 border-b md:border-b-0'>
					<div className='flex md:flex-col p-4 gap-2 overflow-x-auto md:overflow-visible w-full hide-scroll-indicator'>
						{Tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 w-full text-left ${
									activeTab === tab.id
										? "bg-brand-orange/10 text-brand-orange relative"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								}`}
							>
								{activeTab === tab.id && (
									<motion.div
										layoutId='activeTabIndicator'
										className='absolute inset-0 rounded-xl border border-brand-orange/30 bg-brand-orange/5'
										initial={false}
										transition={{
											type: "spring",
											stiffness: 300,
											damping: 30,
										}}
									/>
								)}
								<tab.icon
									className={`size-4 relative z-10 ${activeTab === tab.id ? "text-brand-orange" : ""}`}
								/>
								<span className='relative z-10'>
									{tab.label}
								</span>
							</button>
						))}

						<div className='mt-auto hidden md:block pt-8'>
							<button
								onClick={() => logout()}
								className='flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold w-full text-left text-destructive hover:bg-destructive/10 transition-colors'
							>
								<LogOut className='size-4' />
								Log out
							</button>
						</div>
					</div>
				</div>

				{/* Settings Content Area */}
				<div className='flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10'>
					<AnimatePresence mode='wait'>
						{activeTab === "profile" && (
							<motion.div
								key='profile'
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								className='max-w-2xl mx-auto'
							>
								<div className='mb-8'>
									<h2 className='text-xl font-bold font-serif text-foreground mb-1'>
										Personal Information
									</h2>
									<p className='text-sm text-muted-foreground'>
										Update your photo and personal details
										here.
									</p>
								</div>

								<Card className='p-8 bg-card border-border shadow-lg shadow-black/5 relative overflow-hidden group'>
									{/* Avatar Upload Section */}
									<div className='flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-8 border-b border-border/50'>
										<div className='relative group/avatar cursor-pointer'>
											<Avatar className='h-24 w-24 rounded-full border-4 border-background shadow-xl ring-1 ring-border group-hover/avatar:ring-brand-orange/50 transition-all'>
												<AvatarImage
													src={
														user?.profileImageUrl ||
														""
													}
												/>
												<AvatarFallback className='rounded-full bg-brand-orange/10 text-brand-orange font-bold text-2xl'>
													{displayName
														.substring(0, 2)
														.toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className='absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm'>
												<Camera className='size-6 text-white' />
											</div>
										</div>

										<div className='space-y-2'>
											<div className='flex gap-3'>
												<button className='px-4 py-2 bg-brand-orange text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-brand-orange/90 transition-all shadow-[0_0_15px_rgba(255,111,32,0.3)] hover:shadow-[0_0_25px_rgba(255,111,32,0.5)] active:scale-95'>
													Upload new photo
												</button>
												<button className='px-4 py-2 bg-muted text-foreground text-xs font-bold rounded-xl hover:bg-muted/80 transition-colors'>
													Remove
												</button>
											</div>
											<p className='text-[10px] text-muted-foreground uppercase tracking-wider font-bold'>
												At least 800x800 px recommended.
												JPG or PNG.
											</p>
										</div>
									</div>

									{/* Form Fields */}
									<div className='space-y-6'>
										<div className='grid gap-2'>
											<label className='text-xs font-bold text-foreground'>
												Full Name
											</label>
											<Input
												value={displayName}
												onChange={(e) =>
													setDisplayName(
														e.target.value,
													)
												}
												className='bg-background/50 border-border focus-visible:ring-brand-orange/50 h-11'
												placeholder='Enter your full name'
											/>
										</div>

										<div className='grid gap-2'>
											<label className='text-xs font-bold text-foreground'>
												Email Address
											</label>
											<Input
												value={email}
												onChange={(e) =>
													setEmail(e.target.value)
												}
												className='bg-background/50 border-border focus-visible:ring-brand-orange/50 h-11'
												placeholder='Enter your email'
												type='email'
											/>
										</div>

										<div className='grid gap-2 mb-4'>
											<label className='text-xs font-bold text-foreground'>
												Academic Institution (Optional)
											</label>
											<Input
												className='bg-background/50 border-border focus-visible:ring-brand-orange/50 h-11'
												placeholder='e.g. Stanford University'
											/>
										</div>

										<div className='pt-6 border-t border-border/50 flex justify-end'>
											<button
												onClick={handleSave}
												disabled={isSaving}
												className='flex items-center gap-2 px-6 py-3 bg-foreground text-background text-xs font-black uppercase tracking-widest rounded-xl hover:bg-foreground/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed'
											>
												{isSaving ? (
													<motion.div
														animate={{
															rotate: 360,
														}}
														transition={{
															repeat: Infinity,
															duration: 1,
															ease: "linear",
														}}
													>
														<SettingsIcon className='size-4' />
													</motion.div>
												) : (
													<Save className='size-4' />
												)}
												Save Changes
											</button>
										</div>
									</div>
								</Card>
							</motion.div>
						)}

						{activeTab !== "profile" && (
							<motion.div
								key='other'
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								className='h-[60vh] flex flex-col items-center justify-center text-center max-w-md mx-auto relative z-10'
							>
								<div className='w-24 h-24 mb-6 rounded-3xl bg-brand-orange/5 flex items-center justify-center border border-brand-orange/10'>
									<SettingsIcon className='size-10 text-muted-foreground' />
								</div>
								<h3 className='text-xl font-bold font-serif text-foreground mb-2'>
									Coming Soon
								</h3>
								<p className='text-sm text-muted-foreground'>
									This section of the configuration module is
									currently under development.
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

export default SettingsPage;
