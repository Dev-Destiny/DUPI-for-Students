import React, { useState } from "react";
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

// Mock data for demonstration
const MOCK_DOCS = [
	{
		id: "1",
		title: "Biology Chapter 12.pdf",
		size: "3.2MB",
		pages: 24,
		status: "processed",
		uploadedAt: "2 hours ago",
		type: "pdf",
	},
	{
		id: "2",
		title: "Organic Chem Intro.docx",
		size: "5.1MB",
		pages: null,
		status: "analyzing",
		progress: 67,
		uploadedAt: "Processing",
		type: "docx",
	},
	{
		id: "3",
		title: "History Essay Draft.pdf",
		size: "1.2MB",
		pages: 8,
		status: "error",
		uploadedAt: "Yesterday",
		type: "pdf",
	},
	{
		id: "4",
		title: "Psychology Notes.pdf",
		size: "1.8MB",
		pages: 10,
		status: "processed",
		uploadedAt: "2 days ago",
		type: "pdf",
	},
	{
		id: "5",
		title: "Calculus 1 Review.pdf",
		size: "4.5MB",
		pages: 30,
		status: "processed",
		uploadedAt: "3 days ago",
		type: "pdf",
	},
];

const DocumentsPage: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [view, setView] = useState<"grid" | "list">("grid");

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

							<Button className='h-11 rounded-full px-6 gap-2 font-bold shadow-lg shadow-brand-orange/10 transition-all hover:scale-105 active:scale-95'>
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
						<motion.div
							layout
							className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
						>
							<AnimatePresence>
								{MOCK_DOCS.map((doc) => (
									<DocumentCard key={doc.id} doc={doc} />
								))}
							</AnimatePresence>
						</motion.div>

						{/* Empty State (If needed) */}
						{MOCK_DOCS.length === 0 && (
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
		</div>
	);
};

export default DocumentsPage;
