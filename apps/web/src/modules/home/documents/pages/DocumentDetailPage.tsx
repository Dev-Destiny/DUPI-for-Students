import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
	FileText,
	ArrowLeft,
	Sparkles,
	Layers,
	MessageCircle,
	Clock,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";
import { Button, Card, ScrollArea, Input } from "@dupi/ui";

const MOCK_DOCS = [
	{
		id: "1",
		title: "Biology Chapter 12.pdf",
		size: "3.2MB",
		pages: 24,
		status: "processed" as const,
		uploadedAt: "2 hours ago",
		type: "pdf",
	},
	{
		id: "2",
		title: "Organic Chem Intro.docx",
		size: "5.1MB",
		pages: null,
		status: "analyzing" as const,
		progress: 67,
		uploadedAt: "Processing",
		type: "docx",
	},
	{
		id: "3",
		title: "History Essay Draft.pdf",
		size: "1.2MB",
		pages: 8,
		status: "error" as const,
		uploadedAt: "Yesterday",
		type: "pdf",
	},
] as const;

type MockDoc = (typeof MOCK_DOCS)[number];

interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
}

const DocumentDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			id: "welcome",
			role: "assistant",
			content:
				"I'm your DUPI study copilot. Ask me anything about this document, or generate a test or flashcards when you're ready.",
		},
	]);

	const doc: MockDoc | undefined = useMemo(
		() => MOCK_DOCS.find((d) => d.id === id),
		[id],
	);

	const isProcessing = doc?.status === "analyzing";
	const isError = doc?.status === "error";

	const handleSend = () => {
		const trimmed = input.trim();
		if (!trimmed) return;

		const userMessage: ChatMessage = {
			id: `user-${Date.now()}`,
			role: "user",
			content: trimmed,
		};

		const assistantMessage: ChatMessage = {
			id: `assistant-${Date.now()}`,
			role: "assistant",
			content:
				"Once the RAG pipeline is wired, this is where DUPI will answer with grounded explanations from your document. For now, this is a design preview.",
		};

		setMessages((prev) => [...prev, userMessage, assistantMessage]);
		setInput("");
	};

	if (!doc) {
		return (
			<div className='flex h-full items-center justify-center bg-background font-grotesk'>
				<div className='text-center space-y-4'>
					<p className='text-sm text-muted-foreground'>
						This document could not be found.
					</p>
					<Button
						variant='outline'
						onClick={() => navigate("/documents")}
						className='rounded-full text-xs font-black tracking-widest'
					>
						Go back to library
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='flex h-full bg-background font-grotesk'>
			<div className='flex-1 flex flex-col min-w-0'>
				<ScrollArea className='flex-1'>
					<div className='max-w-6xl mx-auto px-6 py-6 space-y-6 md:space-y-8'>
						<div className='flex items-center justify-between gap-4'>
							<div className='flex items-center gap-3'>
								<Button
									variant='outline'
									size='icon'
									onClick={() => navigate("/documents")}
									className='rounded-full h-8 w-8 border-border'
								>
									<ArrowLeft className='size-4' />
								</Button>
								<div>
									<p className='text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground'>
										Document
									</p>
									<div className='flex items-center gap-2'>
										<h1 className='text-xl md:text-2xl font-black text-foreground font-serif'>
											{doc.title}
										</h1>
									</div>
									<div className='mt-1 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground/80 font-black uppercase tracking-widest'>
										<span>{doc.size}</span>
										{doc.pages && (
											<>
												<span className='size-1 rounded-full bg-border' />
												<span>{doc.pages} pages</span>
											</>
										)}
										<span className='size-1 rounded-full bg-border' />
										<span>{doc.uploadedAt}</span>
									</div>
								</div>
							</div>
							<div className='hidden md:flex items-center gap-2'>
								<Button
									variant='outline'
									size='sm'
									className='rounded-full text-[11px] font-black tracking-widest border-border'
								>
									Open original
								</Button>
							</div>
						</div>

						{isProcessing && (
							<Card className='relative overflow-hidden border-border/70 bg-gradient-to-br from-brand-violet/25 via-background to-brand-orange/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'>
								<div className='pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-brand-orange/40 blur-3xl opacity-40' />
								<div className='pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-brand-violet/40 blur-3xl opacity-40' />
								<div className='relative px-6 py-6 md:px-8 md:py-7 space-y-5'>
									<div className='flex items-center justify-between gap-4'>
										<div className='flex items-center gap-3'>
											<div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-black/40 text-brand-orange'>
												<Clock className='size-5' />
											</div>
											<div>
												<p className='text-xs font-black uppercase tracking-[0.2em] text-brand-orange'>
													Processing document
												</p>
												<p className='text-sm text-muted-foreground font-medium'>
													We&apos;re chunking, embedding, and indexing this file so
													questions stay grounded in your content.
												</p>
											</div>
										</div>
										<span className='hidden md:inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-semibold text-muted-foreground/80'>
											<Clock className='size-3' />
											<small>~ a few moments</small>
										</span>
									</div>

									<div className='space-y-3'>
										<div className='flex items-center justify-between text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground/80'>
											<span>Indexing progress</span>
											<span>{doc.progress ?? 0}%</span>
										</div>
										<div className='h-2 w-full overflow-hidden rounded-full bg-black/40'>
											<motion.div
												className='h-full rounded-full bg-gradient-to-r from-brand-orange via-brand-gold to-brand-violet shadow-[0_0_18px_rgba(255,111,32,0.6)]'
												initial={{ width: 0 }}
												animate={{ width: `${doc.progress ?? 0}%` }}
												transition={{ type: "spring", stiffness: 200, damping: 30 }}
											/>
										</div>
										<div className='flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground/80'>
											<span className='inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-0.5'>
												<span className='size-1.5 rounded-full bg-brand-orange animate-pulse' />
												<span>Embedding key concepts</span>
											</span>
											<span className='inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-0.5'>
												<span className='size-1.5 rounded-full bg-emerald-400' />
												<span>Safe to leave — we&apos;ll cache everything</span>
											</span>
										</div>
									</div>
								</div>
							</Card>
						)}

						{isError && (
							<Card className='border-destructive/40 bg-destructive/10'>
								<div className='flex items-center gap-3 px-5 py-4'>
									<div className='flex h-9 w-9 items-center justify-center rounded-full bg-destructive/15 text-destructive'>
										<AlertCircle className='size-5' />
									</div>
									<div>
										<p className='text-sm font-semibold text-destructive'>
											We hit an issue processing this document.
										</p>
										<p className='text-xs text-destructive/90'>
											Try re-uploading or using a cleaner PDF export. In the full app,
											you&apos;ll see detailed error diagnostics here.
										</p>
									</div>
								</div>
							</Card>
						)}

						{!isProcessing && !isError && (
							<div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)] gap-6 md:gap-8'>
								<div className='space-y-6'>
									<Card className='border-border bg-card/90 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.6)]'>
										<div className='flex items-center justify-between px-5 pt-5 pb-2'>
											<div className='flex items-center gap-2'>
												<div className='flex h-8 w-8 items-center justify-center rounded-xl bg-brand-violet/20 text-brand-orange'>
													<FileText className='size-4' />
												</div>
												<div>
													<p className='text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground'>
														AI summary
													</p>
													<p className='text-xs text-muted-foreground'>
														High-level overview of this document.
													</p>
												</div>
											</div>
										</div>
										<div className='px-5 pb-5 space-y-3 text-sm leading-relaxed text-muted-foreground'>
											<p>
												This is a summary placeholder. When the RAG pipeline is active,
												DUPI will condense your document into a concise, exam-focused
												overview: core definitions, mechanisms, and relationships.
											</p>
											<p>
												For biology chapters, think key processes, diagrams, and
												pathways. For essays, think thesis, arguments, and supporting
												evidence. The goal here is to give learners a fast mental map
												before they dive into practice questions.
											</p>
										</div>
									</Card>

									<Card className='border-border bg-card/90 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.6)] flex flex-col h-[360px] md:h-[420px]'>
										<div className='flex items-center justify-between px-5 pt-4 pb-2'>
											<div className='flex items-center gap-2'>
												<div className='flex h-8 w-8 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange'>
													<MessageCircle className='size-4' />
												</div>
												<div>
													<p className='text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground'>
														Ask DUPI about this doc
													</p>
													<p className='text-xs text-muted-foreground'>
														Questions stay grounded in your uploaded content.
													</p>
												</div>
											</div>
										</div>
										<div className='flex-1 px-4 pb-3'>
											<div className='h-full rounded-2xl border border-border/70 bg-background/70 overflow-hidden flex flex-col'>
												<div className='flex-1 overflow-y-auto px-3 py-3 space-y-3 text-sm'>
													{messages.map((message) => (
														<div
															key={message.id}
															className={`flex ${
																message.role === "user"
																	? "justify-end"
																	: "justify-start"
															}`}
														>
															<div
																className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
																	message.role === "user"
																		? "bg-brand-violet text-white shadow-[0_0_20px_rgba(98,16,159,0.6)]"
																		: "bg-card text-foreground border border-border/70"
																}`}
															>
																{message.content}
															</div>
														</div>
													))}
												</div>
												<div className='border-t border-border/70 bg-background/80 px-3 py-2 flex items-center gap-2'>
													<Input
														value={input}
														onChange={(event) => setInput(event.target.value)}
														onKeyDown={(event) => {
															if (event.key === "Enter") {
																event.preventDefault();
																handleSend();
															}
														}}
														placeholder='Ask a question about this document...'
														className='h-9 text-xs bg-card border-border'
													/>
													<Button
														size='icon'
														variant='outline'
														onClick={handleSend}
														className='h-9 w-9 rounded-full border-border'
													>
														<Sparkles className='size-4 text-brand-orange' />
													</Button>
												</div>
											</div>
										</div>
									</Card>
								</div>

								<div className='space-y-4 lg:space-y-5'>
									<Card className='border-border bg-card/95 backdrop-blur-xl'>
										<div className='px-5 pt-5 pb-4 space-y-3'>
											<p className='text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2'>
												<span className='inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange'>
													<CheckCircle2 className='size-3.5' />
												</span>
												Next actions
											</p>
											<div className='space-y-2.5'>
												<Button
													className='w-full justify-between rounded-2xl bg-brand-orange text-black font-black text-[11px] tracking-[0.18em] hover:bg-brand-orange/90'
													size='lg'
												>
													<span className='flex items-center gap-2'>
														<Sparkles className='size-4' />
														Generate test
													</span>
													<span className='text-[10px] font-semibold'>
														Mixed MCQ + short answer
													</span>
												</Button>
												<Button
													variant='outline'
													className='w-full justify-between rounded-2xl border-border bg-background text-xs font-bold'
													size='lg'
												>
													<span className='flex items-center gap-2'>
														<Layers className='size-4 text-brand-orange' />
														Create flashcards
													</span>
													<span className='text-[10px] text-muted-foreground'>
														Ideal for spaced repetition
													</span>
												</Button>
											</div>
										</div>
									</Card>

									<Card className='border-border bg-card/95 backdrop-blur-xl'>
										<div className='px-5 py-4 space-y-3 text-xs text-muted-foreground'>
											<p className='text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground'>
												How DUPI will use this
											</p>
											<ul className='space-y-2 list-disc list-inside'>
												<li>
													Document is chunked and embedded into a vector store to
													enable fast, semantic retrieval.
												</li>
												<li>
													Test generation uses RAG prompts to create grounded,
													exam-style questions.
												</li>
												<li>
													Flashcards focus on high-yield concepts, definitions, and
													common traps.
												</li>
											</ul>
										</div>
									</Card>
								</div>
							</div>
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};

export default DocumentDetailPage;

