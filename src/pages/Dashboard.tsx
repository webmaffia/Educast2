import { 
  Video as VideoIcon, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Loader2, 
  Users as UsersIcon, 
  UserPlus, 
  Download, 
  Edit2, 
  UserMinus,
  ExternalLink,
  PlusCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { useOutletContext, Link } from 'react-router-dom';

type DashboardContext = {
  currentView: 'admin' | 'user';
};

export function Dashboard() {
  const { currentView } = useOutletContext<DashboardContext>();

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {currentView === 'admin' ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}

function AdminDashboard() {
  const stats = [
    { name: 'Total videos', value: '214', change: '+12 this month', color: 'text-green-500' },
    { name: 'Active users', value: '38', change: '+3 this month', color: 'text-green-500' },
    { name: 'Avatars', value: '9', sub: 'Across 4 depts' },
    { name: 'Minutes generated', value: '1,840', sub: 'of 5,000 quota' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card-bg p-6 rounded-xl border border-border-subtle"
          >
            <p className="text-[13px] text-[var(--text-secondary)] font-medium mb-2">{stat.name}</p>
            <div className="flex flex-col">
              <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
              {stat.change && (
                <span className={`text-[12px] font-medium mt-1 ${stat.color}`}>{stat.change}</span>
              )}
              {stat.sub && (
                <span className="text-[12px] font-medium mt-1 text-gray-500">{stat.sub}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Avatar Library Section */}
      <div className="bg-card-bg rounded-2xl border border-border-subtle p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold">Avatar library</h2>
          <Link to="/avatars" className="flex items-center gap-2 bg-button-bg hover:opacity-80 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
            Manage library <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AvatarCard name="Dr. Priya Sharma" dept="Chemistry · Science dept" initials="DP" bg="bg-blue-900/30 text-blue-400" />
          <AvatarCard name="Prof. Arjun Mehta" dept="Physics · Science dept" initials="PA" bg="bg-green-900/30 text-green-400" />
          
          <Link 
            to="/create-avatar"
            className="border-2 border-dashed border-border-subtle rounded-xl flex flex-col items-center justify-center p-8 text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center mb-3 group-hover:border-gray-400">
               <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold">Create avatar</span>
          </Link>
        </div>
      </div>

      {/* Users Table Section */}
      <div className="bg-card-bg rounded-2xl border border-border-subtle p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-xl font-bold">Users</h2>
          <Link to="/manage-users" className="flex items-center gap-2 bg-button-bg hover:opacity-80 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
            Manage access <UsersIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-border-subtle pb-4">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50">
              <UserRow 
                name="Rahul Singh" 
                email="r.singh@univ.edu" 
                role="Super admin" 
                dept="All depts" 
                status="Active" 
                initials="RS" 
                avatarBg="bg-blue-600/40 text-blue-300"
                roleBg="bg-blue-900/40 text-blue-400 border-blue-800"
              />
              <UserRow 
                name="Meena Kapoor" 
                email="m.kapoor@univ.edu" 
                role="User" 
                dept="Science" 
                status="Active" 
                initials="MK" 
                avatarBg="bg-white/10 text-gray-400"
              />
              <UserRow 
                name="Ankit Tiwari" 
                email="a.tiwari@univ.edu" 
                role="User" 
                dept="Law" 
                status="Inactive" 
                initials="AT" 
                avatarBg="bg-white/10 text-gray-400"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UserDashboard() {
  const stats = [
    { name: 'My videos', value: '18', sub: 'Across 3 subjects' },
    { name: 'Published', value: '14', sub: '4 drafts' },
    { name: 'Total duration', value: '3.2h', sub: 'Content created' },
    { name: 'Last created', value: '2 May', sub: 'Functional Groups' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card-bg p-6 rounded-xl border border-border-subtle"
          >
            <p className="text-[13px] text-[var(--text-secondary)] font-medium mb-1">{stat.name}</p>
            <div className="flex flex-col">
              <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
              <span className="text-[12px] font-medium text-[var(--text-secondary)] mt-1">{stat.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* My Videos Section */}
      <div className="bg-card-bg rounded-2xl border border-border-subtle p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold">My videos</h2>
          <Link to="/create" className="flex items-center gap-2 bg-blue-600 text-white hover:opacity-90 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
            + New video <PlusCircle className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          <VideoRow 
            title="Introduction to Hydroxyl Groups" 
            meta="Organic Chemistry · Ch 2 · 8 min 54 sec" 
            status="Published" 
          />
          <VideoRow 
            title="Carbonyl & Carboxyl Groups" 
            meta="Organic Chemistry · Ch 2 · 11 min 20 sec" 
            status="Published" 
          />
          <VideoRow 
            title="Amines and Amides Explained" 
            meta="Organic Chemistry · Ch 2 · 5 slides" 
            status="Draft" 
          />
        </div>
      </div>

      {/* Available Avatars Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-lg font-bold">Available avatars</h2>
           <span className="text-xs text-gray-500 font-medium">Managed by your admin</span>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="bg-card-bg border border-border-subtle rounded-xl p-3 flex items-center gap-4 w-64">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-500/20">DP</div>
            <div>
              <p className="text-sm font-bold">Dr. Priya Sharma</p>
              <p className="text-[11px] text-[var(--text-secondary)]">Chemistry</p>
            </div>
          </div>
          
          <div className="bg-card-bg border border-border-subtle rounded-xl p-3 flex items-center gap-4 w-64">
            <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center font-bold text-xs shrink-0 border border-green-500/20">PA</div>
            <div>
              <p className="text-sm font-bold">Prof. Arjun Mehta</p>
              <p className="text-[11px] text-[var(--text-secondary)]">Physics</p>
            </div>
          </div>

          <div className="bg-card-bg border border-border-subtle border-dashed rounded-xl p-3 flex items-center gap-4 w-64 text-gray-600">
            <div className="w-10 h-10 rounded-full bg-gray-800 text-gray-600 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold">More coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AvatarCard({ name, dept, initials, bg }: any) {
  return (
    <div className="bg-card-bg border border-border-subtle rounded-xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-all">
      <div className="flex-1 min-h-[160px] flex items-center justify-center bg-black/5">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${bg}`}>
          {initials}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-sm mb-0.5">{name}</h3>
        <p className="text-[11px] font-medium mb-4">{dept}</p>
        <div className="flex gap-2">
          <button className="flex-1 bg-button-bg hover:opacity-80 text-[11px] font-bold py-1.5 rounded-lg transition-all">Edit</button>
          <button className="flex-1 bg-transparent hover:bg-card-bg text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-border-subtle text-[11px] font-bold py-1.5 rounded-lg transition-all">Deactivate</button>
        </div>
      </div>
    </div>
  );
}

function UserRow({ name, email, role, dept, status, initials, avatarBg, roleBg }: any) {
  return (
    <tr className="group hover:bg-button-bg transition-colors">
      <td className="px-4 py-6">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${avatarBg}`}>
             {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight">{name}</span>
            <span className="text-[var(--text-secondary)] text-[11px]">{email}</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-6">
        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${roleBg || 'bg-black/5 text-[var(--text-secondary)] border-border-subtle'}`}>
          {role}
        </span>
      </td>
      <td className="px-4 py-6 text-[var(--text-secondary)] text-[13px]">{dept}</td>
      <td className="px-4 py-6">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className={`text-[12px] font-bold ${status === 'Active' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>{status}</span>
        </div>
      </td>
      <td className="px-4 py-6 text-right">
        <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <span className="text-xs font-bold">Edit</span>
        </button>
      </td>
    </tr>
  );
}

function VideoRow({ title, meta, status }: any) {
  return (
    <div className="flex items-center gap-4 p-4 bg-card-bg hover:bg-button-bg border border-border-subtle rounded-xl transition-all group shadow-sm">
      <div className="w-20 h-12 bg-black/5 rounded-lg flex items-center justify-center shrink-0 border border-border-subtle">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
        <div className="flex flex-col gap-1">
          <div className="w-8 h-1 bg-gray-700 rounded-full" />
          <div className="w-6 h-1 bg-gray-800 rounded-full" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm truncate">{title}</h3>
        <p className="text-[var(--text-secondary)] text-[11px] truncate uppercase tracking-tight">{meta}</p>
      </div>

      <div className="flex items-center gap-4">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
          status === 'Published' 
            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
        }`}>
          {status}
        </span>
        <button className="flex items-center gap-2 bg-button-bg hover:opacity-80 border border-border-subtle px-4 py-1.5 rounded-lg text-xs font-bold transition-all">
          Download
        </button>
      </div>
    </div>
  );
}
