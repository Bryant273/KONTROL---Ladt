import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  FolderOpen, 
  Plus, 
  Search, 
  UserPlus, 
  Trash2, 
  Pencil, 
  Download, 
  Filter, 
  CheckCircle, 
  Clock, 
  FileCheck, 
  FileX, 
  Briefcase, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Building,
  Mail,
  Phone,
  Shield,
  Eye,
  Upload,
  CheckCircle2,
  FileUp,
  Award,
  CreditCard,
  Printer,
  X,
  AlertCircle,
  Layers
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { saveActionLog } from '../../../lib/auditLogger';
import { EmployeeA4SheetModal } from '../../../components/modals/EmployeeA4SheetModal';
import { useCompany } from '../../../context/CompanyContext';
import { generateSmartContractText } from '../../../lib/contractGenerator';

// Interfaces
export interface Employee {
  id: string;
  matricule: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  salary: number;
  status: 'Actif' | 'Inactif' | 'Suspendu';
}

export interface Contract {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'CDI' | 'CDD' | 'Stage' | 'Consultant';
  startDate: string;
  endDate?: string;
  salary: number;
  trialPeriod: string; // e.g. "3 mois"
  status: 'Actif' | 'Expiré' | 'En attente';
}

export interface HrFolder {
  id: string;
  employeeId: string;
  employeeName: string;
  folderType: 'Médical' | 'Identité & CMU' | 'RIB & Banques' | 'Permis de conduire' | 'Diplômes & Certifications' | 'Contrats Signés' | 'Attestations & Justificatifs' | 'Disciplinaire' | string;
  documentCount: number;
  lastUpdated: string;
  status: 'Complet' | 'Incomplet';
}

interface ViewProps {
  selectedDossierId: string | null;
  onNavigateToCreate?: () => void;
}

