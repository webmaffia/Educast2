import { Shield, Key, Database, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Settings() {
  const [heygenKey, setHeygenKey] = useState('********************************');
  const [apiStatus, setApiStatus] = useState<{heygen: boolean, gemini: boolean} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.config) {
          setApiStatus(data.config);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Institution Profile */}
          <div className="bg-card-bg rounded-3xl border border-border-subtle shadow-xl overflow-hidden">
            <div className="p-8 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Institution Profile</h2>
                <p className="text-sm mt-1 text-[var(--text-secondary)]">Manage your university's global presence.</p>
              </div>
              <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-500 uppercase tracking-widest">
                Premium Enterprise
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">Institution Name</label>
                  <input readOnly value="Oxford University" className="w-full px-4 py-3 bg-black/5 border border-border-subtle rounded-xl outline-none text-[var(--text-primary)] font-bold cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">Routing Identifier</label>
                  <input readOnly value="oxford-uni-v1-production" className="w-full px-4 py-3 bg-black/5 border border-border-subtle rounded-xl outline-none text-[var(--text-secondary)] font-mono text-xs cursor-not-allowed" />
                </div>
              </div>
            </div>
          </div>

          {/* AI Configuration */}
          <div className="bg-card-bg rounded-3xl border border-border-subtle shadow-xl overflow-hidden">
            <div className="p-8 border-b border-border-subtle">
              <h2 className="text-xl font-bold tracking-tight">AI & Media Engine</h2>
              <p className="text-sm mt-1 text-[var(--text-secondary)]">Configure your synthesis and rendering providers.</p>
            </div>
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                      <Key className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-bold">HeyGen API Access</p>
                      <p className="text-xs text-[var(--text-secondary)]">Used for avatar synthesis and lip-sync rendering.</p>
                    </div>
                  </div>
                  <a href="https://app.heygen.com/settings?nav=API" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-500 hover:underline">Get Key</a>
                </div>
                <div className="relative">
                  <input 
                    type="password" 
                    value={heygenKey}
                    onChange={(e) => setHeygenKey(e.target.value)}
                    className="w-full px-4 py-4 bg-black/5 border border-border-subtle rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" 
                    placeholder="Enter your HeyGen API Key..."
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[var(--text-secondary)]" />
                    ) : apiStatus?.heygen ? (
                      <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded font-bold uppercase tracking-widest border border-green-500/20">Active</span>
                    ) : (
                      <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-1 rounded font-bold uppercase tracking-widest border border-red-500/20">Missing</span>
                    )}
                  </div>
                </div>
                {!apiStatus?.heygen && !isLoading && (
                   <p className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                     <AlertCircle className="w-3 h-3" />
                     Please add HEYGEN_API_KEY to your environment variables in AI Studio settings.
                   </p>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-border-subtle">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                      <Database className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-bold">Gemini AI Model</p>
                      <p className="text-xs text-[var(--text-secondary)]">Content analysis and script refinement.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {apiStatus?.gemini ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest leading-none">Healthy</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest leading-none">Missing Key</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-telemetry-bg p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden border border-border-subtle">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
             <div className="flex items-center gap-3 relative z-10">
               <div className="p-2 bg-black/5 rounded-lg border border-border-subtle">
                 <Shield className="w-5 h-5 text-blue-500" />
               </div>
               <h3 className="font-bold tracking-tight">Security Audit</h3>
             </div>
             <div className="space-y-4 relative z-10">
               <div className="p-5 bg-black/5 rounded-2xl border border-border-subtle">
                 <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-2 opacity-60">Last Log Leak Scan</p>
                 <p className="text-xl font-black tracking-tight text-green-500">PASSED</p>
               </div>
               <div className="p-5 bg-black/5 rounded-2xl border border-border-subtle">
                 <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-2 opacity-60">Active Sessions</p>
                 <p className="text-xl font-black tracking-tight text-[var(--text-primary)]">04 LOCAL / 01 REMOTE</p>
               </div>
             </div>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl space-y-6">
             <div className="flex items-center gap-3 text-red-500">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-bold text-[11px] uppercase tracking-[0.15em]">Admin Control</h3>
             </div>
             <div className="space-y-2">
                <p className="text-lg font-bold tracking-tight">System Reset</p>
                <p className="text-sm leading-relaxed opacity-70">Wiping institution data will revoke all active rendering sessions and delete the media repository.</p>
             </div>
             <button className="w-full py-4 bg-transparent border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all">
               Initiate Purge Sequence
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

