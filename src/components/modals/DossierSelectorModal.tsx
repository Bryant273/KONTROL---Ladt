import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  FolderOpen, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  FileText
} from 'lucide-react';
import { useCompany, Dossier } from '../../context/CompanyContext';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface DossierSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DossierSelectorModal = ({ isOpen, onClose }: DossierSelectorModalProps) => {
  const { dossiers, selectedDossier, setSelectedDossier } = useCompany();
  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate();

  const filteredDossiers = dossiers.filter(d => 
    d.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.exercise.includes(searchTerm)
  );

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="w-full max-w-lg bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative z-10 overflow-hidden border border-slate-200/60"
          >
            {/* Header: Surgical Header */}
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
               <div>
                  <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">Échange de Dossier</h2>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Sélection du contexte de gestion</p>
               </div>
               <button 
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content List */}
            <div className="p-2">
              <div className="px-6 py-4">
                <div className="relative">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                  <input 
                    placeholder="RECHERCHER..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-6 h-8 bg-transparent text-[10px] font-black uppercase tracking-widest focus:outline-none placeholder:text-slate-200"
                  />
                </div>
              </div>

              <div className="max-h-[300px] overflow-y-auto px-4 pb-4 space-y-1 custom-scrollbar">
                {filteredDossiers.map((dossier) => (
                  <button
                    key={dossier.id}
                    onClick={() => {
                      setSelectedDossier(dossier);
                      onClose();
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left border group",
                      selectedDossier?.id === dossier.id
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "bg-white border-transparent hover:bg-slate-50 text-slate-600"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                        selectedDossier?.id === dossier.id ? "bg-white/10 border-white/10 text-brand" : "bg-white border-slate-100 text-slate-300"
                      )}>
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className={cn(
                          "font-black uppercase tracking-tight text-[11px]",
                          selectedDossier?.id === dossier.id ? "text-white" : "text-slate-900"
                        )}>{dossier.filename}</h4>
                        <p className="text-[8px] font-bold uppercase tracking-widest opacity-50 mt-0.5">EXERCICE {dossier.exercise}</p>
                      </div>
                    </div>
                    
                    {selectedDossier?.id === dossier.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <button 
                onClick={() => { navigate('/setup'); onClose(); }}
                className="text-[9px] font-black text-brand uppercase tracking-widest hover:underline flex items-center gap-2"
              >
                <Plus className="w-3 h-3" /> Nouveau Fichier
              </button>
              <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest italic">Gateway Unikorp v2.1</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
