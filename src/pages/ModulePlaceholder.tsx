import { motion } from 'motion/react';
import { LayoutDashboard, Hammer } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModulePlaceholderProps {
  title: string;
}

export function ModulePlaceholder({ title }: ModulePlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center border border-blue-500/20"
      >
        <Hammer className="w-10 h-10 text-blue-500" />
      </motion.div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
        <p className="text-[var(--text-secondary)] max-w-md mx-auto">
          We're currently scaling our enterprise infrastructure. This module will be initialized in the next deployment cycle.
        </p>
      </div>

      <Link 
        to="/" 
        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/10"
      >
        <LayoutDashboard className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
}
