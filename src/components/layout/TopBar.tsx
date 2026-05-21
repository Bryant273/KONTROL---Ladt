import React, { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  FolderSync, 
  ChevronRight,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings as SettingsIcon,
  X,
  History,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { DossierSelectorModal } from '../modals/DossierSelectorModal';

export const TopBar = ({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) => {
  const { selectedDossier, activeEnterprise } = useCompany();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const notifications = [
    { title: 'Dossier Fiscal', desc: 'Le dossier 2026 est maintenant prêt pour la clôture', time: '5m' },
    { title: 'Validation RH', desc: '3 nouveaux bulletins en attente de signature', time: '1h' },
    { title: 'Sync LOGSON', desc: 'Inventaire mis à jour avec succès', time: '2h' },
  ];

  return (
    <header className="h-[70px] bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm/50">
      <div className="flex items-center gap-6">
        <button 
          onClick={onToggle}
          className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-brand rounded-xl transition-all border border-slate-100/50"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live System Time</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-slate-900 tracking-tighter tabular-nums">
                {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {currentTime.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar - Minimal */}
        <div className="hidden xl:flex items-center h-10 w-[240px] bg-slate-50 border border-slate-100 rounded-xl px-4 group focus-within:bg-white focus-within:border-brand/30 transition-all">
          <Search className="w-4 h-4 text-slate-300 group-focus-within:text-brand" />
          <input 
            placeholder="Quantum Search..." 
            className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-600 w-full placeholder:text-slate-300 placeholder:uppercase placeholder:tracking-widest px-3 outline-none shadow-none"
          />
        </div>

        <div className="flex items-center gap-3 pr-4 border-r border-slate-100 relative">
          <button 
            onClick={() => setShowDossierModal(true)} 
            className="group flex items-center gap-3 px-3 h-10 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-900 transition-all duration-300 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center group-hover:bg-brand/20 group-hover:border-brand/30 transition-colors">
              <FolderSync className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand transition-colors" />
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5 group-hover:text-slate-500">Changer Dossier</p>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-none group-hover:text-white truncate max-w-[100px]">{selectedDossier?.filename || 'Sélectionner'}</p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-300 group-hover:text-white transition-colors ml-1 hidden lg:block" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-400 hover:bg-slate-50 hover:text-brand rounded-xl transition-all"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-2 z-[100] overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Flux d'alertes</p>
                    <Link 
                      to="/app/notifications" 
                      onClick={() => setShowNotifications(false)}
                      className="text-[9px] font-black text-brand uppercase underline tracking-widest decoration-brand/30"
                    >
                      Historique
                    </Link>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto p-2 space-y-1">
                    {notifications.map((n, i) => (
                      <div key={i} className="p-4 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all group flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate">{n.title}</p>
                            <span className="text-[8px] font-black text-slate-300 uppercase shrink-0">{n.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-relaxed line-clamp-2">{n.desc}</p>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="py-20 text-center space-y-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto">
                          <Info className="w-6 h-6" />
                        </div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Aucun événement </p>
                      </div>
                    )}
                  </div>
                  <Link 
                    to="/app/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="block w-full py-4 text-center text-[9px] font-black uppercase text-slate-400 border-t border-slate-50 hover:bg-slate-50 transition-all tracking-widest"
                  >
                    Voir toutes les notifications
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-2xl transition-all group border border-transparent hover:border-slate-100"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              {activeEnterprise?.logo ? (
                <img src={activeEnterprise.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#09090b] text-white font-black text-xs uppercase">
                  {activeEnterprise?.name?.[0] || 'U'}
                </div>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none truncate max-w-[100px] italic">Administrateur</p>
              <p className="text-[9px] font-black text-slate-900 uppercase tracking-tight mt-1 truncate max-w-[120px]">
                {user?.displayName || activeEnterprise?.name || user?.email?.split('@')[0] || 'Utilisateur'}
              </p>
            </div>
            <ChevronDown className={cn("w-3.5 h-3.5 text-slate-300 transition-transform", showProfileMenu ? "rotate-180" : "")} />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 overflow-hidden z-[100]"
              >
                <div className="px-5 py-4 border-b border-slate-50 mb-2">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none italic">Session Active</p>
                  <p className="text-[11px] font-bold text-slate-900 truncate">{user?.email}</p>
                </div>
                <div className="space-y-1">
                  <Link to="/app/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-4 px-4 py-3 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 hover:text-brand transition-all">
                    <User className="w-4 h-4" /> Profil Utilisateur
                  </Link>
                  <Link to="/app/admin/actions" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-4 px-4 py-3 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 hover:text-brand transition-all">
                    <History className="w-4 h-4" /> Actions
                  </Link>
                  <Link to="/app/admin/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-4 px-4 py-3 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 hover:text-brand transition-all">
                    <SettingsIcon className="w-4 h-4" /> Paramètres Système
                  </Link>
                  <div className="h-px bg-slate-50 mx-2 my-2" />
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-rose-50 transition-all text-left"
                  >
                    <LogOut className="w-4 h-4" /> Terminer Session
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <DossierSelectorModal 
        isOpen={showDossierModal} 
        onClose={() => setShowDossierModal(false)} 
      />
    </header>
  );
};
