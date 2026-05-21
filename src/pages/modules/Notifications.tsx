import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { 
  Bell, 
  Search, 
  Trash2, 
  CheckCircle2, 
  MoreVertical,
  Clock,
  Settings,
  Filter,
  ShieldAlert,
  Info,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function Notifications() {
  const [activeTab, setActiveTab] = React.useState<'ALL' | 'UNREAD' | 'ARCHIVED'>('ALL');
  const [searchTerm, setSearchTerm] = React.useState('');

  const notifications = [
    { 
      id: 1, 
      title: 'Dossier Fiscal 2026', 
      desc: 'Le dossier est maintenant prêt pour la clôture annuelle. Veuillez vérifier les écritures d\'inventaire.', 
      time: 'Il y a 5 minutes', 
      type: 'INFO',
      module: 'FINANCE',
      unread: true 
    },
    { 
      id: 2, 
      title: 'Alerte Validation RH', 
      desc: '3 nouveaux bulletins de paie sont en attente de votre signature électronique dans SOCIX.', 
      time: 'Il y a 1 heure', 
      type: 'ALERT',
      module: 'RH',
      unread: true 
    },
    { 
      id: 3, 
      title: 'Synchronisation LOGSON', 
      desc: 'Mise à jour réussie de l\'inventaire centralisé du dépôt Principal.', 
      time: 'Il y a 2 heures', 
      type: 'SUCCESS',
      module: 'LOGS',
      unread: false 
    },
    { 
      id: 4, 
      title: 'Sécurité SYSCORP', 
      desc: 'Nouvelle connexion détectée sur votre compte depuis une adresse IP non reconnue (192.168.1.102).', 
      time: 'Hier 14:30', 
      type: 'SECURITY',
      module: 'CORE',
      unread: false 
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'ALERT': return <ShieldAlert className="w-5 h-5 text-orange-500" />;
      case 'SECURITY': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'SUCCESS': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default: return <Info className="w-5 h-5 text-brand" />;
    }
  };

  const filtered = notifications.filter(n => {
    if (activeTab === 'UNREAD') return n.unread;
    return true;
  }).filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
              <span className="w-10 h-px bg-slate-300"></span> Centre de Communications
            </p>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Flux des <span className="text-slate-300">Notifications</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <button className="h-12 px-6 bg-white border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                <CheckCircle2 className="w-4 h-4" /> Tout marquer comme lu
             </button>
             <button className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                <Settings className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
           <div className="xl:col-span-3 space-y-6">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                 <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 italic italic">Configuration</h3>
                 <div className="space-y-4">
                    {[
                      { id: 'ALL', label: 'Toutes les alertes', count: 4 },
                      { id: 'UNREAD', label: 'Non lues', count: 2 },
                      { id: 'ARCHIVED', label: 'Archives', count: 0 },
                    ].map((tab) => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                          "w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                          activeTab === tab.id ? "bg-[#09090b] text-white shadow-xl" : "text-slate-500 hover:bg-slate-50"
                        )}
                      >
                         <span>{tab.label}</span>
                         <span className={cn(
                           "min-w-[20px] px-1.5 py-0.5 rounded-lg flex items-center justify-center text-[8px]",
                           activeTab === tab.id ? "bg-white/10 text-white" : "bg-slate-100 text-slate-400"
                         )}>{tab.count}</span>
                      </button>
                    ))}
                 </div>

                 <div className="mt-10 pt-10 border-t border-slate-50 space-y-4">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest ml-1">Recherche</p>
                    <div className="relative group">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-brand transition-colors" />
                       <input 
                         placeholder="Filtrer..." 
                         value={searchTerm}
                         onChange={e => setSearchTerm(e.target.value)}
                         className="w-full h-11 bg-slate-50 border border-slate-50 rounded-xl pl-12 pr-4 font-bold text-xs focus:ring-2 focus:ring-brand/10 focus:border-brand transition-all outline-none"
                       />
                    </div>
                 </div>
              </div>
           </div>

           <div className="xl:col-span-9 space-y-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "bg-white border rounded-[2rem] p-6 flex flex-col md:flex-row items-start md:items-center gap-6 group hover:border-brand/30 transition-all",
                      n.unread ? "border-brand/10 bg-brand/[0.01] shadow-sm shadow-brand/5" : "border-slate-100 opacity-80"
                    )}
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border",
                      n.unread ? "bg-white border-brand/20 shadow-lg shadow-brand/5" : "bg-slate-50 border-slate-100"
                    )}>
                      {getIcon(n.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{n.title}</h4>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded italic">{n.module}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide leading-relaxed line-clamp-1">{n.desc}</p>
                      <div className="flex items-center gap-4 mt-3">
                         <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{n.time}</span>
                         </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                       <button className="h-10 px-4 bg-slate-50 text-slate-400 hover:text-brand rounded-xl font-black text-[9px] uppercase tracking-widest transition-all">Détails</button>
                       <button className="w-10 h-10 bg-slate-50 text-slate-300 hover:text-rose-500 rounded-xl flex items-center justify-center transition-all">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filtered.length === 0 && (
                <div className="py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                   <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-slate-200 mb-6">
                      <Bell className="w-8 h-8" />
                   </div>
                   <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">Flux silencieux</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-xs leading-relaxed">
                     Aucune nouvelle notification Quantum à afficher pour le moment.
                   </p>
                </div>
              )}
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
