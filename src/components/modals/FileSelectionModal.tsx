import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCompany, Dossier } from '../../context/CompanyContext';
import { useAuth } from '../../context/AuthContext';
import { 
  FolderOpen, 
  Search, 
  ChevronRight, 
  ArrowRight,
  Plus,
  LogOut,
  ShieldCheck,
  FileText,
  Calendar
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function FileSelectionModal() {
  const { user, signOut } = useAuth();
  const { dossiers, setSelectedDossier, loading } = useCompany();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredDossiers = dossiers.filter(d => 
    d.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.exercise.includes(searchTerm)
  );

  const selectedDossier = dossiers.find(d => d.id === selectedId);

  const handleConfirm = () => {
    if (selectedDossier) {
      setSelectedDossier(selectedDossier);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 font-['Inter',sans-serif]">
      {/* Surgical Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden border border-slate-200"
      >
        <div className="flex flex-col h-[85vh] max-h-[700px]">
          {/* Header */}
          <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
             <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Sélecteur de Dossier</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Passerelle de Sécurité Unikorp</p>
             </div>
             <button 
              onClick={() => signOut()}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all group"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Search & Actions */}
          <div className="px-8 py-6 bg-slate-50/50 flex flex-wrap items-center gap-4 shrink-0">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text"
                placeholder="RECHERCHER UN FICHIER..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 h-11 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-slate-300"
              />
            </div>
            
            <button 
              onClick={() => navigate('/setup')}
              className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Nouveau Dossier
            </button>
          </div>

          {/* Dossiers List */}
          <div className="flex-1 overflow-y-auto px-8 py-4 space-y-3 custom-scrollbar">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-2xl" />
              ))
            ) : filteredDossiers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 bg-slate-50 rounded-full mb-4">
                  <FolderOpen className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Aucun fichier détecté</p>
                <p className="text-[10px] text-slate-400 mt-2">Commencez par créer un nouveau dossier de gestion.</p>
              </div>
            ) : (
              filteredDossiers.map((dossier) => (
                <button
                  key={dossier.id}
                  onClick={() => setSelectedId(dossier.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-5 rounded-2xl transition-all text-left group border text-[10px]",
                    selectedId === dossier.id 
                      ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                      : "bg-white border-slate-100 hover:border-slate-300 text-slate-600"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      selectedId === dossier.id ? "bg-white/10 text-brand" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                    )}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={cn(
                        "font-black uppercase tracking-tight text-sm",
                        selectedId === dossier.id ? "text-white" : "text-slate-900"
                      )}>{dossier.filename}</h4>
                      <div className="flex items-center gap-3 mt-1 opacity-60">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className="font-bold uppercase tracking-widest">EXERCICE {dossier.exercise}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-current" />
                        <span className="font-bold uppercase tracking-widest">STATUT: {dossier.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                    selectedId === dossier.id ? "bg-brand text-white" : "bg-slate-50 text-slate-300 group-hover:bg-slate-100"
                  )}>
                    {selectedId === dossier.id ? <ShieldCheck className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer Info & Confirm */}
          <div className="p-8 border-t border-slate-50 bg-slate-50/20 shrink-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xs ring-1 ring-white/10">
                  {user?.displayName?.[0] || 'U'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{user?.displayName}</p>
                  <p className="text-[8px] font-black text-brand uppercase tracking-[0.2em] mt-0.5">Session Sécurisée</p>
                </div>
              </div>

              <button
                disabled={!selectedId}
                onClick={handleConfirm}
                className={cn(
                  "px-8 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl",
                  selectedId 
                    ? "bg-slate-900 text-white hover:bg-brand hover:shadow-brand/20 cursor-pointer" 
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
              >
                Valider la sélection
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
