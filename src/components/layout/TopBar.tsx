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
import { getActionLogs, saveActionLog } from '../../lib/auditLogger';

export const TopBar = ({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) => {
  const { selectedDossier, dossiers, setSelectedDossier, activeEnterprise } = useCompany();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Audit Logs modal states
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditStartDate, setAuditStartDate] = useState('');
  const [auditEndDate, setAuditEndDate] = useState('');
  const [auditTypeFilter, setAuditTypeFilter] = useState('');

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
          {/* Direct Dropdown Dossier Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-2.5 h-10 group focus-within:bg-white focus-within:border-brand/35 transition-all">
            <FolderSync className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={selectedDossier?.id || ''}
              onChange={(e) => {
                const d = dossiers.find(x => x.id === e.target.value);
                if (d) {
                  setSelectedDossier(d);
                  saveActionLog(d.id, {
                    type: 'Consultation',
                    desc: 'Dossier actif modifié',
                    details: `Ouverture du dossier comptable : ${d.filename}`
                  });
                }
              }}
              className="bg-transparent border-none text-[10px] font-black text-slate-800 uppercase tracking-wider outline-none cursor-pointer pr-1"
            >
              {dossiers.map(d => (
                <option key={d.id} value={d.id} className="text-xs uppercase">{d.filename}</option>
              ))}
            </select>
          </div>

          {/* Audit Logs Trigger Button */}
          <button 
            onClick={() => setShowAuditModal(true)}
            className="group flex items-center justify-center gap-1.5 px-3 h-10 bg-slate-50 hover:bg-slate-900 border border-slate-100 rounded-xl transition-all shadow-sm cursor-pointer"
            title="Consulter l'historique de journalisation"
          >
            <History className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand transition-colors" />
            <span className="text-[9px] font-black text-slate-500 group-hover:text-white uppercase tracking-widest hidden md:inline-block">Journal d'audit</span>
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

      {/* AUDIT LOGS MODAL */}
      <AnimatePresence>
        {showAuditModal && (
          <div className="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4 font-sans animate-in fade-in duration-305">
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[2.5rem] border border-slate-150 shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                    <span className="text-[10px] font-black text-brand uppercase tracking-[0.2em]">Tracé d'Audit & Historique</span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Journalisation Système</h2>
                  <p className="text-[11px] text-slate-400 font-medium">Suivi complet et traçabilité des actions comptables du dossier courant</p>
                </div>
                <button 
                  onClick={() => setShowAuditModal(false)}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-all border border-transparent hover:border-slate-200"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Filters Toolbar */}
              <div className="p-6 bg-white border-b border-slate-50 shrink-0 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Rechercher par mot clé..." 
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    className="w-full pl-9 h-11 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-brand transition-all"
                  />
                </div>
                
                <div>
                  <select 
                    value={auditTypeFilter}
                    onChange={e => setAuditTypeFilter(e.target.value)}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold text-slate-700 outline-none focus:border-brand cursor-pointer"
                  >
                    <option value="">Tous les types d'actions</option>
                    <option value="Saisie">Saisie Comptable</option>
                    <option value="Création">Création de données</option>
                    <option value="Digitalisation">Digitalisation & Transmissions</option>
                    <option value="Configuration">Configurations Système</option>
                    <option value="Consultation">Consultation d'états</option>
                    <option value="Suppression">Suppression d'écritures</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider shrink-0">Du</span>
                  <input 
                    type="date" 
                    value={auditStartDate}
                    onChange={e => setAuditStartDate(e.target.value)}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs outline-none focus:border-brand font-bold"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider shrink-0">Au</span>
                  <input 
                    type="date" 
                    value={auditEndDate}
                    onChange={e => setAuditEndDate(e.target.value)}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs outline-none focus:border-brand font-bold"
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/20">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[300px]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/30 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        <th className="py-3 px-6">Horodatage</th>
                        <th className="py-3 px-6">Utilisateur</th>
                        <th className="py-3 px-6">Nature</th>
                        <th className="py-3 px-6">Opération</th>
                        <th className="py-3 px-6">Détails de traçabilité</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {getActionLogs(selectedDossier?.id || 'default')
                        .filter(log => {
                          if (auditSearch) {
                            const kw = auditSearch.toLowerCase();
                            return log.desc.toLowerCase().includes(kw) || 
                                   log.details.toLowerCase().includes(kw) || 
                                   log.user.toLowerCase().includes(kw) ||
                                   log.type.toLowerCase().includes(kw);
                          }
                          return true;
                        })
                        .filter(log => {
                          if (auditTypeFilter) {
                            return log.type.toLowerCase() === auditTypeFilter.toLowerCase();
                          }
                          return true;
                        })
                        .filter(log => {
                          if (auditStartDate) {
                            const logD = new Date(log.dateSec);
                            const startD = new Date(auditStartDate);
                            startD.setHours(0,0,0,0);
                            return logD >= startD;
                          }
                          return true;
                        })
                        .filter(log => {
                          if (auditEndDate) {
                            const logD = new Date(log.dateSec);
                            const endD = new Date(auditEndDate);
                            endD.setHours(23,59,59,999);
                            return logD <= endD;
                          }
                          return true;
                        })
                        .map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50/50 transition-all font-sans">
                            <td className="py-4 px-6 text-slate-400 font-medium whitespace-nowrap">
                              <span className="font-bold text-slate-705">{log.date}</span> à {log.time}
                            </td>
                            <td className="py-4 px-6 font-bold text-slate-900">{log.user}</td>
                            <td className="py-4 px-6">
                              <span className={cn(
                                "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest inline-block",
                                log.type === 'Saisie' ? "bg-cyan-50 text-cyan-600" :
                                log.type === 'Digitalisation' ? "bg-purple-50 text-purple-600" :
                                log.type === 'Création' ? "bg-emerald-50 text-emerald-600" :
                                log.type === 'Suppression' ? "bg-rose-50 text-rose-600" :
                                "bg-slate-100 text-slate-600"
                              )}>
                                {log.type}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-bold text-slate-800">{log.desc}</td>
                            <td className="py-4 px-6 text-slate-500 font-medium italic">{log.details}</td>
                          </tr>
                        ))}
                      {getActionLogs(selectedDossier?.id || 'default').filter(log => {
                          if (auditSearch) {
                            const kw = auditSearch.toLowerCase();
                            return log.desc.toLowerCase().includes(kw) || 
                                   log.details.toLowerCase().includes(kw) || 
                                   log.user.toLowerCase().includes(kw) ||
                                   log.type.toLowerCase().includes(kw);
                          }
                          return true;
                        })
                        .filter(log => {
                          if (auditTypeFilter) {
                            return log.type.toLowerCase() === auditTypeFilter.toLowerCase();
                          }
                          return true;
                        }).length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-16 text-center text-slate-300 uppercase tracking-widest font-black text-[10px] bg-white">
                            Aucun enregistrement trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DossierSelectorModal 
        isOpen={showDossierModal} 
        onClose={() => setShowDossierModal(false)} 
      />
    </header>
  );
};
