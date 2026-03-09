import { type FC } from "react";

const footerLinks = {
	product: [
		{ label: "Upload Notes", href: "#" },
		{ label: "Quiz Generator", href: "#" },
		{ label: "Pricing", href: "#pricing" },
	],
	resources: [
		{ label: "Blog", href: "#" },
		{ label: "Study Tips", href: "#" },
		{ label: "Success Stories", href: "#" },
	],
	legal: [
		{ label: "Terms", href: "#" },
		{ label: "Privacy", href: "#" },
		{ label: "Help", href: "#" },
	],
};

const Footer: FC = () => {
	return (
		<footer className='bg-background py-16 border-t border-border'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='grid grid-cols-2 md:grid-cols-5 gap-12 mb-12'>
					{/* Brand */}
					<div className='col-span-2'>
						<div className='flex items-center gap-1 mb-6'>
							<span className='font-grotesk font-bold tracking-tighter text-foreground text-2xl flex items-center gap-[3px]'>
								dupi
								<img
									src='/image/dupi-mark.svg'
									alt='DUPI logo'
									className='h-5 w-5'
								/>
							</span>
						</div>
						<p className='text-muted-foreground max-w-xs mb-6 text-sm leading-relaxed'>
							DUPI is building the future of personalized learning
							through AI-driven assessment generation.
						</p>
						<div className='flex gap-4'>
							<a
								href='#'
								className='text-muted-foreground hover:text-brand-orange transition-colors duration-300'
							>
								<span className='material-symbols-outlined'>
									alternate_email
								</span>
							</a>
							<a
								href='#'
								className='text-muted-foreground hover:text-brand-orange transition-colors duration-300'
							>
								<span className='material-symbols-outlined'>
									share
								</span>
							</a>
						</div>
					</div>

					{/* Product */}
					<div>
						<h4 className='font-bold mb-6 text-sm uppercase tracking-wider text-foreground'>
							Product
						</h4>
						<ul className='space-y-4 text-sm text-muted-foreground'>
							{footerLinks.product.map((link) => (
								<li key={link.label}>
									<a
										href={link.href}
										className='hover:text-brand-violet transition-colors duration-300'
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Resources */}
					<div>
						<h4 className='font-bold mb-6 text-sm uppercase tracking-wider text-foreground'>
							Resources
						</h4>
						<ul className='space-y-4 text-sm text-muted-foreground'>
							{footerLinks.resources.map((link) => (
								<li key={link.label}>
									<a
										href={link.href}
										className='hover:text-brand-violet transition-colors duration-300'
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h4 className='font-bold mb-6 text-sm uppercase tracking-wider text-foreground'>
							Legal
						</h4>
						<ul className='space-y-4 text-sm text-muted-foreground'>
							{footerLinks.legal.map((link) => (
								<li key={link.label}>
									<a
										href={link.href}
										className='hover:text-brand-orange transition-colors duration-300'
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom */}
				<div className='pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground'>
					<p>
						© {new Date().getFullYear()} DUPI AI. All rights
						reserved.
					</p>
					<div className='flex gap-6'>
						<a
							href='#'
							className='hover:text-foreground transition-colors'
						>
							Accessibility
						</a>
						<a
							href='#'
							className='hover:text-foreground transition-colors'
						>
							Cookies
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
