import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TypewriterProps {
	text: string;
	speed?: number;
	className?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 2, className = "" }) => {
	const [displayedText, setDisplayedText] = useState("");
	const [isComplete, setIsComplete] = useState(false);

	useEffect(() => {
		setDisplayedText("");
		setIsComplete(false);
		
		let index = 0;
		const intervalId = setInterval(() => {
			setDisplayedText((prev) => {
				const nextChar = text.slice(index, index + 5); // Take 5 chars at a time for efficiency and speed
				index += 5;
				
				if (index >= text.length) {
					clearInterval(intervalId);
					setIsComplete(true);
					return text;
				}
				return text.slice(0, index);
			});
		}, speed);

		return () => clearInterval(intervalId);
	}, [text, speed]);

	return (
		<div className={`${className} ${isComplete ? "" : "cursor-typing"}`}>
			<ReactMarkdown 
				remarkPlugins={[remarkGfm]}
				components={{
					h1: ({ node, ...props }) => <h1 className="text-2xl font-serif text-foreground mb-4 mt-6" {...props} />,
					h2: ({ node, ...props }) => <h2 className="text-xl font-serif text-foreground mb-3 mt-5" {...props} />,
					h3: ({ node, ...props }) => <h3 className="text-lg font-serif text-foreground mb-2 mt-4" {...props} />,
					p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-foreground/90 font-serif" {...props} />,
					ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
					ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2" {...props} />,
					li: ({ node, ...props }) => <li className="font-serif text-foreground/80" {...props} />,
					blockquote: ({ node, ...props }) => (
						<blockquote className="border-l-4 border-brand-orange/40 pl-4 py-1 italic bg-brand-orange/5 rounded-r-xl mb-4" {...props} />
					),
				}}
			>
				{displayedText}
			</ReactMarkdown>
			{!isComplete && (
				<span className="inline-block w-1.5 h-4 bg-brand-orange ml-1 animate-pulse rounded-full align-middle" />
			)}
		</div>
	);
};
