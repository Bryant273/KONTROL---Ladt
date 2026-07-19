import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  BookText, 
  Plus, 
  Search, 
  Trash2, 
  Pencil, 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  Layers, 
  Copy, 
  Save, 
  FileText, 
  Check, 
  X, 
  ChevronRight, 
  Coins, 
  Info,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { saveActionLog } from '../../../lib/auditLogger';

// Interfaces
export interface Rubrique {
  id: string;
  code: string; // e.g. "101", "301"
  name: string;
  category: 'Gain' | 'Retenue' | 'Patronale';
  calculationType: 'Fixe' | 'Pourcentage' | 'Formule';
  value: number; // Taux ou Montant fixe
  isCotisable: boolean;
  isImposable: boolean;
  description: string;
}

export interface BulletinModele {
  id: string;
  name: string;
  description: string;
  category: 'Cadre' | 'Non-Cadre' | 'Stagiaire' | 'Consultant';
  rubriqueIds: string[];
  status: 'Actif' | 'Inactif';
}

interface ViewProps {
  selectedDossierId: string | null;
}

// 1. RUBRIQUES DE PAIE VIEW
export function RubriquesView({ selectedDossierId }: ViewProps) {
  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'Tous' | 'Gain' | 'Retenue' | 'Patronale'>('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRubrique, setEditingRubrique] = useState<Rubrique | null>(null);

  const [form, setForm] = useState({
    code: '',
    name: '',
    category: 'Gain' as 'Gain' | 'Retenue' | 'Patronale',
    calculationType: 'Fixe' as 'Fixe' | 'Pourcentage' | 'Formule',
    value: 0,
    isCotisable: true,
    isImposable: true,
    description: ''
  });

  const dossierKey = selectedDossierId || 'default';

  // Load from localStorage or seed defaults
  useEffect(() => {
    const key = `payroll_rubriques_${dossierKey}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setRubriques(JSON.parse(saved));
    } else {
      const defaultRubriques: Rubrique[] = [
        { id: 'rub-101', code: '101', name: 'Salaire de Base', category: 'Gain', calculationType: 'Fixe', value: 0, isCotisable: true, isImposable: true, description: 'Rémunération de base contractuelle du salarié.' },
        { id: 'rub-104', code: '104', name: "Prime d'Ancienneté", category: 'Gain', calculationType: 'Pourcentage', value: 2, isCotisable: true, isImposable: true, description: "Prime de fidélité de 2% calculée sur le salaire de base." },
        { id: 'rub-110', code: '110', name: 'Indemnité de Logement', category: 'Gain', calculationType: 'Fixe', value: 50000, isCotisable: true, isImposable: true, description: 'Allocation fixe pour la compensation du logement.' },
        { id: 'rub-115', code: '115', name: 'Indemnité de Transport', category: 'Gain', calculationType: 'Fixe', value: 35000, isCotisable: false, isImposable: false, description: 'Prime forfaitaire de transport exonérée sous plafond.' },
        { id: 'rub-201', code: '201', name: 'Heures Supplémentaires', category: 'Gain', calculationType: 'Formule', value: 0, isCotisable: true, isImposable: true, description: 'Calcul du temps supplémentaire selon le barème légal.' },
        { id: 'rub-301', code: '301', name: 'Retenue CNPS Salariale', category: 'Retenue', calculationType: 'Pourcentage', value: 5.5, isCotisable: true, isImposable: false, description: 'Part sociale salariale obligatoire versée à la CNPS (5.5%).' },
        { id: 'rub-310', code: '310', name: 'Impôt ITS', category: 'Retenue', calculationType: 'Pourcentage', value: 1.2, isCotisable: false, isImposable: false, description: 'Impôt sur les Traitements et Salaires prélevé à la source.' },
        { id: 'rub-320', code: '320', name: 'Contribution Nationale (CN)', category: 'Retenue', calculationType: 'Pourcentage', value: 1.5, isCotisable: false, isImposable: false, description: 'Taxe nationale civique obligatoire prélevée sur le brut.' },
        { id: 'rub-330', code: '330', name: 'Impôt Général (IGR)', category: 'Retenue', calculationType: 'Formule', value: 0, isCotisable: false, isImposable: false, description: "Calcul progressif de l'Impôt Général sur le Revenu." },
        { id: 'rub-401', code: '401', name: 'Retenue CNPS Patronale', category: 'Patronale', calculationType: 'Pourcentage', value: 7.7, isCotisable: true, isImposable: false, description: 'Contribution patronale de sécurité sociale (7.7%).' }
      ];
      setRubriques(defaultRubriques);
      localStorage.setItem(key, JSON.stringify(defaultRubriques));
    }
  }, [dossierKey]);

  const saveRubriques = (data: Rubrique[]) => {
    setRubriques(data);
    localStorage.setItem(`payroll_rubriques_${dossierKey}`, JSON.stringify(data));
  };

  const handleOpenCreate = () => {
    setEditingRubrique(null);
    setForm({
      code: '',
      name: '',
      category: 'Gain',
      calculationType: 'Fixe',
      value: 0,
      isCotisable: true,
      isImposable: true,
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rub: Rubrique) => {
    setEditingRubrique(rub);
    setForm({
      code: rub.code,
      name: rub.name,
      category: rub.category,
      calculationType: rub.calculationType,
      value: rub.value,
      isCotisable: rub.isCotisable,
      isImposable: rub.isImposable,
      description: rub.description
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.name) {
      alert('Veuillez remplir les champs obligatoires.');
      return;
    }

    // Check if code already exists (except when editing the same rubrique)
    const codeExists = rubriques.some(r => r.code === form.code && (!editingRubrique || r.id !== editingRubrique.id));
    if (codeExists) {
      alert(`Le code de rubrique ${form.code} est déjà utilisé.`);
      return;
    }

    if (editingRubrique) {
      const updated = rubriques.map(r => {
        if (r.id === editingRubrique.id) {
          return {
            ...r,
            code: form.code,
            name: form.name,
            category: form.category,
            calculationType: form.calculationType,
            value: Number(form.value),
            isCotisable: form.isCotisable,
            isImposable: form.isImposable,
            description: form.description
          };
        }
        return r;
      });
      saveRubriques(updated);
      saveActionLog(dossierKey, {
        type: 'Rubrique',
        desc: "Mise à jour d'une rubrique de paie",
        details: `Rubrique [${form.code}] ${form.name} modifiée.`
      });
    } else {
      const newRub: Rubrique = {
        id: `rub-${Date.now()}`,
        code: form.code,
        name: form.name,
        category: form.category,
        calculationType: form.calculationType,
        value: Number(form.value),
        isCotisable: form.isCotisable,
        isImposable: form.isImposable,
        description: form.description
      };
      const updated = [...rubriques, newRub];
      saveRubriques(updated);
      saveActionLog(dossierKey, {
        type: 'Rubrique',
        desc: "Création d'une rubrique de paie",
        details: `Rubrique [${form.code}] ${form.name} ajoutée.`
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la rubrique "${name}" ?`)) {
      const updated = rubriques.filter(r => r.id !== id);
      saveRubriques(updated);
      saveActionLog(dossierKey, {
        type: 'Rubrique',
        desc: "Suppression d'une rubrique de paie",
        details: `Rubrique ${name} supprimée.`
      });
    }
  };

  const filtered = rubriques.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.code.includes(searchTerm);
    const matchesCategory = categoryFilter === 'Tous' || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Rubriques de Paie</h2>
          <p className="text-xs text-slate-400">Définition des codes, taux légaux, calculs de cotisations SYSCOHADA et d'impôts sur le revenu</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-md border-0"
        >
          <Plus className="w-4 h-4" /> Nouvelle Rubrique
        </button>
      </div>

      {/* Categories Switch */}
      <div className="flex flex-wrap gap-2">
        {['Tous', 'Gain', 'Retenue', 'Patronale'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat as any)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer",
              categoryFilter === cat 
                ? "bg-[#4A9EC9] text-white border-transparent shadow-sm" 
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
            )}
          >
            {cat === 'Tous' ? 'Toutes rubriques' : cat + 's'}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Settings className="w-4 h-4 text-slate-400" />
          Nomenclature active : {filtered.length} rubriques listées
        </span>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher par code ou libellé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-slate-50 border border-slate-150 rounded-xl pl-9 pr-4 text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
          />
        </div>
      </div>

      {/* Rubriques Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="py-3.5 px-4 w-20">Code</th>
                <th className="py-3.5 px-4">Libellé / Désignation</th>
                <th className="py-3.5 px-4">Type d'élément</th>
                <th className="py-3.5 px-4">Calcul</th>
                <th className="py-3.5 px-4 text-right">Valeur / Taux</th>
                <th className="py-3.5 px-4 text-center">Cotisable</th>
                <th className="py-3.5 px-4 text-center">Imposable</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((rub) => (
                <tr key={rub.id} className="hover:bg-slate-50/40 transition-colors group">
                  <td className="py-4 px-4 font-mono font-black text-xs text-slate-400">
                    {rub.code}
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <span className="font-bold text-slate-900">{rub.name}</span>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5 max-w-sm truncate" title={rub.description}>
                        {rub.description || 'Aucune description rédigée.'}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                      rub.category === 'Gain' ? "bg-emerald-50 text-emerald-600" :
                      rub.category === 'Retenue' ? "bg-rose-50 text-rose-600" :
                      "bg-indigo-50 text-indigo-600"
                    )}>
                      {rub.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      {rub.calculationType}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-black text-slate-950 tabular-nums">
                    {rub.calculationType === 'Pourcentage' ? `${rub.value}%` : 
                     rub.calculationType === 'Formule' ? 'Formule' : 
                     `${rub.value.toLocaleString()} F`}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest inline-flex items-center gap-1",
                      rub.isCotisable ? "bg-teal-50 text-teal-600" : "bg-slate-100 text-slate-400"
                    )}>
                      {rub.isCotisable ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest inline-flex items-center gap-1",
                      rub.isImposable ? "bg-orange-50 text-orange-600" : "bg-slate-100 text-slate-400"
                    )}>
                      {rub.isImposable ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenEdit(rub)}
                        className="w-7 h-7 bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center rounded-lg border-0 cursor-pointer"
                        title="Modifier la rubrique"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(rub.id, rub.name)}
                        className="w-7 h-7 bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center rounded-lg border-0 cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest bg-white">
                    Aucune rubrique trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE/EDIT RUBRIQUE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2rem] border border-slate-150 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  {editingRubrique ? 'Modifier la rubrique' : 'Créer une rubrique'}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configurez le barème de paie</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 border-0 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Code Rubrique *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="ex: 120"
                    value={form.code}
                    onChange={e => setForm({...form, code: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Libellé / Désignation *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Nom complet de la rubrique"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Catégorie *</label>
                  <select 
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value as any})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] cursor-pointer"
                  >
                    <option value="Gain">Gain (Part+ Salaire)</option>
                    <option value="Retenue">Retenue (Part- Salaire)</option>
                    <option value="Patronale">Charges Patronales</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Type de calcul *</label>
                  <select 
                    value={form.calculationType}
                    onChange={e => setForm({...form, calculationType: e.target.value as any})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] cursor-pointer"
                  >
                    <option value="Fixe">Fixe (Montant direct)</option>
                    <option value="Pourcentage">Pourcentage (%)</option>
                    <option value="Formule">Formule calculée</option>
                  </select>
                </div>
              </div>

              {form.calculationType !== 'Formule' && (
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {form.calculationType === 'Pourcentage' ? 'Pourcentage / Taux (%) *' : 'Montant Fixe (FCFA) *'}
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={form.value}
                    onChange={e => setForm({...form, value: Number(e.target.value)})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <input 
                    type="checkbox" 
                    id="isCotisable"
                    checked={form.isCotisable}
                    onChange={e => setForm({...form, isCotisable: e.target.checked})}
                    className="w-4 h-4 rounded cursor-pointerAccent text-[#4A9EC9]"
                  />
                  <label htmlFor="isCotisable" className="text-[10px] font-black text-slate-600 uppercase tracking-wider cursor-pointer">Cotisable (CNPS)</label>
                </div>
                
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <input 
                    type="checkbox" 
                    id="isImposable"
                    checked={form.isImposable}
                    onChange={e => setForm({...form, isImposable: e.target.checked})}
                    className="w-4 h-4 rounded cursor-pointerAccent text-[#4A9EC9]"
                  />
                  <label htmlFor="isImposable" className="text-[10px] font-black text-slate-600 uppercase tracking-wider cursor-pointer">Imposable (Impôts)</label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Description / Note légale</label>
                <textarea 
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  rows={2}
                  placeholder="Justification légale, usage ou formule simplifiée..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 h-11 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-95 border-0 cursor-pointer"
                >
                  {editingRubrique ? 'Sauvegarder les modifications' : 'Enregistrer la Rubrique'}
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

// 2. BULLETINS MODELES VIEW
export function BulletinsModelesView({ selectedDossierId }: ViewProps) {
  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  const [templates, setTemplates] = useState<BulletinModele[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<BulletinModele | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Non-Cadre' as 'Cadre' | 'Non-Cadre' | 'Stagiaire' | 'Consultant',
    rubriqueIds: [] as string[],
    status: 'Actif' as 'Actif' | 'Inactif'
  });

  const dossierKey = selectedDossierId || 'default';

  useEffect(() => {
    // Load Rubriques first
    const rubKey = `payroll_rubriques_${dossierKey}`;
    const savedRubs = localStorage.getItem(rubKey);
    let activeRubs: Rubrique[] = [];
    if (savedRubs) {
      activeRubs = JSON.parse(savedRubs);
      setRubriques(activeRubs);
    }

    const key = `bulletin_templates_${dossierKey}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setTemplates(JSON.parse(saved));
    } else {
      // Create defaults
      const defaultTemplates: BulletinModele[] = [
        {
          id: 'tpl-1',
          name: 'Modèle Employé SYSCOHADA (Standard)',
          description: 'Structure de bulletin standard pour employés non-cadres, incluant salaire de base, indemnité de transport et les cotisations obligatoires CNPS, ITS, CN, IGR.',
          category: 'Non-Cadre',
          rubriqueIds: ['rub-101', 'rub-104', 'rub-115', 'rub-301', 'rub-310', 'rub-320', 'rub-330', 'rub-401'],
          status: 'Actif'
        },
        {
          id: 'tpl-2',
          name: 'Modèle Cadre de Direction',
          description: "Modèle de paie complet pour cadres supérieurs avec indemnités de logement, de transport et primes d'ancienneté.",
          category: 'Cadre',
          rubriqueIds: ['rub-101', 'rub-104', 'rub-110', 'rub-115', 'rub-301', 'rub-310', 'rub-320', 'rub-330', 'rub-401'],
          status: 'Actif'
        },
        {
          id: 'tpl-3',
          name: 'Modèle Contrat Stage',
          description: 'Bulletin simplifié avec indemnité de transport exonérée, sans charges sociales (CNPS) ni retenues imposable lourdes.',
          category: 'Stagiaire',
          rubriqueIds: ['rub-101', 'rub-115'],
          status: 'Actif'
        }
      ];
      setTemplates(defaultTemplates);
      localStorage.setItem(key, JSON.stringify(defaultTemplates));
    }
  }, [dossierKey]);

  const saveTemplates = (data: BulletinModele[]) => {
    setTemplates(data);
    localStorage.setItem(`bulletin_templates_${dossierKey}`, JSON.stringify(data));
  };

  const handleOpenCreate = () => {
    // Collect some logical default rubriques (first few ones)
    const initialRubIds = rubriques.map(r => r.id);
    setForm({
      name: '',
      description: '',
      category: 'Non-Cadre',
      rubriqueIds: initialRubIds.slice(0, 5),
      status: 'Actif'
    });
    setSelectedTemplate(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tpl: BulletinModele) => {
    setSelectedTemplate(tpl);
    setForm({
      name: tpl.name,
      description: tpl.description,
      category: tpl.category,
      rubriqueIds: [...tpl.rubriqueIds],
      status: tpl.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.rubriqueIds.length === 0) {
      alert('Veuillez spécifier un nom et sélectionner au moins une rubrique.');
      return;
    }

    if (selectedTemplate) {
      const updated = templates.map(t => {
        if (t.id === selectedTemplate.id) {
          return {
            ...t,
            name: form.name,
            description: form.description,
            category: form.category,
            rubriqueIds: form.rubriqueIds,
            status: form.status
          };
        }
        return t;
      });
      saveTemplates(updated);
      saveActionLog(dossierKey, {
        type: 'Modèle',
        desc: "Mise à jour d'un modèle de bulletin",
        details: `Modèle ${form.name} modifié avec ${form.rubriqueIds.length} rubriques.`
      });
    } else {
      const newTpl: BulletinModele = {
        id: `tpl-${Date.now()}`,
        name: form.name,
        description: form.description,
        category: form.category,
        rubriqueIds: form.rubriqueIds,
        status: form.status
      };
      const updated = [...templates, newTpl];
      saveTemplates(updated);
      saveActionLog(dossierKey, {
        type: 'Modèle',
        desc: "Création d'un modèle de bulletin",
        details: `Modèle ${form.name} ajouté.`
      });
    }

    setIsModalOpen(false);
  };

  const handleToggleRubrique = (rubId: string) => {
    const list = [...form.rubriqueIds];
    const index = list.indexOf(rubId);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(rubId);
    }
    setForm({ ...form, rubriqueIds: list });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Voulez-vous vraiment supprimer le modèle de bulletin "${name}" ?`)) {
      const updated = templates.filter(t => t.id !== id);
      saveTemplates(updated);
      saveActionLog(dossierKey, {
        type: 'Modèle',
        desc: "Suppression d'un modèle de bulletin",
        details: `Modèle ${name} supprimé.`
      });
    }
  };

  const filtered = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Bulletins modèles de paie</h2>
          <p className="text-xs text-slate-400">Gabarits types de bulletins par collèges de salariés (Cadres, Salariés standard, Stagiaires, Consultants)</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-[#4A9EC9] hover:bg-[#3D8CB7] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg shadow-[#4A9EC9]/20 border-0"
        >
          <BookOpen className="w-4 h-4" /> Créer un modèle
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-400" />
          Structures de paie prédéfinies : {templates.length} modèles actifs
        </span>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher par gabarit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-slate-50 border border-slate-150 rounded-xl pl-9 pr-4 text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
          />
        </div>
      </div>

      {/* Models Grid Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((tpl) => {
          // Count rubriques
          const count = tpl.rubriqueIds.length;
          return (
            <div key={tpl.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                    tpl.category === 'Cadre' ? "bg-purple-50 text-purple-600" :
                    tpl.category === 'Stagiaire' ? "bg-teal-50 text-teal-600" :
                    tpl.category === 'Consultant' ? "bg-blue-50 text-blue-600" :
                    "bg-slate-100 text-slate-600"
                  )}>
                    Collège {tpl.category}
                  </span>
                  <span className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    tpl.status === 'Actif' ? "bg-emerald-500" : "bg-slate-300"
                  )} title={tpl.status} />
                </div>

                <h3 className="text-sm font-black text-slate-900 leading-tight uppercase">{tpl.name}</h3>
                <p className="text-xs text-slate-400 font-medium line-clamp-3">{tpl.description}</p>
              </div>

              {/* Rubriques overview badges */}
              <div className="pt-2 border-t border-slate-50 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <span>Rubriques associées :</span>
                  <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">{count} actives</span>
                </div>

                <div className="flex flex-wrap gap-1 max-h-16 overflow-hidden">
                  {tpl.rubriqueIds.map(rubId => {
                    const found = rubriques.find(r => r.id === rubId);
                    if (!found) return null;
                    return (
                      <span key={rubId} className="px-1.5 py-0.5 bg-slate-50 text-slate-500 text-[8px] font-bold rounded border border-slate-100">
                        {found.code} - {found.name}
                      </span>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button 
                    onClick={() => handleOpenEdit(tpl)}
                    className="flex-1 h-9 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-widest border-0 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Pencil className="w-3 h-3" /> Configurer
                  </button>
                  <button 
                    onClick={() => handleDelete(tpl.id, tpl.name)}
                    className="w-9 h-9 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border-0 cursor-pointer flex items-center justify-center"
                    title="Supprimer le gabarit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest bg-white rounded-2xl border border-slate-100">
            Aucun modèle de bulletin répertorié.
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODEL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] border border-slate-150 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-8">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  {selectedTemplate ? 'Paramétrer le Modèle de Bulletin' : 'Créer un gabarit de bulletin'}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sélectionnez les rubriques constitutives de la fiche</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 border-0 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nom du modèle *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="ex: Modèle Agent Commercial"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Collège Salariés *</label>
                  <select 
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value as any})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    <option value="Non-Cadre">Employé Non-Cadre</option>
                    <option value="Cadre">Cadre de direction</option>
                    <option value="Stagiaire">Stagiaire</option>
                    <option value="Consultant">Consultant Externe</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                <input 
                  type="text"
                  placeholder="Utilité, barèmes, etc."
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                />
              </div>

              {/* Rubriques checkboxes area */}
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Sélectionner les rubriques incluses ({form.rubriqueIds.length} cochées)</label>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">SYSCOHADA V1</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
                  {rubriques.map((rub) => {
                    const isChecked = form.rubriqueIds.includes(rub.id);
                    return (
                      <div 
                        key={rub.id} 
                        onClick={() => handleToggleRubrique(rub.id)}
                        className={cn(
                          "p-3 rounded-2xl border flex items-center justify-between cursor-pointer hover:border-[#4A9EC9] transition-all",
                          isChecked ? "bg-slate-50/50 border-[#4A9EC9] shadow-sm" : "bg-white border-slate-150"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded flex items-center justify-center border",
                            isChecked ? "bg-[#4A9EC9] border-transparent text-white" : "border-slate-300"
                          )}>
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-slate-400 font-mono">[{rub.code}]</span>
                            <p className="text-xs font-bold text-slate-800 line-clamp-1">{rub.name}</p>
                          </div>
                        </div>

                        <span className={cn(
                          "text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider",
                          rub.category === 'Gain' ? "bg-emerald-50 text-emerald-600" :
                          rub.category === 'Retenue' ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500"
                        )}>
                          {rub.category === 'Gain' ? '+ Gain' : '- Ret.'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 h-11 bg-[#4A9EC9] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-95 border-0 cursor-pointer shadow-lg"
                >
                  Sauvegarder le modèle de bulletin
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

// 3. MODELES DE CONTRATS VIEW
export interface ContratModele {
  id: string;
  name: string;
  type: 'CDI' | 'CDD' | 'Stage' | 'Consultant';
  description: string;
  content: string;
  lastUpdated: string;
}

export function ContratsModelesView({ selectedDossierId }: ViewProps) {
  const [templates, setTemplates] = useState<ContratModele[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ContratModele | null>(null);

  const [form, setForm] = useState({
    name: '',
    type: 'CDI' as 'CDI' | 'CDD' | 'Stage' | 'Consultant',
    description: '',
    content: ''
  });

  const dossierKey = selectedDossierId || 'default';

  useEffect(() => {
    const key = `contract_templates_${dossierKey}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setTemplates(JSON.parse(saved));
    } else {
      const defaultTemplates: ContratModele[] = [
        {
          id: 'tpl-c1',
          name: "Contrat de Travail à Durée Indéterminée (CDI)",
          type: "CDI",
          description: "Modèle de contrat à durée indéterminée standard avec période d'essai.",
          content: `CONTRAT DE TRAVAIL A DUREE INDETERMINEE (CDI)\n\nENTRE LES SOUSSIGNES :\nL'entreprise UNIKORP, représentée par son Directeur des Ressources Humaines, ci-après désignée "L'Employeur",\nET :\nM./Mme {{PRENOM}} {{NOM}}, titulaire du matricule {{MATRICULE}}, demeurant à l'adresse indiquée sur sa fiche d'identité, ci-après désigné "Le Salarié".\n\nIL A ETE CONVENU ET ARRETE CE QUI SUIT :\n\nARTICLE 1 : FONCTIONS ET DEPARTEMENT\nLe Salarié est engagé par l'Employeur en qualité de {{POSTE}}, rattaché au département {{DEPARTEMENT}}. Il exercera ses fonctions conformément aux directives de sa hiérarchie.\nLe Salarié est assujetti à la {{CONVENTION}}.\n\nARTICLE 2 : DATE D'EFFET ET LIEU DE TRAVAIL\nLe présent contrat prend effet à compter du {{DATE_DEBUT}} pour une durée indéterminée. Le lieu de travail est fixé au siège social de l'entreprise.\n\nARTICLE 3 : REMUNERATION\nEn contrepartie de ses services, le Salarié percevra une rémunération mensuelle brute de base de {{SALAIRE}} FCFA. S'y ajouteront les primes et indemnités prévues par la législation.\nSituation du salarié : collaborateur {{SITUATION}}.\n\nFait à Abidjan, le {{DATE_DEBUT}} en deux exemplaires originaux.\n\nL'Employeur (Signature)                    Le Salarié (Signature)`,
          lastUpdated: new Date().toISOString().substring(0, 10)
        },
        {
          id: 'tpl-c2',
          name: "Contrat de Travail à Durée Déterminée (CDD)",
          type: "CDD",
          description: "Modèle de contrat à durée déterminée avec spécification de la durée.",
          content: `CONTRAT DE TRAVAIL A DUREE DETERMINEE (CDD)\n\nENTRE LES SOUSSIGNES :\nL'entreprise UNIKORP, représentée par son Directeur des Ressources Humaines, ci-après désignée "L'Employeur",\nET :\nM./Mme {{PRENOM}} {{NOM}}, titulaire du matricule {{MATRICULE}}, demeurant à l'adresse indiquée sur sa fiche d'identité, ci-après désigné "Le Salarié".\n\nIL A ETE CONVENU ET ARRETE CE QUI SUIT :\n\nARTICLE 1 : OBJET ET DUREE\nLe Salarié est engagé en qualité de {{POSTE}} pour une durée déterminée de {{DUREE}} mois, débutant le {{DATE_DEBUT}} et se terminant le {{DATE_FIN}}.\n\nARTICLE 2 : REMUNERATION\nLa rémunération mensuelle de base brute convenue est de {{SALAIRE}} FCFA.\nSituation du salarié : collaborateur {{SITUATION}}.\n\nFait à Abidjan, le {{DATE_DEBUT}} en deux exemplaires.`,
          lastUpdated: new Date().toISOString().substring(0, 10)
        },
        {
          id: 'tpl-c3',
          name: "Convention de Stage Indemnisé",
          type: "Stage",
          description: "Convention type pour stagiaires de perfectionnement ou d'études.",
          content: `CONVENTION DE STAGE DE PERFECTIONNEMENT\n\nENTRE LES SOUSSIGNES :\nL'entreprise UNIKORP, ci-après "L'Organisme d'accueil",\nET :\nM./Mme {{PRENOM}} {{NOM}}, titulaire du matricule {{MATRICULE}}, ci-après désigné "Le Stagiaire".\n\nIL A ETE CONVENU CE QUI SUIT :\n\nARTICLE 1 : OBJECTIF DU STAGE\nLe Stagiaire est accueilli pour accomplir un stage de formation pratique au sein du département {{DEPARTEMENT}} en qualité de {{POSTE}}.\nLa durée du stage est fixée à {{DUREE}} mois, du {{DATE_DEBUT}} au {{DATE_FIN}}.\n\nARTICLE 2 : INDEMNISATION & STATUT\nL'Organisme d'accueil versera au Stagiaire une prime de stage mensuelle globale de {{SALAIRE}} FCFA.\nSituation du stagiaire : collaborateur {{SITUATION}}.\n\nFait à Abidjan, le {{DATE_DEBUT}}.`,
          lastUpdated: new Date().toISOString().substring(0, 10)
        }
      ];
      setTemplates(defaultTemplates);
      localStorage.setItem(key, JSON.stringify(defaultTemplates));
    }
  }, [dossierKey]);

  const saveTemplates = (data: ContratModele[]) => {
    setTemplates(data);
    localStorage.setItem(`contract_templates_${dossierKey}`, JSON.stringify(data));
  };

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setForm({
      name: '',
      type: 'CDI',
      description: '',
      content: `CONTRAT DE TRAVAIL\n\nNom: {{NOM}}\nPrénom: {{PRENOM}}\nPoste: {{POSTE}}\nSalaire: {{SALAIRE}} FCFA`
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tpl: ContratModele) => {
    setEditingTemplate(tpl);
    setForm({
      name: tpl.name,
      type: tpl.type,
      description: tpl.description,
      content: tpl.content
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.content) {
      alert('Veuillez remplir le nom et le contenu du modèle.');
      return;
    }

    if (editingTemplate) {
      const updated = templates.map(t => {
        if (t.id === editingTemplate.id) {
          return {
            ...t,
            name: form.name,
            type: form.type,
            description: form.description,
            content: form.content,
            lastUpdated: new Date().toISOString().substring(0, 10)
          };
        }
        return t;
      });
      saveTemplates(updated);
      saveActionLog(dossierKey, {
        type: 'ContratMod',
        desc: 'Mise à jour d\'un modèle de contrat',
        details: `Modèle de contrat "${form.name}" mis à jour.`
      });
    } else {
      const newTpl: ContratModele = {
        id: `tpl-c-${Date.now()}`,
        name: form.name,
        type: form.type,
        description: form.description,
        content: form.content,
        lastUpdated: new Date().toISOString().substring(0, 10)
      };
      const updated = [newTpl, ...templates];
      saveTemplates(updated);
      saveActionLog(dossierKey, {
        type: 'ContratMod',
        desc: 'Création d\'un modèle de contrat',
        details: `Modèle de contrat "${form.name}" ajouté.`
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Voulez-vous supprimer le modèle de contrat "${name}" ?`)) {
      const updated = templates.filter(t => t.id !== id);
      saveTemplates(updated);
      saveActionLog(dossierKey, {
        type: 'ContratMod',
        desc: 'Suppression d\'un modèle de contrat',
        details: `Modèle de contrat "${name}" supprimé.`
      });
    }
  };

  const filtered = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#4A9EC9]" /> Modèles de Contrats
          </h2>
          <p className="text-xs text-slate-400">Configurez vos gabarits d'embauche réutilisables avec fusion automatique des dossiers d'employés</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-[#4A9EC9] hover:bg-[#3D8CB7] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg shadow-[#4A9EC9]/10 border-0"
        >
          <Plus className="w-4 h-4" /> Créer un modèle
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {filtered.length} modèle(s) de contrats disponible(s)
        </span>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher un modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-slate-50 border border-slate-150 rounded-xl pl-9 pr-4 text-xs font-bold outline-none focus:border-[#4A9EC9] transition-all"
          />
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tpl) => (
          <div key={tpl.id} className="bg-white border border-slate-100 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className={cn(
                  "px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                  tpl.type === 'CDI' ? "bg-purple-50 text-purple-600" :
                  tpl.type === 'CDD' ? "bg-blue-50 text-[#4A9EC9]" :
                  tpl.type === 'Stage' ? "bg-emerald-50 text-emerald-600" :
                  "bg-slate-100 text-slate-700"
                )}>
                  {tpl.type}
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                  Màj: {tpl.lastUpdated}
                </span>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-black text-slate-900 uppercase leading-snug tracking-tight group-hover:text-[#4A9EC9] transition-colors">
                  {tpl.name}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider line-clamp-2">
                  {tpl.description}
                </p>
              </div>

              <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest block mb-1">Extrait du texte :</span>
                <p className="text-[10px] font-mono font-medium text-slate-600 line-clamp-3 whitespace-pre-wrap">
                  {tpl.content}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-50 flex items-center justify-between">
              <button 
                onClick={() => handleOpenEdit(tpl)}
                className="text-xs font-bold text-[#4A9EC9] flex items-center gap-1.5 hover:underline border-0 bg-transparent cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" /> Éditer le texte
              </button>

              <button 
                onClick={() => handleDelete(tpl.id, tpl.name)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 transition-colors border-0 cursor-pointer"
                title="Supprimer le modèle"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 bg-white rounded-3xl border border-slate-100 text-center text-[10px] font-black uppercase tracking-widest text-slate-300">
            Aucun modèle de contrat.
          </div>
        )}
      </div>

      {/* CREATE / EDIT CONTRACT TEMPLATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2rem] border border-slate-150 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  {editingTemplate ? 'Modifier le modèle de contrat' : 'Nouveau modèle de contrat'}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  Définition des clauses juridiques et des balises de fusion
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 border-0 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nom du gabarit *</label>
                  <input 
                    type="text" 
                    required
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Ex: Contrat de Travail CDI Standard"
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Type d'accord *</label>
                  <select 
                    value={form.type}
                    onChange={e => setForm({...form, type: e.target.value as any})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer outline-none focus:border-[#4A9EC9]"
                  >
                    <option value="CDI">CDI (Indéterminé)</option>
                    <option value="CDD">CDD (Déterminé)</option>
                    <option value="Stage">Convention Stage</option>
                    <option value="Consultant">Consultant / Freelance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Description brève</label>
                <input 
                  type="text" 
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Ex: Utilisé pour les embauches d'employés non-cadres en Côte d'Ivoire."
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Texte contractuel / Clauses *</label>
                  <span className="text-[8.5px] font-bold text-slate-400">
                    Balises: {"{{NOM}}"}, {"{{PRENOM}}"}, {"{{MATRICULE}}"}, {"{{SALAIRE}}"}, {"{{POSTE}}"}, {"{{DATE_DEBUT}}"}, {"{{DATE_FIN}}"}, {"{{DUREE}}"}, {"{{DEPARTEMENT}}"}, {"{{CONVENTION}}"}, {"{{SITUATION}}"}
                  </span>
                </div>
                <textarea 
                  required
                  rows={10}
                  value={form.content}
                  onChange={e => setForm({...form, content: e.target.value})}
                  placeholder="Rédigez ou collez le texte juridique du contrat ici..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium outline-none focus:border-[#4A9EC9] h-60 overflow-y-auto"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 h-11 bg-[#4A9EC9] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-95 border-0 cursor-pointer shadow-lg"
                >
                  Sauvegarder le modèle
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
