import React, { useState } from "react";
import { Card } from "@studify/ui";
import { toast } from "sonner";
import { useAuthStore } from "../../../../store/auth.store";
import { UserPreferences } from "@studify/shared";
import { SliderPill } from "./SliderPill";

interface PreferencesSectionProps {
	isSaving: boolean;
	setIsSaving: (v: boolean) => void;
}

export const PreferencesSection: React.FC<PreferencesSectionProps> = ({ isSaving, setIsSaving }) => {
	const { user, updateSettings } = useAuthStore();
	const [aiTone, setAiTone] = useState<string>((user?.preferences as UserPreferences)?.aiTone || "Academic");
	const [responseLength, setResponseLength] = useState<string>((user?.preferences as UserPreferences)?.responseLength || "Balanced");

	const handleSaveSettings = async () => {
		setIsSaving(true);
		try {
			await updateSettings({
				preferences: { aiTone, responseLength },
			});
			toast.success("Preferences saved.");
		} catch {
			toast.error("Failed to save preferences.");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className='w-full space-y-5'>
			<h2 className='font-serif text-xl text-foreground mb-1'>AI Preferences</h2>
			<p className='text-sm text-muted-foreground mb-6'>Configure how Studify communicates and generates content for you.</p>

			<Card className='p-6 bg-card border-border/40 shadow-soft space-y-6'>
				<div className='space-y-3'>
					<label className='text-sm font-medium text-foreground'>AI Communication Tone</label>
					<SliderPill options={["Academic", "Professional", "Socratic"]} value={aiTone} onChange={setAiTone} />
					<p className='text-xs text-muted-foreground'>
						{aiTone === "Academic" && "Formal, precise, and citation-aware. Best for exam preparation."}
						{aiTone === "Professional" && "Clear, concise, and business-oriented. Best for professional certifications."}
						{aiTone === "Socratic" && "Question-driven and exploratory. Best for deep conceptual understanding."}
					</p>
				</div>
				<div className='space-y-3 pt-4 border-t border-border/40'>
					<label className='text-sm font-medium text-foreground'>Default Response Length</label>
					<SliderPill options={["Brief", "Balanced", "Detailed"]} value={responseLength} onChange={setResponseLength} />
				</div>
				<div className='pt-4 border-t border-border/40 flex justify-end'>
					<button
						onClick={handleSaveSettings}
						disabled={isSaving}
						className='px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all disabled:opacity-60'
					>
						{isSaving ? "Saving..." : "Save Preferences"}
					</button>
				</div>
			</Card>
		</div>
	);
};
