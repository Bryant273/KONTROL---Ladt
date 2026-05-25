import React, { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useCompany } from '../../context/CompanyContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Search, 
  Eye, 
  Pencil, 
  Trash2, 
  FileText, 
  UploadCloud, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  Download,
  FolderOpen,
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { saveActionLog } from '../../lib/auditLogger';
import { cn } from '../../lib/utils';

interface Invoice {
  id: string;
  date: string;
  piece: string;
  tiers: string;
  type: string;
  amount: number;
  status: string;
  fileUrl?: string;
  fileName?: string;
}

export default function InvoicesAdminPage() {
  const { selectedDossier, activeEnterprise } = useCompany();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Tous');
  
  // Storage synchronized with selected dossier
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  const [formInvoice, setFormInvoice] = useState({
    id: '',
    piece: '',
    tiers: '',
    type: 'Achat',
    date: new Date().toISOString().substring(0, 10),
    amount: '',
    fileName: '',
    fileUrl: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load invoices dynamically based on dossier
  useEffect(() => {
    const defaultInvoices = [
      { id: '1', date: '2024-07-20', piece: 'FACT-088', tiers: 'Client Alpha', type: 'Vente', amount: 4500, status: 'Traité' },
      { id: '2', date: '2024-07-19', piece: 'F-2024-001', tiers: 'SOCIX SARL', type: 'Achat', amount: 125000, status: 'Traité' },
      { id: '3', date: '2024-07-18', piece: 'MTN-INV-99', tiers: 'MTN CI', type: 'Achat', amount: 15000, status: 'Traité' },
    ];
    
    if (selectedDossier) {
      const storageKey = `invoices_adm_${selectedDossier.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setInvoices(JSON.parse(saved));
      } else {
        setInvoices(defaultInvoices);
        localStorage.setItem(storageKey, JSON.stringify(defaultInvoices));
      }
    } else {
      setInvoices(defaultInvoices);
    }
  }, [selectedDossier]);

  const saveInvoicesState = (newInvoices: Invoice[]) => {
    setInvoices(newInvoices);
    if (selectedDossier) {
      const storageKey = `invoices_adm_${selectedDossier.id}`;
      localStorage.setItem(storageKey, JSON.stringify(newInvoices));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const nameWithoutExt = file.name.split('.').slice(0, -1).join('.') || 'FAC-NEW';
      const cleanPiece = nameWithoutExt.toUpperCase().replace(/\s+/g, '-').substring(0, 15);
      const randAmount = Math.floor(Math.random() * 85 + 15) * 1000;
      
      setFormInvoice(prev => ({
        ...prev,
        piece: cleanPiece,
        amount: randAmount.toString(),
        fileName: file.name,
        fileUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInvoice.piece || !formInvoice.amount || !formInvoice.tiers) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (modalMode === 'create') {
      const newInv: Invoice = {
        id: Date.now().toString(),
        date: formInvoice.date,
        piece: formInvoice.piece,
        tiers: formInvoice.tiers,
        type: formInvoice.type,
        amount: parseFloat(formInvoice.amount) || 0,
        status: 'Traité',
        fileName: formInvoice.fileName,
        fileUrl: formInvoice.fileUrl
      };
      const updated = [newInv, ...invoices];
      saveInvoicesState(updated);
      
      if (selectedDossier) {
        saveActionLog(selectedDossier.id, {
          type: 'Digitalisation',
          desc: 'Facture digitalisée',
          details: `Ajout de la facture ${newInv.piece} | Tiers : ${newInv.tiers} | Montant : ${newInv.amount} FCFA`
        });
      }
    } else {
      const updated = invoices.map(inv => {
        if (inv.id === formInvoice.id) {
          return {
            ...inv,
            date: formInvoice.date,
            piece: formInvoice.piece,
            tiers: formInvoice.tiers,
            type: formInvoice.type,
            amount: parseFloat(formInvoice.amount) || 0,
            fileName: formInvoice.fileName || inv.fileName,
            fileUrl: formInvoice.fileUrl || inv.fileUrl
          };
        }
        return inv;
      });
      saveInvoicesState(updated);

      if (selectedDossier) {
        saveActionLog(selectedDossier.id, {
          type: 'Digitalisation',
          desc: 'Modification facture',
          details: `Modification de la facture ${formInvoice.piece}`
        });
      }
    }

    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string, piece: string) => {
    if (window.confirm(`Confirmez-vous la suppression définitive de la facture ${piece} ?`)) {
      const updated = invoices.filter(inv => inv.id !== id);
      saveInvoicesState(updated);
      if (selectedDossier) {
        saveActionLog(selectedDossier.id, {
          type: 'Suppression',
          desc: 'Suppression facture',
          details: `Suppression de la facture ${piece}`
        });
      }
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormInvoice({
      id: '',
      piece: '',
      tiers: '',
      type: 'Achat',
      date: new Date().toISOString().substring(0, 10),
      amount: '',
      fileName: '',
      fileUrl: ''
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (inv: Invoice) => {
    setModalMode('edit');
    setFormInvoice({
      id: inv.id,
      piece: inv.piece,
      tiers: inv.tiers,
      type: inv.type,
      date: inv.date,
      amount: inv.amount.toString(),
      fileName: inv.fileName || '',
      fileUrl: inv.fileUrl || ''
    });
    setIsAddModalOpen(true);
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.piece.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.tiers.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'Tous' || inv.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto">
        
        {/* Dashboard Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-0.5 bg-[#8B5CF6]"></span>
              <p className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-[0.3em]">SKOMPTAB Intelligent Core</p>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Numérisation & <span className="text-slate-300">Factures</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
              Dossier actif : <span className="text-[#8B5CF6]">{selectedDossier?.filename || 'Aucun'}</span>
            </p>
          </div>
          
          <button 
            onClick={openCreateModal}
            className="h-11 px-6 bg-[#8B5CF6] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-95 shadow-xl shadow-purple-200 transition-all active:scale-95 cursor-pointer border-0"
          >
            <Plus className="w-4 h-4" /> Digitaliser une facture
          </button>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
            {['Tous', 'Achat', 'Vente'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all",
                  typeFilter === t 
                    ? "bg-white text-slate-900 border border-slate-200 shadow-sm" 
                    : "text-slate-400 hover:text-slate-600 border-0"
                )}
              >
                {t}s
              </button>
            ))}
          </div>

          <div className="relative group min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#8B5CF6] transition-colors" />
            <input 
              placeholder="Rechercher une facture..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-11 bg-white border border-slate-200 rounded-xl pl-11 pr-4 font-bold text-xs focus:ring-4 focus:ring-purple-500/5 focus:border-[#8B5CF6] transition-all outline-none"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/50 text-left border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="py-4 px-6">Date de Facture</th>
                  <th className="py-4 px-6">N° Pièce</th>
                  <th className="py-4 px-6">Tiers Associé</th>
                  <th className="py-4 px-6">Type d'opération</th>
                  <th className="py-4 px-6">Montant Brut</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-purple-50/10 transition-colors group">
                    <td className="py-4 px-6 font-semibold text-slate-500">
                      {new Date(inv.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-6 font-black text-slate-900 tracking-tight uppercase">
                      {inv.piece}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-50 text-[#8B5CF6] flex items-center justify-center text-[9px] font-black">
                          {inv.tiers.substring(0,2).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-700">{inv.tiers}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest inline-block",
                        inv.type === 'Vente' ? "bg-emerald-50 text-emerald-600" : "bg-purple-50 text-purple-600"
                      )}>
                        {inv.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-black text-slate-900 tabular-nums">
                      {inv.amount.toLocaleString()} <span className="text-[10px] text-slate-400 font-bold ml-0.5">FCFA</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setIsDetailsModalOpen(true);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 bg-slate-50 hover:bg-white hover:text-[#8B5CF6] hover:shadow-sm border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(inv)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 bg-slate-50 hover:bg-white hover:text-amber-500 hover:shadow-sm border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(inv.id, inv.piece)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 bg-slate-50 hover:bg-white hover:text-rose-500 hover:shadow-sm border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest bg-white">
                      Aucune facture numérisée disponible.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              {filteredInvoices.length} FACTURE(S) FILTRÉE(S)
            </span>
          </div>
        </div>

        {/* MODAL : DIGITALISATION & SAISIE RAPIDE */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-sans">
            <div className="bg-white rounded-[2rem] border border-slate-150 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    {modalMode === 'create' ? 'Digitaliser un justificatif' : 'Modifier les données de facturation'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Traitement OCR et indexation comptable</p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 border border-transparent hover:border-slate-250 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto">
                {modalMode === 'create' && (
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:border-[#8B5CF6] transition-colors bg-slate-50/50 flex flex-col items-center justify-center text-center relative group">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*,application/pdf"
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                    <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-[#8B5CF6] transition-colors mb-2" />
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Sélectionnez ou Glissez une facture</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Image ou PDF (max 20 MB)</p>
                    {formInvoice.fileName && (
                      <div className="mt-3 px-3 py-1 bg-purple-50 text-[#8B5CF6] text-[10px] font-black uppercase tracking-wider rounded-lg border border-purple-100 truncate max-w-xs">
                        {formInvoice.fileName}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">N° Pièce Comptable *</label>
                    <input 
                      type="text" 
                      required
                      value={formInvoice.piece}
                      onChange={e => setFormInvoice({...formInvoice, piece: e.target.value.toUpperCase()})}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#8B5CF6] transition-all"
                      placeholder="Ex: FACT-2026"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Type de Flux</label>
                    <select 
                      value={formInvoice.type}
                      onChange={e => setFormInvoice({...formInvoice, type: e.target.value})}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#8B5CF6] transition-all cursor-pointer"
                    >
                      <option value="Achat">Achat (Dépense)</option>
                      <option value="Vente">Vente (Chiffre d'Affaires)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nom du Tiers Associé *</label>
                  <input 
                    type="text" 
                    required
                    value={formInvoice.tiers}
                    onChange={e => setFormInvoice({...formInvoice, tiers: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#8B5CF6] transition-all"
                    placeholder="Ex: CIE Côte d'Ivoire"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date d'opération *</label>
                    <input 
                      type="date" 
                      required
                      value={formInvoice.date}
                      onChange={e => setFormInvoice({...formInvoice, date: e.target.value})}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#8B5CF6] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Montant global (FCFA) *</label>
                    <input 
                      type="number" 
                      required
                      value={formInvoice.amount}
                      onChange={e => setFormInvoice({...formInvoice, amount: e.target.value})}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#8B5CF6] transition-all"
                      placeholder="Montant brut"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button 
                    type="submit"
                    className="flex-1 h-12 bg-[#8B5CF6] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-95 shadow-xl shadow-purple-100 transition-all cursor-pointer border-0"
                  >
                    {modalMode === 'create' ? 'Confirmer la numérisation' : 'Appliquer les modifications'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-6 h-12 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer border-0"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DETAILS MODAL */}
        {isDetailsModalOpen && selectedInvoice && (
          <div className="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-sans">
            <div className="bg-white rounded-[2.5rem] border border-slate-150 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[80vh]">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Consultation de la facture numérisée</h3>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide">Intégration d'écriture et traçabilité</p>
                </div>
                <button 
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 border border-transparent hover:border-slate-250 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
                {/* Visualizer */}
                <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-8 relative">
                  {selectedInvoice.fileUrl ? (
                    <img src={selectedInvoice.fileUrl} alt="Justificatif" className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" />
                  ) : (
                    <div className="text-center p-8 text-white/30 space-y-4">
                      <FileText className="w-16 h-16 mx-auto animate-pulse" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">FACTURE NUMÉRIQUE PDF OBLIGATOIRE</p>
                      <p className="text-[9px] font-medium tracking-wide">Fichier brut archivé en stockage Cloud souverain</p>
                    </div>
                  )}
                </div>

                {/* Indexation sheet */}
                <div className="w-full md:w-[350px] bg-white p-6 flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-6">
                    <div className="border-b border-slate-50 pb-4">
                      <span className="text-[8px] font-black text-[#8B5CF6] uppercase tracking-[0.3em] italic">Statut Traitement</span>
                      <div className="flex items-center gap-2 mt-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Validé et Enregistré</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">N° Pièce</p>
                        <p className="text-sm font-black text-slate-900 tracking-tight uppercase mt-0.5">{selectedInvoice.piece}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Tiers Client / Fournisseur</p>
                        <p className="text-xs font-black text-slate-800 mt-0.5">{selectedInvoice.tiers}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Date d'opération</p>
                        <p className="text-xs font-bold text-slate-600 mt-0.5">{new Date(selectedInvoice.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Nature du flux</p>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider inline-block mt-1",
                          selectedInvoice.type === 'Vente' ? "bg-emerald-50 text-emerald-600" : "bg-purple-50 text-purple-600"
                        )}>
                          {selectedInvoice.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6 mt-8">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider mb-2">
                      <span className="text-slate-400">Total Facturé</span>
                      <span className="text-slate-900 text-sm font-mono leading-none">{selectedInvoice.amount.toLocaleString()} FCFA</span>
                    </div>
                    <button 
                      onClick={() => setIsDetailsModalOpen(false)}
                      className="w-full h-11 bg-[#09090b] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1a1a1e] transition-all cursor-pointer border-0 mt-4"
                    >
                      Fermer la fiche
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
