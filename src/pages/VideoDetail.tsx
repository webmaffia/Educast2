import { ArrowLeft, Download, Share2, Trash2, Clock, CheckCircle, Loader2, User as UserIcon, BookOpen, AlertCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AVATARS } from '../constants';

export function VideoDetail() {
  const { id } = useParams();

  const { data: video, isLoading } = useQuery({
    queryKey: ['video', id],
    queryFn: async () => {
      const res = await axios.get(`/api/videos/${id}`, {
        headers: { 'x-institution-id': 'oxford-1' }
      });
      return res.data;
    },
    refetchInterval: (query) => {
      return query.state.data?.status === 'COMPLETED' ? false : 3000;
    }
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-24 text-slate-400 gap-4">
      <Loader2 className="w-12 h-12 animate-spin" />
      <p className="font-bold">Retrieving video instance...</p>
    </div>
  );

  if (!video) return <div>Video not found</div>;

  const selectedAvatar = AVATARS.find(a => a.id === video.avatarId);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
            <Trash2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all">
            <Share2 className="w-5 h-5" />
          </button>
          <a
            href={video.outputUrl}
            download={`${video.title.replace(/\s+/g, '_')}.mp4`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/10 ${!video.outputUrl ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <Download className="w-4 h-4" />
            Download MP4
          </a>
        </div>
      </div>

      {video.status === 'COMPLETED' && !video.heygenVideoId && (
        <div className="bg-blue-600/10 border border-blue-600/20 p-5 rounded-2xl flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold tracking-tight leading-none">Simulation Environment</p>
            <p className="text-xs leading-relaxed max-w-2xl opacity-70">
              Real-time AI video rendering requires a production license. A high-quality <strong>sample video</strong> has been generated to demonstrate the user workflow.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Player Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black aspect-video rounded-[32px] overflow-hidden shadow-2xl relative border-[12px] border-card-bg group">
             {video.status === 'COMPLETED' ? (
               <video 
                 src={video.outputUrl} 
                 controls 
                 playsInline
                 className="w-full h-full object-contain"
               />
             ) : (
               <div className="absolute inset-0 flex items-center justify-center bg-black">
                 <div className="text-center space-y-8 max-w-sm px-6">
                    <div className="relative inline-block">
                      <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20 backdrop-blur-sm">
                        <Loader2 className="text-blue-500 w-10 h-10 animate-spin" />
                      </div>
                      {selectedAvatar && (
                        <img src={selectedAvatar.previewImageUrl} className="absolute inset-0 w-24 h-24 rounded-full object-cover opacity-20 filter grayscale" />
                      )}
                    </div>
                    <div className="space-y-4">
                      <p className="font-black tracking-[0.2em] uppercase text-[10px] opacity-80">Renderer: {video.status}</p>
                      <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden border border-border-subtle">
                        <div 
                          className="bg-blue-500 h-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                          style={{ width: `${video.progress}%` }} 
                        />
                      </div>
                      <p className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest">{video.progress}% Complete</p>
                    </div>
                 </div>
               </div>
             )}
          </div>

          <div className="bg-card-bg p-10 rounded-3xl border border-border-subtle shadow-xl space-y-8 text-[var(--text-primary)]">
            <div className="flex items-center justify-between border-b border-border-subtle pb-8">
               <div className="space-y-2">
                 <div className="flex items-center gap-3">
                   <h2 className="text-4xl font-black tracking-tight">{video.title}</h2>
                   <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded border ${video.heygenVideoId ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                     {video.heygenVideoId ? 'Real Synthesis' : 'Simulated'}
                   </span>
                 </div>
                 <p className="text-[var(--text-secondary)] font-mono text-[9px] uppercase tracking-widest leading-none">Instance_ID: {video.id}</p>
               </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-500">
                <BookOpen className="w-4 h-4" />
                <span className="font-bold text-[11px] uppercase tracking-wider">Presenter Script</span>
              </div>
              <div className="relative">
                <div className="absolute -left-5 top-0 bottom-0 w-1 bg-blue-500 rounded-full opacity-50 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <p className="text-xl leading-relaxed font-medium italic pl-4 opacity-90">
                  "{video.content}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Avatar Profile */}
          <div className="bg-card-bg p-8 rounded-3xl border border-border-subtle shadow-xl space-y-8">
             <h3 className="font-bold text-[var(--text-secondary)] flex items-center gap-2 text-[11px] uppercase tracking-[0.15em]">
               <UserIcon className="w-4 h-4 text-blue-500" />
               Presenter
             </h3>
             <div className="flex items-center gap-5 p-5 bg-black/5 rounded-2xl border border-border-subtle">
               <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border-subtle shadow-lg shrink-0">
                  <img src={selectedAvatar?.previewImageUrl} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
               </div>
               <div>
                  <p className="font-bold text-lg leading-none">{selectedAvatar?.name || 'Standard AI'}</p>
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-black leading-none mt-2">
                    {selectedAvatar?.gender === 'FEMALE' ? 'Female' : 'Male'} Model
                  </p>
               </div>
             </div>
             <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
               <p className="text-[11px] leading-relaxed font-medium opacity-70">
                 Trained on domain-specific academic vocabularies for expert technical delivery.
               </p>
             </div>
          </div>

          <div className="bg-card-bg p-8 rounded-3xl border border-border-subtle shadow-xl space-y-6">
            <h3 className="font-bold text-[var(--text-secondary)] flex items-center gap-2 text-[11px] uppercase tracking-[0.15em]">
              <Clock className="w-4 h-4 text-blue-500" />
              Instance Details
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Status', value: video.status, color: video.status === 'COMPLETED' ? 'text-green-500 bg-green-500/10 border-green-500/20' : 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
                { label: 'Progress', value: `${video.progress}%` },
                { label: 'Engine', value: 'AIS-CLOUD-V1' },
                { label: 'Timestamp', value: new Date(video.createdAt).toLocaleDateString() },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between pb-3 border-b border-border-subtle last:border-0 last:pb-0">
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] opacity-60 uppercase tracking-widest">{item.label}</span>
                  <span className={`text-[9px] font-mono font-bold ${item.color || 'bg-black/5 text-[var(--text-secondary)]'} px-2 py-0.5 rounded uppercase`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-telemetry-bg p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden border border-border-subtle">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
             <div className="flex items-center justify-between relative z-10">
               <h3 className="font-black text-[10px] uppercase tracking-[0.25em] text-blue-500/60">Telemetry Logs</h3>
               <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/30" />
               </div>
             </div>
             <div className="font-mono text-[9px] text-blue-500 space-y-2 bg-black/5 p-5 rounded-2xl border border-border-subtle backdrop-blur-xl relative z-10">
                <p className="opacity-40">[{new Date().toISOString().split('T')[1]}] SYS_KERNEL: OK</p>
                <p className="opacity-70">[{new Date().toISOString().split('T')[1]}] SHAKE_SECURE: READY</p>
                <p className="text-[var(--text-primary)]">[{new Date().toISOString().split('T')[1]}] {video.status === 'QUEUED' ? 'QUEUE_IDLE' : 'S_THREAD_ACTIVE'}</p>
                <p className="text-blue-500 font-bold">[{new Date().toISOString().split('T')[1]}] V_MODEL: {selectedAvatar?.name?.toUpperCase()}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

