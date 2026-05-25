import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCompany } from '../../context/CompanyContext';
import { Logo } from '../../components/ui/Logo';
import { saveActionLog } from '../../lib/auditLogger';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  FileText, 
  Receipt, 
  History, 
  Plus, 
  Download,
  Filter,
  Search,
  UserPlus,
  Zap,
  Building2,
  ChevronDown,
  Bell,
  LayoutDashboard,
  CircleDollarSign,
  ShieldCheck,
  Truck,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  ClipboardList,
  Pencil,
  Scan,
  Book,
  Files,
  BookText,
  Contact,
  Briefcase,
  TrendingUp,
  Folder
} from 'lucide-react';
import { cn } from '../../lib/utils';

type Module = 'tdb' | 'skom' | 'rh' | 'logistics' | 'marketing';

export default function RH() {
  const { user } = useAuth();
  const { activeEnterprise, selectedDossier, dossiers, setSelectedDossier } = useCompany();
  const [activePage, setActivePage] = useState<string>('rh-tdb');
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const userName = activeEnterprise?.name || user?.displayName || user?.email?.split('@')[0] || 'Anonyme';
  const userInitial = userName.charAt(0).toUpperCase();

  const toggleSection = (id: string) => {
    const newSections = new Set(openSections);
    if (newSections.has(id)) {
      newSections.delete(id);
    } else {
      newSections.add(id);
    }
    setOpenSections(newSections);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'rh-tdb':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Tableau de bord</h2>
                <p className="text-xs text-slate-400">Gestion des Ressources Humaines — Mai 2026</p>
              </div>
              <button className="bg-[#111] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-90 cursor-pointer">
                <UserPlus className="w-4 h-4" /> Nouvel employé
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Effectif Total" value="112" badge="+4%" badgeType="pos" />
              <StatCard icon={ClipboardList} label="Contrats" value="108" />
              <StatCard icon={History} label="Absences" value="3" badge="-15%" badgeType="pos" />
              <StatCard icon={Receipt} label="Masse Salariale" value="12.4M" />
            </div>
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 overflow-x-auto">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-6">Employés récents</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Nom complet</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Département</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Poste</th>
                    <th className="text-right py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[13px]">
                  <EmployeeRow name="KONAN Kouassi Jean" dept="Finances" post="Comptable Senior" status="Actif" statusType="ok" />
                  <EmployeeRow name="DIARRASSOUBA Mariam" dept="Logistique" post="Chef de Stock" status="Actif" statusType="ok" />
                  <EmployeeRow name="YAO Koffi Serge" dept="RH" post="Assistant RH" status="Actif" statusType="ok" />
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return (
          <div className="h-64 flex items-center justify-center text-slate-400 text-sm font-medium animate-pulse">
            Module {activePage} en cours de développement...
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F5F9] font-sans selection:bg-brand/20">
      {/* HEADER */}
      <nav className="h-14 bg-[#111] flex items-center justify-between px-6 shrink-0 relative z-50">
        <div className="flex items-center gap-3">
          <Logo 
            iconClassName="w-8 h-8 bg-[#E8521A] text-white rounded-lg" 
            textClassName="text-white text-base font-bold tracking-tight"
          />
          <div className="h-8 w-px bg-white/10 mx-2 hidden lg:block" />
          <div className="hidden lg:flex flex-col">
            <p className="text-[9px] font-black text-brand uppercase tracking-[0.2em] leading-none mb-1">Système Unikorp</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white tabular-nums tracking-tighter">
                {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                {currentTime.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Direct Dropdown Dossier Switcher */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 h-8 hover:bg-white/10 transition-all">
            <Folder className="w-3.5 h-3.5 text-white/50" />
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
              className="bg-transparent border-none text-[10px] font-black text-white/80 uppercase tracking-wider outline-none cursor-pointer pr-1"
            >
              {dossiers.map(d => (
                <option key={d.id} value={d.id} className="text-xs uppercase bg-[#111] text-white">{d.filename}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
            <Building2 className="w-3.5 h-3.5 text-white/80" />
            <span className="text-[11px] font-medium text-white/80 uppercase tracking-tight">{activeEnterprise?.name || 'GEST-ETEST-2026'}</span>
            <ChevronDown className="w-3 h-3 text-white/40" />
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all cursor-pointer">
            <Bell className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 ml-2 group cursor-pointer">
            <div className="w-8 h-8 bg-[#E8521A] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
              {userInitial}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Session</p>
              <p className="text-[10px] font-bold text-white tracking-tight leading-none uppercase">{userName}</p>
            </div>
          </div>
          <button className="text-white/40 hover:text-white transition-all cursor-pointer">
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* TOPBAR */}
      <div className="h-11 bg-[#4A9EC9] flex items-center px-4 shrink-0 relative z-40 gap-1">
        <button 
          onClick={() => navigate('/app/finance')}
          className="flex items-center gap-2 px-4 h-8 rounded-lg text-[12px] font-medium text-white hover:bg-white/20 transition-all cursor-pointer"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Tableau de bord
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button 
          onClick={() => navigate('/app/finance', { state: { module: 'skom' } })}
          className="flex items-center gap-2 px-4 h-8 rounded-lg text-[12px] font-medium text-white hover:bg-white/20 transition-all cursor-pointer"
        >
          <CircleDollarSign className="w-3.5 h-3.5" />
          SKOMPTAB
        </button>
        <button 
          onClick={() => setActivePage('rh-tdb')}
          className={cn(
            "flex items-center gap-2 px-4 h-8 rounded-lg text-[12px] font-bold transition-all cursor-pointer",
            activePage.startsWith('rh-') 
              ? "bg-white text-[#4A9EC9] shadow-sm scale-105" 
              : "text-white hover:bg-white/20"
          )}
        >
          <Users className="w-3.5 h-3.5" />
          SOCIX
        </button>
        <button 
          onClick={() => navigate('/app/logistics')}
          className="flex items-center gap-2 px-4 h-8 rounded-lg text-[12px] font-medium text-white hover:bg-white/20 transition-all cursor-pointer"
        >
          <Truck className="w-3.5 h-3.5" />
          LOGSON
        </button>
        <button 
          onClick={() => navigate('/app/marketing')}
          className="flex items-center gap-2 px-4 h-8 rounded-lg text-[12px] font-medium text-white hover:bg-white/20 transition-all cursor-pointer"
        >
          <Target className="w-3.5 h-3.5" />
          MARKOS
        </button>
        <div className="flex-1" />
        <button 
          onClick={() => navigate('/app')}
          className="flex items-center gap-2 px-4 h-8 bg-[#111] border border-white/10 rounded-lg cursor-pointer hover:bg-brand transition-all shadow-lg active:scale-95"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-brand" />
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">Page admin</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <motion.nav 
          initial={{ width: 228 }}
          className="bg-white border-r border-black/5 flex flex-col py-3 overflow-y-auto shrink-0 scrollbar-hide"
        >
          <SidebarLink 
            icon={LayoutDashboard} 
            label="Tableau de bord" 
            active={activePage === 'rh-tdb'} 
            onClick={() => setActivePage('rh-tdb')} 
          />

          <SidebarSection 
            label="Personnal" 
            isOpen={openSections.has('personnel')} 
            onToggle={() => toggleSection('personnel')}
          >
            <SidebarLink icon={Users} label="Salariés" active={activePage === 'employees'} onClick={() => setActivePage('employees')} />
            <SidebarLink icon={FileText} label="Contrats" active={activePage === 'contracts'} onClick={() => setActivePage('contracts')} />
            <SidebarLink icon={History} label="Absences" active={activePage === 'absences'} onClick={() => setActivePage('absences')} />
          </SidebarSection>

          <SidebarSection 
            label="Paie" 
            isOpen={openSections.has('paie')} 
            onToggle={() => toggleSection('paie')}
          >
            <SidebarLink icon={Receipt} label="Bulletins" active={activePage === 'payroll'} onClick={() => setActivePage('payroll')} />
            <SidebarLink icon={Files} label="Déclarations" active={activePage === 'reports'} onClick={() => setActivePage('reports')} />
          </SidebarSection>
        </motion.nav>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-[1200px] mx-auto text-[13px]">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

// Sub-components
function StatCard({ icon: Icon, label, value, badge, badgeType }: any) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 flex flex-col gap-3 group hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div className="w-9 h-9 bg-[#111] rounded-xl flex items-center justify-center text-white">
          <Icon className="w-4 h-4" />
        </div>
        {badge && (
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-md",
            badgeType === 'pos' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function EmployeeRow({ name, dept, post, status, statusType }: any) {
  return (
    <tr className="hover:bg-slate-50 cursor-pointer transition-colors group">
      <td className="py-4 px-4">
        <p className="font-bold text-slate-900 group-hover:text-brand transition-colors">{name}</p>
      </td>
      <td className="py-4 px-4 font-medium text-slate-500">{dept}</td>
      <td className="py-4 px-4 font-medium text-slate-700">{post}</td>
      <td className="py-4 px-4 text-right">
        <span className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold",
          statusType === 'ok' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
        )}>
          {statusType === 'ok' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {status}
        </span>
      </td>
    </tr>
  );
}

function SidebarLink({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-6 py-2.5 mx-2 rounded-xl text-[13px] font-medium transition-all relative group cursor-pointer",
        active 
          ? "bg-[#F0F9FF] text-[#4A9EC9] font-bold shadow-sm shadow-[#4A9EC9]/10 ring-1 ring-[#4A9EC9]/20" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <div className={cn(
        "w-1.5 h-6 absolute left-0 rounded-r-lg transition-all",
        active ? "bg-[#4A9EC9] scale-y-100" : "bg-transparent scale-y-0"
      )} />
      <Icon className={cn("w-4 h-4 shrink-0 transition-all", active ? "text-[#4A9EC9] scale-110" : "opacity-70 group-hover:opacity-100")} />
      {label}
    </button>
  );
}

function SidebarSection({ label, children, isOpen, onToggle }: any) {
  return (
    <div className="mt-6 mb-2">
      <button 
        onClick={onToggle}
        className="flex items-center justify-between w-full px-6 py-2 group cursor-pointer"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-600 transition-colors">
          {label}
        </span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-slate-300 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>
      <div className={cn(
        "space-y-1 mt-1 transition-all duration-300 overflow-hidden",
        isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      )}>
        {children}
      </div>
    </div>
  );
}
