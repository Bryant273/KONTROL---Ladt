import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useCompany, Dossier } from '../../context/CompanyContext';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  MoreVertical, 
  Calendar,
  ShieldCheck,
  Filter,
  CheckCircle2,
  Clock,
  Download,
  Trash2,
  Settings,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../components/ui/DataTable';

export default function Dossiers() {
  const { dossiers, selectedDossier, setSelectedDossier, activeEnterprise } = useCompany();
  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate();

  const filteredDossiers = dossiers.filter(d => 
    d.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.exercise.includes(searchTerm)
  );

  const columns = [
    {
      header: 'ID / Référence',
      key: 'id',
      render: (val: string) => (
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
          #{val.slice(0, 8)}
        </span>
      )
    },
    {
      header: 'Fichier de gestion',
      key: 'filename',
      render: (val: string, row: Dossier) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm",
            selectedDossier?.id === row.id ? "bg-brand text-white" : "bg-slate-50 text-slate-400"
          )}>
            <FolderOpen className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 group-hover:text-brand transition-colors">{val}</p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{activeEnterprise?.acronym}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Exercice',
      key: 'exercise',
      render: (val: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-bold text-slate-600">{val}</span>
        </div>
      )
    },
    {
      header: 'Statut',
      key: 'status',
      render: (val: string, row: Dossier) => (
        <div className="flex items-center gap-2">
          <div className={cn(
            "px-3 py-1 rounded-full flex items-center gap-1.5",
            val === 'open' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full", val === 'open' ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
            <span className="text-[9px] font-black uppercase tracking-widest">{val === 'open' ? 'Actif' : 'Clos'}</span>
          </div>
          {selectedDossier?.id === row.id && (
            <span className="text-[7px] font-black text-brand uppercase tracking-[0.2em] italic">(SÉLECTIONNÉ)</span>
          )}
        </div>
      )
    },
    {
      header: 'Dernière Sync',
      key: 'updatedAt',
      render: () => (
        <div className="flex items-center gap-2 text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">Aujourd'hui 10:45</span>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-100 pb-8">
          <div>
            <p className="text-[10px] font-black text-brand uppercase tracking-[0.4em] mb-3 flex items-center gap-2">
              <span className="w-8 h-px bg-brand"></span> Enterprise Ledger
            </p>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Fichiers de <span className="text-slate-300">Gestion</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-11 px-6 bg-white border border-slate-100 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all text-slate-600">
               <Download className="w-4 h-4" /> Sauvegarde Totale
            </button>
            <button 
              onClick={() => navigate('/setup')}
              className="h-11 px-6 bg-[#09090b] text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-brand transition-all shadow-xl shadow-black/10"
            >
              <Plus className="w-4 h-4" /> Nouvel Exercice
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-xl w-fit">
              {['Tous', 'Ouverts', 'Clos'].map((f, i) => (
                <button key={i} className={cn(
                  "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                  i === 0 ? "bg-white border border-slate-200 text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}>
                  {f}
                </button>
              ))}
           </div>
           
           <div className="relative group min-w-[280px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-brand" />
              <input 
                placeholder="Filtrer les fichiers..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full h-11 bg-white border border-slate-100 rounded-xl pl-11 pr-4 font-bold text-xs focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all outline-none"
              />
           </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <DataTable 
            columns={columns} 
            data={filteredDossiers}
            onView={(row) => setSelectedDossier(row)}
            actions={[
              { label: 'Ouvrir', onClick: (row) => setSelectedDossier(row), icon: FolderOpen },
              { label: 'Archiver', onClick: () => {}, icon: Settings },
              { label: 'Clôturer', onClick: () => {}, icon: Trash2 },
            ]}
          />
        </div>

        <div className="bg-[#09090b] rounded-[1.5rem] p-8 text-white relative overflow-hidden group border border-white/5 shadow-2xl">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
              <ShieldCheck className="w-32 h-32" />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                 <h4 className="text-lg font-black tracking-tighter uppercase mb-1">Gouvernance des données</h4>
                 <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest italic">Quantum Engine Sovereign Infrastructure</p>
              </div>
              <div className="flex gap-4">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-brand uppercase tracking-widest mb-1">Stockage total</span>
                    <span className="text-lg font-black tracking-tighter">1.4 GB / 10 GB</span>
                 </div>
                 <div className="w-px bg-white/10 mx-4" />
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Intégrité Blockchain</span>
                    <span className="text-lg font-black tracking-tighter uppercase">Validée</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
