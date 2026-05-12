import { GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await login();
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-dashboard-bg flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <div className="text-center space-y-4">
          <div className="mx-auto bg-card-bg border border-border-subtle w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
            <GraduationCap className="text-[var(--text-primary)] w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">EduCast</h1>
          <p className="text-[var(--text-secondary)] font-medium">Enterprise Learning Orchestration Portal</p>
        </div>

        <div className="bg-card-bg p-10 rounded-3xl border border-border-subtle shadow-2xl space-y-8">
          <div className="space-y-2 text-center">
             <h2 className="text-xl font-bold text-[var(--text-primary)]">Welcome back</h2>
             <p className="text-sm text-[var(--text-secondary)] opacity-70">Please sign in with your institution account.</p>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full py-4 bg-white text-black hover:bg-gray-100 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all group disabled:opacity-50 shadow-lg shadow-black/5"
          >
            {isLoggingIn ? (
              <Loader2 className="w-5 h-5 animate-spin text-black" />
            ) : (
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
            )}
            <span className="text-black">Sign in with Google</span>
            {!isLoggingIn && <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />}
          </button>

          <div className="pt-6 border-t border-border-subtle flex items-center justify-center gap-4">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                   <div key={i} className="w-6 h-6 rounded-full border-2 border-card-bg bg-black/10 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i+20}`} className="w-full h-full object-cover" />
                   </div>
                ))}
             </div>
             <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest leading-none mt-1">Trusted by 50+ Global Institutions</p>
          </div>
        </div>

        <p className="text-center text-[11px] text-[var(--text-secondary)] px-8">
          By signing in, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </motion.div>
    </div>
  );
}

