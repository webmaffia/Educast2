import { motion } from 'motion/react';
import { Users2, Plus, MoreHorizontal, Video, AlertCircle, Settings2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AVATARS } from '../constants';

export function Avatars() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">Avatar Library</h1>
          <p className="text-[var(--text-secondary)] font-medium">Manage institutional digital twins and faculty representations.</p>
        </div>
        <Link 
          to="/create-avatar" 
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/10"
        >
          <Plus className="w-4 h-4" />
          Create New Avatar
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {AVATARS.map((avatar, i) => (
          <motion.div
            key={avatar.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-card-bg border border-border-subtle rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-500/30 transition-all flex flex-col"
          >
            <div className="aspect-[4/5] relative overflow-hidden bg-black/5">
              <img 
                src={avatar.previewImageUrl} 
                alt={avatar.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20">
                   <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-black tracking-tight group-hover:text-blue-500 transition-colors">{avatar.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] mt-1">
                  {avatar.gender === 'FEMALE' ? 'Professional Female' : 'Expert Male'}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-button-bg hover:bg-black/10 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest border border-border-subtle transition-all">
                  <Settings2 className="w-3.5 h-3.5" />
                  Config
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-blue-500/5 hover:bg-blue-500/10 text-blue-500 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest border border-blue-500/20 transition-all">
                  <Video className="w-3.5 h-3.5" />
                  Preview
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        <Link 
          to="/create-avatar"
          className="border-2 border-dashed border-border-subtle rounded-3xl flex flex-col items-center justify-center p-12 text-center group hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
        >
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-border-subtle group-hover:border-blue-500/50 flex items-center justify-center mb-4 transition-all">
             <Plus className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-blue-500" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-primary)]">Add Institutional Avatar</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Scale your faculty presence</p>
          </div>
        </Link>
      </div>

      <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-3xl flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
           <p className="text-sm font-bold text-amber-200">Processing Queue Notice</p>
           <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
             New custom avatars require approximately 48 hours for high-fidelity neural training. Once complete, they will appear as "Ready" in this library and be available in the Video Orchestrator.
           </p>
        </div>
      </div>
    </div>
  );
}
