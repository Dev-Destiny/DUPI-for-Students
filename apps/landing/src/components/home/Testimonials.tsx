import { type FC } from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Med Student @ Stanford",
    content: "DUPI turned my 400-page pathology textbook into quizzes I actually enjoy doing. Saved my finals week.",
  },
  {
    name: "Marcus Johnson",
    role: "Law Student @ Yale",
    content: "The case study generation is scarily accurate. It generates scenarios that actually test application, not just memory.",
  },
  {
    name: "Dr. Emily Alcott",
    role: "Professor of Biology",
    content: "I recommend DUPI to all my students. It forces them to engage with the material actively instead of just highlighting.",
  },
  {
    name: "David Park",
    role: "Computer Science Major",
    content: "I use it for my lecture slides. The instant feedback helps me clarify concepts immediately after class.",
  },
  {
    name: "Jessica Wu",
    role: "High School Teacher",
    content: "Great for generating quick exit tickets for my AP classes. Saves me hours of prep time.",
  },
];

const Testimonials: FC = () => {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
        <h2 className="header-font text-4xl md:text-5xl mb-4 uppercase tracking-tight text-slate-900">Loved by learners</h2>
        <p className="text-slate-600">Join the thousands of students acing their exams.</p>
      </div>

      <div className="flex flex-col gap-8 opacity-80 hover:opacity-100 transition-opacity duration-500">
        {/* Row 1: Left to Right (appears as Right to Left visually if we move x negative) 
            Standard marquee moves content LEFT.
        */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-6 pl-6"
            animate={{ x: "-50%" }}
            transition={{
              ease: "linear",
              duration: 40,
              repeat: Infinity,
            }}
            style={{ width: "max-content" }}
          >
            {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="w-80 md:w-96 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between"
              >
                <p className="text-slate-700 mb-6 leading-relaxed">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-brand-violet flex items-center justify-center text-white font-bold text-lg">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2: Right to Left (appears as Left to Right visually if we move x from negative to 0) 
            To move RIGHT, we start at -50% and go to 0%.
        */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-6 pl-6"
            initial={{ x: "-50%" }}
            animate={{ x: "0%" }}
            transition={{
              ease: "linear",
              duration: 40,
              repeat: Infinity,
            }}
            style={{ width: "max-content" }}
          >
            {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="w-80 md:w-96 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between"
              >
                <p className="text-slate-700 mb-6 leading-relaxed">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold to-brand-violet flex items-center justify-center text-white font-bold text-lg">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
