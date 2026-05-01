// import React from "react";
import { motion } from "framer-motion";

const spring = { type: "spring", stiffness: 260, damping: 30 };

interface ToggleProps {
	checked: boolean;
	onChange: (v: boolean) => void;
}

export function Toggle({ checked, onChange }: ToggleProps) {
	return (
		<button
			onClick={() => onChange(!checked)}
			role='switch'
			aria-checked={checked}
			className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
				checked ? "bg-foreground" : "bg-muted"
			}`}
		>
			<motion.div
				animate={{ x: checked ? 22 : 2 }}
				transition={spring}
				className='absolute top-1 w-4 h-4 rounded-full bg-background shadow-sm'
			/>
		</button>
	);
}
