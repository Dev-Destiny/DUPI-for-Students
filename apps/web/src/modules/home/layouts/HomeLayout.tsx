import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
	LayoutDashboard,
	FileText,
	ClipboardCheck,
	Layers,
	BarChart3,
	Settings,
	LogOut,
	Zap,
	ChevronUp,
	BadgeCheck,
	Bell,
	CreditCard,
	Sparkles,
} from "lucide-react";

import { useAuthStore } from "../../../store/auth.store";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Separator,
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
	useSidebar,
} from "@dupi/ui";

const navMain = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Documents",
		url: "/documents",
		icon: FileText,
	},
	{
		title: "Tests",
		url: "/tests",
		icon: ClipboardCheck,
	},
	{
		title: "Flashcards",
		url: "/flashcards",
		icon: Layers,
	},
];

const navSecondary = [
	{
		title: "Analytics",
		url: "/analytics",
		icon: BarChart3,
	},
	{
		title: "Settings",
		url: "/settings",
		icon: Settings,
	},
];

function NavUser() {
	const { user, logout } = useAuthStore();
	const { isMobile } = useSidebar();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size='lg'
							className='data-[state=open]:bg-muted data-[state=open]:text-foreground'
						>
							<Avatar className='h-8 w-8 rounded-lg'>
								<AvatarImage
									src={user?.profileImageUrl || ""}
								/>
								<AvatarFallback className='rounded-lg bg-brand-orange/10 text-brand-orange font-bold text-xs'>
									{user?.displayName
										?.substring(0, 2)
										.toUpperCase() || "SA"}
								</AvatarFallback>
							</Avatar>
							<div className='grid flex-1 text-left text-sm leading-tight'>
								<span className='truncate font-bold text-xs'>
									{user?.displayName || "Sodiq Adesina"}
								</span>
								<span className='truncate text-[10px] text-muted-foreground font-medium'>
									Free Plan
								</span>
							</div>
							<ChevronUp className='ml-auto size-4' />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
						side={isMobile ? "bottom" : "right"}
						align='end'
						sideOffset={4}
					>
						<DropdownMenuLabel className='p-0 font-normal'>
							<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
								<Avatar className='h-8 w-8 rounded-lg'>
									<AvatarImage
										src={user?.profileImageUrl || ""}
									/>
									<AvatarFallback className='rounded-lg bg-brand-orange/10 text-brand-orange font-bold text-xs'>
										{user?.displayName
											?.substring(0, 2)
											.toUpperCase() || "SA"}
									</AvatarFallback>
								</Avatar>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-bold text-xs'>
										{user?.displayName || "Sodiq Adesina"}
									</span>
									<span className='truncate text-[10px] text-muted-foreground'>
										{user?.email || "sodiq@dupi.ai"}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem className='text-xs'>
								<Sparkles className='mr-2 size-4 text-brand-orange' />
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem className='text-xs'>
								<BadgeCheck className='mr-2 size-4' />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem className='text-xs'>
								<CreditCard className='mr-2 size-4' />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem className='text-xs'>
								<Bell className='mr-2 size-4' />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className='text-xs text-destructive focus:text-destructive focus:bg-destructive/10'
							onClick={() => logout()}
						>
							<LogOut className='mr-2 size-4' />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

function MobileBottomNav() {
	const location = useLocation();
	const { setOpenMobile } = useSidebar();

	return (
		<motion.div 
			initial={{ y: 100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
			className='md:hidden fixed inset-x-0 bottom-6 z-50 flex justify-center px-4'
		>
			<div className='w-full max-w-sm bg-card/90 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-3xl p-2 px-4 flex items-center justify-around'>
				{[...navMain, { title: "More", url: "#more", icon: ChevronUp }].map(
					(item) => {
						const isActive = location.pathname === item.url;
						const isMore = item.title === "More";

						return (
							<React.Fragment key={item.title}>
								{isMore ? (
									<button 
										onClick={() => setOpenMobile(true)}
										className='flex flex-col items-center gap-1 p-2 transition-all duration-300'
									>
										<div className='relative'>
											<item.icon className='size-5 text-muted-foreground' />
										</div>
										<span className='text-[8px] font-black uppercase tracking-widest text-muted-foreground'>
											Menu
										</span>
									</button>
								) : (
									<Link
										to={item.url}
										className='flex flex-col items-center gap-1 p-2 transition-all duration-300'
									>
										<div className='relative'>
											<item.icon
												className={`size-5 transition-colors duration-300 ${
													isActive
														? "text-brand-orange"
														: "text-muted-foreground"
												}`}
											/>
											{isActive && (
												<motion.div
													layoutId='active-dot'
													className='absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(255,111,32,0.6)]'
												/>
											)}
										</div>
										<span
											className={`text-[8px] font-black uppercase tracking-widest transition-colors duration-300 ${
												isActive
													? "text-brand-orange"
													: "text-muted-foreground"
											}`}
										>
											{item.title}
										</span>
									</Link>
								)}
							</React.Fragment>
						);
					},
				)}
			</div>
		</motion.div>
	);
}

export default function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const location = useLocation();
	const { isMobile, setOpenMobile } = useSidebar();

	React.useEffect(() => {
		if (isMobile) {
			setOpenMobile(false);
		}
	}, [location.pathname, isMobile, setOpenMobile]);

	return (
		<SidebarProvider defaultOpen={true}>
			<div className='flex min-h-svh w-full bg-background relative'>
				<Sidebar collapsible='icon' className='border-r border-border'>
					<SidebarHeader className='h-16 flex items-center px-4'>
						<Link
							to='/'
							className='flex items-center gap-2 group overflow-hidden'
						>
							<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange text-white shrink-0 group-hover:scale-105 transition-transform'>
								<Zap className='size-4 fill-current' />
							</div>
							<div className='grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden'>
								<span className='truncate font-grotesk font-black text-xl text-foreground tracking-tighter'>
									dupi
									<span className='inline-block size-1.5 rounded-full bg-brand-orange ml-0.5'></span>
								</span>
							</div>
						</Link>
					</SidebarHeader>
					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupLabel>Study Hub</SidebarGroupLabel>
							<SidebarMenu>
								{navMain.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											isActive={
												location.pathname === item.url
											}
											tooltip={item.title}
											size='sm'
											className='data-[active=true]:bg-brand-orange/10 data-[active=true]:text-brand-orange data-[active=true]:border-l-2 data-[active=true]:border-brand-orange rounded-l-none'
										>
											<Link to={item.url}>
												<item.icon
													className={
														location.pathname ===
														item.url
															? "text-brand-orange"
															: ""
													}
												/>
												<span className='font-grotesk font-bold text-xs'>
													{item.title}
												</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroup>
						<SidebarGroup className='mt-auto'>
							<SidebarGroupLabel>Preferences</SidebarGroupLabel>
							<SidebarMenu>
								{navSecondary.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											isActive={
												location.pathname === item.url
											}
											tooltip={item.title}
											size='sm'
											className='data-[active=true]:bg-brand-violet/10 data-[active=true]:text-brand-orange data-[active=true]:border-l-2 data-[active=true]:border-brand-orange rounded-l-none'
										>
											<Link to={item.url}>
												<item.icon
													className={
														location.pathname ===
														item.url
															? "text-brand-orange"
															: ""
													}
												/>
												<span className='font-grotesk font-bold text-xs'>
													{item.title}
												</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroup>

						{/* Premium Promo */}
						<SidebarGroup className='group-data-[collapsible=icon]:hidden mb-4'>
							<div className='mx-2 mt-4 rounded-3xl bg-gradient-to-br from-brand-orange to-[#6C2B0D] p-5 text-white shadow-xl shadow-brand-orange/20 overflow-hidden relative group/promo'>
								<div className='absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover/promo:scale-125 transition-transform duration-500' />
								<h4 className='text-[10px] font-black font-grotesk mb-2 uppercase tracking-widest text-white/90'>
									PRO ACCESS
								</h4>
								<p className='text-[11px] text-white/80 mb-4 font-medium leading-relaxed italic'>
									Unlock unlimited study power & AI
									generation.
								</p>
								<button className='w-full py-2 bg-white text-brand-orange text-[10px] font-black rounded-xl hover:bg-black hover:text-white transition-all shadow-lg active:scale-95'>
									UPGRADE NOW
								</button>
							</div>
						</SidebarGroup>
					</SidebarContent>
					<SidebarFooter className='border-t border-border p-2'>
						<NavUser />
					</SidebarFooter>
				</Sidebar>

				<main className='flex flex-1 flex-col overflow-hidden bg-background relative mb-24 md:mb-0'>
					<header className='flex h-12 md:h-16 shrink-0 items-center justify-between md:justify-start gap-2 border-b border-border px-4 bg-background/80 backdrop-blur-md z-10 sticky top-0'>
						<div className='flex items-center gap-2'>
							<SidebarTrigger className='-ml-1 md:flex hidden' />
							<div className='md:hidden flex h-7 w-7 items-center justify-center rounded bg-brand-orange text-white shrink-0'>
								<Zap className='size-3.5 fill-current' />
							</div>
							<Separator
								orientation='vertical'
								className='mr-2 h-4 md:block hidden'
							/>
							<div className='flex items-center gap-1 md:gap-2'>
								<span className='text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest font-grotesk'>
									Hub
								</span>
								<span className='text-border'>/</span>
								<span className='text-[10px] md:text-xs font-black text-foreground uppercase tracking-widest font-grotesk truncate max-w-[100px]'>
									{location.pathname.split("/").pop() ||
										"Dashboard"}
								</span>
							</div>
						</div>

						{/* Small Profile on Mobile Topbar */}
						<div className='md:hidden'>
							<Avatar className='h-7 w-7 rounded-full border border-border shadow-sm'>
								<AvatarFallback className='text-[10px] bg-brand-orange/10 text-brand-orange'>
									JD
								</AvatarFallback>
							</Avatar>
						</div>
					</header>
					<div className='flex flex-1 flex-col overflow-hidden items-center'>
						<div className='w-full max-w-7xl px-4 md:px-8 py-4 md:py-6'>
							{children}
						</div>
					</div>
				</main>
			</div>
			<MobileBottomNav />
		</SidebarProvider>
	);
}