// 1. EMPLOYEES VIEW
export function EmployeesView({ selectedDossierId, onNavigateToCreate }: ViewProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Finances',
    position: '',
    hireDate: new Date().toISOString().substring(0, 10),
    salary: 350000,
    status: 'Actif' as 'Actif' | 'Inactif' | 'Suspendu'
  });

  // Load from localStorage
  useEffect(() => {
    const key = `employees_${selectedDossierId || 'default'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setEmployees(JSON.parse(saved));
    } else {
      const defaultEmps: Employee[] = [
        { id: 'emp-1', matricule: 'EMP2026-001', name: 'KONAN Kouassi Jean', email: 'jean.konan@socix.ci', phone: '+225 07 45 89 12', department: 'Finances', position: 'Comptable Senior', hireDate: '2024-01-15', salary: 650000, status: 'Actif' },
        { id: 'emp-2', matricule: 'EMP2026-002', name: 'DIARRASSOUBA Mariam', email: 'm.diarrassouba@socix.ci', phone: '+225 05 12 78 94', department: 'Logistique', position: 'Chef de Stock', hireDate: '2024-06-01', salary: 450000, status: 'Actif' },
        { id: 'emp-3', matricule: 'EMP2026-003', name: 'YAO Koffi Serge', email: 's.yao@socix.ci', phone: '+225 01 02 03 04', department: 'RH', position: 'Assistant RH', hireDate: '2025-02-10', salary: 350000, status: 'Actif' },
        { id: 'emp-4', matricule: 'EMP2026-004', name: 'AMANI Affoué Nicole', email: 'nicole.amani@socix.ci', phone: '+225 07 11 22 33', department: 'Marketing', position: 'Brand Manager', hireDate: '2025-05-15', salary: 500000, status: 'Actif' },
      ];
      setEmployees(defaultEmps);
      localStorage.setItem(key, JSON.stringify(defaultEmps));
    }
  }, [selectedDossierId]);

  const saveEmployees = (data: Employee[]) => {
    setEmployees(data);
    const key = `employees_${selectedDossierId || 'default'}`;
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.position) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      matricule: `EMP2026-${String(employees.length + 1).padStart(3, '0')}`,
      name: form.name,
      email: form.email || `${form.name.toLowerCase().replace(/\s+/g, '.')}@socix.ci`,
      phone: form.phone || '+225 00 00 00 00',
      department: form.department,
      position: form.position,
      hireDate: form.hireDate,
      salary: Number(form.salary) || 0,
      status: form.status
    };

    const updated = [newEmp, ...employees];
    saveEmployees(updated);
    setIsModalOpen(false);

    if (selectedDossierId) {
      saveActionLog(selectedDossierId, {
        type: 'Création',
        desc: 'Nouvel employé enregistré',
        details: `Ajout de ${newEmp.name} (${newEmp.matricule}) - Poste : ${newEmp.position}`
      });
    }

    // Reset Form
    setForm({
      name: '',
      email: '',
      phone: '',
      department: 'Finances',
      position: '',
      hireDate: new Date().toISOString().substring(0, 10),
      salary: 350000,
      status: 'Actif'
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Voulez-vous vraiment supprimer la fiche de l'employé ${name} ?`)) {
      const updated = employees.filter(e => e.id !== id);
      saveEmployees(updated);
      if (selectedDossierId) {
        saveActionLog(selectedDossierId, {
          type: 'Suppression',
          desc: "Fiche d'employé supprimée",
          details: `Suppression de l'employé ${name}`
        });
      }
    }
  };

  const filtered = employees.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'Tous' || e.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Registre unique du personnel</h2>
          <p className="text-xs text-slate-400">Gestion et indexation réglementaire de vos salariés</p>
        </div>
        <button 
          onClick={() => onNavigateToCreate ? onNavigateToCreate() : setIsModalOpen(true)}
          className="bg-[#4A9EC9] hover:bg-[#3D8CB7] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg shadow-[#4A9EC9]/20 border-0"
        >
          <UserPlus className="w-4 h-4" /> Nouvel Employé
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Effectif Actif</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{employees.filter(e => e.status === 'Actif').length}</p>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-[#4A9EC9] rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Masse Salariale Mensuelle</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {employees.reduce((acc, curr) => acc + (curr.status === 'Actif' ? curr.salary : 0), 0).toLocaleString()} <span className="text-[10px] font-bold text-slate-400">FCFA</span>
            </p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Nouveaux ce mois</p>
            <p className="text-2xl font-black text-slate-900 mt-1">1</p>
          </div>
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
          {['Tous', 'Finances', 'RH', 'Logistique', 'Marketing'].map((d) => (
            <button
              key={d}
              onClick={() => setDeptFilter(d)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border-0 cursor-pointer",
                deptFilter === d ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher par nom, matricule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-slate-50 border border-slate-150 rounded-xl pl-9 pr-4 text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
          />
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="py-3 px-4">Matricule</th>
                <th className="py-3 px-4">Nom Complet</th>
                <th className="py-3 px-4">Département & Poste</th>
                <th className="py-3 px-4">Date d'embauche</th>
                <th className="py-3 px-4 text-right">Salaire de Base</th>
                <th className="py-3 px-4 text-center">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 font-mono font-black text-xs text-slate-600">{emp.matricule}</td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">{emp.name}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-3 mt-1 font-semibold">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {emp.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {emp.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 block w-max mb-1">
                      {emp.department}
                    </span>
                    <span className="font-bold text-slate-600 text-xs">{emp.position}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-550 font-bold">{new Date(emp.hireDate).toLocaleDateString('fr-FR')}</td>
                  <td className="py-4 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {emp.salary.toLocaleString()} <span className="text-[10px] text-slate-400 font-bold">F</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                      emp.status === 'Actif' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => setSelectedEmp(emp)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors border-0 cursor-pointer"
                        title="Détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(emp.id, emp.name)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors border-0 cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest bg-white">
                    Aucun employé trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE EMPLOYEE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2rem] border border-slate-150 shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Fiche d'embauche unique</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Saisie des informations contractuelles et d'identité</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 border-0 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nom complet du salarié *</label>
                <input 
                  type="text" 
                  required
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
                  placeholder="Ex: KASSI Raymond"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Adresse E-mail</label>
                  <input 
                    type="email" 
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
                    placeholder="Ex: r.kassi@socix.ci"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Téléphone</label>
                  <input 
                    type="text" 
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
                    placeholder="+225 00 00 00 00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Département</label>
                  <select 
                    value={form.department}
                    onChange={e => setForm({...form, department: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all cursor-pointer"
                  >
                    <option value="Finances">Finances</option>
                    <option value="RH">RH (Ressources Humaines)</option>
                    <option value="Logistique">Logistique</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Poste occupé *</label>
                  <input 
                    type="text" 
                    required
                    value={form.position}
                    onChange={e => setForm({...form, position: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
                    placeholder="Ex: Comptable Trésorerie"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date d'embauche</label>
                  <input 
                    type="date" 
                    value={form.hireDate}
                    onChange={e => setForm({...form, hireDate: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Salaire de Base Brut (FCFA)</label>
                  <input 
                    type="number" 
                    value={form.salary}
                    onChange={e => setForm({...form, salary: Number(e.target.value)})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 h-11 bg-[#4A9EC9] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-95 shadow-lg border-0 cursor-pointer"
                >
                  Valider l'embauche
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 h-11 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 border-0 cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL A4 SHEET MODAL */}
      {selectedEmp && (
        <EmployeeA4SheetModal 
          data={selectedEmp} 
          onClose={() => setSelectedEmp(null)} 
        />
      )}
    </div>
  );
}

// 2. CONTRACTS VIEW
export function ContractsView({ selectedDossierId }: ViewProps) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedContractForView, setSelectedContractForView] = useState<Contract | null>(null);
  const [selectedContractForEdit, setSelectedContractForEdit] = useState<Contract | null>(null);

  // Load active enterprise for company logo and details
  let activeEnterprise = null;
  try {
    const compCtx = useCompany();
    activeEnterprise = compCtx?.activeEnterprise || null;
  } catch (e) {
    // Context fallback
  }

  const [form, setForm] = useState({
    employeeId: '',
    type: 'CDI' as 'CDI' | 'CDD' | 'Stage' | 'Consultant',
    startDate: new Date().toISOString().substring(0, 10),
    endDate: '',
    trialPeriod: '3 mois',
    salary: 400000
  });

  const [editForm, setEditForm] = useState({
    type: 'CDI' as 'CDI' | 'CDD' | 'Stage' | 'Consultant',
    startDate: new Date().toISOString().substring(0, 10),
    endDate: '',
    trialPeriod: '3 mois',
    salary: 400000,
    status: 'Actif' as 'Actif' | 'Expiré' | 'Suspendu'
  });

  // State for View Contract Modal
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [contractTemplates, setContractTemplates] = useState<any[]>([]);
  const [contractText, setContractText] = useState<string>('');

  useEffect(() => {
    // Load Employees to bind in drop-down list
    const empKey = `employees_${selectedDossierId || 'default'}`;
    const savedEmps = localStorage.getItem(empKey);
    if (savedEmps) {
      setEmployees(JSON.parse(savedEmps));
    }

    // Load templates
    const tplKey = `contract_templates_${selectedDossierId || 'default'}`;
    const savedTpls = localStorage.getItem(tplKey);
    if (savedTpls) {
      setContractTemplates(JSON.parse(savedTpls));
    }

    const key = `contracts_${selectedDossierId || 'default'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setContracts(JSON.parse(saved));
    } else {
      const defaultContracts: Contract[] = [
        { id: 'c-1', employeeId: 'emp-1', employeeName: 'KONAN Kouassi Jean', type: 'CDI', startDate: '2024-01-15', salary: 650000, trialPeriod: '3 mois', status: 'Actif' },
        { id: 'c-2', employeeId: 'emp-2', employeeName: 'DIARRASSOUBA Mariam', type: 'CDD', startDate: '2024-06-01', endDate: '2026-06-01', salary: 450000, trialPeriod: '2 mois', status: 'Actif' },
        { id: 'c-3', employeeId: 'emp-3', employeeName: 'YAO Koffi Serge', type: 'CDI', startDate: '2025-02-10', salary: 350000, trialPeriod: '3 mois', status: 'Actif' },
      ];
      setContracts(defaultContracts);
      localStorage.setItem(key, JSON.stringify(defaultContracts));
    }
  }, [selectedDossierId]);

  const saveContracts = (data: Contract[]) => {
    setContracts(data);
    const key = `contracts_${selectedDossierId || 'default'}`;
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employeeId) {
      alert('Veuillez sélectionner un employé.');
      return;
    }

    const selectedEmpObj = employees.find(x => x.id === form.employeeId);
    if (!selectedEmpObj) return;

    const newContract: Contract = {
      id: `c-${Date.now()}`,
      employeeId: form.employeeId,
      employeeName: selectedEmpObj.name,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      salary: Number(form.salary) || selectedEmpObj.salary,
      trialPeriod: form.trialPeriod,
      status: 'Actif'
    };

    const updated = [newContract, ...contracts];
    saveContracts(updated);
    setIsModalOpen(false);

    if (selectedDossierId) {
      saveActionLog(selectedDossierId, {
        type: 'Création',
        desc: 'Nouveau contrat de travail généré',
        details: `Génération contrat ${newContract.type} pour ${newContract.employeeName}`
      });
    }

    setForm({
      employeeId: '',
      type: 'CDI',
      startDate: new Date().toISOString().substring(0, 10),
      endDate: '',
      trialPeriod: '3 mois',
      salary: 400000
    });
  };

  const handleOpenViewContract = (contract: Contract) => {
    setSelectedContractForView(contract);
    const empObj = employees.find(e => e.id === contract.employeeId);
    
    // Check if there is a saved template matching contract type or first available
    const matchingTpl = contractTemplates.find(t => t.type === contract.type) || contractTemplates[0];
    const tplContent = matchingTpl ? matchingTpl.content : undefined;
    if (matchingTpl) {
      setSelectedTemplateId(matchingTpl.id);
    } else {
      setSelectedTemplateId('');
    }

    const smartText = generateSmartContractText({
      employee: empObj,
      contract: contract,
      enterprise: activeEnterprise,
      templateContent: tplContent
    });

    setContractText(smartText);
  };

  const handleOpenEditContract = (contract: Contract) => {
    setSelectedContractForEdit(contract);
    setEditForm({
      type: contract.type,
      startDate: contract.startDate,
      endDate: contract.endDate || '',
      trialPeriod: contract.trialPeriod || '3 mois',
      salary: contract.salary,
      status: contract.status || 'Actif'
    });
  };

  const handleSaveEditedContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContractForEdit) return;

    const updated = contracts.map(c => {
      if (c.id === selectedContractForEdit.id) {
        return {
          ...c,
          type: editForm.type,
          startDate: editForm.startDate,
          endDate: editForm.endDate || undefined,
          trialPeriod: editForm.trialPeriod,
          salary: Number(editForm.salary),
          status: editForm.status
        };
      }
      return c;
    });

    saveContracts(updated);
    setSelectedContractForEdit(null);

    if (selectedDossierId) {
      saveActionLog(selectedDossierId, {
        type: 'Modification',
        desc: 'Contrat de travail modifié',
        details: `Mise à jour des termes du contrat de ${selectedContractForEdit.employeeName}`
      });
    }
  };

  const filtered = contracts.filter(c => 
    c.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Registre des contrats de travail</h2>
          <p className="text-xs text-slate-400">Gérez les CDI, CDD, conventions de stage et accords de consultation</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#4A9EC9] hover:bg-[#3D8CB7] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg shadow-[#4A9EC9]/20 border-0"
        >
          <Plus className="w-4 h-4" /> Générer un contrat
        </button>
      </div>

      {/* Contract Search bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {filtered.length} contrat(s) en cours
        </span>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher par collaborateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-slate-50 border border-slate-150 rounded-xl pl-9 pr-4 text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="py-3 px-4">Salarié</th>
                <th className="py-3 px-4">Type de contrat</th>
                <th className="py-3 px-4">Période d'essai</th>
                <th className="py-3 px-4">Date de début</th>
                <th className="py-3 px-4">Date de fin</th>
                <th className="py-3 px-4 text-right">Rémunération brute</th>
                <th className="py-3 px-4 text-center">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((con) => (
                <tr key={con.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">{con.employeeName}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider block w-max",
                      con.type === 'CDI' ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-[#4A9EC9]"
                    )}>
                      {con.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-600">{con.trialPeriod || 'Aucune'}</td>
                  <td className="py-4 px-4 font-bold text-slate-500">{new Date(con.startDate).toLocaleDateString('fr-FR')}</td>
                  <td className="py-4 px-4 font-bold text-slate-500">
                    {con.endDate ? new Date(con.endDate).toLocaleDateString('fr-FR') : 'Indéterminée'}
                  </td>
                  <td className="py-4 px-4 text-right font-black text-slate-900 tabular-nums">
                    {con.salary.toLocaleString()} <span className="text-[10px] text-slate-400 font-bold">FCFA</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600 tracking-wider">
                      <CheckCircle className="w-3.5 h-3.5" /> {con.status || 'Actif'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => handleOpenViewContract(con)}
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#4A9EC9] rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border-0 cursor-pointer transition-colors shadow-xs"
                        title="Voir le contrat de travail"
                      >
                        <Eye className="w-3.5 h-3.5" /> Voir
                      </button>
                      <button 
                        onClick={() => handleOpenEditContract(con)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border-0 cursor-pointer transition-colors shadow-xs"
                        title="Modifier le contrat"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Modifier
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest bg-white">
                    Aucun contrat indexé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW CONTRACT MODAL */}
      {selectedContractForView && (() => {
        const empObj = employees.find(e => e.id === selectedContractForView.employeeId);
        return (
          <div className="fixed inset-0 bg-[#09090b]/60 backdrop-blur-md flex items-center justify-center z-[120] p-4 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
            <div className="bg-white rounded-[2rem] border border-slate-150 shadow-2xl w-full max-w-4xl overflow-hidden my-auto flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:rounded-none">
              
              {/* Control Header */}
              <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
                <div className="flex items-center gap-3">
                  {activeEnterprise?.logo ? (
                    <img src={activeEnterprise.logo} alt="Logo" className="h-9 max-w-[140px] object-contain" />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-[#4A9EC9] text-white flex items-center justify-center font-black">
                      <FileText className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-white">
                      Contrat de travail : {selectedContractForView.employeeName}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Type : {selectedContractForView.type} • Matricule : {empObj?.matricule || 'N/A'} • {activeEnterprise?.name || 'SOCIX GROUP S.A.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setTimeout(() => window.print(), 150);
                    }}
                    className="px-4 h-9 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border-0 cursor-pointer shadow-md transition-all"
                  >
                    <Printer className="w-4 h-4" /> Imprimer le contrat A4
                  </button>
                  <button
                    onClick={() => setSelectedContractForView(null)}
                    className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 border-0 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Template selection & info header */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gabarit Modèle :</span>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => {
                      const tplId = e.target.value;
                      setSelectedTemplateId(tplId);
                      const tpl = contractTemplates.find(t => t.id === tplId);
                      const newText = generateSmartContractText({
                        employee: empObj,
                        contract: selectedContractForView,
                        enterprise: activeEnterprise,
                        templateContent: tpl?.content
                      });
                      setContractText(newText);
                    }}
                    className="h-8 px-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-[#4A9EC9]"
                  >
                    <option value="">Intelligent par défaut ({selectedContractForView.type})</option>
                    {contractTemplates.map((t: any) => (
                      <option key={t.id} value={t.id}>{t.title} ({t.type})</option>
                    ))}
                  </select>
                </div>

                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  ✓ Variables collaborateur & entreprise fusionnées automatiquement
                </span>
              </div>

              {/* Printable / Editable Contract Content Area */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-4 print:p-8">
                {/* Print header visible on print */}
                <div className="hidden print:flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
                  <div>
                    <h2 className="text-base font-black uppercase text-slate-900">{activeEnterprise?.name || 'SOCIX GROUP S.A.'}</h2>
                    <p className="text-[9px] font-bold text-slate-500">N° NCC: {activeEnterprise?.ncc || '1234567 A'} • N° CNPS: {activeEnterprise?.cnps || '98765'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-mono font-black text-slate-700">RÉF : CONTRAT/{selectedContractForView.type}/{selectedContractForView.id}</p>
                    <p className="text-[8px] text-slate-400 font-bold">ÉDITION DU : {new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block print:hidden">
                    Contenu rédigé du contrat (Modifiable) :
                  </label>
                  <textarea
                    value={contractText}
                    onChange={(e) => setContractText(e.target.value)}
                    rows={18}
                    className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 leading-relaxed outline-none focus:border-[#4A9EC9] print:bg-white print:border-none print:p-0 print:text-sm print:leading-relaxed"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0 print:hidden">
                <p className="text-[10px] text-slate-400 font-medium">
                  Document conforme à la législation du travail et aux modèles de contrat configurés.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedContractForView(null)}
                  className="px-5 h-9 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest border-0 cursor-pointer"
                >
                  Fermer
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* EDIT CONTRACT MODAL */}
      {selectedContractForEdit && (
        <div className="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm flex items-center justify-center z-[120] p-4">
          <div className="bg-white rounded-[2rem] border border-slate-150 shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Modifier le contrat de travail</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  Salarié : {selectedContractForEdit.employeeName}
                </p>
              </div>
              <button 
                onClick={() => setSelectedContractForEdit(null)} 
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 border-0 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedContract} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Type de contrat</label>
                  <select 
                    value={editForm.type}
                    onChange={e => setEditForm({...editForm, type: e.target.value as any})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] cursor-pointer"
                  >
                    <option value="CDI">CDI (Indéterminé)</option>
                    <option value="CDD">CDD (Déterminé)</option>
                    <option value="Stage">Stage</option>
                    <option value="Consultant">Prestation / Consultant</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Période d'essai</label>
                  <input 
                    type="text" 
                    value={editForm.trialPeriod}
                    onChange={e => setEditForm({...editForm, trialPeriod: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date de début *</label>
                  <input 
                    type="date" 
                    required
                    value={editForm.startDate}
                    onChange={e => setEditForm({...editForm, startDate: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date de fin</label>
                  <input 
                    type="date" 
                    value={editForm.endDate}
                    onChange={e => setEditForm({...editForm, endDate: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Salaire Brut (FCFA) *</label>
                  <input 
                    type="number" 
                    required
                    value={editForm.salary}
                    onChange={e => setEditForm({...editForm, salary: Number(e.target.value)})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Statut du contrat</label>
                  <select 
                    value={editForm.status}
                    onChange={e => setEditForm({...editForm, status: e.target.value as any})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] cursor-pointer"
                  >
                    <option value="Actif">Actif</option>
                    <option value="Expiré">Expiré</option>
                    <option value="Suspendu">Suspendu</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 h-11 bg-[#4A9EC9] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-95 shadow-lg border-0 cursor-pointer"
                >
                  Enregistrer les modifications
                </button>
                <button 
                  type="button"
                  onClick={() => setSelectedContractForEdit(null)}
                  className="px-5 h-11 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 border-0 cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CONTRACT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2rem] border border-slate-150 shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Générer un acte de recrutement</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Conformité légale SYSCOHADA & Code du travail</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 border-0 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Salarié Bénéficiaire *</label>
                <select 
                  required
                  value={form.employeeId}
                  onChange={e => {
                    const emp = employees.find(x => x.id === e.target.value);
                    setForm({
                      ...form, 
                      employeeId: e.target.value,
                      salary: emp ? emp.salary : 400000
                    });
                  }}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all cursor-pointer"
                >
                  <option value="">Sélectionnez un employé...</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.matricule})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Type de contrat</label>
                  <select 
                    value={form.type}
                    onChange={e => setForm({...form, type: e.target.value as any})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all cursor-pointer"
                  >
                    <option value="CDI">CDI (Indéterminé)</option>
                    <option value="CDD">CDD (Déterminé)</option>
                    <option value="Stage">Stage</option>
                    <option value="Consultant">Prestation / Consultant</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Période d'essai</label>
                  <input 
                    type="text" 
                    value={form.trialPeriod}
                    onChange={e => setForm({...form, trialPeriod: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
                    placeholder="Ex: 3 mois"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date de début *</label>
                  <input 
                    type="date" 
                    required
                    value={form.startDate}
                    onChange={e => setForm({...form, startDate: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date de fin (CDD)</label>
                  <input 
                    type="date" 
                    value={form.endDate}
                    onChange={e => setForm({...form, endDate: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Salaire Brut Mensuel stipulé (FCFA) *</label>
                <input 
                  type="number" 
                  required
                  value={form.salary}
                  onChange={e => setForm({...form, salary: Number(e.target.value)})}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 h-11 bg-[#4A9EC9] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-95 shadow-lg border-0 cursor-pointer"
                >
                  Confirmer l'acte de contrat
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 h-11 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 border-0 cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 3. DOSSIERS VIEW (HrFolders)
export function FoldersView({ selectedDossierId }: ViewProps) {
  const [folders, setFolders] = useState<HrFolder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);

  const [selectedFolder, setSelectedFolder] = useState<HrFolder | null>(null);
  const [viewA4Employee, setViewA4Employee] = useState<Employee | null>(null);
  const [selectedContractTemplate, setSelectedContractTemplate] = useState<string>('');
  const [generatedContractText, setGeneratedContractText] = useState<string>('');
  const [contractTemplates, setContractTemplates] = useState<any[]>([]);

  const [form, setForm] = useState({
    employeeId: '',
    folderType: 'Identité & CMU',
    status: 'Complet' as 'Complet' | 'Incomplet'
  });

  const COLLECTED_DATA_TYPES = [
    {
      id: 'identity',
      title: "1. Identité, CMU & État Civil",
      folderType: "Identité & CMU",
      badge: "Identité",
      description: "CNI, Passeport biométrique, Carte CMU, Extrait d'acte de naissance, Photo d'identité",
      icon: Shield,
      color: "bg-blue-50 text-[#4A9EC9] border-blue-200"
    },
    {
      id: 'bank',
      title: "2. Coordonnées Bancaires & RIB",
      folderType: "RIB & Banques",
      badge: "RIB",
      description: "Relevé d'Identité Bancaire (RIB) officiel, Attestation d'ouverture de compte, Domiciliation de paie",
      icon: CreditCard,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200"
    },
    {
      id: 'contracts',
      title: "3. Contrats de Travail & Avenants",
      folderType: "Contrats Signés",
      badge: "Contrats",
      description: "Contrats de travail signés (CDI, CDD, Stage), Avenants, Promesse d'embauche, Fiche de poste",
      icon: FileText,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200"
    },
    {
      id: 'diplomas',
      title: "4. Diplômes, Titres & Certifications",
      folderType: "Diplômes & Certifications",
      badge: "Diplômes",
      description: "Diplômes universitaires et académiques, Homologations BAC/Master, Certifications professionnelles",
      icon: Award,
      color: "bg-purple-50 text-purple-600 border-purple-200"
    },
    {
      id: 'driving',
      title: "5. Permis de Conduire & Transport",
      folderType: "Permis de conduire",
      badge: "Permis",
      description: "Permis de conduire biométrique (Catégories B/C/D/E), Attestations de capacité de conduite",
      icon: FileCheck,
      color: "bg-amber-50 text-amber-600 border-amber-200"
    },
    {
      id: 'legal',
      title: "6. Casier Judiciaire B3 & Justificatifs Légaux",
      folderType: "Attestations & Justificatifs",
      badge: "Casier B3",
      description: "Extrait de casier judiciaire (Bulletin N° 3 récent), Certificat de résidence légalisé, Attestations de travail",
      icon: CheckCircle2,
      color: "bg-cyan-50 text-cyan-600 border-cyan-200"
    },
    {
      id: 'medical',
      title: "7. Dossier Médical & Aptitude au Travail",
      folderType: "Médical & Aptitude",
      badge: "Médical",
      description: "Certificat d'aptitude médicale du travail, Carnet de santé, Visites médicales périodiques",
      icon: CheckCircle,
      color: "bg-[#4A9EC9]/10 text-[#4A9EC9] border-[#4A9EC9]/30"
    },
    {
      id: 'discipline',
      title: "8. Dossier Disciplinaire & Contentieux",
      folderType: "Disciplinaire",
      badge: "Disciplinaire",
      description: "Demandes d'explication, Avertissements, Blâmes, Procès-verbaux d'entretien, Sanctions",
      icon: AlertCircle,
      color: "bg-rose-50 text-rose-600 border-rose-200"
    }
  ];

  useEffect(() => {
    // Load Employees
    const empKey = `employees_${selectedDossierId || 'default'}`;
    const savedEmps = localStorage.getItem(empKey);
    if (savedEmps) {
      setEmployees(JSON.parse(savedEmps));
    } else {
      const defaultEmps = [
        { id: 'emp-1', name: 'KONAN Kouassi Jean', matricule: 'EMP-2026-001', position: 'Chef de Projet IT', department: 'Informatique', status: 'Actif', salary: 650000 },
        { id: 'emp-2', name: 'DIARRASSOUBA Mariam', matricule: 'EMP-2026-002', position: 'Comptable Senior', department: 'Finance & Comptabilité', status: 'Actif', salary: 450000 },
        { id: 'emp-3', name: 'YAO Koffi Serge', matricule: 'EMP-2026-003', position: 'Responsable Logistique', department: 'Opérations', status: 'Actif', salary: 500000 },
      ];
      setEmployees(defaultEmps);
    }

    // Load Contract Templates
    const tplKey = `contract_templates_${selectedDossierId || 'default'}`;
    const savedTpls = localStorage.getItem(tplKey);
    if (savedTpls) {
      setContractTemplates(JSON.parse(savedTpls));
    }

    const key = `hr_folders_${selectedDossierId || 'default'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setFolders(JSON.parse(saved));
    } else {
      const defaultFolders: HrFolder[] = [
        { id: 'f-1', employeeId: 'emp-1', employeeName: 'KONAN Kouassi Jean', folderType: 'Identité & CMU', documentCount: 3, lastUpdated: '2026-05-12', status: 'Complet' },
        { id: 'f-rib-1', employeeId: 'emp-1', employeeName: 'KONAN Kouassi Jean', folderType: 'RIB & Banques', documentCount: 1, lastUpdated: '2026-05-12', status: 'Complet' },
        { id: 'f-permis-1', employeeId: 'emp-1', employeeName: 'KONAN Kouassi Jean', folderType: 'Permis de conduire', documentCount: 1, lastUpdated: '2026-05-12', status: 'Complet' },
        { id: 'f-2', employeeId: 'emp-1', employeeName: 'KONAN Kouassi Jean', folderType: 'Contrats Signés', documentCount: 1, lastUpdated: '2026-01-15', status: 'Complet' },
        { id: 'f-3', employeeId: 'emp-2', employeeName: 'DIARRASSOUBA Mariam', folderType: 'Identité & CMU', documentCount: 2, lastUpdated: '2026-06-02', status: 'Incomplet' },
        { id: 'f-4', employeeId: 'emp-3', employeeName: 'YAO Koffi Serge', folderType: 'Diplômes & Certifications', documentCount: 4, lastUpdated: '2026-02-11', status: 'Complet' },
      ];
      setFolders(defaultFolders);
      localStorage.setItem(key, JSON.stringify(defaultFolders));
    }
  }, [selectedDossierId]);

  // Reactive variables fusion for contract generation
  useEffect(() => {
    if (!selectedFolder || !selectedContractTemplate) {
      setGeneratedContractText('');
      return;
    }
    const emp = employees.find(e => e.id === selectedFolder.employeeId);
    const tpl = contractTemplates.find(t => t.id === selectedContractTemplate);
    if (!emp) return;

    // Load active enterprise
    let activeEnterprise = null;
    try {
      const compCtx = useCompany();
      activeEnterprise = compCtx?.activeEnterprise || null;
    } catch (e) {}

    const text = generateSmartContractText({
      employee: emp,
      contract: {
        type: tpl?.type || emp.contractDetails?.nature || 'CDI',
        salary: emp.payrollDetails?.baseSalary || emp.salary,
        startDate: emp.contractDetails?.startDate || emp.hireDate,
        endDate: emp.contractDetails?.endDate,
        trialPeriod: '3 mois'
      },
      enterprise: activeEnterprise,
      templateContent: tpl?.content
    });

    setGeneratedContractText(text);
  }, [selectedContractTemplate, selectedFolder, employees, contractTemplates]);

  const saveFolders = (data: HrFolder[]) => {
    setFolders(data);
    const key = `hr_folders_${selectedDossierId || 'default'}`;
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employeeId) {
      alert('Veuillez sélectionner un employé.');
      return;
    }

    const selectedEmpObj = employees.find(x => x.id === form.employeeId);
    if (!selectedEmpObj) return;

    const duplicate = folders.find(f => f.employeeId === form.employeeId && f.folderType === form.folderType);
    if (duplicate) {
      alert("Ce dossier existe déjà pour cet employé. Veuillez ajouter des documents à l'intérieur.");
      return;
    }

    const newFolder: HrFolder = {
      id: `fld-${Date.now()}`,
      employeeId: form.employeeId,
      employeeName: selectedEmpObj.name,
      folderType: form.folderType,
      documentCount: 1,
      lastUpdated: new Date().toISOString().substring(0, 10),
      status: form.status
    };

    const updated = [newFolder, ...folders];
    saveFolders(updated);
    setIsModalOpen(false);

    if (selectedDossierId) {
      saveActionLog(selectedDossierId, {
        type: 'Indexation',
        desc: 'Nouveau dossier RH indexé',
        details: `Indexation du dossier ${newFolder.folderType} pour ${newFolder.employeeName}`
      });
    }

    setForm({
      employeeId: '',
      folderType: 'Identité & CMU',
      status: 'Complet'
    });
  };

  const handleDelete = (id: string, empName: string, folderType: string) => {
    if (confirm(`Voulez-vous supprimer le dossier ${folderType} de ${empName} ?`)) {
      const updated = folders.filter(f => f.id !== id);
      saveFolders(updated);
      if (selectedDossierId) {
        saveActionLog(selectedDossierId, {
          type: 'Suppression',
          desc: 'Archivage / Suppression dossier',
          details: `Dossier ${folderType} supprimé pour ${empName}`
        });
      }
    }
  };

  // Find existing folder for an employee under a given folderType
  const getFolderForEmployee = (empId: string, folderType: string) => {
    return folders.find(f => 
      f.employeeId === empId && 
      (f.folderType.toLowerCase() === folderType.toLowerCase() ||
       f.folderType.toLowerCase().includes(folderType.toLowerCase().split(' ')[0]))
    );
  };

  const handleOpenOrCreateFolder = (emp: any, dataType: typeof COLLECTED_DATA_TYPES[0]) => {
    let existing = getFolderForEmployee(emp.id, dataType.folderType);
    if (!existing) {
      existing = {
        id: `fld-${emp.id}-${dataType.id}`,
        employeeId: emp.id,
        employeeName: emp.name,
        folderType: dataType.folderType,
        documentCount: 0,
        lastUpdated: new Date().toISOString().substring(0, 10),
        status: 'Incomplet'
      };
    }
    setSelectedFolder(existing);
    setSelectedContractTemplate('');
  };

  // Filter Categories by search term and selected tab
  const displayedDataTypes = COLLECTED_DATA_TYPES.filter(dt => {
    if (selectedCategoryFilter !== 'all' && dt.id !== selectedCategoryFilter) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    
    // Match if category matches search term
    const categoryMatches = dt.title.toLowerCase().includes(term) || dt.description.toLowerCase().includes(term) || dt.folderType.toLowerCase().includes(term);
    
    // Or if any employee in this category matches search term
    const employeeMatches = employees.some(e => e.name.toLowerCase().includes(term) || e.matricule?.toLowerCase().includes(term));

    return categoryMatches || employeeMatches;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Dossiers administratifs & pièces collectées</h2>
          <p className="text-xs text-slate-400">Organisation par nature de données RH collectées et suivi individuel par collaborateur</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#4A9EC9] hover:bg-[#3D8CB7] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg shadow-[#4A9EC9]/20 border-0"
        >
          <Plus className="w-4 h-4" /> Indexer une pièce / chemise
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={cn(
              "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border-0 cursor-pointer",
              selectedCategoryFilter === 'all' 
                ? "bg-slate-900 text-white shadow-sm" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            Tous les types ({COLLECTED_DATA_TYPES.length})
          </button>

          {COLLECTED_DATA_TYPES.map(dt => (
            <button
              key={dt.id}
              onClick={() => setSelectedCategoryFilter(dt.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border-0 cursor-pointer flex items-center gap-1.5",
                selectedCategoryFilter === dt.id 
                  ? "bg-[#4A9EC9] text-white shadow-sm" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              <span>{dt.badge}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher un salarié ou un type de document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-slate-50 border border-slate-150 rounded-xl pl-9 pr-4 text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
          />
        </div>
      </div>

      {/* CATEGORY GROUPED SECTIONS (Types de données collectées) */}
      <div className="space-y-8">
        {displayedDataTypes.map(dataType => {
          const IconComp = dataType.icon;
          
          // Filter employees for this category
          const filteredEmployees = employees.filter(emp => {
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            return emp.name.toLowerCase().includes(term) || emp.matricule?.toLowerCase().includes(term) || dataType.title.toLowerCase().includes(term);
          });

          // Calculate completion stats for this category
          const completedCount = filteredEmployees.filter(emp => {
            const fld = getFolderForEmployee(emp.id, dataType.folderType);
            return fld && fld.status === 'Complet';
          }).length;

          const totalEmployees = filteredEmployees.length;
          const completionPercentage = totalEmployees > 0 ? Math.round((completedCount / totalEmployees) * 100) : 0;

          return (
            <div key={dataType.id} className="bg-white rounded-[1.75rem] border border-slate-150 p-6 shadow-xs space-y-5">
              
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-3.5">
                  <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border", dataType.color)}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{dataType.title}</h3>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase tracking-widest">
                        {dataType.folderType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {dataType.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-800 font-mono">{completedCount} / {totalEmployees} complets</span>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{completionPercentage}% de conformité</p>
                  </div>
                  <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Employee Breakdown Cards Grid for this Category */}
              {filteredEmployees.length === 0 ? (
                <div className="py-8 text-center text-slate-300 text-xs font-bold uppercase tracking-widest bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Aucun collaborateur trouvé pour cette catégorie.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEmployees.map(emp => {
                    const folder = getFolderForEmployee(emp.id, dataType.folderType);
                    const isComplete = folder && folder.status === 'Complet';
                    const isIncomplete = folder && folder.status === 'Incomplet';
                    const isMissing = !folder || folder.documentCount === 0;

                    return (
                      <div 
                        key={emp.id} 
                        className="bg-slate-50/70 hover:bg-white border border-slate-150 hover:border-[#4A9EC9]/40 rounded-2xl p-4 transition-all shadow-2xs hover:shadow-md flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-black text-xs shrink-0">
                                {emp.name.charAt(0)}
                              </div>
                              <div className="overflow-hidden">
                                <h4 className="text-xs font-black text-slate-900 uppercase truncate group-hover:text-[#4A9EC9] transition-colors" title={emp.name}>
                                  {emp.name}
                                </h4>
                                <p className="text-[9px] text-slate-400 font-mono font-bold">
                                  {emp.matricule || 'EMP-2026'} • {emp.positionDetails?.title || emp.position || 'Collaborateur'}
                                </p>
                              </div>
                            </div>

                            <span className={cn(
                              "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shrink-0",
                              isComplete ? "bg-emerald-100 text-emerald-800" :
                              isIncomplete ? "bg-amber-100 text-amber-800" :
                              "bg-slate-200 text-slate-600"
                            )}>
                              {isComplete ? "✓ Complet" : isIncomplete ? "● Incomplet" : "○ Non fourni"}
                            </span>
                          </div>

                          <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                            <span className="font-bold font-mono">
                              {folder ? `${folder.documentCount} pièce(s) enregistrée(s)` : '0 pièce numérisée'}
                            </span>
                            {folder && (
                              <span className="text-[9px] text-slate-400">Maj : {folder.lastUpdated}</span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleOpenOrCreateFolder(emp, dataType)}
                            className="flex-1 py-1.5 px-2 bg-white hover:bg-[#4A9EC9] text-[#4A9EC9] hover:text-white border border-[#4A9EC9]/30 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all shadow-2xs border-0 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" /> Consulter / Gérer
                          </button>

                          <button
                            onClick={() => setViewA4Employee(emp)}
                            className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-[9px] font-black uppercase tracking-wider transition-colors border-0 cursor-pointer"
                            title="Fiche individuelle A4"
                          >
                            A4
                          </button>

                          {folder && (
                            <button
                              onClick={() => handleDelete(folder.id, emp.name, dataType.folderType)}
                              className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors border-0 cursor-pointer"
                              title="Supprimer la chemise"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* CREATE / INDEX FOLDER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2rem] border border-slate-150 shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Ouvrir un dossier de classement</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Indexation réglementaire des documents du collaborateur</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 border-0 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Salarié concerné *</label>
                <select 
                  required
                  value={form.employeeId}
                  onChange={e => setForm({...form, employeeId: e.target.value})}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all cursor-pointer"
                >
                  <option value="">Sélectionnez un employé...</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.matricule})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Type de données collectées</label>
                  <select 
                    value={form.folderType}
                    onChange={e => setForm({...form, folderType: e.target.value as any})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all cursor-pointer"
                  >
                    <option value="Identité & CMU">Pièces d'identité & CMU (CNI, CMU, Passeport)</option>
                    <option value="RIB & Banques">RIB & Coordonnées bancaires</option>
                    <option value="Permis de conduire">Permis de conduire numérisé</option>
                    <option value="Diplômes & Certifications">Diplômes, Titres & Certifications</option>
                    <option value="Contrats Signés">Contrats de travail signés</option>
                    <option value="Attestations & Justificatifs">Attestations, Casier B3 & Résidence</option>
                    <option value="Médical & Aptitude">Dossier médical & Aptitude</option>
                    <option value="Disciplinaire">Dossier disciplinaire</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">État de conformité</label>
                  <select 
                    value={form.status}
                    onChange={e => setForm({...form, status: e.target.value as any})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all cursor-pointer"
                  >
                    <option value="Complet">Complet (Toutes pièces fournies)</option>
                    <option value="Incomplet">Incomplet (En attente de pièces)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 h-11 bg-[#4A9EC9] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-95 shadow-lg border-0 cursor-pointer"
                >
                  Valider l'indexation
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 h-11 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 border-0 cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED FOLDER POPUP WITH CONTRACT TEMPLATE GENERATION & PREVIEW */}
      {selectedFolder && (() => {
        const emp = employees.find(e => e.id === selectedFolder.employeeId);
        
        // Custom added documents saved in localStorage for this folder
        const customDocsKey = `custom_folder_docs_${selectedFolder.id}`;
        const savedCustomDocsJson = localStorage.getItem(customDocsKey);
        const customDocs: Array<{ name: string; date: string; size: string }> = savedCustomDocsJson ? JSON.parse(savedCustomDocsJson) : [];

        // Helper to check what default simulated documents are in this folder type
        let defaultDocList: Array<{ name: string; date: string; size: string }> = [];
        const fType = selectedFolder.folderType.toLowerCase();

        if (fType.includes('identité') || fType.includes('cmu')) {
          defaultDocList = [
            { name: "Photocopie_CNI_Recto_Verso.pdf", date: "2026-05-10", size: "1.2 MB" },
            { name: "Carte_CMU_Recto_Verso.pdf", date: "2026-05-11", size: "980 KB" },
            { name: "Passeport_Biometrique.pdf", date: "2026-05-12", size: "3.4 MB" },
            { name: "Attestation_Residence_Valide.pdf", date: selectedFolder.lastUpdated, size: "520 KB" }
          ];
        } else if (fType.includes('rib') || fType.includes('banque')) {
          defaultDocList = [
            { name: "Releve_Identite_Bancaire_RIB_Officiel.pdf", date: selectedFolder.lastUpdated, size: "450 KB" },
            { name: "Attestation_Ouverture_Compte_Bancaire.pdf", date: selectedFolder.lastUpdated, size: "310 KB" }
          ];
        } else if (fType.includes('permis')) {
          defaultDocList = [
            { name: "Permis_De_Conduire_Biometrique_Recto_Verso.pdf", date: selectedFolder.lastUpdated, size: "1.1 MB" }
          ];
        } else if (fType.includes('diplôme') || fType.includes('certification') || fType.includes('diplomes')) {
          defaultDocList = [
            { name: `Diplome_Master_Declare_${emp?.personalDetails?.nationality || 'Ivoirienne'}.pdf`, date: "2026-02-11", size: "2.1 MB" },
            { name: "Certificat_Homologation_BAC_Licence.pdf", date: "2026-02-11", size: "850 KB" }
          ];
        } else if (fType.includes('attestation') || fType.includes('justificatif')) {
          defaultDocList = [
            { name: "Extrait_Casier_Judiciaire_B3.pdf", date: selectedFolder.lastUpdated, size: "720 KB" },
            { name: "Certificat_De_Residence_Legalise.pdf", date: selectedFolder.lastUpdated, size: "480 KB" },
            { name: "Attestation_De_Travail_Ancien_Employeur.pdf", date: "2026-01-10", size: "1.4 MB" }
          ];
        } else if (fType.includes('médical') || fType.includes('medical')) {
          defaultDocList = [
            { name: "Certificat_Aptitude_Medecine_Du_Travail.pdf", date: "2026-04-03", size: "1.1 MB" }
          ];
        } else {
          defaultDocList = [
            { name: "Document_Indexation_Initiale.pdf", date: selectedFolder.lastUpdated, size: "142 KB" }
          ];
        }

        let docList = [...defaultDocList, ...customDocs];

        // Add any saved contracts generated from template
        const savedContractKey = `saved_contract_${selectedFolder.employeeId}_${selectedFolder.id}`;
        const savedContractText = localStorage.getItem(savedContractKey);
        if (savedContractText) {
          if (!docList.some(d => d.name === "Contrat_de_Travail_Genere.pdf")) {
            docList.push({ name: "Contrat_de_Travail_Genere.pdf", date: selectedFolder.lastUpdated, size: "84 KB" });
          }
        }

        return (
          <div className="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
            <div className="bg-white rounded-[2rem] border border-slate-150 shadow-2xl w-full max-w-4xl overflow-hidden my-8">
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-8 h-8 text-[#4A9EC9]" />
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Chemise : {selectedFolder.folderType}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Collab : {selectedFolder.employeeName} ({emp?.matricule || 'N/A'})</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedFolder(null)} 
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 border-0 cursor-pointer text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Grid content */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[70vh] overflow-y-auto">
                
                {/* Left col: Pieces list */}
                <div className="lg:col-span-5 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Pièces jointes & Documents ({docList.length})</h4>
                  
                  {docList.length === 0 ? (
                    <div className="p-8 text-center text-slate-300 text-xs font-bold uppercase tracking-wider bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      Aucun document dans cette chemise.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {docList.map((doc, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-slate-700 truncate" title={doc.name}>{doc.name}</p>
                              <p className="text-[9px] text-slate-400 font-medium">Indexé le {doc.date} • {doc.size}</p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              if (doc.name === "Contrat_de_Travail_Genere.pdf" && savedContractText) {
                                alert(`Contenu du contrat généré :\n\n${savedContractText}`);
                              } else {
                                alert(`Téléchargement simulé de ${doc.name}\nLe fichier est intègre et sécurisé.`);
                              }
                            }}
                            className="text-[10px] font-black text-[#4A9EC9] hover:underline bg-transparent border-0 cursor-pointer flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" /> Ouvrir
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Personal details info widget */}
                  <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Informations du collaborateur</h5>
                      {emp && (
                        <button
                          type="button"
                          onClick={() => setViewA4Employee(emp)}
                          className="px-2 py-0.5 bg-[#4A9EC9] hover:bg-[#3D8CB7] text-white rounded-lg text-[8px] font-black uppercase tracking-wider flex items-center gap-1 border-0 cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3 h-3" /> Fiche A4
                        </button>
                      )}
                    </div>
                    {emp ? (
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-bold text-slate-700">
                        <div><span className="text-slate-400 font-medium">Matricule:</span> {emp.matricule}</div>
                        <div><span className="text-slate-400 font-medium">Poste:</span> {emp.positionDetails?.title || emp.position}</div>
                        <div><span className="text-slate-400 font-medium">N° CNI:</span> {emp.personalDetails?.cniNumber || 'Non précisé'}</div>
                        <div><span className="text-slate-400 font-medium">N° CMU:</span> {emp.personalDetails?.cmuNumber || 'Non précisé'}</div>
                        <div><span className="text-slate-400 font-medium">Département:</span> {emp.positionDetails?.department || emp.department}</div>
                        <div><span className="text-slate-400 font-medium">Contrat:</span> {emp.contractDetails?.type || 'CDI'}</div>
                        <div><span className="text-slate-400 font-medium">Salaire Brut:</span> {(emp.payrollDetails?.baseSalary || emp.salary || 75000).toLocaleString('fr-FR')} FCFA</div>
                        <div><span className="text-slate-400 font-medium">Nationalité:</span> {emp.personalDetails?.nationality || 'Non précisé'}</div>
                        <div><span className="text-slate-400 font-medium">Statut:</span> {emp.status}</div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">Données détaillées non disponibles.</p>
                    )}
                  </div>
                </div>

                {/* Right col: Contract generator if 'Contrats Signés' */}
                <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-6 space-y-4">
                  {selectedFolder.folderType === 'Contrats Signés' ? (
                    <div className="space-y-4 h-full flex flex-col justify-between">
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Génération & Signature d'un gabarit de contrat</h4>
                        
                        {contractTemplates.length === 0 ? (
                          <div className="p-6 bg-amber-50 rounded-xl border border-amber-100 text-slate-600 text-xs font-bold leading-relaxed">
                            ⚠️ Aucun modèle de contrat n'est disponible. Veuillez en configurer un d'abord dans la section <span className="underline">Paramétrage &gt; Modèles de contrats</span> de l'application RH.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sélectionner un gabarit de contrat modèle</label>
                              <select
                                value={selectedContractTemplate}
                                onChange={e => setSelectedContractTemplate(e.target.value)}
                                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] cursor-pointer"
                              >
                                <option value="">Choisir un modèle...</option>
                                {contractTemplates.map((t: any) => (
                                  <option key={t.id} value={t.id}>{t.title} ({t.type})</option>
                                ))}
                              </select>
                            </div>

                            {generatedContractText && (
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                                  <span>Prévisualisation du contrat fusionné</span>
                                  <span className="text-emerald-600 font-bold">✓ Variables injectées intelligemment</span>
                                </label>
                                <textarea
                                  value={generatedContractText}
                                  onChange={e => setGeneratedContractText(e.target.value)}
                                  rows={12}
                                  className="w-full p-4 bg-slate-50 border border-slate-150 rounded-xl text-xs font-mono text-slate-700 leading-relaxed outline-none focus:border-[#4A9EC9]"
                                />
                                <p className="text-[10px] text-slate-400 leading-normal italic">
                                  Ce texte est entièrement modifiable. Les variables d'état du collaborateur ont été fusionnées à partir du formulaire de création de l'employé.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {generatedContractText && (
                        <div className="pt-4 border-t border-slate-100 flex gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              localStorage.setItem(savedContractKey, generatedContractText);
                              
                              // Increment documentCount in folders
                              const updatedFolders = folders.map(f => {
                                if (f.id === selectedFolder.id) {
                                  return {
                                    ...f,
                                    documentCount: f.documentCount + 1,
                                    lastUpdated: new Date().toISOString().substring(0, 10),
                                    status: 'Complet' as const
                                  };
                                }
                                return f;
                              });
                              saveFolders(updatedFolders);
                              setSelectedFolder({
                                ...selectedFolder,
                                documentCount: selectedFolder.documentCount + 1,
                                status: 'Complet' as const
                              });

                              if (selectedDossierId) {
                                saveActionLog(selectedDossierId, {
                                  type: 'Indexation',
                                  desc: 'Contrat modèle généré et indexé',
                                  details: `Contrat modèle généré pour ${selectedFolder.employeeName}`
                                });
                              }

                              alert("Le contrat de travail a été généré avec succès, fusionné avec les données de l'employé, signé électroniquement et indexé dans son dossier administratif !");
                            }}
                            className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border-0 cursor-pointer shadow-lg shadow-emerald-600/10"
                          >
                            Signer et indexer dans le dossier
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                          Ajouter un document numérisé (RIB, Permis, Diplômes...)
                        </h4>
                        
                        <div 
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              const file = e.dataTransfer.files[0];
                              const newDoc = {
                                name: file.name,
                                date: new Date().toISOString().substring(0, 10),
                                size: `${(file.size / 1024).toFixed(0)} KB`
                              };
                              const updatedCustomDocs = [...customDocs, newDoc];
                              localStorage.setItem(customDocsKey, JSON.stringify(updatedCustomDocs));
                              
                              const updatedFolders = folders.map(f => {
                                if (f.id === selectedFolder.id) {
                                  return { ...f, documentCount: f.documentCount + 1, lastUpdated: new Date().toISOString().substring(0, 10), status: 'Complet' as const };
                                }
                                return f;
                              });
                              saveFolders(updatedFolders);
                              setSelectedFolder({ ...selectedFolder, documentCount: selectedFolder.documentCount + 1, status: 'Complet' as const });
                            }
                          }}
                          onClick={() => {
                            const fileName = prompt("Entrez le nom de la pièce à joindre (ex: RIB_BANQUE_BOA.pdf, Permis_Conduire_CatB.pdf, Diplome_Licence_2024.pdf) :", `Scan_${selectedFolder.folderType.replace(/[^a-zA-Z0-0]/g, '_')}.pdf`);
                            if (fileName) {
                              const cleanName = fileName.endsWith('.pdf') || fileName.endsWith('.png') || fileName.endsWith('.jpg') ? fileName : `${fileName}.pdf`;
                              const newDoc = {
                                name: cleanName,
                                date: new Date().toISOString().substring(0, 10),
                                size: "1.2 MB"
                              };
                              const updatedCustomDocs = [...customDocs, newDoc];
                              localStorage.setItem(customDocsKey, JSON.stringify(updatedCustomDocs));

                              const updatedFolders = folders.map(f => {
                                if (f.id === selectedFolder.id) {
                                  return { ...f, documentCount: f.documentCount + 1, lastUpdated: new Date().toISOString().substring(0, 10), status: 'Complet' as const };
                                }
                                return f;
                              });
                              saveFolders(updatedFolders);
                              setSelectedFolder({ ...selectedFolder, documentCount: selectedFolder.documentCount + 1, status: 'Complet' as const });
                              if (selectedDossierId) {
                                saveActionLog(selectedDossierId, {
                                  type: 'Indexation',
                                  desc: `Pièce numérisée ajoutée (${newDoc.name})`,
                                  details: `Document indexé dans ${selectedFolder.folderType} pour ${selectedFolder.employeeName}`
                                });
                              }
                            }
                          }}
                          className="border-2 border-dashed border-slate-200 hover:border-[#4A9EC9] bg-slate-50/60 hover:bg-slate-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 cursor-pointer transition-all group"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-150 flex items-center justify-center text-[#4A9EC9] group-hover:scale-105 transition-transform shadow-sm">
                            <Upload className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Cliquer ou glisser-déposer un fichier</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-1">Numérisations acceptées : RIB, Permis de conduire, Diplômes, CNI, Attestations en PDF, PNG ou JPG</p>
                          </div>
                          <span className="px-3 py-1 bg-[#4A9EC9]/10 text-[#4A9EC9] rounded-full text-[9px] font-black uppercase tracking-wider">
                            Indexation Numérique Sécurisée
                          </span>
                        </div>
                      </div>

                      <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-black uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4" /> Chemise RH Réglémentaire
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                          Les pièces enregistrées dans la chemise <span className="font-bold text-slate-700">"{selectedFolder.folderType}"</span> sont archivées avec horodatage conformément aux normes de conformité sociale et légale.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-150 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedFolder(null)}
                  className="px-6 h-10 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest border-0 cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* A4 Sheet Modal */}
      {viewA4Employee && (
        <EmployeeA4SheetModal
          data={viewA4Employee}
          onClose={() => setViewA4Employee(null)}
        />
      )}
    </div>
  );
}
