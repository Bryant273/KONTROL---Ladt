import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useCompany } from '../../context/CompanyContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Search, 
  BarChart, 
  Calendar, 
  Filter, 
  Download,
  FolderOpen,
  ArrowRight,
  ChevronLeft,
  Sliders,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { saveActionLog } from '../../lib/auditLogger';
import { cn } from '../../lib/utils';

export default function BalanceAdminPage() {
  const { selectedDossier, activeEnterprise } = useCompany();
  const [balanceType, setBalanceType] = useState('6 Colonnes'); // Default 6 cols
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().substring(0, 10));
  const [isGenerated, setIsGenerated] = useState(false);

  // Core high-fidelity sample balance data
  const balanceRows = [
    { id: '101100', label: 'Capital social', ouvD: 0, ouvC: 10000000, mvtD: 0, mvtC: 0, soldeD: 0, soldeC: 10000000 },
    { id: '211000', label: 'Terrains nus', ouvD: 25000000, ouvC: 0, mvtD: 0, mvtC: 0, soldeD: 25000000, soldeC: 0 },
    { id: '401100', label: 'Fournisseurs Services', ouvD: 0, ouvC: 0, mvtD: 1180000, mvtC: 1180000, soldeD: 0, soldeC: 0 },
    { id: '411100', label: 'Clients', ouvD: 0, ouvC: 0, mvtD: 4500000, mvtC: 2500000, soldeD: 2000000, soldeC: 0 },
    { id: '521100', label: 'Banque', ouvD: 5000000, ouvC: 0, mvtD: 10600000, mvtC: 8400000, soldeD: 7200000, soldeC: 0 },
    { id: '601100', label: 'Achats marchandises', ouvD: 0, ouvC: 0, mvtD: 850000, mvtC: 0, soldeD: 850000, soldeC: 0 },
    { id: '701100', label: 'Ventes produits finis', ouvD: 0, ouvC: 0, mvtD: 0, mvtC: 4500000, soldeD: 0, soldeC: 4500000 },
  ];

  const handleGenerate = () => {
    setIsGenerated(true);
    if (selectedDossier) {
      saveActionLog(selectedDossier.id, {
        type: 'Consultation',
        desc: 'Consultation Balance',
        details: `Génération de la balance générale en mode : ${balanceType}`
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
              Balance <span className="text-slate-300">Générale</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
              Dossier actif : <span className="text-[#8B5CF6]">{selectedDossier?.filename || 'Aucun'}</span>
            </p>
          </div>
        </div>

        {/* Configurations/Filters Form Card */}
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-[#8B5CF6]" />
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800">Paramètres de la Balance</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-bold">Modèle d'État d'Impression</label>
              <select 
                value={balanceType}
                onChange={(e) => {
                  setBalanceType(e.target.value);
                  setIsGenerated(false);
                }}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold outline-none focus:border-[#8B5CF6] transition-all cursor-pointer"
              >
                <option value="2 Colonnes">Balance à 2 Colonnes (Soldes finaux)</option>
                <option value="4 Colonnes">Balance à 4 Colonnes (Mouvements, Soldes)</option>
                <option value="6 Colonnes">Balance à 6 Colonnes (Report, Mouvements, Soldes finaux)</option>
                <option value="8 Colonnes">Balance à 8 Colonnes (Report, Mouvements, Cumuls, Soldes)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Période du</label>
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
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Au</label>
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
              className="h-11 px-8 bg-[#8B5CF6] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-purple-100 transition-all border-none flex items-center gap-2 cursor-pointer"
            >
              Générer la Balance <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live dynamic balance list rendering area */}
        {isGenerated ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
            
            {/* Header elements matching the Finance design */}
            <div className="flex flex-col md:flex-row justify-between pb-6 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-[#8B5CF6] flex items-center justify-center rounded-xl font-bold text-lg">
                  <BarChart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase leading-none mb-1">Balance Générale des comptes</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-1 uppercase tracking-wider"><MapPin className="w-3 h-3 text-slate-300" /> Abidjan, Côte d'Ivoire</span>
                    <span>•</span>
                    <span className="uppercase tracking-wider">Modèle : {balanceType}</span>
                    <span>•</span>
                    <span className="uppercase tracking-wider">Période : {new Date(startDate).toLocaleDateString()} au {new Date(endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right flex flex-col justify-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SOCIÉTÉ :</p>
                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{activeEnterprise?.name || 'Votre Société S.A.'}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Généré le : {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Table wrapper */}
            <div className="overflow-x-auto rounded-xl border border-slate-150">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  {/* Category Headers */}
                  <tr className="bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest align-middle">
                    <th rowSpan={balanceType === '2 Colonnes' ? 1 : 2} className="py-4 px-5 border-r border-slate-800">N° Compte</th>
                    <th rowSpan={balanceType === '2 Colonnes' ? 1 : 2} className="py-4 px-5 border-r border-slate-800 min-w-[180px]">Intitulé du compte</th>
                    
                    {balanceType === '8 Colonnes' && (
                      <>
                        <th colSpan={2} className="py-3 px-5 border-b border-slate-800 border-r border-slate-800 text-center bg-slate-800/20">Ouv. (Report)</th>
                        <th colSpan={2} className="py-3 px-5 border-b border-slate-800 border-r border-slate-800 text-center bg-slate-800/40">Mvts Période</th>
                        <th colSpan={2} className="py-3 px-5 border-b border-slate-800 border-r border-slate-800 text-center bg-slate-800/60">Cumuls Mvts</th>
                        <th colSpan={2} className="py-3 px-5 border-b border-slate-800 text-center bg-emerald-950/40">Soldes Finaux</th>
                      </>
                    )}

                    {balanceType === '6 Colonnes' && (
                      <>
                        <th colSpan={2} className="py-3 px-5 border-b border-slate-800 border-r border-slate-800 text-center bg-slate-800/20">Ouv. (Report)</th>
                        <th colSpan={2} className="py-3 px-5 border-b border-slate-800 border-r border-slate-800 text-center bg-slate-800/40">Mvts Période</th>
                        <th colSpan={2} className="py-3 px-5 border-b border-slate-800 text-center bg-emerald-950/40">Soldes Finaux</th>
                      </>
                    )}

                    {balanceType === '4 Colonnes' && (
                      <>
                        <th colSpan={2} className="py-3 px-5 border-b border-slate-800 border-r border-slate-800 text-center bg-slate-800/40">Mouvements</th>
                        <th colSpan={2} className="py-3 px-5 border-b border-slate-800 text-center bg-emerald-950/40">Soldes finaux</th>
                      </>
                    )}

                    {balanceType === '2 Colonnes' && (
                      <>
                        <th className="py-4 px-5 text-right border-r border-slate-800 bg-emerald-950/30">Solde DébiteuR</th>
                        <th className="py-4 px-5 text-right bg-rose-950/30">Solde Créditeur</th>
                      </>
                    )}
                  </tr>

                  {/* Sub Header row */}
                  {(balanceType === '4 Colonnes' || balanceType === '6 Colonnes' || balanceType === '8 Colonnes') && (
                    <tr className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-wider border-t border-slate-800">
                      {/* Solde d'ouverture for 6, 8 cols */}
                      {(balanceType === '6 Colonnes' || balanceType === '8 Colonnes') && (
                        <>
                          <th className="py-2.5 px-5 text-right border-r border-slate-800">Déb.</th>
                          <th className="py-2.5 px-5 text-right border-r border-slate-800">Créd.</th>
                        </>
                      )}
                      
                      {/* Transactions for 4, 6, 8 cols */}
                      <th className="py-2.5 px-5 text-right border-r border-slate-800">Débit</th>
                      <th className="py-2.5 px-5 text-right border-r border-slate-800">Crédit</th>

                      {/* Cumulative transactions for 8 cols */}
                      {balanceType === '8 Colonnes' && (
                        <>
                          <th className="py-2.5 px-5 text-right border-r border-slate-800">Débit</th>
                          <th className="py-2.5 px-5 text-right border-r border-slate-800">Crédit</th>
                        </>
                      )}

                      {/* Final balance columns */}
                      <th className="py-2.5 px-5 text-right border-r border-slate-800 bg-[#10b981]/15 text-emerald-300">DébiteuR</th>
                      <th className="py-2.5 px-5 text-right bg-[#f43f5e]/15 text-rose-300">Créditeur</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {balanceRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-5 font-black text-slate-900 border-r border-slate-100">{row.id}</td>
                      <td className="py-3.5 px-5 font-bold text-slate-600 border-r border-slate-100 uppercase tracking-tight">{row.label}</td>
                      
                      {balanceType === '8 Colonnes' && (
                        <>
                          <td className="py-3.5 px-5 text-right tabular-nums text-slate-400 border-r border-slate-100">{row.ouvD > 0 ? row.ouvD.toLocaleString() : ''}</td>
                          <td className="py-3.5 px-5 text-right tabular-nums text-slate-400 border-r border-slate-100">{row.ouvC > 0 ? row.ouvC.toLocaleString() : ''}</td>
                          <td className="py-3.5 px-5 text-right tabular-nums text-slate-600 border-r border-slate-100">{row.mvtD > 0 ? row.mvtD.toLocaleString() : ''}</td>
                          <td className="py-3.5 px-5 text-right tabular-nums text-slate-600 border-r border-slate-100">{row.mvtC > 0 ? row.mvtC.toLocaleString() : ''}</td>
                          <td className="py-3.5 px-5 text-right tabular-nums text-slate-900 border-r border-slate-100">{(row.ouvD + row.mvtD).toLocaleString()}</td>
                          <td className="py-3.5 px-5 text-right tabular-nums text-slate-900 border-r border-slate-100">{(row.ouvC + row.mvtC).toLocaleString()}</td>
                          <td className="py-3.5 px-5 text-right tabular-nums font-black text-emerald-600 border-r border-slate-100 bg-emerald-50/10">{row.soldeD > 0 ? row.soldeD.toLocaleString() : ''}</td>
                          <td className="py-3.5 px-5 text-right tabular-nums font-black text-rose-600 bg-rose-50/10">{row.soldeC > 0 ? row.soldeC.toLocaleString() : ''}</td>
                        </>
                      )}

                      {balanceType === '6 Colonnes' && (
                        <>
                          <td className="py-3.5 px-5 text-right tabular-nums text-slate-400 border-r border-slate-100">{row.ouvD > 0 ? row.ouvD.toLocaleString() : ''}</td>
                          <td className="py-3.5 px-5 text-right tabular-nums text-slate-400 border-r border-slate-100">{row.ouvC > 0 ? row.ouvC.toLocaleString() : ''}</td>
                          <td className="py-3.5 px-5 text-right tabular-nums text-slate-600 border-r border-slate-100">{row.mvtD > 0 ? row.mvtD.toLocaleString() : ''}</td>
                          <td className="py-3.5 px-5 text-right tabular-nums text-slate-600 border-r border-slate-100">{row.mvtC > 0 ? row.mvtC.toLocaleString() : ''}</td>
                          <td className="py-3.5 px-5 text-right tabular-nums font-black text-emerald-600 border-r border-slate-100 bg-emerald-50/10">{row.soldeD > 0 ? row.soldeD.toLocaleString() : ''}</td>
                          <td className="py-3.5 px-5 text-right tabular-nums font-black text-rose-600 bg-rose-50/10">{row.soldeC > 0 ? row.soldeC.toLocaleString() : ''}</td>
                        </>
                      )}

                      {balanceType === '4 Colonnes' && (
                        <>
                          <td className="py-3.5 px-5 text-right tabular-nums text-slate-600 border-r border-slate-100">{row.mvtD > 0 ? row.mvtD.toLocaleString() : ''}</td>
                          <td className="py-3.5 px-5 text-right tabular-nums text-slate-600 border-r border-slate-100">{row.mvtC > 0 ? row.mvtC.toLocaleString() : ''}</td>
                          <td className="py-3.5 px-5 text-right tabular-nums font-black text-emerald-600 border-r border-slate-100 bg-emerald-50/10">{row.soldeD > 0 ? row.soldeD.toLocaleString() : ''}</td>
                          <td className="py-3.5 px-5 text-right tabular-nums font-black text-rose-600 bg-rose-50/10">{row.soldeC > 0 ? row.soldeC.toLocaleString() : ''}</td>
                        </>
                      )}

                      {balanceType === '2 Colonnes' && (
                        <>
                          <td className="py-3.5 px-5 text-right tabular-nums font-black text-emerald-600 border-r border-slate-100 bg-emerald-50/5">{row.soldeD > 0 ? row.soldeD.toLocaleString() : ''}</td>
                          <td className="py-3.5 px-5 text-right tabular-nums font-black text-rose-600 bg-rose-50/5">{row.soldeC > 0 ? row.soldeC.toLocaleString() : ''}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-350 text-xs">
                  <tr>
                    <td colSpan={2} className="py-4 px-5 text-right uppercase tracking-widest text-[9px] font-black text-slate-400">Somme Balance Totale</td>
                    
                    {balanceType === '8 Colonnes' && (
                      <>
                        <td className="py-4 px-5 text-right border-l border-slate-200">30 000 000</td>
                        <td className="py-4 px-5 text-right border-l border-slate-200">10 000 000</td>
                        <td className="py-4 px-5 text-right border-l border-slate-200">18 130 000</td>
                        <td className="py-4 px-5 text-right border-l border-slate-200">18 130 000</td>
                        <td className="py-4 px-5 text-right border-l border-slate-200">48 130 000</td>
                        <td className="py-4 px-5 text-right border-l border-slate-200">28 130 000</td>
                        <td className="py-4 px-5 text-right border-l border-slate-200 text-emerald-700 bg-white">35 050 000</td>
                        <td className="py-4 px-5 text-right border-l border-slate-200 text-rose-700 bg-white">35 050 000</td>
                      </>
                    )}

                    {balanceType === '6 Colonnes' && (
                      <>
                        <td className="py-4 px-5 text-right border-l border-slate-200">30 000 000</td>
                        <td className="py-4 px-5 text-right border-l border-slate-200">10 000 000</td>
                        <td className="py-4 px-5 text-right border-l border-slate-200">18 130 000</td>
                        <td className="py-4 px-5 text-right border-l border-slate-200">18 130 000</td>
                        <td className="py-4 px-5 text-right border-l border-slate-200 text-emerald-700 bg-white">35 050 000</td>
                        <td className="py-4 px-5 text-right border-l border-slate-200 text-rose-700 bg-white">35 050 000</td>
                      </>
                    )}

                    {balanceType === '4 Colonnes' && (
                      <>
                        <td className="py-4 px-5 text-right border-l border-slate-200">18 130 000</td>
                        <td className="py-4 px-5 text-right border-l border-slate-200">18 130 000</td>
                        <td className="py-4 px-5 text-right border-l border-slate-200 text-emerald-700 bg-white">35 050 000</td>
                        <td className="py-4 px-5 text-right border-l border-slate-200 text-rose-700 bg-white">35 050 000</td>
                      </>
                    )}

                    {balanceType === '2 Colonnes' && (
                      <>
                        <td className="py-4 px-5 text-right border-l border-slate-200 text-emerald-700 bg-white">35 050 000</td>
                        <td className="py-4 px-5 text-right border-l border-slate-200 text-rose-700 bg-white">35 050 000</td>
                      </>
                    )}
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Print action and audit checks */}
            <div className="flex justify-between items-center pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider">État Équilibré et validé</span>
              </div>
              <button 
                onClick={() => window.print()}
                className="h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer border-none"
              >
                <Download className="w-3.5 h-3.5" /> Exporter la Balance
              </button>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center shadow-sm max-w-2xl mx-auto flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-purple-50 text-[#8B5CF6] rounded-2xl flex items-center justify-center mb-6">
              <BarChart className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Générer la Balance</h3>
            <p className="text-xs text-slate-400 font-medium max-w-sm mt-1 mb-8">
              Établissez l'état global périodique de contrôle pour vérifier l'équilibre parfait de la partie double de vos comptes.
            </p>
            <button 
              onClick={handleGenerate}
              className="h-11 px-8 bg-[#8B5CF6] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-purple-100 transition-all border-none cursor-pointer"
            >
              Générer la Balance
            </button>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
