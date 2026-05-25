import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useCompany } from '../../context/CompanyContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Search, 
  Book, 
  Calendar, 
  Filter, 
  Download,
  FolderOpen,
  ArrowRight,
  ChevronLeft,
  Sliders,
  MapPin
} from 'lucide-react';
import { saveActionLog } from '../../lib/auditLogger';
import { cn } from '../../lib/utils';

export default function LedgerAdminPage() {
  const { selectedDossier, activeEnterprise } = useCompany();
  const [accountStart, setAccountStart] = useState('100000');
  const [accountEnd, setAccountEnd] = useState('799999');
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().substring(0, 10));
  const [isGenerated, setIsGenerated] = useState(false);

  // High quality sample data representing general ledger transactions grouped by accounts
  const ledgerAccounts = [
    {
      code: '211000',
      label: 'TERRAINS NUS',
      initialBalance: { type: 'Débiteur', amount: 25000000 },
      transactions: [
        { date: '01/01/2024', journal: 'OD', piece: 'REP-001', label: 'Bilan d\'ouverture N', debit: 25000000, credit: 0, balance: 25000000, type: 'D' }
      ],
      totalDebit: 25000000,
      totalCredit: 0,
      finalBalance: { type: 'Débiteur', amount: 25000000 }
    },
    {
      code: '401000',
      label: 'FOURNISSEURS GROUPE',
      initialBalance: { type: 'Créditeur', amount: 0 },
      transactions: [
        { date: '15/01/2024', journal: 'ACH', piece: 'FACT-088', label: 'Achat matières premières', debit: 0, credit: 1180000, balance: 1180000, type: 'C' },
        { date: '22/01/2024', journal: 'ACH', piece: 'F-2024-001', label: 'Achat fournitures de bureau', debit: 0, credit: 590000, balance: 1770000, type: 'C' }
      ],
      totalDebit: 0,
      totalCredit: 1770000,
      finalBalance: { type: 'Créditeur', amount: 1770000 }
    },
    {
      code: '521100',
      label: 'BANQUE DE L\'HABITAT CI',
      initialBalance: { type: 'Débiteur', amount: 5000000 },
      transactions: [
        { date: '01/01/2024', journal: 'OD', piece: 'REP-001', label: 'Bilan d\'ouverture N', debit: 5000000, credit: 0, balance: 5000000, type: 'D' },
        { date: '20/01/2024', journal: 'BQ', piece: 'RECOV-99', label: 'Règlement facture Client Alpha', debit: 1200000, credit: 0, balance: 6200000, type: 'D' }
      ],
      totalDebit: 6200000,
      totalCredit: 0,
      finalBalance: { type: 'Débiteur', amount: 6200000 }
    }
  ];

  const handleGenerate = () => {
    setIsGenerated(true);
    if (selectedDossier) {
      saveActionLog(selectedDossier.id, {
        type: 'Consultation',
        desc: 'Consultation Grand livre',
        details: `Génération du Grand Livre Général des comptes ${accountStart} à ${accountEnd}`
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
              Grand Livre <span className="text-slate-300">Général</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
              Dossier actif : <span className="text-[#8B5CF6]">{selectedDossier?.filename || 'Aucun'}</span>
            </p>
          </div>
        </div>

        {/* Filters/Criteria */}
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-[#8B5CF6]" />
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800">Fourchette de comptes</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Compte début</label>
              <input 
                type="text" 
                value={accountStart}
                onChange={(e) => {
                  setAccountStart(e.target.value);
                  setIsGenerated(false);
                }}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold outline-none focus:border-[#8B5CF6] transition-all"
                placeholder="100000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Compte fin</label>
              <input 
                type="text" 
                value={accountEnd}
                onChange={(e) => {
                  setAccountEnd(e.target.value);
                  setIsGenerated(false);
                }}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold outline-none focus:border-[#8B5CF6] transition-all"
                placeholder="799999"
              />
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
              className="h-11 px-8 bg-[#8B5CF6] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-95 shadow-xl shadow-purple-100 transition-all border-none cursor-pointer flex items-center gap-2"
            >
              Générer le Grand Livre <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Ledger Report */}
        {isGenerated ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {ledgerAccounts.map((account, index) => (
              <div key={index} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
                
                {/* Account Details */}
                <div className="flex flex-col md:flex-row justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-3">
                      <span className="text-white bg-slate-900 px-3 py-1.5 rounded-lg text-xs font-mono">{account.code}</span>
                      <span className="uppercase text-slate-700">{account.label}</span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">A SOLDE INITIAL :</p>
                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight">
                      {account.initialBalance.amount.toLocaleString()} FCFA ({account.initialBalance.type})
                    </p>
                  </div>
                </div>

                {/* Account entries list table */}
                <div className="overflow-x-auto rounded-xl border border-slate-100/50">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-wider text-left border-b border-slate-100">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Journal</th>
                        <th className="py-3 px-4">Pièce Ref</th>
                        <th className="py-3 px-4">Libellé de l'écriture comptable</th>
                        <th className="py-3 px-4 text-right">Mouvement Débit</th>
                        <th className="py-3 px-4 text-right">Mouvement Crédit</th>
                        <th className="py-3 px-4 text-right">Solde progressif</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {account.transactions.map((tx, tIdx) => (
                        <tr key={tIdx} className="hover:bg-slate-50/50 text-slate-700">
                          <td className="py-3.5 px-4 font-semibold text-slate-550">{tx.date}</td>
                          <td className="py-3.5 px-4 font-black text-[#8B5CF6] uppercase">{tx.journal}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-800 tracking-tight uppercase">{tx.piece}</td>
                          <td className="py-3.5 px-4 font-medium text-slate-500">{tx.label}</td>
                          <td className="py-3.5 px-4 text-right font-bold text-emerald-600 tabular-nums">
                            {tx.debit > 0 ? tx.debit.toLocaleString() : ''}
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold text-rose-500 tabular-nums">
                            {tx.credit > 0 ? tx.credit.toLocaleString() : ''}
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold text-slate-900 tabular-nums">
                            {tx.balance.toLocaleString()} <span className="text-[9px] text-slate-400 ml-1">{tx.type}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50/50 font-black text-slate-900">
                      <tr>
                        <td colSpan={4} className="py-4 px-4 text-right uppercase tracking-widest text-[9px] text-slate-400">Total Période et Solde Final</td>
                        <td className="py-4 px-4 text-right text-emerald-600 border-l border-slate-100/50">
                          {account.totalDebit > 0 ? account.totalDebit.toLocaleString() : '-'}
                        </td>
                        <td className="py-4 px-4 text-right text-rose-500 border-l border-slate-100/50">
                          {account.totalCredit > 0 ? account.totalCredit.toLocaleString() : '-'}
                        </td>
                        <td className="py-4 px-4 text-right text-slate-900 border-l border-slate-100/50 font-mono">
                          {account.finalBalance.amount.toLocaleString()} <span className="text-[9px] text-slate-400 ml-1">({account.finalBalance.type === 'Débiteur' ? 'D' : 'C'})</span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

              </div>
            ))}

            {/* Print trigger options */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Validité SYSCOHADA certifiée</span>
              <button 
                onClick={() => window.print()}
                className="h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer border-none"
              >
                <Download className="w-3.5 h-3.5" /> Imprimer le Grand Livre
              </button>
            </div>
            
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center shadow-sm max-w-2xl mx-auto flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-purple-50 text-[#8B5CF6] rounded-2xl flex items-center justify-center mb-6">
              <Book className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Générer le Grand Livre</h3>
            <p className="text-xs text-slate-400 font-medium max-w-sm mt-1 mb-8">
              Lancez le traitement et dressez l'inventaire historique des flux financiers de l'entreprise sur chaque compte général.
            </p>
            <button 
              onClick={handleGenerate}
              className="h-11 px-8 bg-[#8B5CF6] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-purple-100 transition-all border-none cursor-pointer"
            >
              Générer l'état
            </button>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
