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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
            <Trash2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
            <Share2 className="w-5 h-5" />
          </button>
          <a
            href={video.outputUrl}
            download={`${video.title.replace(/\s+/g, '_')}.mp4`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-shadow shadow-lg shadow-indigo-100 ${!video.outputUrl ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <Download className="w-4 h-4" />
            Download MP4
          </a>
        </div>
      </div>

      {video.status === 'COMPLETED' && !video.heygenVideoId && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-amber-900">Prototype Environment Notice</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              This is a demonstration build. Real-time AI video rendering requires a production license key (e.g., HeyGen, Synthesia). 
              A high-quality <strong>sample video</strong> has been generated to showcase the player interface and user workflow.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Player Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black aspect-video rounded-3xl overflow-hidden shadow-2xl relative border-8 border-slate-900 group">
             {video.status === 'COMPLETED' ? (
               <video 
                 src={video.outputUrl} 
                 controls 
                 playsInline
                 className="w-full h-full object-contain"
               />
             ) : (
               <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                 <div className="text-center space-y-6 max-w-sm px-6">
                    <div className="relative inline-block">
                      <div className="w-24 h-24 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto border border-indigo-600/20">
                        <Loader2 className="text-indigo-500 w-10 h-10 animate-spin" />
                      </div>
                      {selectedAvatar && (
                        <img src={selectedAvatar.previewImageUrl} className="absolute inset-0 w-24 h-24 rounded-full object-cover opacity-20" />
                      )}
                    </div>
                    <div className="space-y-3">
                      <p className="text-white font-black tracking-widest uppercase text-xs">AI Renderer: {video.status}</p>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-full transition-all duration-1000 ease-out" 
                          style={{ width: `${video.progress}%` }} 
                        />
                      </div>
                      <p className="text-white/40 text-[10px] font-mono">{video.progress}% Frame Progress</p>
                    </div>
                 </div>
               </div>
             )}
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-50 pb-6">
               <div className="space-y-1">
                 <div className="flex items-center gap-2">
                   <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{video.title}</h2>
                   <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded border ${video.heygenVideoId ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                     {video.heygenVideoId ? 'Real Synthesis' : 'Simulated'}
                   </span>
                 </div>
                 <p className="text-slate-400 font-mono text-[10px]">OBJECT_ID: {video.id}</p>
               </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 group">
                <BookOpen className="w-4 h-4" />
                <span className="font-bold text-xs uppercase tracking-widest">Presenter Script</span>
              </div>
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500 rounded-full" />
                <p className="text-slate-700 text-lg leading-relaxed font-medium italic pl-4">
                  "{video.content}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Avatar Profile */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
             <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
               <UserIcon className="w-4 h-4 text-indigo-600" />
               Lead Presenter
             </h3>
             <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg shrink-0">
                  <img src={selectedAvatar?.previewImageUrl} className="w-full h-full object-cover" />
               </div>
               <div>
                  <p className="font-bold text-slate-900">{selectedAvatar?.name || 'Standard AI'}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black leading-tight mt-1">
                    Visionary {selectedAvatar?.gender === 'FEMALE' ? 'Female' : 'Male'} Model
                  </p>
               </div>
             </div>
             <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
               <p className="text-[10px] text-indigo-600 leading-relaxed font-medium">
                 This model is trained on domain-specific academic vocabularies to ensure professional delivery of complex technical topics.
               </p>
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Clock className="w-4 h-4 text-indigo-600" />
              Instance Details
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Pipeline Status', value: video.status, color: video.status === 'COMPLETED' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-indigo-600 bg-indigo-50 border border-indigo-100' },
                { label: 'Progress', value: `${video.progress}%` },
                { label: 'Provider ID', value: 'AIS-CLOUD-ENGINE-V1' },
                { label: 'Created At', value: new Date(video.createdAt).toLocaleDateString() },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                  <span className={`text-[10px] font-mono font-bold text-slate-800 ${item.color || ''} px-2 py-0.5 rounded uppercase`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-8 rounded-3xl text-white space-y-6 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
             <div className="flex items-center justify-between">
               <h3 className="font-black text-xs uppercase tracking-[0.2em] text-indigo-400">System Logs</h3>
               <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
               </div>
             </div>
             <div className="font-mono text-[9px] text-indigo-300 space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                <p className="opacity-50 tracking-tighter">[{new Date().toISOString().split('T')[1]}] KERNEL_INIT_OK</p>
                <p className="opacity-80">[{new Date().toISOString().split('T')[1]}] SECURE_HANDSHAKE_READY</p>
                <p className="text-white">[{new Date().toISOString().split('T')[1]}] {video.status === 'QUEUED' ? 'ASSET_QUEUE_PENDING' : 'THREAD_RENDER_ACTIVE'}</p>
                <p className="text-indigo-400">[{new Date().toISOString().split('T')[1]}] AVATAR_SYNC: {selectedAvatar?.name}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

