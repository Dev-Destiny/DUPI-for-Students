import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	FileText,
	Search,
	Plus,
	MoreVertical,
	Layers,
	Filter,
} from "lucide-react";
import { Button, Input, ScrollArea } from "@dupi/ui";
import { DocumentCard } from "../components/DocumentCard";
import { DocumentsSidebar } from "../components/DocumentsSidebar";
import { UploadModal } from "../components/UploadModal";
import { documentService } from "@/services/document.service";

interface DocumentData {
	id: string;
	title: string;
	size: string;
	pages: number | null;
	status: string;
	uploadedAt: string;
	type: string;
	progress?: number;
}
const DocumentsPage: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [view, setView] = useState<"grid" | "list">("grid");
	const [documents, setDocuments] = useState<DocumentData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

	const fetchDocuments = async () => {
		try {
			setIsLoading(true);
			const docs = await documentService.getDocuments();
			const formatted = docs.map((doc: any) => ({
				id: doc.id,
				title: doc.title,
				size: doc.fileSizeBytes 
					? (doc.fileSizeBytes / 1024 / 1024).toFixed(1) + "MB" 
					: "Unknown",
				pages: null,
				status: doc.processed 
					? "processed" 
					: (doc.processingError ? "error" : "analyzing"),
				uploadedAt: new Date(doc.createdAt).toLocaleDateString(),
				type: doc.title.split('.').pop() || "doc",
				progress: doc.processed ? 100 : 50,
			}));
			setDocuments(formatted);
		} catch (error) {
			console.error("Failed to fetch documents:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchDocuments();
	}, []);

	const filteredDocs = documents.filter((doc) =>
		doc.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleUploadDocument = () => {
		setIsUploadModalOpen(true);
	};

	return (
		<div className='flex h-full bg-background overflow-hidden font-grotesk'>
			{/* Main Content Area */}
			<div className='flex-1 flex flex-col min-w-0'>
				<ScrollArea className='flex-1'>
					<div className='p-8 max-w-6xl mx-auto space-y-8'>
						{/* Header Section */}
						<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
							<div>
								<h1 className='text-4xl font-black text-foreground tracking-tight font-serif'>
									Document{" "}
									<span className='text-brand-orange'>
										Library.
									</span>
								</h1>
								<p className='text-muted-foreground text-sm mt-1 font-medium italic opacity-80'>
									Manage your study materials and generate AI
									assessments.
								</p>
							</div>

							<Button 
								onClick={handleUploadDocument}
								className='h-11 rounded-full px-6 gap-2 font-bold shadow-lg shadow-brand-orange/10 transition-all hover:scale-105 active:scale-95'
							>
								<Plus className='size-4' />
								Upload Document
							</Button>
						</div>

						{/* Filter & Actions Bar */}
						<div className='flex flex-col sm:flex-row gap-3 items-center justify-between p-2 bg-card border border-border rounded-2xl shadow-sm'>
							<div className='relative w-full sm:w-80 group'>
								<Search className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-brand-orange transition-colors' />
								<Input
									placeholder='Search your library...'
									className='pl-10 h-10 rounded-xl border-transparent bg-muted/30 focus:bg-muted/50 focus:ring-0 focus:border-border transition-all text-xs font-bold uppercase tracking-wider'
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
								/>
							</div>

							<div className='flex items-center gap-2'>
								<button className='flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors'>
									<Filter className='size-3.5' />
									Filter
								</button>
								<div className='h-4 w-px bg-border' />
								<div className='flex bg-muted p-1 rounded-lg'>
									<button
										onClick={() => setView("grid")}
										className={`p-1.5 rounded-md transition-all ${view === "grid" ? "bg-card shadow-sm text-brand-orange" : "text-muted-foreground"}`}
									>
										<Layers className='size-3.5' />
									</button>
									<button
										onClick={() => setView("list")}
										className={`p-1.5 rounded-md transition-all ${view === "list" ? "bg-card shadow-sm text-brand-orange" : "text-muted-foreground"}`}
									>
										<MoreVertical className='size-3.5' />
									</button>
								</div>
							</div>
						</div>

						{/* Documents Grid */}
						{isLoading ? (
							<div className='flex items-center justify-center py-24'>
								<p className='text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse'>Loading Documents...</p>
							</div>
						) : (
							<motion.div
								layout
								className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
							>
								<AnimatePresence>
									{filteredDocs.map((doc) => (
										<DocumentCard key={doc.id} doc={doc} />
									))}
								</AnimatePresence>
							</motion.div>
						)}

						{/* Empty State (If needed) */}
						{!isLoading && filteredDocs.length === 0 && (
							<div className='flex flex-col items-center justify-center py-24 text-center space-y-5'>
								<div className='w-24 h-24 bg-muted rounded-full flex items-center justify-center shadow-inner'>
									<FileText className='size-10 text-muted-foreground/30' />
								</div>
								<div className='space-y-2'>
									<h3 className='text-foreground font-black uppercase tracking-widest'>
										No documents yet
									</h3>
									<p className='text-muted-foreground text-sm font-medium'>
										Upload your first document to start
										studying.
									</p>
								</div>
								<Button
									variant='outline'
									className='rounded-full font-black uppercase tracking-widest text-[10px] h-11 px-8 mt-4'
								>
									Learn How it Works
								</Button>
							</div>
						)}
					</div>
				</ScrollArea>
			</div>

			<DocumentsSidebar />
			
			<UploadModal 
				isOpen={isUploadModalOpen} 
				onClose={() => setIsUploadModalOpen(false)} 
				onUploadComplete={() => {
					fetchDocuments();
				}}
			/>
		</div>
	);
};

export default DocumentsPage;
