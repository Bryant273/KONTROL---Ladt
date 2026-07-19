import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Settings, 
  FileText, 
  PieChart, 
  Download, 
  Printer, 
  Plus, 
  Search, 
  CheckCircle, 
  Building, 
  User, 
  Briefcase, 
  Percent, 
  ChevronRight, 
  Sliders,
  DollarSign,
  Coins
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { saveActionLog } from '../../../lib/auditLogger';
import { Employee } from './PersonnelViews';

// Interfaces
export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  matricule: string;
  position: string;
  department: string;
  month: string; // e.g. "Mai 2026"
  baseSalary: number;
  seniorityBonus: number;
  transportAllowance: number;
  grossSalary: number;
  cnpsDeduction: number; // 5.5% Salariale
  itsTaxDeduction: number; // ~1.2% ITS
  igrTaxDeduction: number; // ~2% IGR
  cnTaxDeduction: number; // ~1.5% CN
  totalDeductions: number;
  netSalary: number;
  employerCnps: number; // 7.7% Patronale
  status: 'Payé' | 'Généré';
}

interface ViewProps {
  selectedDossierId: string | null;
}

// 1. PARAMETRAGE DE LA PAIE VIEW
export function PayrollSettingsView({ selectedDossierId }: ViewProps) {
  const [rates, setRates] = useState({
    cnpsSalariale: 5.5,
    cnpsPatronale: 7.7,
    smig: 75000,
    transportExempt: 30000, // Indemnité de transport exonérée
    primeTransportFixe: 35000,
    itsRate: 1.2,
    cnRate: 1.5,
  });

  useEffect(() => {
    const key = `payroll_settings_${selectedDossierId || 'default'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setRates(JSON.parse(saved));
    }
  }, [selectedDossierId]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const key = `payroll_settings_${selectedDossierId || 'default'}`;
    localStorage.setItem(key, JSON.stringify(rates));
    alert('Paramètres de calcul de paie sauvegardés !');
    if (selectedDossierId) {
      saveActionLog(selectedDossierId, {
        type: 'Paramétrage',
        desc: 'Mise à jour des barèmes de paie',
        details: `CNPS Salariale: ${rates.cnpsSalariale}%, Patronale: ${rates.cnpsPatronale}%, SMIG: ${rates.smig} FCFA`
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Paramètres légaux de la paie</h2>
        <p className="text-xs text-slate-400">Configurez les taux de cotisations CNPS, le SMIG et les plafonds d'exonérations d'impôts</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm max-w-3xl mx-auto">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-50 mb-6">
          <Settings className="w-5 h-5 text-[#4A9EC9]" />
          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800">Taux & Barèmes SYSCOHADA (Côte d'Ivoire)</h4>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase text-[#4A9EC9] tracking-wider">Sécurité Sociale (CNPS)</h5>
              
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Part Salariale (%)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={rates.cnpsSalariale}
                  onChange={e => setRates({...rates, cnpsSalariale: Number(e.target.value)})}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Part Patronale (%)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={rates.cnpsPatronale}
                  onChange={e => setRates({...rates, cnpsPatronale: Number(e.target.value)})}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase text-[#4A9EC9] tracking-wider">SMIG & Indemnités</h5>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SMIG Mensuel (FCFA)</label>
                <input 
                  type="number" 
                  value={rates.smig}
                  onChange={e => setRates({...rates, smig: Number(e.target.value)})}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Prime de transport exonérée maximum (FCFA)</label>
                <input 
                  type="number" 
                  value={rates.transportExempt}
                  onChange={e => setRates({...rates, transportExempt: Number(e.target.value)})}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
                />
              </div>
            </div>

            <div className="space-y-4 md:col-span-2">
              <h5 className="text-[10px] font-black uppercase text-[#4A9EC9] tracking-wider border-t border-slate-50 pt-4">Impôts sur les Salaires (IS / CN / IGR)</h5>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Taux ITS (%)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={rates.itsRate}
                    onChange={e => setRates({...rates, itsRate: Number(e.target.value)})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Taux CN (%)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={rates.cnRate}
                    onChange={e => setRates({...rates, cnRate: Number(e.target.value)})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Prime Transport Standard (FCFA)</label>
                  <input 
                    type="number" 
                    value={rates.primeTransportFixe}
                    onChange={e => setRates({...rates, primeTransportFixe: Number(e.target.value)})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-50 flex justify-end">
            <button 
              type="submit"
              className="h-11 px-8 bg-[#4A9EC9] hover:bg-[#3D8CB7] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-0 cursor-pointer shadow-lg shadow-[#4A9EC9]/20"
            >
              Sauvegarder la configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 2. BULLETINS DE SALAIRE VIEW (Payslips List & real-time slip generator)
export function BulletinsView({ selectedDossierId }: ViewProps) {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('Mai 2026');

  useEffect(() => {
    // Load Employees
    const empKey = `employees_${selectedDossierId || 'default'}`;
    const savedEmps = localStorage.getItem(empKey);
    if (savedEmps) {
      setEmployees(JSON.parse(savedEmps));
    }

    const key = `payslips_${selectedDossierId || 'default'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setPayslips(JSON.parse(saved));
    } else {
      // empty initial slips, let user generate them!
      setPayslips([]);
    }
  }, [selectedDossierId]);

  const savePayslips = (data: Payslip[]) => {
    setPayslips(data);
    const key = `payslips_${selectedDossierId || 'default'}`;
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleGenerateMonth = () => {
    if (employees.length === 0) {
      alert("Aucun employé enregistré dans ce dossier. Veuillez d'abord ajouter des employés.");
      return;
    }

    // Check if slips already generated for this month
    const exists = payslips.some(p => p.month === selectedMonth);
    if (exists) {
      if (!confirm(`Des bulletins ont déjà été générés pour ${selectedMonth}. Voulez-vous les écraser et régénérer ?`)) {
        return;
      }
    }

    // Load Settings
    const settingsKey = `payroll_settings_${selectedDossierId || 'default'}`;
    const savedSettings = localStorage.getItem(settingsKey);
    const rates = savedSettings ? JSON.parse(savedSettings) : {
      cnpsSalariale: 5.5,
      cnpsPatronale: 7.7,
      primeTransportFixe: 35000,
      itsRate: 1.2,
      cnRate: 1.5,
    };

    const newSlips: Payslip[] = employees.map(emp => {
      const base = emp.salary;
      const seniorityBonus = Math.round(base * 0.02); // 2% seniority bonus
      const transport = rates.primeTransportFixe;
      const gross = base + seniorityBonus + transport;

      // Deductions
      const cnps = Math.round(base * (rates.cnpsSalariale / 100));
      const its = Math.round(base * (rates.itsRate / 100));
      const cn = Math.round(base * (rates.cnRate / 100));
      const igr = Math.round(base * 0.02); // Simpler standard IGR calculation

      const totalDeducts = cnps + its + cn + igr;
      const net = gross - totalDeducts;
      const employerCnps = Math.round(base * (rates.cnpsPatronale / 100));

      return {
        id: `pay-${emp.id}-${Date.now()}`,
        employeeId: emp.id,
        employeeName: emp.name,
        matricule: emp.matricule,
        position: emp.position,
        department: emp.department,
        month: selectedMonth,
        baseSalary: base,
        seniorityBonus,
        transportAllowance: transport,
        grossSalary: gross,
        cnpsDeduction: cnps,
        itsTaxDeduction: its,
        igrTaxDeduction: igr,
        cnTaxDeduction: cn,
        totalDeductions: totalDeducts,
        netSalary: net,
        employerCnps,
        status: 'Généré'
      };
    });

    // Remove duplicates of same month if they existed, and append
    const cleanSlips = payslips.filter(p => p.month !== selectedMonth);
    const updated = [...newSlips, ...cleanSlips];
    savePayslips(updated);

    if (selectedDossierId) {
      saveActionLog(selectedDossierId, {
        type: 'Traitement',
        desc: `Bulletins du mois de ${selectedMonth} générés`,
        details: `Calcul de la paie pour ${newSlips.length} employés actifs`
      });
    }

    alert(`Succès! ${newSlips.length} bulletins de salaire ont été générés pour le mois de ${selectedMonth}.`);
  };

  const handleMarkPaid = (id: string) => {
    const updated = payslips.map(p => {
      if (p.id === id) {
        return { ...p, status: 'Payé' as const };
      }
      return p;
    });
    savePayslips(updated);
  };

  const filteredSlips = payslips.filter(p => p.month === selectedMonth);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Bulletins de salaire & Rémunérations</h2>
          <p className="text-xs text-slate-400">Émission, contrôle de la partie double salariale et déchargement des bulletins de salaire</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-wider outline-none cursor-pointer"
          >
            <option value="Janvier 2026">Janvier 2026</option>
            <option value="Février 2026">Février 2026</option>
            <option value="Mars 2026">Mars 2026</option>
            <option value="Avril 2026">Avril 2026</option>
            <option value="Mai 2026">Mai 2026</option>
            <option value="Juin 2026">Juin 2026</option>
            <option value="Juillet 2026">Juillet 2026</option>
          </select>

          <button 
            onClick={handleGenerateMonth}
            className="bg-[#4A9EC9] hover:bg-[#3D8CB7] text-white h-11 px-6 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg shadow-[#4A9EC9]/20 border-0"
          >
            <Receipt className="w-4 h-4" /> Calculer & Générer la paie
          </button>
        </div>
      </div>

      {/* Payslips table of selected month */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800">État des bulletins : {selectedMonth}</h4>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{filteredSlips.length} bulletin(s) généré(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="py-3 px-4">Matricule</th>
                <th className="py-3 px-4">Nom de l'employé</th>
                <th className="py-3 px-4 text-right">Salaire de Base</th>
                <th className="py-3 px-4 text-right">Indemnité Transp.</th>
                <th className="py-3 px-4 text-right">Charges Salariales</th>
                <th className="py-3 px-4 text-right">Net à payer</th>
                <th className="py-3 px-4 text-center">État</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {filteredSlips.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="py-4 px-4 font-mono font-black text-xs text-slate-500">{p.matricule}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">{p.employeeName}</td>
                  <td className="py-4 px-4 text-right tabular-nums">{p.baseSalary.toLocaleString()} F</td>
                  <td className="py-4 px-4 text-right tabular-nums text-slate-500">{p.transportAllowance.toLocaleString()} F</td>
                  <td className="py-4 px-4 text-right text-rose-500 tabular-nums">-{p.totalDeductions.toLocaleString()} F</td>
                  <td className="py-4 px-4 text-right font-black text-slate-900 tabular-nums bg-slate-50/20">
                    {p.netSalary.toLocaleString()} <span className="text-[10px] text-slate-400">FCFA</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest inline-flex items-center gap-1",
                      p.status === 'Payé' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedPayslip(p)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors border-0 cursor-pointer"
                        title="Voir le Bulletin SYSCOHADA"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      {p.status === 'Généré' && (
                        <button
                          onClick={() => handleMarkPaid(p.id)}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[9px] font-black uppercase tracking-widest border-0 cursor-pointer"
                        >
                          Régler
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSlips.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest bg-white">
                    Aucun bulletin calculé pour ce mois. Veuillez cliquer sur "Calculer & Générer la paie".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SYSCOHADA PAYSLIP DETAIL MODAL / PRINT PREVIEW */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] border border-slate-150 shadow-2xl w-full max-w-2xl overflow-hidden my-8">
            
            {/* Action Bar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aperçu du bulletin SYSCOHADA</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border-0 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimer
                </button>
                <button 
                  onClick={() => setSelectedPayslip(null)} 
                  className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 border-0 cursor-pointer font-bold"
                >✕</button>
              </div>
            </div>

            {/* Real Payslip Area */}
            <div className="p-8 space-y-6 text-slate-800 font-sans text-xs">
              
              {/* Header Box */}
              <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-6">
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tight text-slate-950">UNIKORP S.A.R.L</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Abidjan, Côte d'Ivoire</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">N° CNPS Employeur: 304561-A</p>
                </div>
                <div className="text-right">
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900">BULLETIN DE SALAIRE</h3>
                  <p className="text-xs font-black text-[#4A9EC9] uppercase tracking-wider mt-1">PÉRIODE : {selectedPayslip.month}</p>
                </div>
              </div>

              {/* Employee info block */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">COLLABORATEUR :</p>
                  <p className="font-bold text-slate-900 text-xs uppercase">{selectedPayslip.employeeName}</p>
                  <p className="text-[10px] text-slate-500 font-semibold">Poste : {selectedPayslip.position}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">MATRICULE :</p>
                  <p className="font-black text-slate-900 font-mono text-xs">{selectedPayslip.matricule}</p>
                  <p className="text-[10px] text-slate-500 font-semibold">Département : {selectedPayslip.department}</p>
                </div>
              </div>

              {/* Payslip grid */}
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 text-left text-[9px] font-black uppercase tracking-widest text-slate-500">
                    <th className="py-2">Rubrique / Code</th>
                    <th className="py-2">Désignation</th>
                    <th className="py-2 text-right">Base de calcul</th>
                    <th className="py-2 text-right text-emerald-600">Gain (Part+)</th>
                    <th className="py-2 text-right text-rose-500">Retenue (Part-)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  <tr>
                    <td className="py-2 text-slate-400 font-mono">101</td>
                    <td className="py-2 uppercase">Salaire de Base</td>
                    <td className="py-2 text-right tabular-nums">{selectedPayslip.baseSalary.toLocaleString()}</td>
                    <td className="py-2 text-right text-emerald-600 tabular-nums">{selectedPayslip.baseSalary.toLocaleString()}</td>
                    <td className="py-2 text-right"></td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-400 font-mono">104</td>
                    <td className="py-2 uppercase">Prime d'ancienneté (2%)</td>
                    <td className="py-2 text-right tabular-nums">{selectedPayslip.baseSalary.toLocaleString()}</td>
                    <td className="py-2 text-right text-emerald-600 tabular-nums">{selectedPayslip.seniorityBonus.toLocaleString()}</td>
                    <td className="py-2 text-right"></td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-400 font-mono">115</td>
                    <td className="py-2 uppercase">Indemnité de transport</td>
                    <td className="py-2 text-right">Standard</td>
                    <td className="py-2 text-right text-emerald-600 tabular-nums">{selectedPayslip.transportAllowance.toLocaleString()}</td>
                    <td className="py-2 text-right"></td>
                  </tr>
                  
                  {/* Deductions rows */}
                  <tr>
                    <td className="py-2 text-slate-400 font-mono">301</td>
                    <td className="py-2 uppercase">Retenue CNPS (5.5%)</td>
                    <td className="py-2 text-right tabular-nums">{selectedPayslip.baseSalary.toLocaleString()}</td>
                    <td className="py-2 text-right"></td>
                    <td className="py-2 text-right text-rose-500 tabular-nums">{selectedPayslip.cnpsDeduction.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-400 font-mono">310</td>
                    <td className="py-2 uppercase">Impôt ITS (1.2%)</td>
                    <td className="py-2 text-right tabular-nums">{selectedPayslip.baseSalary.toLocaleString()}</td>
                    <td className="py-2 text-right"></td>
                    <td className="py-2 text-right text-rose-500 tabular-nums">{selectedPayslip.itsTaxDeduction.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-400 font-mono">320</td>
                    <td className="py-2 uppercase">Impôt Contribution Nationale</td>
                    <td className="py-2 text-right tabular-nums">{selectedPayslip.baseSalary.toLocaleString()}</td>
                    <td className="py-2 text-right"></td>
                    <td className="py-2 text-right text-rose-500 tabular-nums">{selectedPayslip.cnTaxDeduction.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-400 font-mono">330</td>
                    <td className="py-2 uppercase">Impôt IGR (Barème)</td>
                    <td className="py-2 text-right tabular-nums">{selectedPayslip.baseSalary.toLocaleString()}</td>
                    <td className="py-2 text-right"></td>
                    <td className="py-2 text-right text-rose-500 tabular-nums">{selectedPayslip.igrTaxDeduction.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              {/* Total blocks */}
              <div className="grid grid-cols-2 gap-6 border-t-2 border-slate-300 pt-4">
                <div className="space-y-1.5 text-slate-500">
                  <p className="flex justify-between"><span>Total Gains Bruts :</span> <span className="font-bold text-slate-900">{selectedPayslip.grossSalary.toLocaleString()} F</span></p>
                  <p className="flex justify-between"><span>Total Retenues :</span> <span className="font-bold text-slate-900">{selectedPayslip.totalDeductions.toLocaleString()} F</span></p>
                </div>
                
                <div className="bg-slate-950 text-white rounded-xl p-4 flex flex-col justify-center items-center text-center">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">NET À PAYER DIRECTEMENT</p>
                  <p className="text-xl font-black font-mono tracking-tight mt-1">{selectedPayslip.netSalary.toLocaleString()} FCFA</p>
                </div>
              </div>

              {/* Footer text */}
              <div className="border-t border-slate-100 pt-4 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                Paiement par virement bancaire sécurisé • SYSCOHADA v1
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// 3. LIVRE DE PAIE VIEW (Payroll Ledger)
export function PayrollLedgerView({ selectedDossierId }: ViewProps) {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('Mai 2026');

  useEffect(() => {
    const key = `payslips_${selectedDossierId || 'default'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setPayslips(JSON.parse(saved));
    }
  }, [selectedDossierId, payslips]);

  const filteredSlips = payslips.filter(p => p.month === selectedMonth);

  // Sums
  const totalBase = filteredSlips.reduce((acc, curr) => acc + curr.baseSalary, 0);
  const totalTransport = filteredSlips.reduce((acc, curr) => acc + curr.transportAllowance, 0);
  const totalGross = filteredSlips.reduce((acc, curr) => acc + curr.grossSalary, 0);
  const totalCnps = filteredSlips.reduce((acc, curr) => acc + curr.cnpsDeduction, 0);
  const totalTaxes = filteredSlips.reduce((acc, curr) => acc + (curr.itsTaxDeduction + curr.cnTaxDeduction + curr.igrTaxDeduction), 0);
  const totalNet = filteredSlips.reduce((acc, curr) => acc + curr.netSalary, 0);
  const totalEmployerCnps = filteredSlips.reduce((acc, curr) => acc + curr.employerCnps, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Livre de paie récapitulatif</h2>
          <p className="text-xs text-slate-400">Livre de contrôle périodique listant de manière nominative toutes les lignes de rémunération</p>
        </div>
        
        <select 
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-wider outline-none cursor-pointer"
        >
          <option value="Janvier 2026">Janvier 2026</option>
          <option value="Février 2026">Février 2026</option>
          <option value="Mars 2026">Mars 2026</option>
          <option value="Avril 2026">Avril 2026</option>
          <option value="Mai 2026">Mai 2026</option>
          <option value="Juin 2026">Juin 2026</option>
          <option value="Juillet 2026">Juillet 2026</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">Livre de paie nominatif : {selectedMonth}</span>
          <button 
            onClick={() => window.print()}
            className="h-9 px-4 bg-slate-900 hover:bg-slate-850 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Imprimer Livre de paie
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-[9px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <th className="py-3 px-3">Matricule</th>
                <th className="py-3 px-3">Nom complet</th>
                <th className="py-3 px-3 text-right">Salaire Base</th>
                <th className="py-3 px-3 text-right">Prime Transp.</th>
                <th className="py-3 px-3 text-right">Masse Brute</th>
                <th className="py-3 px-3 text-right">Retenue CNPS</th>
                <th className="py-3 px-3 text-right">Retenues Impôts</th>
                <th className="py-3 px-3 text-right">Net à payer</th>
                <th className="py-3 px-3 text-right">Part Patronale CNPS (7.7%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {filteredSlips.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-3 font-mono font-black text-slate-400">{p.matricule}</td>
                  <td className="py-3.5 px-3 font-bold text-slate-900">{p.employeeName}</td>
                  <td className="py-3.5 px-3 text-right tabular-nums">{p.baseSalary.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-right tabular-nums text-slate-500">{p.transportAllowance.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-right font-bold text-slate-900 tabular-nums">{p.grossSalary.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-right text-rose-500 tabular-nums">-{p.cnpsDeduction.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-right text-rose-500 tabular-nums">-{(p.itsTaxDeduction + p.cnTaxDeduction + p.igrTaxDeduction).toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-right font-black text-[#4A9EC9] tabular-nums bg-slate-50/20">{p.netSalary.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-right text-indigo-600 tabular-nums font-mono">{p.employerCnps.toLocaleString()}</td>
                </tr>
              ))}
              {filteredSlips.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest bg-white">
                    Aucune fiche calculée pour ce mois.
                  </td>
                </tr>
              )}
            </tbody>
            {filteredSlips.length > 0 && (
              <tfoot className="bg-slate-900 text-white font-black text-xs">
                <tr>
                  <td colSpan={2} className="py-4 px-3 text-right uppercase tracking-widest text-[9px] text-slate-400 font-black">Totaux Période</td>
                  <td className="py-4 px-3 text-right tabular-nums font-mono">{totalBase.toLocaleString()} F</td>
                  <td className="py-4 px-3 text-right tabular-nums font-mono text-slate-300">{totalTransport.toLocaleString()} F</td>
                  <td className="py-4 px-3 text-right tabular-nums font-mono">{totalGross.toLocaleString()} F</td>
                  <td className="py-4 px-3 text-right tabular-nums text-rose-300 font-mono">-{totalCnps.toLocaleString()} F</td>
                  <td className="py-4 px-3 text-right tabular-nums text-rose-300 font-mono">-{totalTaxes.toLocaleString()} F</td>
                  <td className="py-4 px-3 text-right tabular-nums text-emerald-400 font-black font-mono">{totalNet.toLocaleString()} F</td>
                  <td className="py-4 px-3 text-right tabular-nums text-indigo-300 font-mono">{totalEmployerCnps.toLocaleString()} F</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

// 4. DECLARATIONS / RESUMES DE COTISATIONS VIEW
export function CotisationsView({ selectedDossierId }: ViewProps) {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('Mai 2026');
  const [declarations, setDeclarations] = useState<Record<string, 'Payé' | 'Généré'>>({});

  useEffect(() => {
    const key = `payslips_${selectedDossierId || 'default'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setPayslips(JSON.parse(saved));
    }

    const decKey = `declarations_${selectedDossierId || 'default'}`;
    const savedDecs = localStorage.getItem(decKey);
    if (savedDecs) {
      setDeclarations(JSON.parse(savedDecs));
    }
  }, [selectedDossierId]);

  const filteredSlips = payslips.filter(p => p.month === selectedMonth);

  const totalEmployeeCnps = filteredSlips.reduce((acc, curr) => acc + curr.cnpsDeduction, 0);
  const totalEmployerCnps = filteredSlips.reduce((acc, curr) => acc + curr.employerCnps, 0);
  const totalCnpsDue = totalEmployeeCnps + totalEmployerCnps;

  const totalIts = filteredSlips.reduce((acc, curr) => acc + curr.itsTaxDeduction, 0);
  const totalCn = filteredSlips.reduce((acc, curr) => acc + curr.cnTaxDeduction, 0);
  const totalIgr = filteredSlips.reduce((acc, curr) => acc + curr.igrTaxDeduction, 0);
  const totalItsDue = totalIts + totalCn + totalIgr;

  const handleDeclare = (org: 'CNPS' | 'ITS') => {
    const key = `${selectedMonth}_${org}`;
    const updated = { ...declarations, [key]: 'Payé' as const };
    setDeclarations(updated);

    const decKey = `declarations_${selectedDossierId || 'default'}`;
    localStorage.setItem(decKey, JSON.stringify(updated));

    if (selectedDossierId) {
      saveActionLog(selectedDossierId, {
        type: 'Déclaration',
        desc: `Paiement déclaration sociale ${org}`,
        details: `Télépaiement effectué pour ${org} du mois ${selectedMonth}`
      });
    }

    alert(`Paiement de la déclaration sociale ${org} validé pour ${selectedMonth} !`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Résumés de cotisations sociales & fiscales</h2>
          <p className="text-xs text-slate-400">Gérez vos obligations mensuelles (CNPS, Impôts sur Salaires) et télédéclarations</p>
        </div>
        
        <select 
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-wider outline-none cursor-pointer"
        >
          <option value="Janvier 2026">Janvier 2026</option>
          <option value="Février 2026">Février 2026</option>
          <option value="Mars 2026">Mars 2026</option>
          <option value="Avril 2026">Avril 2026</option>
          <option value="Mai 2026">Mai 2026</option>
          <option value="Juin 2026">Juin 2026</option>
          <option value="Juillet 2026">Juillet 2026</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CNPS Summary Box */}
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-[#4A9EC9]" />
              <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800">Caisse Nationale de Prévoyance Sociale (CNPS)</h4>
            </div>
            <span className={cn(
              "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
              declarations[`${selectedMonth}_CNPS`] === 'Payé' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-500"
            )}>
              {declarations[`${selectedMonth}_CNPS`] === 'Payé' ? 'Réglé' : 'À déclarer'}
            </span>
          </div>

          <div className="space-y-3 font-semibold text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Part Salariale (5.5%) :</span>
              <span className="font-bold text-slate-900">{totalEmployeeCnps.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span>Part Patronale (7.7%) :</span>
              <span className="font-bold text-slate-900">{totalEmployerCnps.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between border-t border-slate-50 pt-2 font-black text-slate-900 text-sm">
              <span>Montant Total dû :</span>
              <span className="text-[#4A9EC9]">{totalCnpsDue.toLocaleString()} FCFA</span>
            </div>

            {totalCnpsDue > 0 && declarations[`${selectedMonth}_CNPS`] !== 'Payé' && (
              <button
                onClick={() => handleDeclare('CNPS')}
                className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-widest border-0 cursor-pointer mt-2"
              >
                Télédéclarer & Payer la CNPS
              </button>
            )}
          </div>
        </div>

        {/* ITS Summary Box */}
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-[#E8521A]" />
              <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800">Impôts sur Traitements et Salaires (ITS)</h4>
            </div>
            <span className={cn(
              "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
              declarations[`${selectedMonth}_ITS`] === 'Payé' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-500"
            )}>
              {declarations[`${selectedMonth}_ITS`] === 'Payé' ? 'Réglé' : 'À déclarer'}
            </span>
          </div>

          <div className="space-y-3 font-semibold text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Impôt sur le Revenu (ITS) :</span>
              <span className="font-bold text-slate-900">{totalIts.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span>Contribution Nationale (CN) :</span>
              <span className="font-bold text-slate-900">{totalCn.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span>Impôt Général (IGR) :</span>
              <span className="font-bold text-slate-900">{totalIgr.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between border-t border-slate-50 pt-2 font-black text-slate-900 text-sm">
              <span>Montant d'Impôts dû :</span>
              <span className="text-[#E8521A]">{totalItsDue.toLocaleString()} FCFA</span>
            </div>

            {totalItsDue > 0 && declarations[`${selectedMonth}_ITS`] !== 'Payé' && (
              <button
                onClick={() => handleDeclare('ITS')}
                className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-widest border-0 cursor-pointer mt-2"
              >
                Télédéclarer & Payer au Trésor Public
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
