import { type FC } from "react";
import { motion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";

const testimonials = [
	{
		name: "Sarah Chen",
		role: "Med Student @ Stanford",
		content:
			"DUPI turned my 400-page pathology textbook into quizzes I actually enjoy doing. Saved my finals week.",
		avatarColor: "bg-gradient-to-br from-primary to-brand-violet",
	},
	{
		name: "Marcus Johnson",
		role: "Law Student @ Yale",
		content:
			"The case study generation is scarily accurate. It generates scenarios that actually test application, not just memory.",
		avatarColor: "bg-gradient-to-br from-brand-violet to-brand-orange",
	},
	{
		name: "Dr. Emily Alcott",
		role: "Professor of Biology",
		content:
			"I recommend DUPI to all my students. It forces them to engage with the material actively instead of just highlighting.",
		avatarColor: "bg-gradient-to-br from-emerald-500 to-teal-500",
	},
	{
		name: "David Park",
		role: "Computer Science Major",
		content:
			"I use it for my lecture slides. The instant feedback helps me clarify concepts immediately after class.",
		avatarColor: "bg-gradient-to-br from-brand-gold to-brand-orange",
	},
	{
		name: "Jessica Wu",
		role: "High School Teacher",
		content:
			"Great for generating quick exit tickets for my AP classes. Saves me hours of prep time.",
		avatarColor: "bg-gradient-to-br from-brand-violet to-purple-600",
	},
];

const Testimonials: FC = () => {
	const marqueeData = [...testimonials, ...testimonials, ...testimonials];

	return (
		<section className='py-24 bg-background overflow-hidden'>
			<div className='max-w-7xl mx-auto px-4 mb-20 text-center relative z-10'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<h2 className='header-font text-4xl md:text-6xl mb-6 uppercase tracking-tight text-foreground'>
						Loved by learners
					</h2>
					<p className='text-muted-foreground text-lg font-medium max-w-xl mx-auto'>
						Join thousands of students and educators who are
						leveling up their mastery with DUPI AI.
					</p>
				</motion.div>
			</div>

			<div className='flex flex-col gap-10 opacity-90 transition-opacity duration-500'>
				<div className='flex overflow-hidden group'>
					<motion.div
						className='flex gap-8 pl-8'
						animate={{ x: "-50%" }}
						transition={{
							ease: "linear",
							duration: 45,
							repeat: Infinity,
						}}
						style={{ width: "max-content" }}
					>
						{marqueeData.map((t, i) => (
							<TestimonialCard key={`row1-${i}`} {...t} />
						))}
					</motion.div>
				</div>

				<div className='flex overflow-hidden group'>
					<motion.div
						className='flex gap-8 pl-8'
						initial={{ x: "-50%" }}
						animate={{ x: "0%" }}
						transition={{
							ease: "linear",
							duration: 50,
							repeat: Infinity,
						}}
						style={{ width: "max-content" }}
					>
						{marqueeData.map((t, i) => (
							<TestimonialCard key={`row2-${i}`} {...t} />
						))}
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default Testimonials;
