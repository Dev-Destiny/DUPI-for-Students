import React from "react";
import { Card } from "@studify/ui";

export const BillingSection: React.FC = () => {
	return (
		<div className='w-full space-y-5'>
			<h2 className='font-serif text-xl text-foreground mb-1'>Billing & Plan</h2>
			<p className='text-sm text-muted-foreground mb-6'>Your current plan and upgrade options.</p>

			<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
				{/* Free Plan */}
				<Card className='p-6 bg-card border-border/40 shadow-soft'>
					<div className='flex items-center justify-between mb-3'>
						<span className='text-xs font-black uppercase tracking-widest text-muted-foreground'>Current Plan</span>
						<span className='px-2 py-0.5 rounded-full bg-foreground/10 border border-foreground/20 text-[10px] font-black text-foreground'>
							Active
						</span>
					</div>
					<p className='text-3xl font-serif font-black text-foreground'>Free</p>
					<p className='text-xs text-muted-foreground mt-1 mb-5'>Up to 10 documents, 3 tests/month</p>
					<ul className='space-y-2 text-xs text-muted-foreground'>
						{["10 documents", "3 AI tests / month", "Basic flashcards", "Community support"].map((f) => (
							<li key={f} className='flex items-center gap-2'>
								<span className='w-1.5 h-1.5 rounded-full bg-muted-foreground/50' />
								{f}
							</li>
						))}
					</ul>
				</Card>

				{/* Pro Plan */}
				<Card className='p-6 bg-foreground/5 border-foreground/20 shadow-soft relative overflow-hidden backdrop-blur-sm'>
					<div className='absolute inset-0 bg-gradient-to-br from-brand-orange/8 via-transparent to-brand-violet/8 pointer-events-none' />
					<div className='relative'>
						<div className='flex items-center justify-between mb-3'>
							<span className='text-xs font-black uppercase tracking-widest text-brand-orange'>Pro Plan</span>
							<span className='px-2 py-0.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-[10px] font-black text-brand-orange'>
								Recommended
							</span>
						</div>
						<p className='text-3xl font-serif font-black text-foreground'>
							$12<span className='text-base font-medium text-muted-foreground'>/mo</span>
						</p>
						<p className='text-xs text-muted-foreground mt-1 mb-5'>Everything you need to master any subject</p>
						<ul className='space-y-2 text-xs text-muted-foreground mb-5'>
							{[
								"Unlimited documents",
								"Unlimited AI generation",
								"Advanced spaced repetition",
								"Priority support",
							].map((f) => (
								<li key={f} className='flex items-center gap-2'>
									<span className='w-1.5 h-1.5 rounded-full bg-brand-orange' />
									{f}
								</li>
							))}
						</ul>
						<button className='w-full py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all'>
							Upgrade Now
						</button>
					</div>
				</Card>
			</div>
		</div>
	);
};
