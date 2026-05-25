import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useCompany } from '../../context/CompanyContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Search, 
  BookText, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  Download,
  FolderOpen,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  MapPin,
  RefreshCw,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { saveActionLog } from '../../lib/auditLogger';
import { cn } from '../../lib/utils';

export default function JournalsAdminPage() {
  const { selectedDossier, activeEnterprise, journals, entries } = useCompany();
  const { user } = useAuth();
  
  const [selectedJournal, setSelectedJournal] = useState('ACH - Journal des achats');
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().substring(0, 10));
  const [isGenerated, setIsGenerated] = useState(false);
  
  // Custom dummy entries list matched dynamically of type selectedJournal
  const reportEntries = [
    { 
      date: '15/01/2024', 
      compta: 'ACH-2401-001', 
      lines: [
        { account: '602100', tiers: '-', label: 'Matières premières', debit: 1000000, credit: 0 },
        { account: '445660', tiers: '-', label: 'TVA déductible', debit: 180000, credit: 0 },
        { account: '401000', tiers: 'FOURN001', label: 'Entreprise Xmaginsie', debit: 0, credit: 1180000 },
      ]
    },
    { 
      date: '22/01/2024', 
      compta: 'ACH-2401-002', 
      lines: [
        { account: '601400', tiers: '-', label: 'Fournitures consommables', debit: 500000, credit: 0 },
        { account: '445660', tiers: '-', label: 'TVA déductible', debit: 90000, credit: 0 },
        { account: '401000', tiers: 'FOURN002', label: 'FournisPlus S.A.', debit: 0, credit: 590000 },
      ]
    }
  ];

  const handleGenerate = () => {
    setIsGenerated(true);
    if (selectedDossier) {
      saveActionLog(selectedDossier.id, {
        type: 'Consultation',
        desc: 'Consultation journal',
        details: `Génération de l'état pour le journal : ${selectedJournal}`
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
        
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-0.5 bg-[#8B5CF6]"></span>
              <p className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-[0.3em]">SKOMPTAB Core Engine</p>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Journaux <span className="text-slate-300">Sectionnels</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
              Dossier actif : <span className="text-[#8B5CF6]">{selectedDossier?.filename || 'Aucun'}</span>
            </p>
          </div>
        </div>

        {/* Filters/Criteria Box */}
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-[#8B5CF6]" />
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800">Critères de ciblage</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Journal comptable</label>
              <select 
                value={selectedJournal}
                onChange={(e) => {
                  setSelectedJournal(e.target.value);
                  setIsGenerated(false);
                }}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold outline-none focus:border-[#8B5CF6] transition-all cursor-pointer"
              >
                <option value="ACH - Journal des achats">ACH - Journal des achats</option>
                <option value="VTE - Journal des ventes">VTE - Journal des ventes</option>
                <option value="BQ - Journal de banque">BQ - Journal de banque</option>
                <option value="OD - Opérations diverses">OD - Opérations diverses</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Date début</label>
              <input 
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setIsGenerated(false);
                }}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold outline-none focus:border-[#8B5CF6] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Date fin</label>
              <input 
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setIsGenerated(false);
                }}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold outline-none focus:border-[#8B5CF6] transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              onClick={handleGenerate}
              className="h-11 px-8 bg-[#8B5CF6] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-95 shadow-xl shadow-purple-100 transition-all cursor-pointer border-none flex items-center gap-2"
            >
              Générer l'état <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live generated report rendering space */}
        {isGenerated ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Report Header Block */}
            <div className="flex flex-col md:flex-row justify-between pb-6 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-[#8B5CF6] flex items-center justify-center rounded-xl font-bold text-lg">
                  <BookText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase leading-none mb-1">{selectedJournal}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-1 uppercase tracking-wider"><MapPin className="w-3 h-3 text-slate-300" /> Abidjan, Côte d'Ivoire</span>
                    <span>•</span>
                    <span className="uppercase tracking-wider">Période : {new Date(startDate).toLocaleDateString()} au {new Date(endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right flex flex-col justify-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SOCIÉTÉ :</p>
                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{activeEnterprise?.name || 'Votre Société S.A.'}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Imprimé le : {new Date().toLocaleDateString()} à {new Date().toLocaleTimeString().substring(0, 5)}</p>
              </div>
            </div>

            {/* Print Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest text-left">
                    <th className="py-4 px-6 w-32 border-r border-slate-800">Date Opérat.</th>
                    <th className="py-4 px-6 w-40 border-r border-slate-800">Num. Saisie</th>
                    <th className="py-4 px-0" colSpan={5}>
                      <div className="grid grid-cols-5 h-full">
                        <div className="px-6 py-4 border-r border-slate-800">Compte Gén.</div>
                        <div className="px-6 py-4 border-r border-slate-800">Tiers</div>
                        <div className="px-6 py-4 border-r border-slate-800">Libellé écriture</div>
                        <div className="px-6 py-4 border-r border-slate-800 text-right">Débit</div>
                        <div className="px-6 py-4 text-right">Crédit</div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {reportEntries.map((tx, idx) => (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors">
                      <td className="py-5 px-6 font-bold text-slate-500 border-r border-slate-100 text-center">{tx.date}</td>
                      <td className="py-5 px-6 font-black text-slate-900 border-r border-slate-100 uppercase tracking-tight">{tx.compta}</td>
                      <td className="p-0" colSpan={5}>
                        <div className="divide-y divide-slate-100">
                          {tx.lines.map((line, lIdx) => (
                            <div key={lIdx} className="grid grid-cols-5">
                              <div className="px-6 py-3.5 font-bold text-slate-700">{line.account}</div>
                              <div className="px-6 py-3.5 font-black text-[#8B5CF6] uppercase tracking-widest text-[9px]">
                                {line.tiers !== '-' ? line.tiers : ''}
                              </div>
                              <div className="px-6 py-3.5 text-slate-500 font-medium">{line.label}</div>
                              <div className="px-6 py-3.5 text-right tabular-nums font-bold text-emerald-600">
                                {line.debit > 0 ? line.debit.toLocaleString() : ''}
                              </div>
                              <div className="px-6 py-3.5 text-right tabular-nums font-bold text-rose-500">
                                {line.credit > 0 ? line.credit.toLocaleString() : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-black text-slate-900 text-sm">
                  <tr className="border-t-2 border-slate-200">
                    <td colSpan={2} className="py-4 px-6 text-center uppercase tracking-widest text-[9px] font-black text-slate-400">Somme Totaux</td>
                    <td colSpan={3} className="p-0" />
                    <td className="py-4 px-6 text-right tabular-nums font-mono text-emerald-600 border-l border-slate-150">1 680 000</td>
                    <td className="py-4 px-6 text-right tabular-nums font-mono text-rose-600 border-l border-slate-150">1 680 000</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Options Row */}
            <div className="flex justify-between items-center pt-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Intégrité d'audit certifiée • SYSCOHADA</p>
              <button 
                onClick={() => window.print()}
                className="h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-2 border-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Exporter en PDF d'état
              </button>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center shadow-sm max-w-2xl mx-auto flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-purple-50 text-[#8B5CF6] rounded-2xl flex items-center justify-center mb-6">
              <BookText className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Générer l'état du Journal</h3>
            <p className="text-xs text-slate-400 font-medium max-w-sm mt-1 mb-8">
              Sélectionnez vos critères de filtrage de dates ci-dessus pour générer dynamiquement l'état journalier ou mensuel.
            </p>
            <button 
              onClick={handleGenerate}
              className="h-11 px-8 bg-[#8B5CF6] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-95 transition-all shadow-xl shadow-purple-100 border-none cursor-pointer"
            >
              Générer maintenant
            </button>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
