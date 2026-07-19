import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Check, 
  X, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Sparkles,
  Fingerprint,
  CalendarCheck2
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { saveActionLog } from '../../../lib/auditLogger';
import { Employee } from './PersonnelViews';

// Interfaces
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'Annuel' | 'Maladie' | 'Maternité' | 'Sans solde' | 'Exceptionnel';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Approuvé' | 'Refusé' | 'En attente';
}

export interface Clocking {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  timeIn: string;
  timeOut?: string;
  status: "À l'heure" | 'En retard' | 'Absent';
}

interface ViewProps {
  selectedDossierId: string | null;
}

// 1. CONGES & ABSENCES VIEW
export function AbsencesView({ selectedDossierId }: ViewProps) {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    employeeId: '',
    type: 'Annuel' as 'Annuel' | 'Maladie' | 'Maternité' | 'Sans solde' | 'Exceptionnel',
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date(Date.now() + 86400000 * 5).toISOString().substring(0, 10),
    days: 5,
    reason: ''
  });

  useEffect(() => {
    // Load Employees
    const empKey = `employees_${selectedDossierId || 'default'}`;
    const savedEmps = localStorage.getItem(empKey);
    if (savedEmps) {
      setEmployees(JSON.parse(savedEmps));
    }

    const key = `leave_requests_${selectedDossierId || 'default'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setRequests(JSON.parse(saved));
    } else {
      const defaultRequests: LeaveRequest[] = [
        { id: 'l-1', employeeId: 'emp-1', employeeName: 'KONAN Kouassi Jean', type: 'Annuel', startDate: '2026-08-01', endDate: '2026-08-15', days: 10, reason: 'Congés annuels réguliers', status: 'Approuvé' },
        { id: 'l-2', employeeId: 'emp-2', employeeName: 'DIARRASSOUBA Mariam', type: 'Maladie', startDate: '2026-05-10', endDate: '2026-05-13', days: 3, reason: 'Rendez-vous médical certifié', status: 'Approuvé' },
        { id: 'l-3', employeeId: 'emp-3', employeeName: 'YAO Koffi Serge', type: 'Exceptionnel', startDate: '2026-07-20', endDate: '2026-07-22', days: 2, reason: 'Événement familial', status: 'En attente' }
      ];
      setRequests(defaultRequests);
      localStorage.setItem(key, JSON.stringify(defaultRequests));
    }
  }, [selectedDossierId]);

  const saveRequests = (data: LeaveRequest[]) => {
    setRequests(data);
    const key = `leave_requests_${selectedDossierId || 'default'}`;
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employeeId || !form.reason) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const empObj = employees.find(x => x.id === form.employeeId);
    if (!empObj) return;

    // Calculate days approximately
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newReq: LeaveRequest = {
      id: `l-${Date.now()}`,
      employeeId: form.employeeId,
      employeeName: empObj.name,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      days: calculatedDays || form.days,
      reason: form.reason,
      status: 'En attente'
    };

    const updated = [newReq, ...requests];
    saveRequests(updated);
    setIsModalOpen(false);

    if (selectedDossierId) {
      saveActionLog(selectedDossierId, {
        type: 'Demande',
        desc: 'Nouvelle demande de congé soumise',
        details: `Demande de congé ${newReq.type} de ${newReq.days} jours pour ${newReq.employeeName}`
      });
    }

    setForm({
      employeeId: '',
      type: 'Annuel',
      startDate: new Date().toISOString().substring(0, 10),
      endDate: new Date(Date.now() + 86400000 * 5).toISOString().substring(0, 10),
      days: 5,
      reason: ''
    });
  };

  const handleUpdateStatus = (id: string, status: 'Approuvé' | 'Refusé') => {
    const updated = requests.map(r => {
      if (r.id === id) {
        return { ...r, status };
      }
      return r;
    });
    saveRequests(updated);

    const req = requests.find(r => r.id === id);
    if (req && selectedDossierId) {
      saveActionLog(selectedDossierId, {
        type: 'Validation',
        desc: `Demande de congé ${status === 'Approuvé' ? 'approuvée' : 'rejetée'}`,
        details: `Congé de ${req.employeeName} (${req.days} jours) : ${status}`
      });
    }
  };

  const filtered = requests.filter(r => 
    r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Gestion des congés & absences</h2>
          <p className="text-xs text-slate-400">Planification des départs, congés payés, arrêts maladie et autorisations exceptionnelles</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#4A9EC9] hover:bg-[#3D8CB7] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg shadow-[#4A9EC9]/20 border-0"
        >
          <CalendarCheck2 className="w-4 h-4" /> Poser un congé / absence
        </button>
      </div>

      {/* Summary widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Demandes en attente</p>
            <p className="text-2xl font-black text-amber-500 mt-1">{requests.filter(r => r.status === 'En attente').length}</p>
          </div>
          <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Approuvées ce mois</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{requests.filter(r => r.status === 'Approuvé').length}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Cumul Jours de congés</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {requests.reduce((acc, curr) => acc + (curr.status === 'Approuvé' ? curr.days : 0), 0)} <span className="text-[10px] font-bold text-slate-400">Jours</span>
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-[#4A9EC9] rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters & search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Liste des demandes enregistrées
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

      {/* Requests table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="py-3 px-4">Salarié</th>
                <th className="py-3 px-4">Type d'absence</th>
                <th className="py-3 px-4">Du</th>
                <th className="py-3 px-4">Au</th>
                <th className="py-3 px-4 text-center">Durée</th>
                <th className="py-3 px-4">Motif indiqué</th>
                <th className="py-3 px-4 text-center">Statut</th>
                <th className="py-3 px-4 text-right">Actions de décision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">{req.employeeName}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                      req.type === 'Annuel' ? "bg-blue-50 text-[#4A9EC9]" :
                      req.type === 'Maladie' ? "bg-rose-50 text-rose-600" :
                      req.type === 'Maternité' ? "bg-purple-50 text-purple-600" :
                      "bg-slate-100 text-slate-700"
                    )}>
                      {req.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-550">{new Date(req.startDate).toLocaleDateString('fr-FR')}</td>
                  <td className="py-4 px-4 font-bold text-slate-550">{new Date(req.endDate).toLocaleDateString('fr-FR')}</td>
                  <td className="py-4 px-4 text-center font-black text-slate-950 tabular-nums">
                    {req.days} Jrs
                  </td>
                  <td className="py-4 px-4 text-slate-500 font-medium max-w-xs truncate" title={req.reason}>
                    {req.reason}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1",
                      req.status === 'Approuvé' ? "bg-emerald-50 text-emerald-600" :
                      req.status === 'Refusé' ? "bg-rose-50 text-rose-600" :
                      "bg-amber-50 text-amber-600"
                    )}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {req.status === 'En attente' ? (
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleUpdateStatus(req.id, 'Approuvé')}
                          className="w-7 h-7 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-lg border-0 cursor-pointer"
                          title="Approuver"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(req.id, 'Refusé')}
                          className="w-7 h-7 bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center rounded-lg border-0 cursor-pointer"
                          title="Refuser"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Traité</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest bg-white">
                    Aucune demande d'absence répertoriée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POST LEAVE REQUEST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2rem] border border-slate-150 shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Saisir une demande d'absence</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Saisie des dates de dispense et motif</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 border-0 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Salarié demandeur *</label>
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

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Type d'absence *</label>
                <select 
                  value={form.type}
                  onChange={e => setForm({...form, type: e.target.value as any})}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all cursor-pointer"
                >
                  <option value="Annuel">Congé payé annuel</option>
                  <option value="Maladie">Arrêt Maladie</option>
                  <option value="Maternité">Maternité / Paternité</option>
                  <option value="Sans solde">Congé Sans solde</option>
                  <option value="Exceptionnel">Permission Exceptionnelle</option>
                </select>
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
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date de fin *</label>
                  <input 
                    type="date" 
                    required
                    value={form.endDate}
                    onChange={e => setForm({...form, endDate: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Motif de la demande *</label>
                <textarea 
                  required
                  value={form.reason}
                  onChange={e => setForm({...form, reason: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all resize-none"
                  placeholder="Justification légale ou personnelle de l'absence..."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 h-11 bg-[#4A9EC9] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-95 shadow-lg border-0 cursor-pointer"
                >
                  Soumettre la demande
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

// 2. DAILY ATTENDANCE (Pointage)
export function PointageView({ selectedDossierId }: ViewProps) {
  const [clockings, setClockings] = useState<Clocking[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [statusInput, setStatusInput] = useState<"À l'heure" | 'En retard'>("À l'heure");

  useEffect(() => {
    // Load Employees
    const empKey = `employees_${selectedDossierId || 'default'}`;
    const savedEmps = localStorage.getItem(empKey);
    if (savedEmps) {
      const emps = JSON.parse(savedEmps);
      setEmployees(emps);
      if (emps.length > 0) {
        setSelectedEmpId(emps[0].id);
      }
    }

    const key = `clockings_${selectedDossierId || 'default'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setClockings(JSON.parse(saved));
    } else {
      const defaultClockings: Clocking[] = [
        { id: 'cl-1', employeeId: 'emp-1', employeeName: 'KONAN Kouassi Jean', date: new Date().toISOString().substring(0, 10), timeIn: '07:55', timeOut: '17:02', status: 'À l\'heure' },
        { id: 'cl-2', employeeId: 'emp-2', employeeName: 'DIARRASSOUBA Mariam', date: new Date().toISOString().substring(0, 10), timeIn: '08:15', timeOut: '17:00', status: 'En retard' },
        { id: 'cl-3', employeeId: 'emp-3', employeeName: 'YAO Koffi Serge', date: new Date().toISOString().substring(0, 10), timeIn: '07:48', timeOut: '17:15', status: 'À l\'heure' }
      ];
      setClockings(defaultClockings);
      localStorage.setItem(key, JSON.stringify(defaultClockings));
    }
  }, [selectedDossierId]);

  const saveClockings = (data: Clocking[]) => {
    setClockings(data);
    const key = `clockings_${selectedDossierId || 'default'}`;
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleClockIn = () => {
    if (!selectedEmpId) return;

    const empObj = employees.find(x => x.id === selectedEmpId);
    if (!empObj) return;

    const todayStr = new Date().toISOString().substring(0, 10);
    // Check if already clock-in today
    const exists = clockings.find(c => c.employeeId === selectedEmpId && c.date === todayStr);
    if (exists) {
      alert("Ce salarié a déjà pointé son entrée aujourd'hui.");
      return;
    }

    const nowTimeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const newClocking: Clocking = {
      id: `clk-${Date.now()}`,
      employeeId: selectedEmpId,
      employeeName: empObj.name,
      date: todayStr,
      timeIn: nowTimeStr,
      status: statusInput
    };

    const updated = [newClocking, ...clockings];
    saveClockings(updated);

    if (selectedDossierId) {
      saveActionLog(selectedDossierId, {
        type: 'Pointage',
        desc: "Enregistrement d'un pointage d'entrée",
        details: `Pointage ENTREE pour ${newClocking.employeeName} à ${newClocking.timeIn} (${newClocking.status})`
      });
    }
  };

  const handleClockOut = (id: string) => {
    const nowTimeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const updated = clockings.map(c => {
      if (c.id === id) {
        return { ...c, timeOut: nowTimeStr };
      }
      return c;
    });
    saveClockings(updated);

    const clk = clockings.find(c => c.id === id);
    if (clk && selectedDossierId) {
      saveActionLog(selectedDossierId, {
        type: 'Pointage',
        desc: "Enregistrement d'un pointage de sortie",
        details: `Pointage SORTIE pour ${clk.employeeName} enregistré à ${nowTimeStr}`
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Pointage numérique & Présences</h2>
          <p className="text-xs text-slate-400">Suivi des horaires d'entrée, de sortie et décompte du temps de travail effectif</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Clock In simulator form card */}
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
            <Fingerprint className="w-5 h-5 text-[#4A9EC9]" />
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800">Simulateur de Pointeuse</h4>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Salarié à badger</label>
              <select 
                value={selectedEmpId}
                onChange={e => setSelectedEmpId(e.target.value)}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all cursor-pointer"
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Statut de ponctualité</label>
              <div className="flex gap-2">
                {['À l\'heure', 'En retard'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusInput(st as any)}
                    className={cn(
                      "flex-1 h-9 rounded-xl text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-all",
                      statusInput === st 
                        ? "bg-slate-900 text-white border-transparent shadow-md" 
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleClockIn}
              className="w-full h-11 bg-[#4A9EC9] hover:bg-[#3D8CB7] text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#4A9EC9]/15 border-0 mt-2"
            >
              <Fingerprint className="w-4 h-4" /> Enregistrer le passage
            </button>
          </div>
        </div>

        {/* Live List Table of daily clock-ins */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800">Registre des pointages</h4>
            <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">Aujourd'hui : {new Date().toLocaleDateString('fr-FR')}</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-[9px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Collaborateur</th>
                  <th className="py-2.5 px-3 text-center">Heure Arrivée</th>
                  <th className="py-2.5 px-3 text-center">Heure Départ</th>
                  <th className="py-2.5 px-3 text-center">Ponctualité</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {clockings.map((clk) => (
                  <tr key={clk.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 text-slate-400 font-bold">{new Date(clk.date).toLocaleDateString('fr-FR')}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{clk.employeeName}</td>
                    <td className="py-3 px-3 text-center font-mono font-black text-xs text-slate-700">{clk.timeIn}</td>
                    <td className="py-3 px-3 text-center font-mono font-black text-xs text-emerald-600">
                      {clk.timeOut ? clk.timeOut : (
                        <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">En poste</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                        clk.status === 'À l\'heure' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      )}>
                        {clk.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {!clk.timeOut ? (
                        <button
                          onClick={() => handleClockOut(clk.id)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[8px] font-black uppercase tracking-widest border-0 cursor-pointer"
                        >
                          Départ
                        </button>
                      ) : (
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Clôturé</span>
                      )}
                    </td>
                  </tr>
                ))}
                {clockings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest bg-white">
                      Aucun pointage aujourd'hui.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
