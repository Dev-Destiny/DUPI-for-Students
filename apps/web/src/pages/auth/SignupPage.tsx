import { type FC, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User as UserIcon, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@dupi/ui/components/ui/button";
import { Input } from "@dupi/ui/components/ui/input";
import { 
  signupSchema, 
  type SignupInput 
} from "@dupi/shared";
import { useAuthStore } from "../../store/auth.store";
import AuthLayout from "../../layouts/AuthLayout";

const SignupPage: FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
    },
  });

  const password = watch("password", "");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: SignupInput) => {
    try {
      await signup(data);
      navigate("/dashboard");
    } catch (err) {
      // Error is handled by the store
    }
  };

  // Password strength logic
  const requirements = useMemo(() => [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "At least one number", met: /\d/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ], [password]);

  const strength = useMemo(() => {
    const metCount = requirements.filter(r => r.met).length;
    if (metCount === 0) return { label: "Weak", color: "bg-red-500", width: "33%" };
    if (metCount < 3) return { label: "Medium", color: "bg-brand-gold", width: "66%" };
    return { label: "Strong", color: "bg-emerald-500", width: "100%" };
  }, [requirements]);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 30 }
    },
  };

  return (
    <AuthLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="mt-2 text-muted-foreground">
            Start mastering your subjects with AI today.
          </p>
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium flex justify-between items-center"
            >
              <span>{error}</span>
              <button 
                type="button"
                onClick={clearError} 
                className="hover:text-red-800 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Social Buttons */}
        <motion.div variants={itemVariants} className="flex gap-3 mb-6">
          <Button
            asChild
            type="button"
            variant="outline"
            className="flex-1 h-11 rounded-xl gap-2 text-sm"
          >
            <motion.button
              whileHover={{ y: -2, scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </motion.button>
          </Button>
          <Button
            asChild
            type="button"
            variant="outline"
            className="flex-1 h-11 rounded-xl gap-2 text-sm"
          >
            <motion.button
              whileHover={{ y: -2, scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </motion.button>
          </Button>
        </motion.div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-white px-3 text-muted-foreground/50 font-bold">
              Secure email registration
            </span>
          </div>
        </motion.div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <motion.div variants={itemVariants} className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <label htmlFor="signup-name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Full Name
              </label>
              {errors.displayName && (
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-tight">
                  {errors.displayName.message}
                </span>
              )}
            </div>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-orange transition-colors" />
              <Input
                id="signup-name"
                placeholder="John Doe"
                {...register("displayName")}
                className="pl-11 h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-brand-orange/5 focus:border-brand-orange transition-all"
              />
            </div>
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants} className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <label htmlFor="signup-email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Email
              </label>
              {errors.email && (
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-tight">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-orange transition-colors" />
              <Input
                id="signup-email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className="pl-11 h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-brand-orange/5 focus:border-brand-orange transition-all"
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants} className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <label htmlFor="signup-password" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-orange transition-colors" />
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="pl-11 pr-11 h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-brand-orange/5 focus:border-brand-orange transition-all"
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-orange transition-colors"
                whileTap={{ scale: 0.8 }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </motion.button>
            </div>

            {/* Password Hints */}
            <AnimatePresence>
              {password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Strength: {strength.label}</span>
                      <span className="text-[10px] font-black text-brand-orange">{strength.width}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${strength.color}`} 
                        initial={{ width: 0 }}
                        animate={{ width: strength.width }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {requirements.map((req, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${req.met ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                            {req.met ? <Check className="w-2.5 h-2.5 text-white" /> : <div className="w-1 h-1 bg-white rounded-full" />}
                          </div>
                          <span className={`text-[10px] font-bold ${req.met ? 'text-slate-600' : 'text-slate-400'}`}>{req.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Submit */}
          <motion.div variants={itemVariants} className="pt-2">
            <Button
              asChild
              type="submit"
              disabled={isLoading}
              className="w-full h-13 rounded-full font-bold text-base shadow-md group"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Account
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </motion.button>
            </Button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.p variants={itemVariants} className="mt-6 text-center text-xs text-slate-500 leading-relaxed">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-slate-900 font-bold hover:text-brand-orange transition-colors">Terms</Link>
          {" "}and{" "}
          <Link to="/privacy" className="text-slate-900 font-bold hover:text-brand-orange transition-colors">Privacy Policy</Link>.
        </motion.p>
        
        <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-slate-500">
          Have an account?{" "}
          <Link to="/login" className="text-brand-orange hover:text-primary font-bold transition-colors">
            Sign In
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
};

export default SignupPage;
