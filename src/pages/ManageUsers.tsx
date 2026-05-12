import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Search, MoreHorizontal, Shield, Mail, Check, X } from 'lucide-react';

interface UserAccess {
  id: string;
  name: string;
  email: string;
  role: string;
  canCreateAvatars: boolean;
  canEditSubjects: boolean;
  canDeleteVideos: boolean;
}

export function ManageUsers() {
  const [users, setUsers] = useState<UserAccess[]>([
    { id: '1', name: 'Rahul Singh', email: 'r.singh@univ.edu', role: 'Super Admin', canCreateAvatars: true, canEditSubjects: true, canDeleteVideos: true },
    { id: '2', name: 'Meena Kapoor', email: 'm.kapoor@univ.edu', role: 'User', canCreateAvatars: false, canEditSubjects: true, canDeleteVideos: false },
    { id: '3', name: 'Ankit Tiwari', email: 'a.tiwari@univ.edu', role: 'User', canCreateAvatars: true, canEditSubjects: false, canDeleteVideos: false },
  ]);

  const togglePermission = (userId: string, permission: keyof UserAccess) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId && typeof u[permission] === 'boolean') {
        return { ...u, [permission]: !u[permission] };
      }
      return u;
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">Access Control</h1>
          <p className="text-[var(--text-secondary)] font-medium">Granular permissions for your institutional department.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/10">
          Invite Faculty Member
        </button>
      </div>

      <div className="bg-card-bg border border-border-subtle rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-border-subtle bg-black/5 flex items-center justify-between">
          <div className="relative w-72">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
             <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-11 pr-4 py-2.5 bg-black/5 border border-border-subtle rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
             />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mr-2">Quick Filter:</span>
            <button className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Active</button>
            <button className="px-3 py-1 bg-black/5 text-[var(--text-secondary)] border border-border-subtle rounded-full text-[10px] font-black uppercase tracking-widest">Admins</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] border-b border-border-subtle bg-black/5">
                <th className="px-8 py-5">Colleague</th>
                <th className="px-8 py-5 text-center">Avatar Creation</th>
                <th className="px-8 py-5 text-center">Subject Management</th>
                <th className="px-8 py-5 text-center">Media Deletion</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50">
              {users.map((user, i) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-black/5 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-500/20">
                         {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold leading-tight group-hover:text-blue-500 transition-colors">{user.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-3 h-3 text-[var(--text-secondary)]" />
                          <span className="text-[var(--text-secondary)] text-[11px] font-medium">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <PermissionToggle 
                        active={user.canCreateAvatars} 
                        onClick={() => togglePermission(user.id, 'canCreateAvatars')} 
                      />
                    </div>
                  </td>
                  
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <PermissionToggle 
                        active={user.canEditSubjects} 
                        onClick={() => togglePermission(user.id, 'canEditSubjects')} 
                      />
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <PermissionToggle 
                        active={user.canDeleteVideos} 
                        onClick={() => togglePermission(user.id, 'canDeleteVideos')} 
                      />
                    </div>
                  </td>

                  <td className="px-8 py-6 text-right">
                     <button className="p-2 hover:bg-black/10 rounded-lg transition-colors text-[var(--text-secondary)]">
                       <MoreHorizontal className="w-4 h-4" />
                     </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 space-y-3">
            <Shield className="w-6 h-6 text-blue-500" />
            <h3 className="font-bold text-sm">Security Invariant</h3>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Permission changes are propagated across all institutional nodes within 300ms. Revoking access terminates active rendering sessions immediately.
            </p>
         </div>
      </div>
    </div>
  );
}

function PermissionToggle({ active, onClick }: { active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
        active ? 'bg-blue-600' : 'bg-black/20'
      }`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
        active ? 'right-1 bg-white text-blue-600' : 'left-1 bg-gray-500 text-transparent'
      }`}>
        {active && <Check className="w-2.5 h-2.5" />}
      </div>
    </button>
  );
}
