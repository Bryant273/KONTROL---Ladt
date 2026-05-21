import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCompany } from '../../context/CompanyContext';
import { cn } from '../../lib/utils';
import { Logo } from '../ui/Logo';
import { 
  BarChart3, 
  Users, 
  Target, 
  Truck, 
  Building2, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronDown,
  LayoutDashboard,
  Wallet,
  Package,
  Megaphone,
  UserCheck,
  ShieldCheck,
  Menu,
  X,
  CreditCard,
  Briefcase,
  History,
  Receipt,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarItemProps {
  id: string;
  label: string;
  icon: any;
  path?: string;
  subItems?: { label: string; path: string; icon?: any }[];
  isOpen?: boolean;
  onToggle?: () => void;
  isCollapsed?: boolean;
  key?: string | number;
}

const SidebarItem = ({ label, icon: Icon, path, subItems, isOpen, onToggle, isCollapsed }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = path ? location.pathname === path : subItems?.some(s => location.pathname === s.path);

  if (isCollapsed) {
    return (
      <div className="relative group">
        <NavLink 
          to={path || '#'} 
          className={cn(
            "w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 mx-auto border",
            isActive 
              ? "bg-brand text-white border-transparent shadow-lg shadow-brand/20" 
              : "text-slate-500 hover:bg-white/5 hover:text-slate-300 border-transparent"
          )}
        >
          <Icon className="w-5 h-5" />
        </NavLink>
        {/* Tooltip */}
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-[#09090b] text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-white/10 whitespace-nowrap">
          {label}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {path ? (
        <NavLink 
          to={path}
          className={({ isActive }) => cn(
            "flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold transition-all duration-300 group",
            isActive 
              ? "bg-white/10 text-white shadow-xl border border-white/5" 
              : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className={cn("w-4 h-4 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-brand" : "")} />
            <span className="truncate">{label}</span>
          </div>
        </NavLink>
      ) : (
        <button 
          onClick={onToggle}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold transition-all duration-300 group",
            isActive 
              ? "bg-white/10 text-white border border-white/5" 
              : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-brand" : "")} />
            <span>{label}</span>
          </div>
          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", isOpen ? "rotate-180" : "")} />
        </button>
      )}

      <AnimatePresence>
        {isOpen && subItems && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-1 ml-4 border-l border-white/5 pl-4 py-1"
          >
            {subItems.map((sub, i) => (
              <NavLink 
                key={i}
                to={sub.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all",
                  isActive ? "text-brand" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {sub.icon && <sub.icon className="w-3.5 h-3.5" />}
                {sub.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Sidebar = ({ isCollapsed }: { isCollapsed: boolean; onToggle: () => void }) => {
  const { activeEnterprise } = useCompany();
  const { user, role } = useAuth();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const menuSections = [
    {
      id: 'ERP',
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      path: '/app'
    },
    {
      id: 'SKOMPTAB',
      label: 'SKOMPTAB',
      icon: Wallet,
      subItems: [
        { label: 'Factures', path: '/app/finance/invoices', icon: CreditCard },
        { label: 'Journaux', path: '/app/finance/journals', icon: FileText },
        { label: 'Grands Livres', path: '/app/finance/ledger', icon: History },
        { label: 'Balance', path: '/app/finance/balance', icon: BarChart3 }
      ]
    },
    {
      id: 'SOCIX',
      label: 'SOCIX',
      icon: Users,
      subItems: [
        { label: 'Employés', path: '/app/rh/employees', icon: UserCheck },
        { label: 'Contrats', path: '/app/rh/contracts', icon: Briefcase },
        { label: 'Paie', path: '/app/rh/payroll', icon: Receipt },
        { label: 'Dossiers', path: '/app/rh/dossiers', icon: History }
      ]
    },
    {
      id: 'LOGSON',
      label: 'LOGSON',
      icon: Truck,
      subItems: [
        { label: 'Inventaires', path: '/app/logistics/inventory', icon: Package },
        { label: 'Stock', path: '/app/logistics/stock', icon: BarChart3 },
        { label: 'Produits', path: '/app/logistics/products', icon: LayoutDashboard }
      ]
    },
    {
      id: 'MARKOS',
      label: 'MARKOS',
      icon: Target,
      subItems: [
        { label: 'Campagnes', path: '/app/marketing/campaigns', icon: Megaphone },
        { label: 'Clients CRM', path: '/app/marketing/crm', icon: Users }
      ]
    },
    {
      id: 'ACTIONS',
      label: 'Actions',
      icon: History,
      path: '/app/admin/actions'
    },
    {
      id: 'NOTIFICATIONS',
      label: 'Notifications',
      icon: Bell,
      path: '/app/notifications'
    }
  ];

  const adminSections = [
    { id: 'DOSSIERS', label: 'Gestion Dossiers', icon: FileText, path: '/app/admin/dossiers' },
    { id: 'USERS', label: 'Utilisateurs', icon: ShieldCheck, path: '/app/admin/users' },
    { id: 'INFOS', label: 'Entreprise', icon: Building2, path: '/app/admin/info' },
    { id: 'SETTINGS', label: 'Paramètres', icon: Settings, path: '/app/admin/settings' }
  ];

  return (
    <aside 
      className={cn(
        "bg-[#09090b] h-screen fixed left-0 top-0 z-50 flex flex-col transition-all duration-500 ease-in-out border-r border-white/5 shadow-2xl overflow-hidden",
        isCollapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      {/* Brand Header */}
      <div className="h-[80px] shrink-0 flex items-center px-6 relative border-b border-white/5">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="shrink-0">
            {activeEnterprise?.logo ? (
              <img 
                src={activeEnterprise.logo} 
                alt="Brand" 
                className={cn("rounded-xl object-contain transition-all duration-500", isCollapsed ? "w-8 h-8" : "w-10 h-10 shadow-xl shadow-brand/10")} 
              />
            ) : (
              <Logo 
                iconClassName={cn("bg-brand text-white rounded-xl shadow-xl shadow-brand/20 transition-all duration-500", isCollapsed ? "w-8 h-8" : "w-10 h-10")} 
                showText={false}
              />
            )}
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="truncate"
            >
              <h2 className="text-white font-black text-[12px] tracking-tight truncate uppercase leading-tight">{activeEnterprise?.name || 'Unikorp ERP'}</h2>
              <p className="text-slate-500 text-[8px] font-black uppercase tracking-[0.2em] mt-0.5">{activeEnterprise?.acronym || 'Quantum engine'}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Nav Content */}
      <div className={cn("flex-1 overflow-y-auto thin-scrollbar py-6", isCollapsed ? "px-0" : "px-4")}>
        <div className="space-y-6">
          {/* Menu Sections */}
          <div className="space-y-1">
            {menuSections.map((item) => (
              <SidebarItem 
                key={item.id}
                {...item}
                isCollapsed={isCollapsed}
                isOpen={openSection === item.id}
                onToggle={() => setOpenSection(openSection === item.id ? null : item.id)}
              />
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-white/5">
            {!isCollapsed && <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4 px-4">Gestion</p>}
            <div className="space-y-1">
              {adminSections.map((item) => (
                <SidebarItem 
                  key={item.id}
                  {...item}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Profile - Improved with Account Type */}
      <div className={cn("mt-auto border-t border-white/5", isCollapsed ? "p-4" : "p-6")}>
        <div 
          id="sidebar-profile-card"
          className={cn(
            "flex items-center bg-white/5 rounded-2xl border border-white/5 transition-all group hover:bg-white/10", 
            isCollapsed ? "justify-center py-2" : "gap-3 p-3"
          )}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-brand/70 flex items-center justify-center text-white font-black text-[12px] ring-1 ring-white/10 shrink-0 shadow-lg shadow-brand/20">
            {(user?.displayName || activeEnterprise?.name || user?.email)?.[0]?.toUpperCase() || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-[11px] text-white/90 font-black truncate leading-none mb-1 uppercase tracking-tight">
                {user?.displayName || activeEnterprise?.name || user?.email?.split('@')[0] || 'Utilisateur'}
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest truncate">
                  {role === 'SYSTEM_ADMIN' ? 'Administrateur Système' : 'Gestionnaire Entreprise'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
