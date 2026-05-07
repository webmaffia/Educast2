import { Shield, Key, Database, Users, Bell, AlertCircle, Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';

export function Settings() {
  const [heygenKey, setHeygenKey] = useState('********************************');

  return (
    <div className="max-w-4xl space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Institution Profile */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Institution Profile</h2>
                <p className="text-sm text-slate-500">Manage your university's global presence.</p>
              </div>
              <div className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-tighter">
                Premium Enterprise
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Institution Name</label>
                  <input readOnly value="Oxford University" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Routing Identifier</label>
                  <input readOnly value="oxford-uni-v1-production" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-400 font-mono text-sm cursor-not-allowed" />
                </div>
              </div>
            </div>
          </div>

          {/* AI Configuration */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">AI & Media Engine</h2>
              <p className="text-sm text-slate-500">Configure your synthesis and rendering providers.</p>
            </div>
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
                      <Key className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">HeyGen API Access</p>
                      <p className="text-xs text-slate-500">Used for avatar synthesis and lip-sync rendering.</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-indigo-600 hover:underline">Revoke Key</button>
                </div>
                <div className="relative">
                  <input 
                    type="password" 
                    value={heygenKey}
                    onChange={(e) => setHeygenKey(e.target.value)}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" 
                    placeholder="Enter your HeyGen API Key..."
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-bold uppercase tracking-widest border border-emerald-100">Verified</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100">
                      <Database className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">S3 Asset Storage</p>
                      <p className="text-xs text-slate-500">Cloud storage for processed MP4 outputs.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Disconnected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-3xl text-white space-y-6 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl font-black" />
             <div className="flex items-center gap-3">
               <div className="p-2 bg-white/10 rounded-lg">
                 <Shield className="w-5 h-5 text-indigo-300" />
               </div>
               <h3 className="font-bold tracking-tight">Security Audit</h3>
             </div>
             <div className="space-y-4">
               <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                 <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mb-1">Last Log Leak Scan</p>
                 <p className="text-lg font-black tracking-tighter text-emerald-400">PASSED</p>
               </div>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                 <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mb-1">Active Sessions</p>
                 <p className="text-lg font-black tracking-tighter">04 LOCAL / 01 REMOTE</p>
               </div>
             </div>
          </div>

          <div className="bg-red-50 border-2 border-red-100/50 p-8 rounded-3xl space-y-6">
             <div className="flex items-center gap-3 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-black text-xs uppercase tracking-widest">Administrative Control</h3>
             </div>
             <div className="space-y-2">
                <p className="text-sm font-bold text-red-900">System Reset</p>
                <p className="text-xs text-red-700/70 leading-relaxed">Wiping institution data will revoke all active rendering sessions and delete the media repository.</p>
             </div>
             <button className="w-full py-4 bg-white border-2 border-red-100 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-xl shadow-red-100/20">
               Initiate Purge Sequence
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

