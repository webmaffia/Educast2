import { Video as VideoIcon, Clock, CheckCircle, AlertCircle, Plus, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { VideoStatus } from '../types';

export function Dashboard() {
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const res = await axios.get('/api/videos', {
        headers: { 'x-institution-id': 'oxford-1' }
      });
      return res.data;
    },
    refetchInterval: 3000, // Poll every 3 seconds for the progress
  });

  const stats = [
    { name: 'Total Videos', value: videos.length.toString(), icon: VideoIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'Processing', value: videos.filter((v: any) => v.status !== VideoStatus.COMPLETED && v.status !== VideoStatus.FAILED).length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Completed', value: videos.filter((v: any) => v.status === VideoStatus.COMPLETED).length.toString(), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Institution Quota', value: '60%', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Videos Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
             <h2 className="font-bold text-slate-900 text-lg">Production Pipeline</h2>
             <p className="text-xs text-slate-500 font-medium italic">Auto-refreshing status from render cloud...</p>
          </div>
          <Link
            to="/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Task
          </Link>
        </div>

        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-4">
             <Loader2 className="w-8 h-8 animate-spin" />
             <p className="text-sm font-medium">Syncing with orchestration server...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="p-12 text-center space-y-4">
             <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <VideoIcon className="text-slate-300 w-8 h-8" />
             </div>
             <div>
                <p className="text-slate-900 font-bold">No videos found</p>
                <p className="text-sm text-slate-500">Start by creating your first educational video.</p>
             </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest">
                  <th className="px-6 py-4 font-black">Video Instance</th>
                  <th className="px-6 py-4 font-black">Current Status</th>
                  <th className="px-6 py-4 font-black">Progress</th>
                  <th className="px-6 py-4 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {videos.map((v: any) => (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden border border-slate-800 shadow-inner">
                           <VideoIcon className="text-white/20 w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{v.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{v.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="px-6 py-4">
                       <div className="space-y-1.5 w-32">
                          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                             <div 
                                className="bg-indigo-500 h-full transition-all duration-1000" 
                                style={{ width: `${v.progress}%` }} 
                             />
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 tabular-nums">{v.progress}%</p>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/video/${v.id}`} className="inline-flex items-center gap-1 text-slate-400 hover:text-indigo-600 transition-all font-bold text-xs uppercase tracking-widest">
                        Inspect
                        <Plus className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: VideoStatus }) {
  const configs = {
    [VideoStatus.COMPLETED]: { color: 'text-emerald-700 bg-emerald-50 border-emerald-100', icon: CheckCircle, label: 'Ready' },
    [VideoStatus.FAILED]: { color: 'text-rose-700 bg-rose-50 border-rose-100', icon: AlertCircle, label: 'Failed' },
    [VideoStatus.PROCESSING]: { color: 'text-indigo-700 bg-indigo-50 border-indigo-100', icon: Loader2, label: 'Processing', animate: true },
    [VideoStatus.RENDERING]: { color: 'text-amber-700 bg-amber-50 border-amber-100', icon: Loader2, label: 'Rendering', animate: true },
    [VideoStatus.QUEUED]: { color: 'text-slate-600 bg-slate-50 border-slate-100', icon: Clock, label: 'Queued' },
    [VideoStatus.DRAFT]: { color: 'text-slate-400 bg-white border-slate-100', icon: Plus, label: 'Draft' },
  } as any;

  const config = configs[status] || configs[VideoStatus.DRAFT];
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${config.color}`}>
      <config.icon className={`w-3 h-3 ${config.animate ? 'animate-spin' : ''}`} />
      {config.label}
    </span>
  );
}
