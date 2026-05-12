import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { History, Play, Download, Trash2, Edit, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Drafts() {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/drafts')
      .then(res => res.json())
      .then(data => {
        setDrafts(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">Drafts</h1>
          <p className="text-[var(--text-secondary)] font-medium">Continue your work in progress tutorials.</p>
        </div>
        <div className="p-2 bg-blue-500/10 rounded-full">
           <History className="w-5 h-5 text-blue-500" />
        </div>
      </div>

      <div className="grid gap-4">
        {drafts.map((draft, i) => (
          <motion.div
            key={draft.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-card-bg border border-border-subtle p-6 rounded-2xl hover:border-blue-500/50 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="w-24 h-14 bg-black/5 rounded-xl flex items-center justify-center border border-border-subtle group-hover:bg-blue-500/5 transition-colors">
                 <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold group-hover:text-blue-500 transition-colors">{draft.title}</h3>
                <div className="flex items-center gap-3 text-[var(--text-secondary)] text-xs mt-1">
                  <span className="font-bold uppercase tracking-tight">{draft.meta}</span>
                  <span className="w-1 h-1 bg-border-subtle rounded-full" />
                  <span>Last saved {draft.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
               <button className="p-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-xl hover:bg-black/5">
                 <Trash2 className="w-4 h-4" />
               </button>
               <Link to={`/create`} className="flex items-center gap-2 bg-button-bg hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-border-subtle">
                 <Edit className="w-4 h-4" />
                 Resume
               </Link>
            </div>
          </motion.div>
        ))}
      </div>
      
      {drafts.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-border-subtle rounded-3xl">
           <p className="text-[var(--text-secondary)]">No drafts found. Starting a new video creates a draft automatically.</p>
        </div>
      )}
    </div>
  );
}
