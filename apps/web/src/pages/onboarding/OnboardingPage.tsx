import { type FC, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronDown, ChevronLeft, FileText, X, Upload, BookOpen, BookMarked, PenLine, ArrowRight } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";

/* ─── helpers ─── */
const slide = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, x: -40, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
};

const FIELDS = [
  "Computer Science", "Medicine", "Law", "Engineering", "Business",
  "Education", "Arts & Humanities", "Natural Sciences", "Social Sciences", "Other",
];

const USE_CASES = [
  { icon: BookOpen, label: "Lecture notes" },
  { icon: BookMarked, label: "Textbook chapters" },
  { icon: PenLine, label: "Study guides" },
];

/* ─── Shared Header ─── */
const OnboardingHeader: FC<{ step: number; onSkip?: () => void; onBack?: () => void }> = ({ step, onSkip, onBack }) => (
  <div className="w-full">
    <header className="flex items-center justify-between px-6 pt-6 pb-4">
      <div className="flex items-center gap-2">
        {onBack ? (
          <button onClick={onBack} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="font-bold text-slate-800 font-grotesk">DUPI</span>
      </div>
      {onSkip && (
        <button onClick={onSkip} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      )}
    </header>

    <div className="px-6 space-y-1">
      <div className="flex justify-between text-xs font-medium text-slate-400">
        <span>Onboarding Progress</span>
        <span>Step {step} of 3</span>
      </div>
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: `${(step - 1) * 33}%` }}
          animate={{ width: `${step * 33.33}%` }}
          transition={{ duration: 0.6, ease: "circOut" }}
          className="h-full rounded-full bg-brand-orange"
        />
      </div>
    </div>
  </div>
);


/* ─── sub-screens ─── */
const WelcomeScreen: FC<{ onNext: () => void; onSkip: () => void }> = ({ onNext, onSkip }) => (
  <motion.div
    key="welcome"
    variants={slide} initial="initial" animate="animate" exit="exit"
    className="flex flex-col min-h-screen bg-background-light relative overflow-hidden"
  >
    <OnboardingHeader step={1} onSkip={onSkip} />

    {/* Decorative dots */}
    <span className="absolute top-32 left-16 w-2 h-2 rounded-full bg-brand-orange/30" />
    <span className="absolute top-48 right-20 w-1.5 h-1.5 rounded-full bg-brand-orange/20" />
    <span className="absolute bottom-40 left-24 w-2 h-2 rounded-full bg-brand-orange/20" />
    <span className="absolute bottom-32 right-16 w-1.5 h-1.5 rounded-full bg-brand-orange/30" />

    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-5 max-w-md">
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight font-grotesk"
        >
          Welcome to DUPI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-slate-500 text-base leading-relaxed"
        >
          Your AI-powered study companion for smarter learning
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="mt-2 inline-flex items-center gap-2 px-10 py-4 rounded-full text-white font-semibold text-base shadow-lg bg-brand-orange"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </div>

    {/* Step dots */}
    <div className="flex justify-center gap-2 pb-10">
      <span className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
      <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
      <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
    </div>
  </motion.div>
);

