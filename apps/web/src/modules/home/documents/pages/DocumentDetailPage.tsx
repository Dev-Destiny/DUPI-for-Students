import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Layers, GraduationCap, Share2, MessageCircle } from "lucide-react";
import { Button, Card, ScrollArea, Input } from "@dupi/ui";
import { documentService } from "@/services/document.service";
import { GenerationModal } from "@/components/modals/GenerationModal";
import { ShareDialog } from "@/components/modals/ShareDialog";

const spring = { type: "spring", stiffness: 260, damping: 30 };

interface ChatMessage { id: string; role: "user" | "assistant"; content: string; }

const DocumentDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [input, setInput] = useState("");
	const [doc, setDoc] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isGenerationOpen, setIsGenerationOpen] = useState(false);
	const [generationType, setGenerationType] = useState<"test" | "flashcard">("test");
	const [isShareOpen, setIsShareOpen] = useState(false);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([{
		id: "welcome", role: "assistant",
		content: "I'm your DUPI study copilot. Ask me anything about this document, generate a test, or create flashcards when you're ready.",
	}]);

	const openGeneration = (type: "test" | "flashcard") => {
		setGenerationType(type);
		setIsGenerationOpen(true);
	};

	useEffect(() => {
		if (!id) return;
		(async () => {
			try {
				setIsLoading(true);
				const data = await documentService.getDocumentById(id);
				setDoc({
					...data,
					size: data.fileSizeBytes ? (data.fileSizeBytes / 1024 / 1024).toFixed(1) + " MB" : "Unknown",
					status: data.processed ? "processed" : (data.processingError ? "error" : "analyzing"),
					uploadedAt: new Date(data.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
					progress: data.processed ? 100 : 50,
				});
			} catch { /* handle silently */ }
			finally { setIsLoading(false); }
		})();
	}, [id]);

	const handleSend = () => {
		const trimmed = input.trim();
		if (!trimmed) return;
		setMessages((p) => [
			...p,
			{ id: `u-${Date.now()}`, role: "user", content: trimmed },
			{ id: `a-${Date.now()}`, role: "assistant", content: "Once the RAG pipeline is active, DUPI will respond with grounded answers from your document. This is a design preview." },
		]);
		setInput("");
	};

	if (isLoading) {
		return (
			<div className='flex h-full items-center justify-center bg-background'>
				<p className='text-xs font-medium text-muted-foreground animate-pulse'>Opening document…</p>
			</div>
		);
	}

	if (!doc) {
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
						<Card className='border-destructive/20 bg-destructive/5 shadow-soft'>
							<div className='flex items-center gap-3 p-5'>
								<AlertCircle className='size-5 text-destructive shrink-0' />
								<div>
									<p className='text-sm font-medium text-destructive'>Processing failed</p>
									<p className='text-xs text-destructive/80 mt-0.5'>Try re-uploading a cleaner PDF version.</p>
								</div>
							</div>
						</Card>
					)}

					{!isProcessing && !isError && (
						<>
							{/* AI Summary — book-reader style */}
							<Card className='bg-card border-border/30 shadow-soft rounded-3xl overflow-hidden'>
								<div className='px-8 py-6 border-b border-border/30'>
									<div className='flex items-center gap-2 mb-1'>
										<span className='text-[10px] font-black uppercase tracking-widest text-muted-foreground'>AI Summary</span>
									</div>
									<CheckCircle2 className='size-4 text-emerald-500' />
								</div>
								<div className='px-8 py-6'>
									<p className='font-serif text-base leading-loose text-foreground/90 max-w-prose'>
										This document has been indexed and is ready for study. When the RAG pipeline is active, you'll see a high-level summary here — covering core definitions, key mechanisms, and the most exam-relevant concepts.
									</p>
									<p className='font-serif text-base leading-loose text-foreground/70 mt-4 max-w-prose'>
										For biology chapters: key processes, diagrams, and molecular pathways. For essays: thesis, arguments, and supporting evidence. For technical docs: architecture, patterns, and gotchas.
									</p>
								</div>
							</Card>

							{/* How DUPI uses this */}
							<div className='px-2'>
								<h3 className='font-serif text-lg text-muted-foreground mb-3'>How DUPI uses this document</h3>
								<ul className='space-y-2'>
									{[
										"Chunked and embedded into a vector store for semantic retrieval",
										"Tests use RAG prompts to create grounded, exam-style questions",
										"Flashcards target high-yield concepts, definitions, and common traps",
									].map((item) => (
										<li key={item} className='flex items-start gap-3 text-sm text-muted-foreground font-serif leading-relaxed'>
											<span className='mt-2 w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0' />
											{item}
										</li>
									))}
								</ul>
							</div>
						</>
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
			<ShareDialog isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} resourceTitle={doc?.title} shareUrl={`https://dupi.ai/share/${id}`} />
		</div>
	);
};

export default DocumentDetailPage;
