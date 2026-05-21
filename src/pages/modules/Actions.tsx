import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { DataTable } from '../../components/ui/DataTable';
import { 
  History, 
  Search, 
  Filter, 
  Download,
  Clock,
  User,
  Shield
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Actions() {
  const columns = [
    { 
      header: 'Horodatage', 
      key: 'timestamp',
      render: (val: string) => (
        <div className="flex items-center gap-2 text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-mono text-[10px]">{val}</span>
        </div>
      )
    },
    { 
      header: 'Utilisateur', 
      key: 'user',
      render: (val: string) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
            {val[0]}
          </div>
          <span className="font-bold text-slate-900">{val}</span>
        </div>
      )
    },
    { 
      header: 'Action / Événement', 
      key: 'action',
      render: (val: string) => (
        <span className="font-bold text-slate-600">{val}</span>
      )
    },
    { 
      header: 'Module', 
      key: 'module',
      render: (val: string) => (
        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[8px] font-black uppercase tracking-widest">
          {val}
        </span>
      )
    },
    { 
      header: 'IP', 
      key: 'ip',
      render: (val: string) => <span className="font-mono text-[10px] text-slate-400">{val}</span>
    }
  ];

  const data = [
    { timestamp: '10/05/2026 22:45', user: 'SILUE Ahmed', action: 'Modification du dossier fiscal', module: 'ERP', ip: '192.168.1.45' },
    { timestamp: '10/05/2026 21:30', user: 'KOFFI Jean', action: 'Validation de bulletin de paie', module: 'SOCIX', ip: '10.0.0.12' },
    { timestamp: '10/05/2026 20:15', user: 'MARIAM D.', action: 'Nouvelle facture client FAC-002', module: 'SKOMPTAB', ip: '192.168.1.102' },
    { timestamp: '10/05/2026 19:00', user: 'SYSTEM', action: 'Sauvegarde automatique quantum', module: 'CORE', ip: 'internal' },
    { timestamp: '10/05/2026 18:45', user: 'SILUE Ahmed', action: 'Connexion au système', module: 'AUTH', ip: '192.168.1.45' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
              <span className="w-10 h-px bg-slate-300"></span> Audit & Traçabilité
            </p>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Journal des <span className="text-slate-300">Actions</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-12 px-6 bg-white border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
              <Download className="w-4 h-4" /> Exporter LOGS
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
           <div className="relative group w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-brand transition-colors" />
              <input 
                placeholder="Filtrer les actions..." 
                className="w-full h-12 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 font-bold text-xs focus:ring-2 focus:ring-slate-100 focus:border-brand transition-all outline-none shadow-sm"
              />
           </div>
        </div>

        <DataTable 
          columns={columns} 
          data={data}
          onView={(row) => console.log('View action', row)}
        />
      </div>
    </AdminLayout>
  );
}
