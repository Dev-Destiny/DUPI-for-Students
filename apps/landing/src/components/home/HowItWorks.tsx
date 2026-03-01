import { type FC } from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: "cloud_upload",
    title: "1. Upload",
    description: "Upload your PDFs, slides, or even messy handwritten notes.",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: "psychology",
    title: "2. Generate",
    description: "Our AI identifies key concepts and generates smart questions.",
    color: "bg-brand-violet/10 text-brand-violet"
  },
  {
    icon: "military_tech",
    title: "3. Master",
    description: "Take the interactive test and master the material instantly.",
    color: "bg-brand-gold/20 text-[#B8860B]"
  },
];

const HowItWorks: FC = () => {
  const springConfig = { type: "spring", stiffness: 400, damping: 30 };

  return (
    <section className="py-24 bg-[#f8faf9]" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={springConfig}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-24"
        >
          <h2 className="header-font text-4xl md:text-6xl mb-4 text-slate-900 leading-tight uppercase tracking-tight">Effortless Mastery</h2>
          <p className="text-slate-500 font-medium text-lg">Three steps to academic excellence.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line (Desktop) */}
          <div className="hidden md:block absolute top-[20%] left-[15%] right-[15%] h-[1px] border-t border-dashed border-slate-200 -z-0" />
          
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ ...springConfig, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative z-10 text-center group"
            >
              <motion.div 
                className={`w-20 h-20 ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:shadow-md transition-shadow duration-300 relative`}
                whileHover={{ y: -10, rotate: index % 2 === 0 ? 5 : -5 }}
                transition={springConfig}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300 -z-10" />
                <span className="material-symbols-outlined text-4xl font-light">{step.icon}</span>
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 tracking-tight">{step.title}</h3>
              <p className="text-slate-500 font-medium max-w-[250px] mx-auto leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
