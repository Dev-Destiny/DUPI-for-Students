import React from "react";
import { motion } from "framer-motion";
import { LogOut, LucideIcon } from "lucide-react";
import { useAuthStore } from "../../../../store/auth.store";

const spring = { type: "spring", stiffness: 260, damping: 30 };

interface Tab {
	id: string;
	label: string;
	icon: LucideIcon;
}

interface SettingsSidebarProps {
	tabs: Tab[];
	activeTab: string;
	setActiveTab: (id: string) => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ tabs, activeTab, setActiveTab }) => {
	const { logout } = useAuthStore();

	return (
		<div className='w-full lg:w-64 border-r border-border/40 bg-card/20 shrink-0 flex lg:flex-col overflow-x-auto hide-scrollbar lg:overflow-visible border-b lg:border-b-0'>
			<div className='flex lg:flex-col p-3 gap-1 min-w-max lg:w-full'>
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors w-full text-left ${
							activeTab === tab.id ? "text-brand-orange" : "text-muted-foreground hover:text-foreground"
						}`}
					>
						{activeTab === tab.id && (
							<motion.div
								layoutId='settingsTab'
								className='absolute inset-0 bg-brand-orange/10 border border-brand-orange/20 rounded-xl -z-10'
								initial={false}
								transition={spring}
							/>
						)}
						<tab.icon className='size-4 shrink-0' />
						{tab.label}
					</button>
				))}
				<div className='mt-auto hidden lg:block pt-6'>
					<button
						onClick={() => logout()}
						className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold w-full text-left text-destructive hover:bg-destructive/5 transition-colors'
					>
						<LogOut className='size-4' />
						Log out
					</button>
				</div>
			</div>
		</div>
	);
};
