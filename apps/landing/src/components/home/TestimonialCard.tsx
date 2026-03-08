import { type FC } from "react";

interface TestimonialCardProps {
	name: string;
	role: string;
	content: string;
	avatarColor?: string;
}

const TestimonialCard: FC<TestimonialCardProps> = ({
	name,
	role,
	content,
	avatarColor,
}) => {
	return (
		<div className='w-80 md:w-96 p-8 bg-card/40 backdrop-blur-sm rounded-[2rem] border border-border/50 flex flex-col justify-between hover:border-brand-violet/30 transition-all duration-500 group'>
			<div>
				<div className='flex gap-1 mb-6 text-brand-orange'>
					<span className='material-symbols-outlined text-sm'>
						star
					</span>
					<span className='material-symbols-outlined text-sm'>
						star
					</span>
					<span className='material-symbols-outlined text-sm'>
						star
					</span>
					<span className='material-symbols-outlined text-sm'>
						star
					</span>
					<span className='material-symbols-outlined text-sm'>
						star
					</span>
				</div>
				<p className='text-foreground/90 mb-8 leading-relaxed font-medium italic'>
					"{content}"
				</p>
			</div>

			<div className='flex items-center gap-4'>
				<div
					className={`w-12 h-12 rounded-2xl ${avatarColor || "bg-gradient-to-br from-brand-violet to-brand-orange"} flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-500`}
				>
					{name[0]}
				</div>
				<div>
					<p className='font-bold text-base text-foreground group-hover:text-brand-orange transition-colors duration-300'>
						{name}
					</p>
					<p className='text-xs text-muted-foreground font-medium uppercase tracking-widest'>
						{role}
					</p>
				</div>
			</div>
		</div>
	);
};

export default TestimonialCard;
