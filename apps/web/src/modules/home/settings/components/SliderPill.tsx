// import React from "react";
import { motion } from "framer-motion";

const spring = { type: "spring", stiffness: 260, damping: 30 };

interface SliderPillProps {
	options: string[];
	value: string;
	onChange: (v: string) => void;
}

export function SliderPill({ options, value, onChange }: SliderPillProps) {
	return (
		<div className='flex p-1 rounded-xl bg-muted/50 relative'>
			{options.map((opt) => (
				<button
					key={opt}
					onClick={() => onChange(opt)}
					className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors relative z-10 ${
						value === opt
							? "text-background"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					{opt}
				</button>
			))}
			<motion.div
				className='absolute inset-y-1 bg-foreground rounded-lg'
				initial={false}
				animate={{
					left: `calc(${options.indexOf(value)} * ${100 / options.length}% + 4px)`,
					width: `calc(${100 / options.length}% - 8px)`,
				}}
				transition={spring}
			/>
		</div>
	);
}
