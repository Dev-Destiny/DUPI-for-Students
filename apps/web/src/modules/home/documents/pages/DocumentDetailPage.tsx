import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, AlertCircle, Layers, GraduationCap, Share2, MessageCircle, RefreshCcw } from "lucide-react";
import { Button, Card, ScrollArea, Input } from "@studify/ui";
import { GenerationModal } from "@/components/modals/GenerationModal";
import { ShareDialog } from "@/components/modals/ShareDialog";
import { Typewriter } from "@/components/Typewriter";
import {
	formatDocument,
	useDocumentQuery,
	useRegenerateSummaryMutation,
} from "@/hooks/use-studify-query";

const spring = { type: "spring", stiffness: 260, damping: 30 };

interface ChatMessage { id: string; role: "user" | "assistant"; content: string; }

const DocumentDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [input, setInput] = useState("");
	const [isGenerationOpen, setIsGenerationOpen] = useState(false);
	const [generationType, setGenerationType] = useState<"test" | "flashcard">("test");
	const [isShareOpen, setIsShareOpen] = useState(false);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([{
		id: "welcome", role: "assistant",
		content: "I'm your Studify study copilot. Ask me anything about this document, generate a test, or create flashcards when you're ready.",
	}]);
	const { data, isLoading, isError: isDocumentError } = useDocumentQuery(id);
	const regenerateSummary = useRegenerateSummaryMutation(id);
	const doc = useMemo(() => (data ? formatDocument(data) : null), [data]);

	const openGeneration = (type: "test" | "flashcard") => {
		setGenerationType(type);
		setIsGenerationOpen(true);
	};

	const handleSend = () => {
		const trimmed = input.trim();
		if (!trimmed) return;
		setMessages((p) => [
			...p,
			{ id: `u-${Date.now()}`, role: "user", content: trimmed },
			{ id: `a-${Date.now()}`, role: "assistant", content: "Once the RAG pipeline is active, Studify will respond with grounded answers from your document. This is a design preview." },
		]);
		setInput("");
	};

	const handleRegenerateSummary = async () => {
		if (!id) return;
		try {
			await regenerateSummary.mutateAsync();
		} catch (error) {
			console.error("Failed to regenerate summary:", error);
		}
	};

	if (isLoading) {
		return (
			<div className='flex h-full flex-col bg-background relative overflow-hidden'>
				<div className='max-w-3xl mx-auto w-full px-6 md:px-10 py-12 space-y-12'>
					<div className='flex items-center gap-3 opacity-20'>
						<div className='w-8 h-8 rounded-full bg-muted animate-pulse' />
						<div className='w-20 h-4 bg-muted rounded animate-pulse' />
					</div>
					<div className='space-y-4'>
						<div className='w-3/4 h-12 bg-muted rounded-2xl animate-pulse' />
						<div className='w-1/2 h-4 bg-muted rounded-lg animate-pulse' />
					</div>
					<div className='space-y-6 pt-12'>
						<div className='w-full h-32 bg-muted/30 rounded-3xl animate-pulse' />
						<div className='w-full h-48 bg-muted/20 rounded-3xl animate-pulse' />
					</div>
				</div>
			</div>
		);
	}

	if (!doc || isDocumentError) {
		return (
			<div className='flex h-full items-center justify-center bg-background'>
				<div className='text-center space-y-4'>
					<p className='text-sm text-muted-foreground'>Document not found.</p>
					<Button variant='outline' onClick={() => navigate("/documents")} className='rounded-full'>Back to library</Button>
				</div>
			</div>
		);
	}

	const isProcessing = doc.status === "analyzing";
	const isError = doc.status === "error";

	return (
		<div className='flex h-full bg-background flex-col relative'>
			<ScrollArea className='flex-1'>
				<div className='max-w-3xl mx-auto px-6 md:px-10 py-8 pb-32 space-y-8'>

					{/* Back nav */}
					<div className='flex items-center gap-3'>
						<Button variant='outline' size='icon' onClick={() => navigate("/documents")} className='rounded-full h-8 w-8 border-border/40'>
							<ArrowLeft className='size-4' />
						</Button>
						<p className='text-xs text-muted-foreground font-medium'>Library</p>
					</div>

					{/* Decorative header blur */}
					<div className='absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-orange/5 to-transparent pointer-events-none -z-10' />
					
					{/* Title block */}
					<div className='space-y-2 relative'>
						<h1 className='text-3xl md:text-5xl font-serif text-foreground leading-[1.1] break-all md:break-words'>{doc.title}</h1>
						<div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-medium'>
							<span>{doc.size}</span>
							{doc.pages && <><span>·</span><span>{doc.pages} pages</span></>}
							<span>·</span>
							<span>Uploaded {doc.uploadedAt}</span>
						</div>
					</div>

					{/* Processing banner */}
					{isProcessing && (
						<Card className='border-border/30 bg-card/60 backdrop-blur-sm shadow-soft relative overflow-hidden'>
							<div className='absolute inset-0 bg-gradient-to-r from-brand-violet/10 via-transparent to-brand-orange/10 pointer-events-none' />
							<div className='relative p-6 space-y-4'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-3'>
										<div className='w-8 h-8 rounded-2xl bg-brand-orange/10 flex items-center justify-center'>
											<Clock className='size-4 text-brand-orange' />
										</div>
										<div>
											<p className='text-sm font-medium text-foreground'>Indexing document</p>
											<p className='text-xs text-muted-foreground'>Chunking, embedding, and building your knowledge graph</p>
										</div>
									</div>
									<span className='text-xs text-muted-foreground'>{doc.progress}%</span>
								</div>
								<div className='h-1 w-full bg-border/30 rounded-full overflow-hidden'>
									<motion.div className='h-full bg-brand-orange rounded-full' initial={{ width: 0 }} animate={{ width: `${doc.progress}%` }} transition={spring} />
								</div>
							</div>
						</Card>
					)}

					{isError && (
						<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
							<Card className='border-destructive/20 bg-destructive/5 shadow-soft overflow-hidden group'>
								<div className='absolute inset-0 bg-gradient-to-r from-destructive/5 to-transparent' />
								<div className='flex items-center gap-4 p-6 relative'>
									<div className='w-10 h-10 rounded-2xl bg-destructive/10 flex items-center justify-center shrink-0 border border-destructive/20'>
										<AlertCircle className='size-5 text-destructive animate-pulse' />
									</div>
									<div>
										<p className='text-sm font-black text-destructive uppercase tracking-widest'>Processing failed</p>
										<p className='text-xs text-destructive/70 mt-1 font-medium'>An error occurred during indexing. Please try re-uploading the document.</p>
									</div>
								</div>
							</Card>
						</motion.div>
					)}

					{!isProcessing && !isError && (
						<motion.section 
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className='space-y-12'
						>
							{/* AI Summary — Integrated style */}
							<div className='space-y-8 relative'>
								<div className='flex items-center gap-4'>
									<div className='h-px flex-1 bg-border/50' />
									<div className='flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-muted/20 backdrop-blur-sm'>
										<span className='text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground'>
											Content Analysis
										</span>
									</div>
									<div className='h-px flex-1 bg-border/50' />
								</div>

								{doc.summary ? (
									<div className='space-y-6'>
										<Typewriter 
											text={doc.summary} 
											className="prose prose-sm md:prose-base dark:prose-invert max-w-none"
										/>
										<div className='p-6 rounded-3xl bg-card/40 border border-border/40 backdrop-blur-sm shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
											<p className='font-serif text-base leading-relaxed text-muted-foreground italic'>
												"This AI-generated summary highlights core processes and exam-relevant patterns."
											</p>
											<Button 
												variant="ghost" 
												size="sm" 
												onClick={handleRegenerateSummary}
												className="rounded-xl h-9 px-4 text-xs font-bold gap-2 text-muted-foreground hover:text-brand-orange hover:bg-brand-orange/10 transition-all shrink-0"
											>
												<RefreshCcw className="size-3.5" />
												Refresh
											</Button>
										</div>
									</div>
								) : (
									<div className='space-y-6'>
										<p className='font-serif text-xl md:text-2xl leading-relaxed text-foreground/90 selection:bg-brand-orange/20'>
											This document has been successfully indexed and is being processed for semantic understanding. 
											<span className='text-muted-foreground/60 transition-opacity hover:opacity-100'> 
												{" "}Our RAG pipeline is mapping definitions, key mechanisms, and high-yield concepts for your next assessment.
											</span>
										</p>
										<div className='p-6 rounded-3xl bg-card/40 border border-border/40 backdrop-blur-sm shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
											<p className='font-serif text-base leading-relaxed text-muted-foreground italic'>
												"AI-generated summaries highlight core processes and exam-relevant patterns in real-time."
											</p>
											{doc.processed && (
												<Button 
													variant="ghost" 
													size="sm" 
													onClick={handleRegenerateSummary}
													className="rounded-xl h-9 px-4 text-xs font-bold gap-2 text-muted-foreground hover:text-brand-orange hover:bg-brand-orange/10 transition-all shrink-0"
												>
													<RefreshCcw className="size-3.5" />
													Generate Summary
												</Button>
											)}
										</div>
									</div>
								)}
							</div>

							{/* How Studify uses this */}
							<motion.div 
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.4 }}
								className='pt-8 border-t border-border/50'
							>
								<h3 className='text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-2'>
									<div className='w-1 h-1 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(255,111,32,0.8)]' />
									Strategic Integration
								</h3>
								<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
									{[
										{ title: "Retrieval", desc: "Chunked and embedded into our semantic vector space." },
										{ title: "Assessments", desc: "RAG-powered prompts for grounded questions." },
										{ title: "Recall", desc: "Flashcard generation focusing on high-yield traps." },
									].map((item, i) => (
										<div key={i} className='space-y-2 group'>
											<h4 className='text-[10px] font-black uppercase tracking-widest text-foreground/80 group-hover:text-brand-orange transition-colors'>
												{item.title}
											</h4>
											<p className='text-xs text-muted-foreground leading-relaxed font-serif italic'>
												{item.desc}
											</p>
										</div>
									))}
								</div>
							</motion.div>
							</motion.section>
						)}
					</div>
				</ScrollArea>

			{/* Floating Action Bar */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.2 }}
				className='fixed inset-x-0 bottom-24 md:bottom-10 md:left-1/2 md:-translate-x-1/2 md:w-auto z-40 flex justify-center px-4 pointer-events-none'>
				<div className='flex items-center gap-1 bg-card/95 backdrop-blur-xl border border-border/40 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] p-1.5 pointer-events-auto max-w-full overflow-x-auto overflow-y-hidden hide-scrollbar'>
					{[
						{ label: "Flashcards", icon: Layers, action: () => openGeneration("flashcard") },
						{ label: "Test", icon: GraduationCap, action: () => openGeneration("test") },
						{ label: "Share", icon: Share2, action: () => setIsShareOpen(true) },
						{ label: "Chat", icon: MessageCircle, action: () => setIsChatOpen(!isChatOpen) },
					].map(({ label, icon: Icon, action }) => (
						<button key={label} onClick={action}
							className='flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all whitespace-nowrap'>
							<Icon className='size-3.5' />{label}
						</button>
					))}
				</div>
			</motion.div>

			{/* Chat panel */}
			{isChatOpen && (
				<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={spring}
					className='fixed bottom-[104px] md:bottom-24 md:right-10 inset-x-4 md:inset-x-auto md:w-80 bg-card/98 backdrop-blur-2xl border border-border/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 flex flex-col overflow-hidden h-[50vh] md:h-96'>
					<div className='px-4 py-3 border-b border-border/30 flex items-center justify-between bg-muted/20'>
						<p className='text-xs font-medium text-foreground'>Ask about this doc</p>
						<button onClick={() => setIsChatOpen(false)} className='text-muted-foreground hover:text-foreground transition-colors text-xs'>close</button>
					</div>
					<div className='flex-1 overflow-y-auto p-3 space-y-2'>
						{messages.map((m) => (
							<div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
								<div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${m.role === "user" ? "bg-foreground text-background" : "bg-muted/50 text-foreground border border-border/30"}`}>
									{m.content}
								</div>
							</div>
						))}
					</div>
					<div className='p-3 border-t border-border/30 flex gap-2'>
						<Input value={input} onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSend()}
							placeholder='Ask anything…' className='h-8 text-xs bg-background border-border/40 rounded-xl' />
						<button onClick={handleSend} className='h-8 px-3 rounded-xl bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-all shrink-0'>
							Send
						</button>
					</div>
				</motion.div>
			)}

			<GenerationModal isOpen={isGenerationOpen} onClose={() => setIsGenerationOpen(false)} initialType={generationType} documentId={id} />
			<ShareDialog isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} resourceTitle={doc?.title} shareUrl={`https://studify.ai/share/${id}`} />
		</div>
	);
};

export default DocumentDetailPage;
