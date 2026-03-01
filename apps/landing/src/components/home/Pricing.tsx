import { type FC } from 'react';
import { Button } from "@dupi/ui/components/ui/button";
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const pricingPlans = [
  {
    name: "Free",
    subtitle: "For casual study sessions.",
    price: "$0",
    period: "/mo",
    features: [
      "3 uploads per month",
      "Basic test generation",
      "24h test history",
    ],
    cta: "Get started",
    featured: false,
    delay: 0,
  },
  {
    name: "Pro",
    subtitle: "For serious exam prep.",
    price: "$9.99",
    period: "/mo",
    features: [
      "Unlimited uploads",
      "Priority AI generation",
      "Advanced analytics",
      "Export to PDF/Word",
    ],
    cta: "Go Premium",
    featured: true,
    delay: 0.1,
  },
  {
    name: "Institution",
    subtitle: "For schools and teams.",
    price: "$19.99",
    period: "/user",
    features: [
      "Admin dashboard",
      "Shared question banks",
      "SSO & LMS integration",
    ],
    cta: "Contact Sales",
    featured: false,
    delay: 0.2,
  },
];

const Pricing: FC = () => {
  const springConfig = { type: "spring", stiffness: 400, damping: 30 };

  return (
    <section className="py-24 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={springConfig}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <h2 className="header-font text-4xl md:text-6xl mb-4 uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Start mastering for free</h2>
          <p className="text-slate-500 font-medium text-lg">Choose the plan that fits your study load.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ ...springConfig, delay: plan.delay }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ 
                y: -15,
                scale: 1.02,
                transition: springConfig
              }}
              className={`p-10 rounded-[3rem] flex flex-col relative ${
                plan.featured
                  ? 'border-2 border-brand-violet bg-white shadow-[0_30px_100px_rgba(98,16,159,0.1)] z-10'
                  : 'border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-colors duration-500'
              } transition-all group`}
            >
              {plan.featured && (
                <motion.div 
                  className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-gold to-yellow-400 text-brand-violet text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, ...springConfig }}
                >
                  Most Popular
                </motion.div>
              )}
              
              <div className="mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.featured ? 'text-brand-violet' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <p className="text-sm font-medium text-slate-400">{plan.subtitle}</p>
              </div>
              
              <div className="text-5xl font-black mb-8 flex items-baseline gap-1 text-slate-900">
                <span>{plan.price}</span>
                <span className="text-lg font-bold text-slate-400">{plan.period}</span>
              </div>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm font-medium text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-base font-bold">check</span>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <motion.button
                onClick={() => toast('Pricing options will be available soon! 🚧', {
                  style: {
                    borderRadius: '100px',
                    background: '#333',
                    color: '#fff',
                  },
                })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={springConfig}
                className="w-full"
              >
                <Button 
                  variant={plan.featured ? "default" : "outline"}
                  className={`w-full py-7 rounded-2xl font-black uppercase tracking-wider text-xs transition-all duration-300 ${
                    plan.featured
                      ? 'bg-brand-violet hover:bg-primary shadow-xl shadow-brand-violet/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-primary/50'
                  }`}
                >
                  {plan.cta}
                </Button>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
