import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings as SettingsIcon, 
  LogOut, 
  PlusCircle, 
  BarChart3, 
  Layers, 
  Users, 
  Shield, 
  Building2, 
  CreditCard, 
  Key, 
  Database,
  History,
  FileText,
  BookOpen,
  User,
  Users2,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';

type ViewType = 'admin' | 'user';

export function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('admin');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const adminNav = [
    { section: 'OVERVIEW', items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    ]},
    { section: 'CONTENT', items: [
      { name: 'Subjects', icon: Layers, path: '/subjects' },
      { name: 'All videos', icon: FileText, path: '/videos', badge: '214' },
    ]},
    { section: 'AVATARS', items: [
      { name: 'Avatar library', icon: Users2, path: '/avatars' },
      { name: 'Create custom avatar', icon: PlusCircle, path: '/create-avatar' },
      { name: 'HeyGen sync', icon: Database, path: '/sync' },
    ]},
    { section: 'USERS', items: [
      { name: 'Manage users', icon: Users, path: '/manage-users', badge: '2' },
      { name: 'Roles & access', icon: Shield, path: '/roles' },
      { name: 'Departments', icon: Building2, path: '/departments' },
    ]},
    { section: 'SETTINGS', items: [
      { name: 'Institution profile', icon: Building2, path: '/profile' },
      { name: 'Billing & quota', icon: CreditCard, path: '/billing' },
      { name: 'SSO / SAML', icon: Key, path: '/sso' },
      { name: 'LMS integration', icon: Layers, path: '/lms' },
    ]},
  ];

  const userNav = [
    { section: 'MY WORK', items: [
      { name: 'My videos', icon: FileText, path: '/' },
      { name: 'Create new video', icon: PlusCircle, path: '/create' },
      { name: 'Drafts', icon: History, path: '/drafts', badge: '2' },
    ]},
    { section: 'LIBRARY', items: [
      { name: 'Browse subjects', icon: BookOpen, path: '/subjects' },
      { name: 'Browse chapters', icon: Layers, path: '/chapters' },
    ]},
    { section: 'AVATARS', items: [
      { name: 'Manage avatars', icon: Users2, path: '/avatars' },
      { name: 'Create custom avatar', icon: PlusCircle, path: '/create-avatar' },
    ]},
    { section: 'SETTINGS', items: [
      { name: 'Manage users', icon: Users, path: '/manage-users' },
      { name: 'Billing', icon: CreditCard, path: '/billing' },
    ]},
    { section: '', items: [
      { name: 'My profile', icon: User, path: '/settings' },
    ]}
  ];

  const currentNav = currentView === 'admin' ? adminNav : userNav;

  return (
    <div className="flex h-screen bg-dashboard-bg font-sans antialiased transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar-bg border-r border-border-subtle flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter text-[var(--text-primary)]">EduCast</span>
          </div>
        </div>

        <nav className="flex-1 px-3 overflow-y-auto custom-scrollbar pb-6">
          {currentNav.map((section, idx) => (
            <div key={idx} className="mb-6">
              {section.section && (
                <h3 className="px-3 mb-2 text-[10px] font-bold text-[var(--text-secondary)] opacity-70 uppercase tracking-widest">
                  {section.section}
                </h3>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between group px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                          : 'text-[var(--text-secondary)] hover:bg-card-bg/50 hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`} />
                        <span className="text-[13px] font-medium">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${isActive ? 'bg-blue-700 text-white' : 'bg-black/10 text-[var(--text-secondary)]'}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border-subtle">
          <button 
            onClick={() => logout()}
            className="flex items-center gap-3 w-full px-3 py-2 text-[var(--text-secondary)] hover:text-red-500 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[13px] font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Tabs */}
        <header className="h-14 bg-header-bg border-b border-border-subtle flex items-center px-4 shrink-0">
          <div className="flex items-center h-full">
            <button
              onClick={() => setCurrentView('admin')}
              className={`h-full px-6 flex items-center text-sm font-semibold relative transition-colors ${
                currentView === 'admin' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Super admin view
              {currentView === 'admin' && (
                <motion.div 
                  layoutId="activeTab" 
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${theme === 'light' ? 'bg-blue-600' : 'bg-white'}`} 
                />
              )}
            </button>
            <button
              onClick={() => setCurrentView('user')}
              className={`h-full px-6 flex items-center text-sm font-semibold relative transition-colors ${
                currentView === 'user' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              User view
              {currentView === 'user' && (
                <motion.div 
                  layoutId="activeTab" 
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${theme === 'light' ? 'bg-blue-600' : 'bg-white'}`} 
                />
              )}
            </button>
          </div>
          
          <div className="ml-auto flex items-center gap-4">
             <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-card-bg transition-colors"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
             >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[var(--text-secondary)]" />
                ) : (
                  <Moon className="w-4 h-4 text-[var(--text-secondary)]" />
                )}
             </button>
             <div className="h-4 w-px bg-border-subtle mx-2" />
             <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center text-xs font-bold ring-2 ring-border-subtle">
                {user?.email?.substring(0, 2).toUpperCase() || 'JD'}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet context={{ currentView }} />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

