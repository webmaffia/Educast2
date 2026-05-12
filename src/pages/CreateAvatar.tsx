import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  Video, 
  Mic, 
  ShieldCheck,
  AlertCircle,
  Loader2,
  ChevronLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function CreateAvatar() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [avatarName, setAvatarName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setStep(2);
    }, 2000);
  };

  const handleFinalize = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/avatars');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/avatars" className="p-2 hover:bg-black/5 rounded-full transition-colors text-[var(--text-secondary)]">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Create Custom Avatar</h1>
          <p className="text-[var(--text-secondary)] font-medium">Clone your digital likeness for educational delivery.</p>
        </div>
      </div>

      <div className="bg-card-bg border border-border-subtle rounded-3xl overflow-hidden shadow-2xl relative min-h-[500px] flex flex-col">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className={`h-full bg-blue-600 transition-all duration-500 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`} />
        </div>

        <div className="flex-1 p-12">
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Avatar Identity</label>
                  <input 
                    type="text"
                    value={avatarName}
                    onChange={(e) => setAvatarName(e.target.value)}
                    placeholder="e.g. Professor Sarah v2"
                    className="w-full px-5 py-4 bg-black/5 border border-border-subtle rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border-subtle rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-4 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group"
                  >
                    <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleUpload} />
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      {isUploading ? <Loader2 className="w-8 h-8 text-blue-500 animate-spin" /> : <Video className="w-8 h-8 text-blue-500" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Upload Baseline Footage</h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 ml-1 px-4">Record 2 minutes of yourself talking with a neutral background.</p>
                    </div>
                  </div>

                  <div className="bg-black/5 rounded-3xl p-8 space-y-4">
                    <h3 className="font-bold text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      Consent Requirement
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      HeyGen requires a verbal consent statement included at the beginning of your video to prevent unauthorized likeness synthesis.
                    </p>
                    <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                      <p className="text-[11px] font-mono text-blue-400 italic">
                        "I, [Name], hereby authorize EduCast to use my likeness for AI avatar generation..."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full space-y-6 text-center py-12"
            >
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 animate-pulse">
                <Mic className="w-10 h-10 text-green-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tight">Voice Cloning Active</h2>
                <p className="text-[var(--text-secondary)] max-w-sm mx-auto">
                  We've successfully extracted the acoustic signature from your video. Select your primary language for synthesis.
                </p>
              </div>
              
              <div className="flex gap-3">
                 <button className="px-6 py-2 bg-blue-600 rounded-xl font-bold text-sm">English (US)</button>
                 <button className="px-6 py-2 bg-black/10 rounded-xl font-bold text-sm text-[var(--text-secondary)]">Hindi</button>
                 <button className="px-6 py-2 bg-black/10 rounded-xl font-bold text-sm text-[var(--text-secondary)]">Spanish</button>
              </div>

              <button 
                onClick={() => setStep(3)}
                className="mt-8 flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-black text-sm hover:scale-105 transition-all"
              >
                Continue to Finalize
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="aspect-[3/4] bg-black rounded-3xl overflow-hidden border border-border-subtle relative group">
                    <div className="absolute inset-0 flex items-center justify-center">
                       <p className="text-xs text-[var(--text-secondary)] font-mono animate-pulse">RENDERING PREVIEW...</p>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                       <p className="text-sm font-bold text-white bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 shrink-0">
                         {avatarName || 'My New Avatar'}
                       </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6 flex flex-col justify-center">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black">Neural Network Training</h2>
                    <p className="text-sm text-[var(--text-secondary)]">Our synthesis engine will now build the high-fidelity model based on 10,000+ training points from your footage.</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs font-bold text-green-500">
                      <CheckCircle2 className="w-4 h-4" />
                      Liveness verification passed
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-green-500">
                      <CheckCircle2 className="w-4 h-4" />
                      Lipsync mapping synchronized
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-blue-500">
                      <AlertCircle className="w-4 h-4" />
                      Institutional watermark will be applied
                    </div>
                  </div>

                  <button 
                    onClick={handleFinalize}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                    {isProcessing ? 'Initializing Synapse...' : 'Commit to Library'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
