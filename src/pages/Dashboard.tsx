import React from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { useCompany } from '../context/CompanyContext';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Truck, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingDown,
  Activity,
  Building2,
  Wallet,
  Clock,
  Briefcase,
  History,
  ShieldCheck,
  CreditCard,
  Banknote,
  Receipt,
  BarChart3,
  LayoutDashboard
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const chartData = [
  { name: 'Jan', ca: 4200, charges: 2800, marge: 1400 },
  { name: 'Feb', ca: 3800, charges: 2400, marge: 1400 },
  { name: 'Mar', ca: 5100, charges: 3100, marge: 2000 },
  { name: 'Apr', ca: 4800, charges: 2900, marge: 1900 },
  { name: 'May', ca: 6200, charges: 3400, marge: 2800 },
  { name: 'Jun', ca: 5900, charges: 3200, marge: 2700 },
];

const auditLogs = [
  { time: '10:45', user: 'S. Ahmed', action: 'Modif. Dossier', module: 'ERP' },
  { time: '09:30', user: 'K. Jean', action: 'Valide Paie', module: 'SOCIX' },
  { time: 'Hier', user: 'M. Diarra', action: 'Facture Achat', module: 'SKOMP' },
  { time: 'Hier', user: 'SYSTEM', action: 'Backup Sync', module: 'CORE' },
];

const KPICard = ({ title, value, sub, trend, trendVal, icon: Icon, color }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
    <div className={cn("absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all transform group-hover:scale-110", color)}>
      <Icon className="w-12 h-12" />
    </div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] italic">{title}</p>
        <div className={cn("p-1.5 rounded-lg border border-slate-50 transition-transform group-hover:rotate-6", color.replace('text-', 'bg-').replace('-500', '-50'))}>
          <Icon className={cn("w-3 h-3", color)} />
        </div>
      </div>
      <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase mb-0.5 tabular-nums">{value}</h3>
      <div className="flex items-center gap-2">
        {trend && (
          <div className={cn(
            "flex items-center gap-0.5 text-[7px] font-black uppercase tracking-widest px-1 py-0.5 rounded-full",
            trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
          )}>
             {trend === 'up' ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
             {trendVal}
          </div>
        )}
        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none truncate">{sub}</p>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { activeEnterprise, selectedDossier } = useCompany();

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
              Tableau de bord
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Dossier: <span className="text-brand">{selectedDossier?.filename || 'Aucun'}</span> • Exercice: {selectedDossier?.exercise || 'N/A'}</p>
          </motion.div>

          <div className="flex flex-wrap items-center gap-3">
            <Link 
              to="/setup"
              className="px-4 h-11 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
            >
              <Activity className="w-3.5 h-3.5 text-brand" />
              Ouverture d'exercice
            </Link>
            <button className="px-4 h-11 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm cursor-not-allowed group">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400" />
              Clôture d'exercice
            </button>
            <div className="w-px h-6 bg-slate-100 mx-1 hidden sm:block" />
            <Link 
              to="/app/finance" 
              className="px-6 h-11 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand transition-all flex items-center gap-3 shadow-xl shadow-slate-200 group"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-brand group-hover:text-white transition-colors" />
              Accéder à l'ERP
            </Link>
          </div>
        </div>

        {/* Updated KPIs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
           <KPICard 
             title="Chiffre d'Affaires" 
             value="420,5M" 
             sub="Performance Mensuelle" 
             trend="up" 
             trendVal="+12%" 
             icon={TrendingUp} 
             color="text-emerald-500" 
           />
           <KPICard 
             title="Trésorerie" 
             value="152,8M" 
             sub="Banque: 142M • Caisse: 10M" 
             trend="up" 
             trendVal="+2%" 
             icon={Wallet} 
             color="text-brand" 
           />
           <KPICard 
             title="Total Charges" 
             value="285,4M" 
             sub="Dépenses d'Exploitation" 
             trend="down" 
             trendVal="-5%" 
             icon={TrendingDown} 
             color="text-orange-500" 
           />
           <KPICard 
             title="Bénéfice Net" 
             value="+135,1M" 
             sub="Estimation Quantum" 
             trend="up" 
             trendVal="+18%" 
             icon={BarChart3} 
             color="text-indigo-500" 
           />
           <KPICard 
             title="Salarial SOCIX" 
             value="128" 
             sub="Employés Actifs" 
             icon={Users} 
             color="text-blue-500" 
           />
           <KPICard 
             title="Stock LOGSON" 
             value="1.250" 
             sub="Valeur: 42,5M FCFA" 
             icon={Truck} 
             color="text-rose-500" 
           />
           <KPICard 
             title="Abonnement" 
             value="15 Jours" 
             sub="Échéance: 25 Mai 2026" 
             icon={Clock} 
             color="text-orange-600" 
           />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
           {/* CA Chart */}
           <div className="xl:col-span-8 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <p className="text-[10px] font-black text-brand uppercase tracking-[0.2em] mb-1 italic">Performances</p>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Évolution Mensuelle</h2>
                 </div>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 bg-brand rounded-full"></span>
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">CA</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 bg-slate-200 rounded-full"></span>
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Charges</span>
                    </div>
                 </div>
              </div>
              
              <div className="h-[250px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={8}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis 
                         dataKey="name" 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} 
                         dy={10}
                       />
                       <YAxis 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fontSize: 9, fontWeight: 900, fill: '#cbd5e1' }}
                       />
                       <Tooltip 
                         cursor={{ fill: '#f8fafc' }}
                         contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                         itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                       />
                       <Bar dataKey="ca" fill="#1a4fcc" radius={[4, 4, 0, 0]} barSize={20} />
                       <Bar dataKey="charges" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Mini Journal Actions */}
           <div className="xl:col-span-4 bg-[#09090b] text-white rounded-[2rem] p-8 relative overflow-hidden border border-white/5 shadow-2xl">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12">
                 <History className="w-32 h-32" />
              </div>
              
              <div className="relative z-10">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[9px] font-black text-brand uppercase tracking-[0.3em]">Dernières Actions</h3>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      className="p-1.5 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                    >
                       <ArrowUpRight className="w-3 h-3 text-slate-500" />
                    </motion.button>
                 </div>

                 <div className="space-y-4">
                    {auditLogs.map((log, i) => (
                      <div key={i} className="flex items-center gap-4 group cursor-pointer p-2.5 rounded-xl hover:bg-white/5 transition-all">
                         <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-brand/30">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                               <p className="text-[11px] font-bold text-white/90 truncate">{log.action}</p>
                               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{log.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="text-[8px] font-black text-brand uppercase tracking-widest">{log.module}</span>
                               <span className="text-[8px] text-slate-500 font-bold">• {log.user}</span>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>

                 <Link to="/app/admin/actions" className="w-full mt-8 h-10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-slate-500 flex items-center justify-center">Voir tout le journal</Link>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
