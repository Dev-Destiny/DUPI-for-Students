import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CTA: FC = () => {
  return (
    <section className="py-24 bg-brand-violet text-white overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="header-font text-5xl md:text-6xl mb-8 leading-tight uppercase tracking-tighter">
            Join thousands of students<br />studying smarter.
          </h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto flex justify-center mb-8"
          >
            <div className="relative group inline-block">
              {/* Dashed border moving along path */}
              <div className="absolute -inset-1.5 rounded-full pointer-events-none">
                <svg className="absolute inset-0 w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
                  <rect
                    width="100%" height="100%" rx="38" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeDasharray="12 12"
                    className="text-white/40 group-hover:text-white transition-colors duration-300 [animation-play-state:paused] group-hover:[animation-play-state:running] animate-[dash-flow_1s_linear_infinite]"
                  />
                </svg>
              </div>
              
              {/* Core button */}
              <Link to="/waitlist" className="block w-full">
                <button className="relative w-full overflow-hidden bg-[#FFF0E6] text-brand-orange hover:bg-white transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 px-10 h-16 text-xl font-bold rounded-full shadow-lg">
                  <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">diamond</span>
                  <span>Create Your First Test</span>
                </button>
              </Link>
            </div>
          </motion.div>
          
          {/* Mastery Metrics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 max-w-2xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <span className="text-3xl md:text-4xl font-black mb-1 block tracking-tighter">1.2M+</span>
                <motion.div 
                  className="absolute -top-1 -right-4 w-2 h-2 bg-emerald-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60">Concepts Mastered</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <span className="text-3xl md:text-4xl font-black mb-1 block tracking-tighter">98%</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60">Score Improvement</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center col-span-2 md:col-span-1"
            >
              <span className="text-3xl md:text-4xl font-black mb-1 block tracking-tighter">24/7</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60">AI Study Support</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Background Blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/20 blur-[100px] rounded-full" />
    </section>
  );
};

export default CTA;
