import { GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (user) {
    navigate('/');
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
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md space-y-8 relative z-10 text-center">
        <div className="mx-auto bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-200 mb-6">
          <GraduationCap className="text-white w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">EduCast</h1>
          <p className="text-slate-500 font-medium">Educational Institution Governance Portal</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 space-y-6">
          <div className="space-y-4">
             <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col gap-2 items-center text-center">
                <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest">Enterprise Access</p>
                <p className="text-sm text-slate-600">Please use your university-affiliated Google Workspace account to continue.</p>
             </div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold flex items-center justify-center gap-3 hover:border-indigo-600 hover:bg-slate-50 transition-all shadow-xl shadow-slate-100 group disabled:opacity-50"
          >
            {isLoggingIn ? (
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            ) : (
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
            )}
            <span className="text-slate-900">Sign in with Google</span>
            {!isLoggingIn && <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />}
          </button>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-center gap-4">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i+10}`} className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trusted by 50+ Institutions</p>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          By continuing, you agree to EduCast's <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}

