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
		
		if (!text) {
			setIsComplete(true);
			return;
		}

		let currentIndex = 0;
		const intervalId = setInterval(() => {
			currentIndex += 5; // Take 5 chars at a time for speed
			
			if (currentIndex >= text.length) {
				clearInterval(intervalId);
				setDisplayedText(text);
				setIsComplete(true);
			} else {
				setDisplayedText(text.slice(0, currentIndex));
			}
		}, speed);

		return () => clearInterval(intervalId);
	}, [text, speed]);

	return (
		<div className={`${className} ${isComplete ? "" : "cursor-typing"}`}>
			<ReactMarkdown 
				remarkPlugins={[remarkGfm]}
				components={{
					h1: ({ node: _node, ...props }) => <h1 className="text-2xl font-serif text-foreground mb-4 mt-6" {...props} />,
					h2: ({ node: _node, ...props }) => <h2 className="text-xl font-serif text-foreground mb-3 mt-5" {...props} />,
					h3: ({ node: _node, ...props }) => <h3 className="text-lg font-serif text-foreground mb-2 mt-4" {...props} />,
					p: ({ node: _node, ...props }) => <p className="mb-4 leading-relaxed text-foreground/90 font-serif" {...props} />,
					ul: ({ node: _node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
					ol: ({ node: _node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2" {...props} />,
					li: ({ node: _node, ...props }) => <li className="font-serif text-foreground/80" {...props} />,
					blockquote: ({ node: _node, ...props }) => (
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