const ProfileScreen: FC<{
  form: { displayName: string; field: string };
  onChange: (k: string, v: string) => void;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}> = ({ form, onChange, onNext, onSkip, onBack }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <motion.div
      key="profile"
      variants={slide} initial="initial" animate="animate" exit="exit"
      className="flex flex-col min-h-screen bg-background-light"
    >
      <OnboardingHeader step={2} onSkip={onSkip} onBack={onBack} />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-10 space-y-7">
        <h2 className="text-3xl font-bold text-slate-900 text-center font-grotesk">
          Tell us about yourself
        </h2>

        {/* Avatar circle */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 bg-slate-100 flex flex-col items-center justify-center cursor-pointer hover:border-brand-orange transition-colors group">
            <Camera className="w-6 h-6 text-slate-400 group-hover:text-brand-orange transition-colors" />
            <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mt-0.5">Add Photo</span>
          </div>
          <span className="text-xs text-slate-400">Optional</span>
        </div>

        {/* Full Name */}
        <div className="w-full max-w-sm space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
          <input
            value={form.displayName}
            onChange={e => onChange("displayName", e.target.value)}
            placeholder="Alex Johnson"
            className="w-full h-12 px-4 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all"
          />
        </div>

        {/* What are you studying */}
        <div className="w-full max-w-sm space-y-1.5 relative">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">What are you studying?</label>
          <button
            type="button"
            onClick={() => setDropdownOpen(o => !o)}
            className="w-full h-12 px-4 rounded-2xl border border-slate-200 bg-white text-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all"
          >
            <span className={form.field ? "text-slate-800" : "text-slate-300"}>
              {form.field || "Select your field"}
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="absolute z-50 w-full mt-1 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden"
              >
                {FIELDS.map(f => (
                  <li key={f}>
                    <button
                      type="button"
                      onClick={() => { onChange("field", f); setDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-brand-orange/10 transition-colors ${form.field === f ? "text-brand-orange font-semibold" : "text-slate-700"}`}
                    >
                      {f}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="w-full max-w-sm space-y-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={onNext}
            disabled={!form.displayName}
            className="w-full h-13 py-3.5 rounded-full text-white bg-brand-orange font-semibold text-base shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            Continue
          </motion.button>
          <button
            onClick={onSkip}
            className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors py-1"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 pb-8">
        <span className="w-2 h-2 rounded-full bg-slate-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
        <span className="w-2 h-2 rounded-full bg-slate-300" />
      </div>
    </motion.div>
  );
};

const UploadScreen: FC<{ onFinish: () => void; onSkip: () => void; onBack: () => void; isLoading: boolean }> = ({ onFinish, onSkip, onBack, isLoading }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  return (
    <motion.div
      key="upload"
      variants={slide} initial="initial" animate="animate" exit="exit"
      className="flex flex-col min-h-screen bg-background-light"
    >
      <OnboardingHeader step={3} onSkip={onSkip} onBack={onBack} />

      {/* Decorative dots */}
      <span className="absolute top-32 left-10 w-2 h-2 rounded-full bg-brand-orange/20" />
      <span className="absolute top-48 right-14 w-1.5 h-1.5 rounded-full bg-brand-orange/15" />
      <span className="absolute bottom-40 left-8 w-1.5 h-1.5 rounded-full bg-brand-orange/15" />
      <span className="absolute bottom-24 right-10 w-2 h-2 rounded-full bg-brand-orange/20" />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-8 space-y-6">
        <div className="text-center space-y-2 max-w-sm">
          <h2 className="text-3xl font-bold text-slate-900 font-grotesk">
            Upload your first document
          </h2>
          <p className="text-sm text-slate-500">We support PDFs, Word docs, and text files up to 50MB</p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`w-full max-w-sm rounded-3xl border-2 border-dashed cursor-pointer p-10 flex flex-col items-center gap-3 transition-all ${
            dragging
              ? "border-brand-orange bg-brand-orange/5"
              : file
                ? "border-emerald-400 bg-emerald-50"
                : "border-slate-300 bg-white hover:border-brand-orange hover:bg-brand-orange/5"
          }`}
        >
          <input ref={inputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={e => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }} />
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-brand-orange/10">
            {file ? (
              <FileText className="w-7 h-7 text-brand-orange" />
            ) : (
              <Upload className="w-7 h-7 text-brand-orange" />
            )}
          </div>
          {file ? (
            <div className="text-center">
              <p className="font-semibold text-slate-800 text-sm">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <>
              <p className="font-semibold text-slate-700 text-sm text-center">Drag &amp; drop your file here</p>
              <p className="text-xs text-slate-400">or click to browse</p>
              <button
                type="button"
                className="mt-1 px-5 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Select File
              </button>
            </>
          )}
        </div>

        {/* Use cases */}
        <div className="w-full max-w-sm space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Example use cases</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {USE_CASES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600">
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="w-full max-w-sm flex items-center justify-between pt-2">
          <button
            onClick={onSkip}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors font-medium"
          >
            Skip tutorial
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={onFinish}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm shadow-md disabled:opacity-50 transition-all bg-brand-orange"
          >
            {isLoading ? "Setting up..." : "Upload document"}
            {!isLoading && <Upload className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 pb-8">
        <span className="w-2 h-2 rounded-full bg-slate-300" />
        <span className="w-2 h-2 rounded-full bg-slate-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
      </div>
    </motion.div>
  );
};

/* ─── Main Component ─── */
const OnboardingPage: FC = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [step, setStep] = useState(1); // 1=welcome, 2=profile, 3=upload
  const [form, setForm] = useState({ displayName: user?.displayName || "", field: "" });

  const handleChange = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleFinish = async () => {
    try {
      await updateProfile({ displayName: form.displayName, isOnboarded: true, studyField: form.field });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSkip = async () => {
    if (step === 2) {
      setStep(3)
      return
    }
    try {
      await updateProfile({ isOnboarded: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative font-grotesk">
      <AnimatePresence mode="wait">
        {step === 1 && <WelcomeScreen key="welcome" onNext={() => setStep(2)} onSkip={handleSkip} />}
        {step === 2 && (
          <ProfileScreen
            key="profile"
            form={form}
            onChange={handleChange}
            onNext={() => setStep(3)}
            onSkip={handleSkip}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <UploadScreen
            key="upload"
            onFinish={handleFinish}
            onSkip={handleSkip}
            onBack={() => setStep(2)}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingPage;
