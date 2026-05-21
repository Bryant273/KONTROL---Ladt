import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { DataTable } from '../../components/ui/DataTable';
import { 
  Users as UsersIcon, 
  ShieldCheck, 
  Plus, 
  UserPlus,
  Mail,
  Lock,
  Search
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function Users() {
  const userColumns = [
    { header: 'Utilisateur', key: 'name', render: (val: string, row: any) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-200">
          {val[0]}
        </div>
        <div>
          <p className="font-bold text-slate-900">{val}</p>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{row.email}</p>
        </div>
      </div>
    )},
    { 
      header: 'Rôle Système', 
      key: 'role',
      render: (val: string) => (
        <span className={cn(
          "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
          val === 'ADMIN' ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-500"
        )}>
          {val}
        </span>
      )
    },
    { header: 'Dernière Connexion', key: 'lastSeen' },
    { 
      header: 'Status', 
      key: 'status',
      render: (val: string) => (
        <div className="flex items-center gap-2">
           <div className={cn("w-1.5 h-1.5 rounded-full", val === 'online' ? 'bg-emerald-500' : 'bg-slate-300')}></div>
           <span className="uppercase tracking-widest text-[10px]">{val}</span>
        </div>
      )
    },
  ];

  const userData = [
    { id: 1, name: 'SILUE Ahmed', email: 'ahmed@unikorp.com', role: 'ADMIN', lastSeen: 'Il y a 2m', status: 'online' },
    { id: 2, name: 'KOFFI Jean', email: 'jean.k@unikorp.com', role: 'USER', lastSeen: 'Hier à 14:00', status: 'offline' },
    { id: 3, name: 'MARIAM D.', email: 'm.diarra@unikorp.com', role: 'USER', lastSeen: '05/05/2025', status: 'offline' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
              <span className="w-10 h-px bg-slate-300"></span> Administration Système
            </p>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Gestion des <span className="text-slate-300">Utilisateurs</span>
            </h1>
          </div>
          <Button className="h-12 px-8 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3">
             <UserPlus className="w-4 h-4" /> Inviter Collaborateur
          </Button>
        </div>

        <div className="flex items-center justify-between">
           <div className="relative group w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-brand transition-colors" />
              <input 
                placeholder="Rechercher utilisateur..." 
                className="w-full h-12 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 font-bold text-xs focus:ring-2 focus:ring-slate-100 focus:border-brand transition-all outline-none"
              />
           </div>
        </div>

        <DataTable 
          columns={userColumns} 
          data={userData}
          onView={(row) => console.log('View', row)}
          onEdit={(row) => console.log('Edit', row)}
          onDelete={(row) => console.log('Delete', row)}
        />
      </div>
    </AdminLayout>
  );
}
