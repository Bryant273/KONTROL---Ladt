import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCompany } from '../../context/CompanyContext';
import { Logo } from '../../components/ui/Logo';
import { saveActionLog } from '../../lib/auditLogger';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Target, 
  Truck, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  MapPin,
  Bell,
  ChevronDown,
  Building2,
  LayoutDashboard,
  CircleDollarSign,
  Notebook,
  ListTree,
  Layout,
  ClipboardList,
  Pencil,
  Scan,
  FileText,
  Book,
  Files,
  BookText,
  Contact,
  Briefcase,
  TrendingUp,
  Folder,
  Clock,
  AlertCircle,
  Plus,
  Check,
  Save,
  UploadCloud,
  Printer,
  Download,
  BarChart,
  Search,
  Circle,
  Trash2,
  X,
  Mail,
  Phone,
  ArrowUpDown,
  Eye,
  Settings,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  FileClock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

type Module = 'tdb' | 'skom';

const CHART_DATA = [
  { name: 'Lun', value: 4000, secondary: 3000 },
  { name: 'Mar', value: 4500, secondary: 3200 },
  { name: 'Mer', value: 6000, secondary: 3800 },
  { name: 'Jeu', value: 5500, secondary: 4000 },
  { name: 'Ven', value: 7000, secondary: 4200 },
  { name: 'Sam', value: 6500, secondary: 4100 },
  { name: 'Dim', value: 8000, secondary: 4500 },
];

const PIE_DATA = [
  { name: 'RH & Social', value: 35, color: '#38C9D4' },
  { name: 'Taxes & Fiscal', value: 25, color: '#F5A623' },
  { name: 'Opérations', value: 30, color: '#1DB97E' },
  { name: 'Autres', value: 10, color: '#8B5CF6' },
];

export default function Finance() {
  const { user } = useAuth();
  const { 
    activeEnterprise, 
    selectedDossier, 
    systemChartId, 
    duplicatedChartId, 
    accounts, 
    thirdParties, 
    addAccount, 
    updateAccount,
    deleteAccount, 
    addTiers, 
    updateTiers,
    deleteTiers,
    journals,
    entries,
    addJournal,
    deleteJournal,
    updateJournal,
    addEntry,
    deleteEntry,
    updateEntry
  } = useCompany();
  const location = useLocation();
  const [currentModule, setCurrentModule] = useState<Module>('tdb');
  const [activePage, setActivePage] = useState<string>('skom-tdb');
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  // Automatic consultation tracking
  useEffect(() => {
    saveActionLog(selectedDossier?.id || 'default', {
      type: 'Consultation',
      desc: `Visualisation de la page ${activePage}`,
      details: `Affichage réussi de l'écran : ${activePage}`
    });
  }, [activePage, selectedDossier?.id]);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isTiersModalOpen, setIsTiersModalOpen] = useState(false);
  const [isSaisieModalOpen, setIsSaisieModalOpen] = useState(false);
  const [isInvoiceAddModalOpen, setIsInvoiceAddModalOpen] = useState(false);
  const [isInvoiceDetailsModalOpen, setIsInvoiceDetailsModalOpen] = useState(false);
  const [isJournalSelectionModalOpen, setIsJournalSelectionModalOpen] = useState(false);
  const [isJournalReportOpen, setIsJournalReportOpen] = useState(false);
  const [isBrouillardSelectionModalOpen, setIsBrouillardSelectionModalOpen] = useState(false);
  const [isBrouillardReportOpen, setIsBrouillardReportOpen] = useState(false);
  const [isGrandLivreSelectionModalOpen, setIsGrandLivreSelectionModalOpen] = useState(false);
  const [isGrandLivreReportOpen, setIsGrandLivreReportOpen] = useState(false);
  const [isGrandLivreTiersSelectionModalOpen, setIsGrandLivreTiersSelectionModalOpen] = useState(false);
  const [isGrandLivreTiersReportOpen, setIsGrandLivreTiersReportOpen] = useState(false);
  const [isBalanceSelectionModalOpen, setIsBalanceSelectionModalOpen] = useState(false);
  const [isBalanceReportOpen, setIsBalanceReportOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [journalParams, setJournalParams] = useState({
    type: 'ACH - Achats',
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  });
  const [brouillardParams, setBrouillardParams] = useState({
    trainee: 'Tous les stagiaires',
    journal: 'Tous les journaux',
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  });
  const [grandLivreParams, setGrandLivreParams] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    accounts: ['401100', '411100', '521100']
  });
  const [grandLivreTiersParams, setGrandLivreTiersParams] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    tiersType: 'Fournisseurs',
    tiersList: ['SOCIX', 'ALPHA']
  });
  const [balanceParams, setBalanceParams] = useState({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    type: '4 Colonnes'
  });
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('create');
  const [tiersTab, setTiersTab] = useState<'FRN' | 'CLI'>('FRN');

  // Search filter query states
  const [accountSearchQuery, setAccountSearchQuery] = useState('');
  const [tiersSearchQuery, setTiersSearchQuery] = useState('');
  const [brouillardSearchQuery, setBrouillardSearchQuery] = useState('');
  const [saisieSearchQuery, setSaisieSearchQuery] = useState('');
  const [saisieSelectedJournal, setSaisieSelectedJournal] = useState('Tous');

  // Saisie Modal for General Account
  const [newAccountNum, setNewAccountNum] = useState('');
  const [newAccountLabel, setNewAccountLabel] = useState('');
  const [newAccountClass, setNewAccountClass] = useState('1');
  const [accountModalError, setAccountModalError] = useState<string | null>(null);

  // Saisie Modal for Tiers Account
  const [newTiersType, setNewTiersType] = useState<'FRN' | 'CLI' | 'PRT'>('FRN');
  const [newTiersCode, setNewTiersCode] = useState('');
  const [newTiersLabel, setNewTiersLabel] = useState('');
  const [newTiersPhone, setNewTiersPhone] = useState('');
  const [newTiersEmail, setNewTiersEmail] = useState('');
  const [newTiersRattachement, setNewTiersRattachement] = useState('401100');

  const [editingTiersId, setEditingTiersId] = useState<string | null>(null);
  const [tiersModalMode, setTiersModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const handleOpenTiers = (tp: any, mode: 'create' | 'edit' | 'view') => {
    setTiersModalMode(mode);
    if (mode === 'edit' || mode === 'view') {
      setEditingTiersId(tp.id);
      setNewTiersType(tp.type || 'FRN');
      setNewTiersCode(tp.code);
      setNewTiersLabel(tp.label);
      setNewTiersPhone(tp.phone || '');
      setNewTiersEmail(tp.email || '');
      setNewTiersRattachement(tp.rattachement || '401100');
    } else {
      setEditingTiersId(null);
      setNewTiersType('FRN');
      setNewTiersCode('');
      setNewTiersLabel('');
      setNewTiersPhone('');
      setNewTiersEmail('');
      setNewTiersRattachement('401100');
    }
    setIsTiersModalOpen(true);
  };

  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [accountModalMode, setAccountModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const handleOpenAccount = (acc: any, mode: 'create' | 'edit' | 'view') => {
    setAccountModalMode(mode);
    setAccountModalError(null);
    if (mode === 'edit' || mode === 'view') {
      setEditingAccountId(acc.id);
      setNewAccountNum(acc.num);
      setNewAccountLabel(acc.label);
      setNewAccountClass(acc.classe ? acc.classe.replace(/\D/g, '') : '1');
    } else {
      setEditingAccountId(null);
      setNewAccountNum('');
      setNewAccountLabel('');
      setNewAccountClass('1');
    }
    setIsAccountModalOpen(true);
  };

  const handleCreateAccount = () => {
    if (!newAccountNum || !newAccountLabel) return;
    
    const cleanNum = newAccountNum.trim().replace(/\s/g, '');
    if (cleanNum.length < 8 || cleanNum.length > 14) {
      setAccountModalError(`Le numéro de compte doit comporter entre 8 et 14 chiffres (actuel: ${cleanNum.length}).`);
      return;
    }

    const firstDigit = cleanNum.charAt(0) || '1';
    const resolvedClass = `Classe ${firstDigit}`;
    
    if (editingAccountId) {
      updateAccount(editingAccountId, cleanNum, newAccountLabel, resolvedClass);
    } else {
      addAccount(cleanNum, newAccountLabel, resolvedClass);
    }
    
    saveActionLog(selectedDossier?.id || 'default', {
      type: 'Création',
      desc: editingAccountId ? `Modification du compte ${cleanNum}` : `Création du compte ${cleanNum}`,
      details: `Intitulé : ${newAccountLabel} | Classe détectée automatiquement : ${resolvedClass}`
    });

    setNewAccountNum('');
    setNewAccountLabel('');
    setNewAccountClass('1');
    setEditingAccountId(null);
    setAccountModalError(null);
    setIsAccountModalOpen(false);
  };

  const handleCreateTiers = () => {
    if (!newTiersCode || !newTiersLabel) return;
    const data = {
      code: newTiersCode,
      label: newTiersLabel,
      phone: newTiersPhone,
      email: newTiersEmail,
      type: newTiersType,
      rattachement: newTiersRattachement
    };
    if (editingTiersId) {
      updateTiers(editingTiersId, data);
    } else {
      addTiers(data);
    }

    saveActionLog(selectedDossier?.id || 'default', {
      type: 'Création',
      desc: editingTiersId ? `Modification du tiers ${newTiersCode}` : `Création du tiers ${newTiersCode}`,
      details: `${newTiersLabel} | Rattachement : ${newTiersRattachement} | Rôle : ${newTiersType}`
    });

    setNewTiersCode('');
    setNewTiersLabel('');
    setNewTiersPhone('');
    setNewTiersEmail('');
    setNewTiersType('FRN');
    setNewTiersRattachement('401100');
    setEditingTiersId(null);
    setIsTiersModalOpen(false);
  };

  const handleOpenEntry = (entry: any, mode: 'view' | 'edit') => {
    setSelectedEntryId(entry.id);
    setModalMode(mode);
    setEntryForm({
      dateSaisie: entry.dateSaisie || new Date().toLocaleDateString('fr-FR'),
      journal: entry.journal || '',
      dateOperation: entry.dateOperation || '',
      piece: entry.piece || '',
      libelle: entry.libelle || ''
    });
    setEntryLines(entry.lines ? [...entry.lines] : [
      { id: 1, account: '', tiers: '', label: '', debit: 0, credit: 0 },
      { id: 2, account: '', tiers: '', label: '', debit: 0, credit: 0 },
    ]);
    setIsSaisieModalOpen(true);
  };

  const handleNewSaisieClick = () => {
    setSelectedEntryId(null);
    setModalMode('create');
    setEntryForm({
      dateSaisie: new Date().toLocaleDateString('fr-FR'),
      journal: '',
      dateOperation: new Date().toLocaleDateString('fr-FR'),
      piece: '',
      libelle: ''
    });
    setEntryLines([
      { id: 1, account: '', tiers: '', label: '', debit: 0, credit: 0 },
      { id: 2, account: '', tiers: '', label: '', debit: 0, credit: 0 },
    ]);
    setIsSaisieModalOpen(true);
  };

  const handleSaveEntry = () => {
    if (!entryForm.journal || !entryForm.piece || !entryForm.libelle) {
      alert("Veuillez remplir tous les champs obligatoires (*).");
      return;
    }
    const debitTotal = entryLines.reduce((acc, l) => acc + (l.debit || 0), 0);
    const creditTotal = entryLines.reduce((acc, l) => acc + (l.credit || 0), 0);
    if (debitTotal !== creditTotal) {
      alert("L'écriture n'est pas équilibrée (Débit doit être égal au Crédit).");
      return;
    }

    const cleanedLines = entryLines.map(l => {
      if (!isTiersAccount(l.account)) {
        return { ...l, tiers: '' };
      }
      return l;
    });

    if (modalMode === 'edit' && selectedEntryId) {
      updateEntry(selectedEntryId, {
        journal: entryForm.journal,
        dateOperation: entryForm.dateOperation,
        piece: entryForm.piece,
        libelle: entryForm.libelle,
        lines: cleanedLines as any
      });
      saveActionLog(selectedDossier?.id || 'default', {
        type: 'Saisie',
        desc: `Modification de l'écriture N° ${entryForm.piece}`,
        details: `${entryForm.libelle} | Journal rattaché : ${entryForm.journal} | Montant rééquilibré : ${debitTotal} FCFA`
      });
    } else {
      addEntry({
        journal: entryForm.journal,
        dateSaisie: entryForm.dateSaisie,
        dateOperation: entryForm.dateOperation,
        piece: entryForm.piece,
        libelle: entryForm.libelle,
        lines: cleanedLines as any
      });
      saveActionLog(selectedDossier?.id || 'default', {
        type: 'Saisie',
        desc: `Nouvelle saisie d'écriture N° ${entryForm.piece}`,
        details: `${entryForm.libelle} | Journal : ${entryForm.journal} | Montant : ${debitTotal} FCFA`
      });
    }

    setIsSaisieModalOpen(false);
  };

  const handleCreateJournal = () => {
    if (!newJournalCode || !newJournalLabel) return;
    if (editingJournalId) {
      updateJournal(editingJournalId, {
        code: newJournalCode,
        label: newJournalLabel,
        type: newJournalType,
        account: newJournalAccount
      });
      saveActionLog(selectedDossier?.id || 'default', {
        type: 'Configuration',
        desc: `Modification du journal ${newJournalCode}`,
        details: `${newJournalLabel} | Type : ${newJournalType} | Compte de contrepartie : ${newJournalAccount || 'Aucun'}`
      });
    } else {
      addJournal(newJournalCode, newJournalLabel, newJournalType, newJournalAccount);
      saveActionLog(selectedDossier?.id || 'default', {
        type: 'Configuration',
        desc: `Création du journal ${newJournalCode}`,
        details: `${newJournalLabel} | Type : ${newJournalType} | Contrepartie affectée : ${newJournalAccount || 'Aucune'}`
      });
    }
    setNewJournalCode('');
    setNewJournalLabel('');
    setNewJournalType('Achats');
    setNewJournalAccount('');
    setEditingJournalId(null);
    setIsJournalModalOpen(false);
  };



  const [invoices, setInvoices] = useState([
    { id: '1', date: '20/07/2024', piece: 'FACT-088', tiers: 'Client Alpha', type: 'Vente', amount: 4500, status: 'Traité' },
    { id: '2', date: '19/07/2024', piece: 'F-2024-001', tiers: 'SOCIX SARL', type: 'Achat', amount: 125000, status: 'Traité' },
    { id: '3', date: '18/07/2024', piece: 'MTN-INV-99', tiers: 'MTN CI', type: 'Achat', amount: 15000, status: 'Traité' },
  ]);

  const [newInvoice, setNewInvoice] = useState({
    piece: '',
    tiers: '',
    type: 'Achat',
    date: '',
    amount: '',
    file: null as File | null,
    fileUrl: '' as string,
    fileType: '' as string,
    fileName: '' as string
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const nameWithoutExtension = file.name.split('.').slice(0, -1).join('.') || 'FAC-NEW';
      // Normalize to a clean invoice code
      const cleanPiece = nameWithoutExtension.toUpperCase().replace(/\s+/g, '-').substring(0, 15);
      const randomAmount = Math.floor(Math.random() * 85 + 15) * 1000; // 15,000 to 100,000 FCFA

      setNewInvoice(prev => ({
        ...prev,
        piece: prev.piece || cleanPiece,
        amount: prev.amount || randomAmount.toString(),
        date: prev.date || new Date().toISOString().substring(0, 10),
        fileUrl: result,
        fileType: file.type,
        fileName: file.name
      }));
      
      saveActionLog(selectedDossier?.id || 'default', {
        type: 'Digitalisation',
        desc: `Pré-chargement du fichier : ${file.name}`,
        details: `Importation réussie | Données IA anticipées : ${cleanPiece} (${randomAmount} FCFA)`
      });
    };
    reader.readAsDataURL(file);
  };
  
  const [newJournalType, setNewJournalType] = useState('Achats');
  const [newJournalCode, setNewJournalCode] = useState('');
  const [newJournalLabel, setNewJournalLabel] = useState('');
  const [newJournalAccount, setNewJournalAccount] = useState('');
  const [editingJournalId, setEditingJournalId] = useState<string | null>(null);
  const [journalModalAction, setJournalModalAction] = useState<'create' | 'edit' | 'view'>('create');

  const handleOpenJournal = (journal: any, mode: 'create' | 'edit' | 'view') => {
    setJournalModalAction(mode);
    if (mode === 'edit' || mode === 'view') {
      setEditingJournalId(journal.id);
      setNewJournalCode(journal.code);
      setNewJournalLabel(journal.label);
      setNewJournalType(journal.type);
      setNewJournalAccount(journal.account === '—' ? '' : journal.account);
    } else {
      setEditingJournalId(null);
      setNewJournalCode('');
      setNewJournalLabel('');
      setNewJournalType('Achats');
      setNewJournalAccount('');
    }
    setIsJournalModalOpen(true);
  };

  // Accounting Entry Modal State
  const [entryLines, setEntryLines] = useState([
    { id: 1, account: '', tiers: '', label: '', debit: 0, credit: 0 },
    { id: 2, account: '', tiers: '', label: '', debit: 0, credit: 0 },
  ]);

  const [entryForm, setEntryForm] = useState({
    dateSaisie: new Date().toLocaleDateString('fr-FR'),
    journal: '',
    dateOperation: new Date().toLocaleDateString('fr-FR'),
    piece: '',
    libelle: ''
  });

  const [activeLineSearch, setActiveLineSearch] = useState<{ idx: number, type: 'account' | 'tiers' } | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const navigate = useNavigate();

  const isAdmin = user?.email?.includes('admin') || true; // Simplified for now

  useEffect(() => {
    if (location.state?.module) {
      setCurrentModule(location.state.module);
      if (location.state.module === 'skom') {
        setActivePage('skom-tdb');
      }
    }
  }, [location.state]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isTiersAccount = (accNum: string) => {
    if (!accNum) return false;
    const clean = accNum.trim().replace(/\s/g, '');
    const prefix2 = clean.substring(0, 2);
    return ['40', '41', '42', '45', '46', '47', '48'].includes(prefix2);
  };

  // Automatic balancing logic for Treasury Journals
  useEffect(() => {
    if (!isSaisieModalOpen || modalMode === 'view' || !entryForm.journal) return;
    
    const activeJournal = journals.find(j => j.code === entryForm.journal);
    if (!activeJournal || activeJournal.type !== 'Trésorerie' || !activeJournal.account || activeJournal.account === '—') {
      return;
    }
    
    const tAcc = activeJournal.account.trim().replace(/\s/g, '');
    if (!tAcc) return;
    
    // Sum standard lines
    const standardLines = entryLines.filter(l => (l.account || '').trim().replace(/\s/g, '') !== tAcc);
    const sumDebits = standardLines.reduce((acc, l) => acc + (parseFloat(l.debit as any) || 0), 0);
    const sumCredits = standardLines.reduce((acc, l) => acc + (parseFloat(l.credit as any) || 0), 0);
    const netDiff = sumDebits - sumCredits;
    
    const expectedDebit = netDiff < 0 ? Math.abs(netDiff) : 0;
    const expectedCredit = netDiff > 0 ? netDiff : 0;
    
    // Find if there is already a line for the treasury account
    const treasuryLineIndex = entryLines.findIndex(l => (l.account || '').trim().replace(/\s/g, '') === tAcc);
    
    if (treasuryLineIndex !== -1) {
      const tLine = entryLines[treasuryLineIndex];
      const currentDebit = parseFloat(tLine.debit as any) || 0;
      const currentCredit = parseFloat(tLine.credit as any) || 0;
      
      if (Math.abs(currentDebit - expectedDebit) > 0.01 || Math.abs(currentCredit - expectedCredit) > 0.01) {
        const updatedLines = [...entryLines];
        updatedLines[treasuryLineIndex] = {
          ...updatedLines[treasuryLineIndex],
          debit: expectedDebit,
          credit: expectedCredit
        };
        setEntryLines(updatedLines);
      }
    } else if (Math.abs(netDiff) > 0.01) {
      // Append new treasury counterpart line
      const newLine = {
        id: Date.now() + Math.random(),
        account: tAcc,
        tiers: '',
        label: 'Contrepartie automatique Trésorerie',
        debit: expectedDebit,
        credit: expectedCredit
      };
      setEntryLines([...entryLines, newLine]);
    }
  }, [entryLines, entryForm.journal, isSaisieModalOpen, journals, modalMode]);

  const userName = activeEnterprise?.name || user?.displayName || user?.email?.split('@')[0] || 'Anonyme';
  const userInitial = userName.charAt(0).toUpperCase();

  const toggleSection = (id: string) => {
    const newSections = new Set(openSections);
    if (newSections.has(id)) {
      newSections.delete(id);
    } else {
      newSections.add(id);
    }
    setOpenSections(newSections);
  };

  const switchModule = (m: Module) => {
    setCurrentModule(m);
    if (m === 'skom') {
      setActivePage('skom-tdb');
    } else {
      setActivePage('tdb');
    }
  };

  const renderContent = () => {
    if (currentModule === 'tdb') {
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Tableau de bord</h2>
              <p className="text-xs text-slate-400 font-medium">Management & Opérations Unikorp — Mai 2026</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Briefcase} label="Revenus" value="12.4M" badge="+15%" badgeType="pos" />
            <StatCard icon={Users} label="Effectif" value="112" badge="+4%" badgeType="pos" />
            <StatCard icon={TrendingUp} label="Cash" value="8.1M" badge="-2%" badgeType="neg" />
            <StatCard icon={Folder} label="Dossiers" value="245" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-black/5 shadow-sm p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Flux financiers</h3>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-[#38C9D4] rounded-full" />
                  <div className="w-2 h-2 bg-slate-200 rounded-full" />
                </div>
              </div>
              <div className="h-48 w-full -ml-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38C9D4" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#38C9D4" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F1F6" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fill: '#BBC0D4' }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fill: '#BBC0D4' }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#38C9D4" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#colorVal)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="secondary" 
                      stroke="#DDE1EE" 
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      fill="transparent" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-6">Répartition</h3>
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PIE_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={55}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {PIE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-lg font-bold text-slate-900 leading-none">85%</span>
                    <span className="text-[9px] text-slate-400">global</span>
                  </div>
                </div>
                <div className="w-full space-y-2">
                  {PIE_DATA.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-500">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </div>
                      <span className="font-bold text-slate-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Historique des opérations</h3>
              <button className="text-[10px] font-bold uppercase tracking-wider text-[#E8521A] hover:opacity-80 cursor-pointer">Exporter .CSV</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Transaction</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Statut</th>
                    <th className="text-right py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[13px]">
                  <TableRow 
                    name="Facture #842 — Client AXA" 
                    id="ID: TTR-2026-F0" 
                    status="Validé" 
                    statusType="ok" 
                    amount="240 000" 
                  />
                  <TableRow 
                    name="Règlement fournisseur SOCIX" 
                    id="ID: TTR-2026-F1" 
                    status="En attente" 
                    statusType="wait" 
                    amount="110 500" 
                  />
                  <TableRow 
                    name="TVA mensuelle — Mars 2026" 
                    id="ID: TTR-2026-F2" 
                    status="Urgent" 
                    statusType="urg" 
                    amount="450 000" 
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // Module SKOMPTAB Pages
    switch (activePage) {
      case 'skom-tdb':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Tableau de bord</h2>
              <p className="text-xs text-slate-400">Vue d'ensemble de la comptabilité — Mai 2026</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Notebook} label="Journaux" value="6" />
              <StatCard icon={FileText} label="Factures" value="84" />
              <StatCard icon={ClipboardList} label="Brouillards" value="12" />
              <StatCard icon={ListTree} label="Comptes" value="340" />
            </div>
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-6">Dernières écritures</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Date</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Journal</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Libellé</th>
                    <th className="text-right py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Débit</th>
                    <th className="text-right py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Crédit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <EntryRow date="12/05/26" journal="ACH" type="info" label="Achat fournitures" debit="45 000" />
                  <EntryRow date="11/05/26" journal="VTE" type="ok" label="Vente client BICI" credit="120 000" />
                  <EntryRow date="10/05/26" journal="BQ" type="wait" label="Virement bancaire" debit="80 000" />
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'journaux-creation':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Journaux</h2>
                <p className="text-xs text-slate-400 font-medium">Configuration des journaux de saisie</p>
              </div>
              <button 
                onClick={() => handleOpenJournal(null, 'create')}
                className="bg-[#111] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-90 cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" /> Nouveau journal
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Code</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Intitulé</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Compte rattaché</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Statut</th>
                    <th className="text-right py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 animate-in fade-in duration-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {journals.map(j => (
                    <JournalRow 
                      key={j.id} 
                      code={j.code} 
                      label={j.label} 
                      type={j.type} 
                      account={j.account} 
                      status={j.status}
                      onView={() => handleOpenJournal(j, 'view')}
                      onEdit={() => handleOpenJournal(j, 'edit')}
                      onDelete={!['ACH', 'VTE', 'BQ', 'OD'].includes(j.code) ? () => deleteJournal(j.id) : undefined}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'comptes-generaux': {
        const filteredAccounts = accounts.filter(acc => {
          const queryStr = accountSearchQuery.toLowerCase().trim();
          if (!queryStr) return true;
          return acc.num.toLowerCase().includes(queryStr) || acc.label.toLowerCase().includes(queryStr);
        });

        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Comptes généraux</h2>
                <p className="text-xs text-slate-400 font-medium font-mono">
                  Plan actif : <strong className="text-slate-600">{selectedDossier?.accountingConfig?.accountingLaw || 'SYSCOHADA Révisé'}</strong>
                </p>
              </div>
              <button 
                onClick={() => handleOpenAccount(null, 'create')}
                className="bg-[#111] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-90 cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" /> Nouveau compte
              </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={accountSearchQuery}
                  onChange={e => setAccountSearchQuery(e.target.value)}
                  placeholder="Rechercher par numéro de compte ou intitulé..." 
                  className="w-full pl-10 pr-4 h-11 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:border-[#4A9EC9] transition-all" 
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden p-6 max-h-[800px] overflow-y-auto">
              {filteredAccounts.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-medium">
                  Aucun compte trouvé pour votre recherche.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider text-left">
                      <th className="py-3 px-4 w-12 text-center">#</th>
                      <th className="py-3 px-4">N° Compte</th>
                      <th className="py-3 px-4">Intitulé</th>
                      <th className="py-3 px-4">Classe</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredAccounts.map((acc, index) => (
                      <AccountRow 
                        key={acc.id} 
                        idx={(index + 1).toString()} 
                        num={acc.num} 
                        label={acc.label} 
                        classe={acc.classe} 
                        onView={() => handleOpenAccount(acc, 'view')}
                        onEdit={() => handleOpenAccount(acc, 'edit')}
                        onDelete={() => deleteAccount(acc.id)}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      }
      case 'comptes-tiers': {
        const filteredThirdParties = thirdParties
          .filter(tp => tp.type === tiersTab)
          .filter(tp => {
            const queryStr = tiersSearchQuery.toLowerCase().trim();
            if (!queryStr) return true;
            return tp.code.toLowerCase().includes(queryStr) || tp.label.toLowerCase().includes(queryStr);
          });

        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Comptes tiers</h2>
                <p className="text-xs text-slate-400 font-medium">Gestion de la base Clients & Fournisseurs</p>
              </div>
              <button 
                onClick={() => handleOpenTiers(null, 'create')}
                className="bg-[#111] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-90 cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" /> Nouveau tiers
              </button>
            </div>

            {/* Search Bar for Tiers */}
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 w-full">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={tiersSearchQuery}
                  onChange={e => setTiersSearchQuery(e.target.value)}
                  placeholder="Rechercher par code tiers ou raison sociale..." 
                  className="w-full pl-10 pr-4 h-11 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:border-[#4A9EC9] transition-all" 
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden min-h-[400px]">
              <div className="flex border-b border-slate-100 bg-slate-50/50">
                <button 
                  onClick={() => setTiersTab('FRN')}
                  className={cn(
                    "px-8 py-3.5 text-[11px] font-black uppercase tracking-widest transition-all relative",
                    tiersTab === 'FRN' ? "text-[#4A9EC9]" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  Fournisseurs
                  {tiersTab === 'FRN' && <motion.div layoutId="tiers-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A9EC9]" />}
                </button>
                <button 
                  onClick={() => setTiersTab('CLI')}
                  className={cn(
                    "px-8 py-3.5 text-[11px] font-black uppercase tracking-widest transition-all relative",
                    tiersTab === 'CLI' ? "text-[#4A9EC9]" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                   Clients
                   {tiersTab === 'CLI' && <motion.div layoutId="tiers-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A9EC9]" />}
                </button>
              </div>

              <div className="p-6 overflow-x-auto">
                {filteredThirdParties.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs font-medium">
                    Aucun compte tiers enregistré.
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider text-left">
                        <th className="py-3 px-4 w-12 text-center">#</th>
                        <th className="py-3 px-4">Code Tiers</th>
                        <th className="py-3 px-4">Intitulé</th>
                        <th className="py-3 px-4">Compte Général</th>
                        <th className="py-3 px-4">Téléphone</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredThirdParties.map((tp, index) => (
                        <TiersRow 
                          key={tp.id}
                          idx={(index + 1).toString()} 
                          code={tp.code} 
                          label={tp.label} 
                          rattachement={tp.rattachement}
                          phone={tp.phone} 
                          email={tp.email} 
                          onView={() => handleOpenTiers(tp, 'view')}
                          onEdit={() => handleOpenTiers(tp, 'edit')}
                          onDelete={() => deleteTiers(tp.id)}
                        />
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        );
      }
      case 'digit-factures':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Digitalisation des factures</h2>
                <p className="text-xs text-slate-400 font-medium tracking-tight">Importez et centralisez vos factures papier ou numériques</p>
              </div>
              <button 
                onClick={() => {
                  setModalMode('create');
                  setIsInvoiceAddModalOpen(true);
                }}
                className="bg-[#8B5CF6] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 cursor-pointer shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" /> Digitaliser une facture
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Rechercher une facture..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] outline-none focus:border-[#8B5CF6] w-64 transition-all" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trier par :</span>
                    <select className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-[#111] outline-none cursor-pointer">
                      <option>Date (Récent)</option>
                      <option>Montant</option>
                      <option>Tiers</option>
                    </select>
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                   <thead>
                     <tr className="bg-slate-50/30 text-left border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                       <th className="py-4 px-6">Date Opération</th>
                       <th className="py-4 px-6">N° Pièce</th>
                       <th className="py-4 px-6">Tiers</th>
                       <th className="py-4 px-6">Type</th>
                       <th className="py-4 px-6">Montant</th>
                       <th className="py-4 px-6 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {invoices.map((inv, idx) => (
                       <tr key={inv.id} className="hover:bg-purple-50/30 transition-colors group">
                         <td className="py-4 px-6 font-medium text-slate-500">{inv.date}</td>
                         <td className="py-4 px-6 font-black text-slate-900">{inv.piece}</td>
                         <td className="py-4 px-6">
                           <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-black">{inv.tiers.charAt(0)}</div>
                             <span className="font-bold text-slate-700">{inv.tiers}</span>
                           </div>
                         </td>
                         <td className="py-4 px-6">
                           <span className={cn(
                             "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                             inv.type === 'Vente' ? "bg-emerald-50 text-emerald-600" : "bg-purple-50 text-purple-600"
                           )}>
                             {inv.type}
                           </span>
                         </td>
                         <td className="py-4 px-6 font-black text-slate-900 tabular-nums">
                           {inv.amount.toLocaleString()} <span className="text-[10px] text-slate-400 font-bold ml-1">FCFA</span>
                         </td>
                         <td className="py-4 px-6 text-right">
                           <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => {
                                 setSelectedInvoice(inv);
                                 setIsInvoiceDetailsModalOpen(true);
                               }}
                               className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-purple-600 transition-all cursor-pointer border border-transparent hover:border-slate-100 shadow-sm"
                             >
                               <Eye className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => {
                                 setModalMode('edit');
                                 setSelectedInvoice(inv);
                                 setNewInvoice({
                                   piece: inv.piece,
                                   tiers: inv.tiers,
                                   type: inv.type,
                                   date: inv.date.split('/').reverse().join('-'), // Convert fr to iso for date input
                                   amount: inv.amount.toString(),
                                   file: null
                                 });
                                 setIsInvoiceAddModalOpen(true);
                               }}
                               className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-brand transition-all cursor-pointer border border-transparent hover:border-slate-100 shadow-sm"
                             >
                               <Pencil className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => {
                                 if (window.confirm('Voulez-vous vraiment supprimer cette facture ?')) {
                                   setInvoices(invoices.filter(i => i.id !== inv.id));
                                 }
                               }}
                               className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-rose-500 transition-all cursor-pointer border border-transparent hover:border-slate-100 shadow-sm"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
               
               <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   {invoices.length} facture(s) au total
                 </span>
                 <div className="flex gap-2">
                    <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-not-allowed opacity-50">Précédent</button>
                    <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#111] hover:bg-slate-50 transition-all cursor-pointer">Suivant</button>
                 </div>
               </div>
            </div>
          </div>
        );
      case 'journal':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Journal comptable</h2>
                <p className="text-xs text-slate-400 font-medium">Consultez l'historique chronologique de vos opérations par journal</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center mb-6">
                <BookText className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Générer un état du journal</h3>
              <p className="text-sm text-slate-500 max-w-md mb-8">
                Sélectionnez le journal spécifique et la période souhaitée pour générer un document comptable officiel prêt pour l'exportation.
              </p>
              <button 
                onClick={() => setIsJournalSelectionModalOpen(true)}
                className="bg-[#8B5CF6] text-white px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center gap-3 hover:opacity-90 cursor-pointer shadow-xl shadow-purple-500/20 active:scale-95 transition-all"
              >
                Afficher le journal <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      case 'etats-brouillard':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">États de brouillard</h2>
                <p className="text-xs text-slate-400 font-medium">Suivi détaillé des saisies effectuées par vos collaborateurs</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mb-6">
                <FileClock className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Générer un brouillard de saisie</h3>
              <p className="text-sm text-slate-500 max-w-md mb-8">
                Consultez l'ensemble des écritures passées par un collaborateur spécifique sur une période donnée pour contrôle et validation.
              </p>
              <button 
                onClick={() => setIsBrouillardSelectionModalOpen(true)}
                className="bg-[#8B5CF6] text-white px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center gap-3 hover:opacity-90 cursor-pointer shadow-xl shadow-purple-500/20 active:scale-95 transition-all"
              >
                Afficher le brouillard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      case 'grand-livre':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Grand livre général</h2>
                <p className="text-xs text-slate-400 font-medium whitespace-nowrap">Visualisez le détail des mouvements par compte sur une période</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6">
                <Book className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Générer le Grand livre</h3>
              <p className="text-sm text-slate-500 max-w-md mb-8">
                Générez un état détaillé de tous les mouvements comptables regroupés par compte général pour une analyse approfondie.
              </p>
              <button 
                onClick={() => setIsGrandLivreSelectionModalOpen(true)}
                className="bg-[#8B5CF6] text-white px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center gap-3 hover:opacity-90 cursor-pointer shadow-xl shadow-purple-500/20 active:scale-95 transition-all"
              >
                Générer le Grand livre <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      case 'grand-livre-tiers':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Grand livre auxiliaire (Tiers)</h2>
                <p className="text-xs text-slate-400 font-medium whitespace-nowrap">Suivi individuel des comptes Fournisseurs et Clients</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6">
                <Contact className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Générer le Grand livre Tiers</h3>
              <p className="text-sm text-slate-500 max-w-md mb-8">
                Visualisez l'historique complet des transactions pour chaque tiers (factures, règlements, avoirs) sur une période donnée.
              </p>
              <button 
                onClick={() => setIsGrandLivreTiersSelectionModalOpen(true)}
                className="bg-[#8B5CF6] text-white px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center gap-3 hover:opacity-90 cursor-pointer shadow-xl shadow-purple-500/20 active:scale-95 transition-all"
              >
                Générer l'état des tiers <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      case 'balance':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Balance générale</h2>
                <p className="text-xs text-slate-400 font-medium whitespace-nowrap">Récapitulatif des soldes et mouvements de tous les comptes</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6">
                <BarChart className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Générer la Balance</h3>
              <p className="text-sm text-slate-500 max-w-md mb-8">
                Générez un état synthétique de l'ensemble des comptes de votre comptabilité pour vérifier l'équilibre entre les débits et les crédits.
              </p>
              <button 
                onClick={() => setIsBalanceSelectionModalOpen(true)}
                className="bg-[#8B5CF6] text-white px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center gap-3 hover:opacity-90 cursor-pointer shadow-xl shadow-purple-500/20 active:scale-95 transition-all"
              >
                Générer la Balance <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      case 'brouillards': {
        const queryStr = brouillardSearchQuery.toLowerCase().trim();
        const filteredBrouillards = entries.filter(e => {
          if (!queryStr) return true;
          return (
            e.piece.toLowerCase().includes(queryStr) ||
            e.libelle.toLowerCase().includes(queryStr) ||
            e.journal.toLowerCase().includes(queryStr)
          );
        });

        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Brouillards</h2>
                <p className="text-xs text-slate-400 font-medium">Contrôle et validation des écritures saisies</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Rechercher dans le brouillard..." 
                    value={brouillardSearchQuery}
                    onChange={(e) => setBrouillardSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#4A9EC9] w-64 transition-all" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
               <div className="p-1 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2 px-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                     {filteredBrouillards.length} Écriture(s) en attente
                   </span>
                </div>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/30 text-left border-b border-slate-100">
                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 w-12 text-center">#</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Date Op.</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">N° Pièce</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Libellé</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Journal</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Créé par</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredBrouillards.map((item, idx) => (
                    <BrouillardRow 
                      key={item.id}
                      idx={idx + 1} 
                      date={item.dateOperation} 
                      piece={item.piece} 
                      label={item.libelle} 
                      user="Saisie ERP" 
                      status={item.journal} 
                      stripe={idx % 2 === 1}
                      onView={() => handleOpenEntry(item, 'view')}
                      onEdit={() => handleOpenEntry(item, 'edit')}
                      onDelete={() => {
                        deleteEntry(item.id);
                        saveActionLog(selectedDossier?.id || 'default', {
                          type: 'Suppression',
                          desc: `Suppression de l'écriture N° ${item.piece}`,
                          details: `${item.libelle} | Journal rattaché : ${item.journal}`
                        });
                      }}
                      onValidate={() => alert(`Écriture ${item.piece} validée avec succès !`)}
                    />
                  ))}
                  {filteredBrouillards.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs font-semibold text-slate-400">
                        Aucune écriture trouvée dans le brouillard.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      case 'saisie-comptable': {
        const queryStr = saisieSearchQuery.toLowerCase().trim();
        const filteredSaisies = entries.filter(e => {
          const matchesQuery = !queryStr ? true : (
            e.piece.toLowerCase().includes(queryStr) ||
            e.libelle.toLowerCase().includes(queryStr) ||
            e.journal.toLowerCase().includes(queryStr)
          );
          const matchesJournal = saisieSelectedJournal === 'Tous' ? true : e.journal === saisieSelectedJournal;
          return matchesQuery && matchesJournal;
        });

        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Saisie comptable</h2>
                <p className="text-xs text-slate-400 font-medium">Historique et enregistrement des écritures</p>
              </div>
              <button 
                onClick={() => {
                  setModalMode('create');
                  setEntryForm({
                    dateSaisie: new Date().toLocaleDateString('fr-FR'),
                    journal: journals[0]?.code || 'ACH',
                    dateOperation: new Date().toISOString().split('T')[0],
                    piece: '',
                    libelle: ''
                  });
                  setEntryLines([
                    { id: 1, account: '', tiers: '', label: '', debit: 0, credit: 0 },
                    { id: 2, account: '', tiers: '', label: '', debit: 0, credit: 0 },
                  ]);
                  setIsSaisieModalOpen(true);
                }}
                className="bg-[#A855F7] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-90 cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" /> Nouvelle saisie
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Rechercher une saisie..." 
                    value={saisieSearchQuery}
                    onChange={(e) => setSaisieSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] outline-none focus:border-[#4A9EC9] w-64 transition-all" 
                  />
                </div>
                <select 
                  value={saisieSelectedJournal}
                  onChange={(e) => setSaisieSelectedJournal(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-500 outline-none cursor-pointer"
                >
                  <option value="Tous">Tous les journaux</option>
                  {journals.map(j => (
                    <option key={j.id} value={j.code}>{j.code} - {j.label}</option>
                  ))}
                </select>
                <div className="flex-1" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400">
                    Total: {filteredSaisies.length} ligne(s)
                  </span>
                </div>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/30 text-left border-b border-slate-100">
                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 w-12 text-center">#</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">N° Saisie</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Journal</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Date Op.</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">N° Pièce</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Libellé</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredSaisies.map((item, idx) => (
                    <SaisieRow 
                      key={item.id}
                      idx={idx + 1} 
                      id={item.id} 
                      journal={item.journal} 
                      date={item.dateOperation} 
                      piece={item.piece} 
                      label={item.libelle} 
                      stripe={idx % 2 === 1}
                      onView={() => handleOpenEntry(item, 'view')}
                      onEdit={() => handleOpenEntry(item, 'edit')}
                      onDelete={() => {
                        deleteEntry(item.id);
                        saveActionLog(selectedDossier?.id || 'default', {
                          type: 'Suppression',
                          desc: `Suppression de la saisie N° ${item.piece}`,
                          details: `${item.libelle} | Journal rattaché : ${item.journal}`
                        });
                      }}
                    />
                  ))}
                  {filteredSaisies.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs font-semibold text-slate-400">
                        Aucune saisie comptable enregistrée.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      default:
        return (
          <div className="h-64 flex items-center justify-center text-slate-400 text-sm font-medium animate-pulse">
            Module {activePage} en cours de développement...
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F5F9] font-sans selection:bg-brand/20">
      {/* HEADER */}
      <nav className="h-14 bg-[#111] flex items-center justify-between px-6 shrink-0 relative z-50">
        <div className="flex items-center gap-3">
          <Logo 
            iconClassName="w-8 h-8 bg-[#E8521A] text-white rounded-lg" 
            textClassName="text-white text-base font-bold tracking-tight"
          />
          <div className="h-8 w-px bg-white/10 mx-2 hidden lg:block" />
          <div className="hidden lg:flex flex-col">
            <p className="text-[9px] font-black text-brand uppercase tracking-[0.2em] leading-none mb-1">Système Unikorp</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white tabular-nums tracking-tighter">
                {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                {currentTime.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
            <Building2 className="w-3.5 h-3.5 text-white/80" />
            <span className="text-[11px] font-medium text-white/80 uppercase tracking-tight">{activeEnterprise?.name || 'GEST-ETEST-2026'}</span>
            <ChevronDown className="w-3 h-3 text-white/40" />
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all cursor-pointer">
            <Bell className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 ml-2 group cursor-pointer">
            <div className="w-8 h-8 bg-[#E8521A] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
              {userInitial}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Session</p>
              <p className="text-[10px] font-bold text-white tracking-tight leading-none uppercase">{userName}</p>
            </div>
          </div>
          <button className="text-white/40 hover:text-white transition-all cursor-pointer">
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* TOPBAR */}
      <div className="h-11 bg-[#4A9EC9] flex items-center px-4 shrink-0 relative z-40 gap-1">
        <button 
          onClick={() => switchModule('tdb')}
          className={cn(
            "flex items-center gap-2 px-4 h-8 rounded-lg text-[12px] font-bold transition-all cursor-pointer",
            currentModule === 'tdb' 
              ? "bg-white text-[#4A9EC9] shadow-sm scale-105" 
              : "text-white hover:bg-white/20"
          )}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Tableau de bord
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button 
          onClick={() => switchModule('skom')}
          className={cn(
            "flex items-center gap-2 px-4 h-8 rounded-lg text-[12px] font-bold transition-all cursor-pointer",
            currentModule === 'skom' 
              ? "bg-white text-[#4A9EC9] shadow-sm scale-105" 
              : "text-white hover:bg-white/20"
          )}
        >
          <CircleDollarSign className="w-3.5 h-3.5" />
          SKOMPTAB
        </button>
        <button 
          onClick={() => navigate('/app/rh')}
          className="flex items-center gap-2 px-4 h-8 rounded-lg text-[12px] font-medium text-white hover:bg-white/20 transition-all cursor-pointer"
        >
          <Users className="w-3.5 h-3.5" />
          SOCIX
        </button>
        <button 
          onClick={() => navigate('/app/logistics')}
          className="flex items-center gap-2 px-4 h-8 rounded-lg text-[12px] font-medium text-white hover:bg-white/20 transition-all cursor-pointer"
        >
          <Truck className="w-3.5 h-3.5" />
          LOGSON
        </button>
        <button 
          onClick={() => navigate('/app/marketing')}
          className="flex items-center gap-2 px-4 h-8 rounded-lg text-[12px] font-medium text-white hover:bg-white/20 transition-all cursor-pointer"
        >
          <Target className="w-3.5 h-3.5" />
          MARKOS
        </button>
        <div className="flex-1" />
        <button 
          onClick={() => navigate('/app')}
          className="flex items-center gap-2 px-4 h-8 bg-[#111] border border-white/10 rounded-lg cursor-pointer hover:bg-brand transition-all shadow-lg active:scale-95"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-brand" />
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">Page admin</span>
        </button>
      </div>

      {/* MODALS */}
      <Modal 
        isOpen={isJournalModalOpen} 
        onClose={() => {
          setNewJournalCode('');
          setNewJournalLabel('');
          setNewJournalType('Achats');
          setNewJournalAccount('');
          setEditingJournalId(null);
          setIsJournalModalOpen(false);
        }} 
        title={journalModalAction === 'view' ? "Détails du journal" : editingJournalId ? "Modifier le journal" : "Nouveau journal"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Code</label>
              <input 
                type="text" 
                value={newJournalCode || ''}
                onChange={(e) => setNewJournalCode(e.target.value)}
                disabled={journalModalAction === 'view'}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#4A9EC9] focus:ring-4 focus:ring-[#4A9EC9]/5 transition-all disabled:opacity-75" 
                placeholder="Ex: ACH" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type</label>
              <select 
                value={newJournalType}
                onChange={(e) => setNewJournalType(e.target.value)}
                disabled={journalModalAction === 'view'}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#4A9EC9] transition-all cursor-pointer disabled:opacity-75"
              >
                <option value="Achats">Achats</option>
                <option value="Ventes">Ventes</option>
                <option value="Trésorerie">Trésorerie</option>
                <option value="Général">Général</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Intitulé</label>
            <input 
              type="text" 
              value={newJournalLabel || ''}
              onChange={(e) => setNewJournalLabel(e.target.value)}
              disabled={journalModalAction === 'view'}
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#4A9EC9] transition-all disabled:opacity-75" 
              placeholder="Nom du journal" 
            />
          </div>

          <AnimatePresence>
            {newJournalType === 'Trésorerie' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-1.5 overflow-hidden"
              >
                <label className="text-[10px] font-black uppercase tracking-widest text-[#4A9EC9]">Compte de trésorerie rattaché</label>
                <select 
                  value={newJournalAccount || ''}
                  onChange={(e) => setNewJournalAccount(e.target.value)}
                  disabled={journalModalAction === 'view'}
                  className="w-full h-11 bg-blue-50/50 border border-[#4A9EC9]/20 rounded-xl px-4 text-sm outline-none focus:border-[#4A9EC9] transition-all cursor-pointer disabled:opacity-75"
                >
                  <option value="">Sélectionner un compte (Classe 5)...</option>
                  {accounts.filter(a => a.num.startsWith('5')).map(a => (
                    <option key={a.id} value={a.num}>{a.num} — {a.label}</option>
                  ))}
                  {accounts.filter(a => a.num.startsWith('5')).length === 0 && (
                    <>
                      <option value="521100">521100 — Banque Principale (Défaut)</option>
                      <option value="571100">571100 — Caisse Siège</option>
                    </>
                  )}
                </select>
                <p className="text-[10px] text-slate-400 italic">Requis pour les journaux de banque ou caisse.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-4 flex gap-3">
            {journalModalAction !== 'view' && (
              <button 
                onClick={handleCreateJournal}
                className="flex-1 h-11 bg-[#111] text-white rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg cursor-pointer"
              >
                Enregistrer le journal
              </button>
            )}
            <button 
              onClick={() => {
                setNewJournalCode('');
                setNewJournalLabel('');
                setNewJournalType('Achats');
                setNewJournalAccount('');
                setEditingJournalId(null);
                setIsJournalModalOpen(false);
              }}
              className={cn(
                "h-11 rounded-xl text-xs font-bold transition-all cursor-pointer",
                journalModalAction === 'view' ? "flex-1 bg-[#111] text-white" : "px-6 bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {journalModalAction === 'view' ? "Fermer" : "Annuler"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isAccountModalOpen} 
        onClose={() => {
          setNewAccountNum('');
          setNewAccountLabel('');
          setNewAccountClass('1');
          setEditingAccountId(null);
          setAccountModalError(null);
          setIsAccountModalOpen(false);
        }} 
        title={accountModalMode === 'view' ? "Détails du compte général" : editingAccountId ? "Modifier le compte général" : "Nouveau compte général"}
      >
        <div className="space-y-4">
          {accountModalError && (
            <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-xs font-bold border border-red-100 animate-in fade-in slide-in-from-top-1 text-center">
              ⚠️ {accountModalError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">N° Compte</label>
              <input 
                type="text" 
                value={newAccountNum}
                onChange={e => {
                  setNewAccountNum(e.target.value);
                  setAccountModalError(null);
                }}
                disabled={accountModalMode === 'view'}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#4A9EC9] transition-all disabled:opacity-75" 
                placeholder="Ex: 40110000" 
              />
              <span className="text-[10px] text-slate-400 font-mono block mt-1">
                Taille actuelle : <strong className={newAccountNum.replace(/\s/g, '').length >= 8 && newAccountNum.replace(/\s/g, '').length <= 14 ? "text-emerald-600 font-bold" : "text-amber-500 font-bold"}>{newAccountNum.replace(/\s/g, '').length}</strong> / requis : 8 à 14
              </span>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Classe</label>
              <select 
                value={newAccountClass}
                onChange={e => setNewAccountClass(e.target.value)}
                disabled={accountModalMode === 'view'}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#4A9EC9] transition-all cursor-pointer disabled:opacity-75"
              >
                {[1,2,3,4,5,6,7,8,9].map(c => (
                  <option key={c} value={c}>Classe {c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Intitulé du compte</label>
            <input 
              type="text" 
              value={newAccountLabel}
              onChange={e => setNewAccountLabel(e.target.value)}
              disabled={accountModalMode === 'view'}
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#4A9EC9] transition-all disabled:opacity-75" 
              placeholder="Libellé du compte" 
            />
          </div>
          <div className="pt-4 flex gap-3">
            {accountModalMode !== 'view' && (
              <button 
                onClick={handleCreateAccount}
                className="flex-1 h-11 bg-[#111] text-white rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg cursor-pointer"
              >
                {editingAccountId ? "Enregistrer les modifications" : "Créer le compte"}
              </button>
            )}
            <button 
              onClick={() => {
                setNewAccountNum('');
                setNewAccountLabel('');
                setNewAccountClass('1');
                setEditingAccountId(null);
                setAccountModalError(null);
                setIsAccountModalOpen(false);
              }}
              className={cn(
                "h-11 rounded-xl text-xs font-bold transition-all cursor-pointer",
                accountModalMode === 'view' ? "flex-1 bg-[#111] text-white" : "px-6 bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {accountModalMode === 'view' ? "Fermer" : "Annuler"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isInvoiceAddModalOpen} 
        onClose={() => setIsInvoiceAddModalOpen(false)} 
        title={modalMode === 'edit' ? "Modifier la facture" : "Digitaliser une nouvelle facture"}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6">
          <p className="text-xs text-slate-400 font-medium">Chargez un fichier PDF pour que l'IA l'analyse, ou remplissez les champs manuellement.</p>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) {
                handleFileChange(e.dataTransfer.files[0]);
              }
            }}
            className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center group hover:border-[#8B5CF6] transition-all cursor-pointer hover:bg-purple-55 bg-white"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="application/pdf,image/*" 
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />
            <UploadCloud className="w-10 h-10 text-slate-300 group-hover:text-[#8B5CF6] mb-3 transition-colors shrink-0" />
            {newInvoice.fileName ? (
              <div className="space-y-1">
                <p className="text-[13px] font-bold text-[#8B5CF6] truncate max-w-xs">{newInvoice.fileName}</p>
                <p className="text-[10px] text-emerald-500 font-bold">✓ Fichier prêt pour la digitalisation (Analyse IA effectuée)</p>
              </div>
            ) : (
              <>
                <p className="text-[13px] font-medium text-slate-600">
                  <span className="text-[#8B5CF6] font-bold">Glissez-déposez</span> une facture ou cliquez pour sélectionner
                </p>
                <p className="text-[10px] text-slate-400 mt-1">PDF ou image (max 5MB)</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">N° Pièce</label>
              <input 
                type="text" 
                value={newInvoice.piece}
                onChange={(e) => setNewInvoice({...newInvoice, piece: e.target.value})}
                placeholder="Ex: FACT-088"
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#8B5CF6] transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Type de facture</label>
              <select 
                value={newInvoice.type}
                onChange={(e) => setNewInvoice({...newInvoice, type: e.target.value})}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#8B5CF6] transition-all cursor-pointer"
              >
                <option value="Achat">Achat</option>
                <option value="Vente">Vente</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Tiers rattaché</label>
            <select 
              value={newInvoice.tiers}
              onChange={(e) => setNewInvoice({...newInvoice, tiers: e.target.value})}
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#8B5CF6] transition-all cursor-pointer"
            >
              <option value="">Sélectionnez un tiers</option>
              {thirdParties.map(tp => (
                <option key={tp.id} value={tp.label}>{tp.code} — {tp.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Date de l'opération</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={newInvoice.date}
                  onChange={(e) => setNewInvoice({...newInvoice, date: e.target.value})}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#8B5CF6] transition-all pr-12" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Montant total (FCFA)</label>
              <input 
                type="number" 
                value={newInvoice.amount}
                onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                placeholder="0"
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold outline-none focus:border-[#8B5CF6] transition-all tabular-nums" 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              onClick={() => setIsInvoiceAddModalOpen(false)}
              className="px-8 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
            >
              Annuler
            </button>
             <button 
              onClick={() => {
                if (modalMode === 'edit' && selectedInvoice) {
                  setInvoices(invoices.map(inv => 
                    inv.id === selectedInvoice.id 
                    ? { 
                        ...inv, 
                        piece: newInvoice.piece, 
                        tiers: newInvoice.tiers, 
                        type: newInvoice.type,
                        date: newInvoice.date.includes('-') ? newInvoice.date.split('-').reverse().join('/') : newInvoice.date, 
                        amount: parseInt(newInvoice.amount) || 0,
                        fileUrl: newInvoice.fileUrl || (inv as any).fileUrl,
                        fileType: newInvoice.fileType || (inv as any).fileType,
                        fileName: newInvoice.fileName || (inv as any).fileName
                      } 
                    : inv
                  ));
                  saveActionLog(selectedDossier?.id || 'default', {
                    type: 'Digitalisation',
                    desc: `Modification de facture digitalisée`,
                    details: `N° Pièce : ${newInvoice.piece} | Tiers : ${newInvoice.tiers} | Montant : ${newInvoice.amount} FCFA`
                  });
                } else {
                  const id = (invoices.length + 1).toString();
                  const finalDate = newInvoice.date ? (newInvoice.date.includes('-') ? newInvoice.date.split('-').reverse().join('/') : newInvoice.date) : '24/05/2026';
                  setInvoices([{
                    id,
                    date: finalDate,
                    piece: newInvoice.piece || 'SANS_NUM',
                    tiers: newInvoice.tiers || 'Inconnu',
                    type: newInvoice.type,
                    amount: parseInt(newInvoice.amount) || 0,
                    status: 'Traité',
                    fileUrl: newInvoice.fileUrl,
                    fileType: newInvoice.fileType,
                    fileName: newInvoice.fileName
                  } as any, ...invoices]);
                  saveActionLog(selectedDossier?.id || 'default', {
                    type: 'Digitalisation',
                    desc: `Nouvelle facture digitalisée`,
                    details: `N° Pièce : ${newInvoice.piece} | Tiers : ${newInvoice.tiers} | Montant : ${newInvoice.amount} FCFA`
                  });
                }
                setIsInvoiceAddModalOpen(false);
                setNewInvoice({ piece: '', tiers: '', type: 'Achat', date: '', amount: '', file: null, fileUrl: '', fileType: '', fileName: '' });
              }}
              className="px-8 py-2.5 bg-[#8B5CF6] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
            >
              {modalMode === 'edit' ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isInvoiceDetailsModalOpen}
        onClose={() => setIsInvoiceDetailsModalOpen(false)}
        title="Détails de la facture"
        maxWidth="max-w-4xl"
      >
        <div className="flex flex-col md:flex-row gap-8">
           <div className="w-full md:w-1/3 space-y-6">
              <p className="text-[11px] text-slate-400 font-medium">Aperçu des informations et du document pour la facture N° {selectedInvoice?.piece}.</p>
              
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">N° Pièce</label>
                    <p className="text-lg font-black text-[#111]">{selectedInvoice?.piece}</p>
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tiers</label>
                    <p className="text-base font-black text-slate-700">{selectedInvoice?.tiers}</p>
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date de l'opération</label>
                    <p className="text-base font-black text-slate-700">{selectedInvoice?.date}</p>
                  </div>
                  <div>
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type</label>
                     <div className="mt-1">
                       <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                         {selectedInvoice?.type}
                       </span>
                     </div>
                  </div>
                  <div className="pt-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Montant Total</label>
                     <p className="text-xl font-black text-[#111]">{selectedInvoice?.amount?.toLocaleString()} FCFA</p>
                  </div>
               </div>

               <div className="pt-8 space-y-3">
                  <button 
                   onClick={() => setIsInvoiceDetailsModalOpen(false)}
                   className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    Fermer
                  </button>
                  <button 
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedInvoice, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", selectedInvoice?.fileUrl || dataStr);
                      downloadAnchor.setAttribute("download", `Facture-${selectedInvoice?.piece || 'digitalisee'}.pdf`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                      
                      saveActionLog(selectedDossier?.id || 'default', {
                        type: 'Digitalisation',
                        desc: `Téléchargement de la facture : ${selectedInvoice?.piece}`,
                        details: `Montant : ${selectedInvoice?.amount} FCFA | Tiers : ${selectedInvoice?.tiers}`
                      });
                    }}
                    className="w-full py-3 bg-[#8B5CF6] text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
                  >
                     <Download className="w-4 h-4" /> Télécharger
                  </button>
               </div>
            </div>

            <div className="flex-1 space-y-3">
               <label className="text-xs font-bold text-slate-700">Aperçu du document</label>
               {selectedInvoice?.fileUrl ? (
                 selectedInvoice.fileType?.includes('pdf') ? (
                   <iframe 
                     src={selectedInvoice.fileUrl} 
                     className="w-full aspect-[3/4] rounded-2xl border border-slate-200 bg-white"
                     title="Aperçu PDF"
                   />
                 ) : (
                   <img 
                     src={selectedInvoice.fileUrl} 
                     alt="Facture digitalisée" 
                     className="w-full aspect-[3/4] object-contain bg-slate-50 rounded-2xl border border-slate-200"
                     referrerPolicy="no-referrer"
                   />
                 )
               ) : (
                 <div className="w-full aspect-[3/4] bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between text-slate-850 relative">
                   <div className="space-y-6">
                     <div className="flex justify-between items-start">
                       <div>
                         <h3 className="text-sm font-black tracking-tight text-slate-900">FACTURE</h3>
                         <p className="text-[10px] text-slate-400 font-mono">N° {selectedInvoice?.piece || 'FACT-000'}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[11px] font-black tracking-tight text-[#8B5CF6]">FACTURE DIGITALISÉE</p>
                         <p className="text-[9px] text-slate-400">Date: {selectedInvoice?.date}</p>
                       </div>
                     </div>

                     <div className="border-t border-b border-slate-100 py-3 grid grid-cols-2 gap-4 text-[10px]">
                       <div>
                         <span className="font-bold text-slate-400 block uppercase tracking-wider text-[8px]">Émetteur (Tiers)</span>
                         <span className="font-extrabold text-slate-700 block mt-0.5">{selectedInvoice?.tiers || 'Fournisseur Externe'}</span>
                         <span className="text-slate-400 block">Abidjan, Côte d'Ivoire</span>
                       </div>
                       <div>
                         <span className="font-bold text-slate-400 block uppercase tracking-wider text-[8px]">Destinataire</span>
                         <span className="font-extrabold text-slate-700 block mt-0.5">{activeEnterprise?.name || "Cabinet SKOM SERVICES"}</span>
                         <span className="text-slate-400 block">Comptabilité Générale / SYSCOHADA</span>
                       </div>
                     </div>

                     <table className="w-full text-left border-collapse text-[10px]">
                       <thead>
                         <tr className="border-b border-slate-100 text-slate-400 font-bold">
                           <th className="pb-2">Désignation</th>
                           <th className="pb-2 text-right">Qté</th>
                           <th className="pb-2 text-right">Prix (FCFA)</th>
                           <th className="pb-2 text-right">Total (FCFA)</th>
                         </tr>
                       </thead>
                       <tbody>
                         <tr className="border-b border-slate-50 text-slate-600 font-medium">
                           <td className="py-2.5">Prestations de services comptables & digitalisation</td>
                           <td className="py-2.5 text-right font-mono">1</td>
                           <td className="py-2.5 text-right font-mono">{(selectedInvoice?.amount || 0).toLocaleString()}</td>
                           <td className="py-2.5 text-right font-semibold font-mono">{(selectedInvoice?.amount || 0).toLocaleString()}</td>
                         </tr>
                       </tbody>
                     </table>
                   </div>

                   <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-[11px] mt-auto">
                     <span className="font-bold text-slate-400">NET À PAYER (FCFA)</span>
                     <span className="text-sm font-black text-emerald-600 font-mono">{(selectedInvoice?.amount || 0).toLocaleString()} FCFA</span>
                   </div>
                 </div>
               )}
            </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isJournalSelectionModalOpen} 
        onClose={() => setIsJournalSelectionModalOpen(false)} 
        title="Critères de génération du journal"
      >
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Journal à afficher</label>
            <select 
              value={journalParams.type}
              onChange={(e) => setJournalParams({...journalParams, type: e.target.value})}
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#8B5CF6] transition-all cursor-pointer"
            >
              <option value="ACH - Journal des achats">ACH - Journal des achats</option>
              <option value="VTE - Journal des ventes">VTE - Journal des ventes</option>
              <option value="BQ - Journal de banque">BQ - Journal de banque</option>
              <option value="OD - Opérations diverses">OD - Opérations diverses</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date de début</label>
              <input 
                type="date" 
                value={journalParams.startDate}
                onChange={(e) => setJournalParams({...journalParams, startDate: e.target.value})}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#8B5CF6] transition-all" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date de fin</label>
              <input 
                type="date" 
                value={journalParams.endDate}
                onChange={(e) => setJournalParams({...journalParams, endDate: e.target.value})}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#8B5CF6] transition-all" 
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              onClick={() => {
                setIsJournalSelectionModalOpen(false);
                setIsJournalReportOpen(true);
              }}
              className="flex-1 h-12 bg-[#8B5CF6] text-white rounded-2xl text-[13px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-purple-500/20"
            >
              Générer le document
            </button>
            <button 
              onClick={() => setIsJournalSelectionModalOpen(false)}
              className="h-12 px-6 bg-slate-100 text-slate-600 rounded-2xl text-[13px] font-bold hover:bg-slate-200 transition-all cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isJournalReportOpen}
        onClose={() => setIsJournalReportOpen(false)}
        title={`Journal - ${journalParams.type}`}
        subtitle={`Période du ${new Date(journalParams.startDate).toLocaleDateString('fr-FR')} au ${new Date(journalParams.endDate).toLocaleDateString('fr-FR')}.`}
        maxWidth="max-w-[1200px]"
      >
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm overflow-hidden">
             {/* Document Header (like the image) */}
             <div className="flex border-b border-slate-100 pb-6 mb-6">
                <div className="flex-1 flex items-center gap-6">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center p-3">
                      <Logo 
                        iconClassName="w-full h-auto text-purple-600" 
                        showText={false}
                      />
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-slate-900 leading-none mb-1">{activeEnterprise?.name || 'Votre Société S.A.'}</h4>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 grayscale opacity-50">
                           <MapPin className="w-3 h-3" />
                           <span className="text-[10px] font-bold">Abidjan, Côte d'Ivoire</span>
                        </div>
                      </div>
                   </div>
                </div>
                <div className="text-right space-y-1">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                     Journal : <span className="text-slate-900 font-black">{journalParams.type.split(' - ')[1]}</span>
                   </p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                     Période : <span className="text-slate-900 font-black">{new Date(journalParams.startDate).toLocaleDateString()} au {new Date(journalParams.endDate).toLocaleDateString()}</span>
                   </p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                     Imprimé le : <span className="text-slate-900 font-black">{new Date().toLocaleString('fr-FR')}</span>
                   </p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                     Par : <span className="text-slate-900 font-black">{activeEnterprise?.name || user?.displayName || user?.name || 'Utilisateur Unikorp'}</span>
                   </p>
                </div>
             </div>

             {/* Report Table */}
             <div className="overflow-x-auto">
               <table className="w-full text-sm border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-y border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-400 text-left">
                       <th className="py-4 px-6 w-32">Date</th>
                       <th className="py-4 px-6 w-40 border-l border-slate-100/50">N° COMPTA</th>
                       <th className="py-4 px-0" colSpan={5}>
                          <div className="grid grid-cols-5 h-full">
                             <div className="px-6 py-4 border-l border-slate-100/50">Compte Gén.</div>
                             <div className="px-6 py-4 border-l border-slate-100/50">Tiers</div>
                             <div className="px-6 py-4 border-l border-slate-100/50">Libellé</div>
                             <div className="px-6 py-4 border-l border-slate-100/50 text-right">Débit</div>
                             <div className="px-6 py-4 border-l border-slate-100/50 text-right">Crédit</div>
                          </div>
                       </th>
                    </tr>
                 </thead>
                 <tbody className="text-[13px]">
                    {[
                      { 
                        date: '15/01/2024', 
                        compta: 'ACH-2401-001', 
                        lines: [
                          { account: '602100', tiers: '-', label: 'Matières premières', debit: 1000000, credit: 0 },
                          { account: '445660', tiers: '-', label: 'TVA déductible', debit: 180000, credit: 0 },
                          { account: '401000', tiers: 'FOURN001', label: 'Xmaginsie', debit: 0, credit: 1180000 },
                        ]
                      },
                      { 
                        date: '22/01/2024', 
                        compta: 'ACH-2401-002', 
                        lines: [
                          { account: '601400', tiers: '-', label: 'Fournitures consommables', debit: 500000, credit: 0 },
                          { account: '445660', tiers: '-', label: 'TVA déductible', debit: 90000, credit: 0 },
                          { account: '401000', tiers: 'FOURN002', label: 'FournisPlus', debit: 0, credit: 590000 },
                        ]
                      }
                    ].map((tx, idx) => (
                      <tr key={idx} className="border-b border-slate-100 group">
                         <td className="py-6 px-6 font-bold text-slate-700 align-top group-hover:bg-slate-50/30 transition-colors">{tx.date}</td>
                         <td className="py-6 px-6 font-black text-slate-900 align-top border-l border-slate-100/50 group-hover:bg-slate-50/30 transition-colors uppercase tracking-tight">{tx.compta}</td>
                         <td className="p-0 border-l border-slate-100/50" colSpan={5}>
                            <div className="divide-y divide-slate-50">
                               {tx.lines.map((line, lIdx) => (
                                 <div key={lIdx} className="grid grid-cols-5 hover:bg-purple-50/20 transition-colors">
                                    <div className="px-6 py-4 font-black text-slate-600">{line.account}</div>
                                    <div className="px-6 py-4 font-bold text-slate-400 uppercase tracking-tighter">
                                      {isTiersAccount(line.account) ? line.tiers : ''}
                                    </div>
                                    <div className="px-6 py-4 text-slate-500 font-medium">{line.label}</div>
                                    <div className="px-6 py-4 text-right tabular-nums font-black text-emerald-600">
                                      {line.debit > 0 ? line.debit.toLocaleString() : ''}
                                    </div>
                                    <div className="px-6 py-4 text-right tabular-nums font-black text-rose-500">
                                      {line.credit > 0 ? line.credit.toLocaleString() : ''}
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
                 <tfoot className="bg-slate-50/50">
                    <tr className="font-black text-slate-900 border-t-2 border-slate-200">
                       <td colSpan={2} className="py-6 px-6 text-center uppercase tracking-widest text-[11px] font-black text-slate-400 bg-slate-50/80">Totaux</td>
                       <td colSpan={3} className="border-l border-slate-100/50"></td>
                       <td className="py-6 px-6 text-right tabular-nums text-lg border-l border-slate-100/50">1 770 000</td>
                       <td className="py-6 px-6 text-right tabular-nums text-lg border-l border-slate-100/50">1 770 000</td>
                    </tr>
                 </tfoot>
               </table>
             </div>
          </div>

          <div className="flex justify-between items-center pt-6">
             <button 
              onClick={() => {
                setIsJournalReportOpen(false);
                setIsJournalSelectionModalOpen(true);
              }}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#111] transition-colors cursor-pointer group"
             >
               <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Précédent
             </button>
             <div className="flex gap-3">
                <button 
                  onClick={() => setIsJournalReportOpen(false)}
                  className="px-8 h-12 bg-slate-100 text-slate-600 rounded-2xl text-[13px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Fermer
                </button>
                <button className="px-8 h-12 bg-[#8B5CF6] text-white rounded-2xl text-[13px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-purple-500/20">
                   <Download className="w-4 h-4" /> Exporter en PDF
                </button>
             </div>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isBrouillardSelectionModalOpen} 
        onClose={() => setIsBrouillardSelectionModalOpen(false)} 
        title="Critères de génération du brouillard"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Collaborateur / Stagiaire</label>
              <select 
                value={brouillardParams.trainee}
                onChange={(e) => setBrouillardParams({...brouillardParams, trainee: e.target.value})}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#8B5CF6] transition-all cursor-pointer"
              >
                <option value="Tous les stagiaires">Tous les stagiaires</option>
                <option value="Ahmed Silue">Ahmed Silue</option>
                <option value="Koffi Junior">Koffi Junior</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Journal concerné</label>
              <select 
                value={brouillardParams.journal}
                onChange={(e) => setBrouillardParams({...brouillardParams, journal: e.target.value})}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#8B5CF6] transition-all cursor-pointer"
              >
                <option value="Tous les journaux">Tous les journaux</option>
                <option value="ACH - Journal des achats">ACH - Journal des achats</option>
                <option value="VTE - Journal des ventes">VTE - Journal des ventes</option>
                <option value="BQ - Journal de banque">BQ - Journal de banque</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date de début</label>
              <input 
                type="date" 
                value={brouillardParams.startDate}
                onChange={(e) => setBrouillardParams({...brouillardParams, startDate: e.target.value})}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#8B5CF6] transition-all" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date de fin</label>
              <input 
                type="date" 
                value={brouillardParams.endDate}
                onChange={(e) => setBrouillardParams({...brouillardParams, endDate: e.target.value})}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#8B5CF6] transition-all" 
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              onClick={() => {
                setIsBrouillardSelectionModalOpen(false);
                setIsBrouillardReportOpen(true);
              }}
              className="flex-1 h-12 bg-[#8B5CF6] text-white rounded-2xl text-[13px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-purple-500/20"
            >
              Générer le brouillard
            </button>
            <button 
              onClick={() => setIsBrouillardSelectionModalOpen(false)}
              className="h-12 px-6 bg-slate-100 text-slate-600 rounded-2xl text-[13px] font-bold hover:bg-slate-200 transition-all cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isBrouillardReportOpen}
        onClose={() => setIsBrouillardReportOpen(false)}
        title="Brouillard de saisie"
        subtitle={`Période du ${new Date(brouillardParams.startDate).toLocaleDateString('fr-FR')} au ${new Date(brouillardParams.endDate).toLocaleDateString('fr-FR')} pour ${brouillardParams.trainee}.`}
        maxWidth="max-w-[1300px]"
      >
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm overflow-hidden">
             {/* Standard Header */}
             <div className="flex border-b border-slate-100 pb-6 mb-6">
                <div className="flex-1 flex items-center gap-6">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center p-3">
                      <Logo iconClassName="w-full h-auto text-purple-600" showText={false} />
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-slate-900 leading-none mb-1">{activeEnterprise?.name || 'Votre Société S.A.'}</h4>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 grayscale opacity-50">
                           <MapPin className="w-3 h-3" />
                           <span className="text-[10px] font-bold">Abidjan, Côte d'Ivoire</span>
                        </div>
                      </div>
                   </div>
                </div>
                <div className="text-right space-y-1">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                     État : <span className="text-slate-900 font-black">Brouillard de saisie</span>
                   </p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                     Période : <span className="text-slate-900 font-black">{new Date(brouillardParams.startDate).toLocaleDateString()} au {new Date(brouillardParams.endDate).toLocaleDateString()}</span>
                   </p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                     Imprimé le : <span className="text-slate-900 font-black">{new Date().toLocaleString('fr-FR')}</span>
                   </p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                     Par : <span className="text-slate-900 font-black">{activeEnterprise?.name || user?.displayName || user?.name || 'Utilisateur Unikorp'}</span>
                   </p>
                </div>
             </div>

             {/* Report Table */}
             <div className="overflow-x-auto">
               <table className="w-full text-sm border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-y border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-400 text-left">
                       <th className="py-4 px-6 w-32 tracking-tighter">DATE OP.</th>
                       <th className="py-4 px-6 w-40 border-l border-slate-100/50 tracking-tighter">N° PIECE</th>
                       <th className="py-4 px-0" colSpan={5}>
                          <div className="grid grid-cols-5 h-full">
                             <div className="px-6 py-4 border-l border-slate-100/50">COMPTE</div>
                             <div className="px-6 py-4 border-l border-slate-100/50">TIERS</div>
                             <div className="px-6 py-4 border-l border-slate-100/50">LIBELLE</div>
                             <div className="px-6 py-4 border-l border-slate-100/50 text-right">DEBIT</div>
                             <div className="px-6 py-4 border-l border-slate-100/50 text-right">CREDIT</div>
                          </div>
                       </th>
                       <th className="py-4 px-6 border-l border-slate-100/50">SAISI PAR</th>
                    </tr>
                 </thead>
                 <tbody className="text-[13px]">
                    {[
                      { 
                        date: '15/01/2024', 
                        piece: 'F2401-001', 
                        lines: [
                          { account: '602100', tiers: '-', label: 'Matières premières', debit: 1000000, credit: 0, user: 'Ahmed Silue' },
                          { account: '445660', tiers: '-', label: 'TVA déductible', debit: 180000, credit: 0, user: 'Ahmed Silue' },
                          { account: '401000', tiers: 'FOURN001', label: 'Xmaginsie', debit: 0, credit: 1180000, user: 'Ahmed Silue' },
                        ]
                      },
                      { 
                        date: '17/01/2024', 
                        piece: 'F2401-088', 
                        lines: [
                          { account: '601100', tiers: '-', label: 'Papeterie Bureau', debit: 45000, credit: 0, user: 'Koffi Junior' },
                          { account: '445660', tiers: '-', label: 'TVA déductible', debit: 8100, credit: 0, user: 'Koffi Junior' },
                          { account: '401000', tiers: 'SOCIX', label: 'Socix Fournitures', debit: 0, credit: 53100, user: 'Koffi Junior' },
                        ]
                      }
                    ].map((tx, idx) => (
                      <tr key={idx} className="border-b border-slate-100 group">
                         <td className="py-6 px-6 font-bold text-slate-700 align-top group-hover:bg-slate-50/30 transition-colors uppercase">{tx.date}</td>
                         <td className="py-6 px-6 font-black text-slate-900 align-top border-l border-slate-100/50 group-hover:bg-slate-50/30 transition-colors uppercase tracking-widest">{tx.piece}</td>
                         <td className="p-0 border-l border-slate-100/50" colSpan={5}>
                            <div className="divide-y divide-slate-50">
                               {tx.lines.map((line, lIdx) => (
                                 <div key={lIdx} className="grid grid-cols-5 hover:bg-amber-50/20 transition-colors">
                                    <div className="px-6 py-4 font-black text-slate-600">{line.account}</div>
                                    <div className="px-6 py-4 font-bold text-slate-400 uppercase tracking-tighter">
                                      {isTiersAccount(line.account) ? line.tiers : ''}
                                    </div>
                                    <div className="px-6 py-4 text-slate-500 font-medium truncate">{line.label}</div>
                                    <div className="px-6 py-4 text-right tabular-nums font-black text-emerald-600">
                                      {line.debit > 0 ? line.debit.toLocaleString() : ''}
                                    </div>
                                    <div className="px-6 py-4 text-right tabular-nums font-black text-rose-500">
                                      {line.credit > 0 ? line.credit.toLocaleString() : ''}
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </td>
                         <td className="py-6 px-6 border-l border-slate-100/50 align-top group-hover:bg-slate-50/30 transition-colors">
                            <div className="text-[10px] font-black uppercase text-slate-400 italic whitespace-nowrap">{tx.lines[0]?.user}</div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
                 <tfoot className="bg-slate-50/50">
                    <tr className="font-black text-slate-900 border-t-2 border-slate-200">
                       <td colSpan={2} className="py-6 px-6 text-center uppercase tracking-widest text-[11px] font-black text-slate-400 bg-slate-50/80">Cumul Brouillard</td>
                       <td colSpan={3} className="border-l border-slate-100/50"></td>
                       <td className="py-6 px-6 text-right tabular-nums text-lg border-l border-slate-100/50">1 233 100</td>
                       <td className="py-6 px-6 text-right tabular-nums text-lg border-l border-slate-100/50">1 233 100</td>
                       <td className="bg-white border-l border-slate-100/50"></td>
                    </tr>
                 </tfoot>
               </table>
             </div>
          </div>

          <div className="flex justify-between items-center pt-6">
             <button 
              onClick={() => {
                setIsBrouillardReportOpen(false);
                setIsBrouillardSelectionModalOpen(true);
              }}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#111] transition-colors cursor-pointer group"
             >
               <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Précédent
             </button>
             <div className="flex gap-3">
                <button 
                  onClick={() => setIsBrouillardReportOpen(false)}
                  className="px-8 h-12 bg-slate-100 text-slate-600 rounded-2xl text-[13px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Fermer
                </button>
                <button className="px-8 h-12 bg-[#8B5CF6] text-white rounded-2xl text-[13px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-purple-500/20">
                   <Download className="w-4 h-4" /> Exporter en PDF
                </button>
             </div>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isGrandLivreSelectionModalOpen} 
        onClose={() => setIsGrandLivreSelectionModalOpen(false)} 
        title="Critères du Grand livre"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date de début</label>
              <input 
                type="date" 
                value={grandLivreParams.startDate}
                onChange={(e) => setGrandLivreParams({...grandLivreParams, startDate: e.target.value})}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#8B5CF6] transition-all" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date de fin</label>
              <input 
                type="date" 
                value={grandLivreParams.endDate}
                onChange={(e) => setGrandLivreParams({...grandLivreParams, endDate: e.target.value})}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#8B5CF6] transition-all" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Comptes à inclure</label>
            <div className="max-h-40 overflow-y-auto border border-slate-100 rounded-xl bg-slate-50 p-3 space-y-2">
              {['401100 - Fournisseurs', '411100 - Clients', '521100 - Banque', '601100 - Achats'].map(acc => (
                <label key={acc} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={grandLivreParams.accounts.includes(acc.split(' - ')[0])}
                    onChange={(e) => {
                      const id = acc.split(' - ')[0];
                      if (e.target.checked) {
                        setGrandLivreParams({...grandLivreParams, accounts: [...grandLivreParams.accounts, id]});
                      } else {
                        setGrandLivreParams({...grandLivreParams, accounts: grandLivreParams.accounts.filter(a => a !== id)});
                      }
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500" 
                  />
                  <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{acc}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              onClick={() => {
                setIsGrandLivreSelectionModalOpen(false);
                setIsGrandLivreReportOpen(true);
              }}
              className="flex-1 h-12 bg-[#8B5CF6] text-white rounded-2xl text-[13px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-purple-500/20"
            >
              Générer le Grand livre
            </button>
            <button 
              onClick={() => setIsGrandLivreSelectionModalOpen(false)}
              className="h-12 px-6 bg-slate-100 text-slate-600 rounded-2xl text-[13px] font-bold hover:bg-slate-200 transition-all cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isGrandLivreReportOpen}
        onClose={() => setIsGrandLivreReportOpen(false)}
        title="Grand livre général"
        subtitle={`Période du ${new Date(grandLivreParams.startDate).toLocaleDateString('fr-FR')} au ${new Date(grandLivreParams.endDate).toLocaleDateString('fr-FR')}.`}
        maxWidth="max-w-[1300px]"
      >
        <div className="space-y-8 pb-8">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm overflow-hidden">
             {/* Standard Header */}
             <div className="flex border-b border-slate-100 pb-6 mb-6">
                <div className="flex-1 flex items-center gap-6">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center p-3">
                      <Logo iconClassName="w-full h-auto text-purple-600" showText={false} />
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-slate-900 leading-none mb-1">{activeEnterprise?.name || 'Votre Société S.A.'}</h4>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 grayscale opacity-50">
                           <MapPin className="w-3 h-3" />
                           <span className="text-[10px] font-bold">Abidjan, Côte d'Ivoire</span>
                        </div>
                      </div>
                   </div>
                </div>
                <div className="text-right space-y-1">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                     État : <span className="text-slate-900 font-black">Grand livre général</span>
                   </p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                     Période : <span className="text-slate-900 font-black">{new Date(grandLivreParams.startDate).toLocaleDateString()} au {new Date(grandLivreParams.endDate).toLocaleDateString()}</span>
                   </p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-slate-900 font-black">
                     Comptes : {grandLivreParams.accounts.join(', ')}
                   </p>
                </div>
             </div>

             {/* Report Tables (One per account) */}
             <div className="space-y-12">
               {[
                 { id: '401100', label: 'Fournisseurs Services', entries: [
                   { date: '15/01/2024', journal: 'ACH', piece: 'F24-001', label: 'Facture SOCIX', debit: 0, credit: 1180000 },
                   { date: '20/01/2024', journal: 'BQ', piece: 'PAY-001', label: 'Règlement SOCIX', debit: 1180000, credit: 0 },
                 ], solde: 0 },
                 { id: '521100', label: 'Banque Principale', entries: [
                   { date: '20/01/2024', journal: 'BQ', piece: 'PAY-001', label: 'Règlement Facture SOCIX', debit: 0, credit: 1180000 },
                   { date: '25/01/2024', journal: 'BQ', piece: 'ENC-001', label: 'Encaissement Client Alpha', debit: 2500000, credit: 0 },
                 ], solde: 1320000 }
               ].map((acc, aIdx) => (
                 <div key={aIdx} className="space-y-4">
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-xl flex justify-between items-center shadow-lg shadow-slate-900/10">
                      <h5 className="text-[13px] font-black uppercase tracking-widest flex items-center gap-3">
                        <span className="text-blue-400">{acc.id}</span>
                        <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                        {acc.label}
                      </h5>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                           <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">
                              <th className="py-3 px-6 w-32 border-r border-slate-100">DATE OP.</th>
                              <th className="py-3 px-6 w-24 border-r border-slate-100">JOURNAL</th>
                              <th className="py-3 px-6 w-32 border-r border-slate-100">N° COMPTA</th>
                              <th className="py-3 px-6 border-r border-slate-100">LIBELLE</th>
                              <th className="py-3 px-6 w-36 text-right border-r border-slate-100">DEBIT</th>
                              <th className="py-3 px-6 w-36 text-right">CREDIT</th>
                           </tr>
                        </thead>
                        <tbody className="text-[13px]">
                           {acc.entries.map((entry, eIdx) => (
                             <tr key={eIdx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 px-6 font-bold text-slate-500 border-r border-slate-50">{entry.date}</td>
                                <td className="py-4 px-6 font-black text-[#4A9EC9] border-r border-slate-50">{entry.journal}</td>
                                <td className="py-4 px-6 font-black text-slate-900 border-r border-slate-50">{entry.piece}</td>
                                <td className="py-4 px-6 text-slate-500 font-medium border-r border-slate-50">{entry.label}</td>
                                <td className="py-4 px-6 text-right tabular-nums font-black text-emerald-600 border-r border-slate-50">
                                  {entry.debit > 0 ? entry.debit.toLocaleString() : ''}
                                </td>
                                <td className="py-4 px-6 text-right tabular-nums font-black text-rose-500">
                                  {entry.credit > 0 ? entry.credit.toLocaleString() : ''}
                                </td>
                             </tr>
                           ))}
                        </tbody>
                        <tfoot>
                           <tr className="bg-slate-50/80 font-black text-slate-900 border-t-2 border-slate-200">
                              <td colSpan={4} className="py-4 px-6 text-right uppercase tracking-[0.2em] text-[10px] font-black text-slate-400">Solde du compte</td>
                              <td colSpan={2} className="py-4 px-6 text-right tabular-nums text-lg bg-white border-l border-slate-100">
                                {acc.solde.toLocaleString()} <span className="text-[10px] text-slate-400 ml-1">FCFA</span>
                              </td>
                           </tr>
                        </tfoot>
                      </table>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="flex justify-between items-center pt-6">
             <button 
              onClick={() => {
                setIsGrandLivreReportOpen(false);
                setIsGrandLivreSelectionModalOpen(true);
              }}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#111] transition-colors cursor-pointer group"
             >
               <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Précédent
             </button>
             <div className="flex gap-3">
                <button 
                  onClick={() => setIsGrandLivreReportOpen(false)}
                  className="px-8 h-12 bg-slate-100 text-slate-600 rounded-2xl text-[13px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl shadow-purple-500/20 shadow-none border-0"
                >
                  Fermer
                </button>
                <button className="px-8 h-12 bg-[#8B5CF6] text-white rounded-2xl text-[13px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-purple-500/20">
                   <Download className="w-4 h-4" /> Exporter en PDF
                </button>
             </div>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isGrandLivreTiersSelectionModalOpen} 
        onClose={() => setIsGrandLivreTiersSelectionModalOpen(false)} 
        title="Critères du Grand livre Tiers"
      >
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type de tiers</label>
            <div className="grid grid-cols-2 gap-2">
               {['Fournisseurs', 'Clients'].map(type => (
                 <button 
                  key={type}
                  onClick={() => setGrandLivreTiersParams({...grandLivreTiersParams, tiersType: type})}
                  className={cn(
                    "h-11 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    grandLivreTiersParams.tiersType === type 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                  )}
                 >
                   {type}
                 </button>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date de début</label>
              <input 
                type="date" 
                value={grandLivreTiersParams.startDate}
                onChange={(e) => setGrandLivreTiersParams({...grandLivreTiersParams, startDate: e.target.value})}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#8B5CF6] transition-all" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date de fin</label>
              <input 
                type="date" 
                value={grandLivreTiersParams.endDate}
                onChange={(e) => setGrandLivreTiersParams({...grandLivreTiersParams, endDate: e.target.value})}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#8B5CF6] transition-all" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{grandLivreTiersParams.tiersType} à inclure</label>
            <div className="max-h-40 overflow-y-auto border border-slate-100 rounded-xl bg-slate-50 p-3 space-y-2">
              {['SOCIX - SOCIX S.A.', 'ALPHA - Alpha Services', 'BETA - Beta Group'].map(tiers => (
                <label key={tiers} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={grandLivreTiersParams.tiersList.includes(tiers.split(' - ')[0])}
                    onChange={(e) => {
                      const id = tiers.split(' - ')[0];
                      if (e.target.checked) {
                        setGrandLivreTiersParams({...grandLivreTiersParams, tiersList: [...grandLivreTiersParams.tiersList, id]});
                      } else {
                        setGrandLivreTiersParams({...grandLivreTiersParams, tiersList: grandLivreTiersParams.tiersList.filter(t => t !== id)});
                      }
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500" 
                  />
                  <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{tiers}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              onClick={() => {
                setIsGrandLivreTiersSelectionModalOpen(false);
                setIsGrandLivreTiersReportOpen(true);
              }}
              className="flex-1 h-12 bg-[#8B5CF6] text-white rounded-2xl text-[13px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-purple-500/20"
            >
              Générer le Grand livre Tiers
            </button>
            <button 
              onClick={() => setIsGrandLivreTiersSelectionModalOpen(false)}
              className="h-12 px-6 bg-slate-100 text-slate-600 rounded-2xl text-[13px] font-bold hover:bg-slate-200 transition-all cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isGrandLivreTiersReportOpen}
        onClose={() => setIsGrandLivreTiersReportOpen(false)}
        title={`Grand livre ${grandLivreTiersParams.tiersType}`}
        subtitle={`Détail des opérations auxiliaires du ${new Date(grandLivreTiersParams.startDate).toLocaleDateString('fr-FR')} au ${new Date(grandLivreTiersParams.endDate).toLocaleDateString('fr-FR')}.`}
        maxWidth="max-w-[1300px]"
      >
        <div className="space-y-8 pb-8">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm overflow-hidden">
             {/* Standard Header */}
             <div className="flex border-b border-slate-100 pb-6 mb-6">
                <div className="flex-1 flex items-center gap-6">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center p-3">
                      <Logo iconClassName="w-full h-auto text-purple-600" showText={false} />
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-slate-900 leading-none mb-1">{activeEnterprise?.name || 'Votre Société S.A.'}</h4>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 grayscale opacity-50">
                           <MapPin className="w-3 h-3" />
                           <span className="text-[10px] font-bold">Abidjan, Côte d'Ivoire</span>
                        </div>
                      </div>
                   </div>
                </div>
                <div className="text-right space-y-1">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                     État : <span className="text-slate-900 font-black">Grand livre {grandLivreTiersParams.tiersType}</span>
                   </p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                     Période : <span className="text-slate-900 font-black">{new Date(grandLivreTiersParams.startDate).toLocaleDateString()} au {new Date(grandLivreTiersParams.endDate).toLocaleDateString()}</span>
                   </p>
                </div>
             </div>

             {/* Report Tables (One per Tiers) */}
             <div className="space-y-12">
               {[
                 { code: 'SOCIX', name: 'SOCIX S.A. (Imprimerie)', account: '401100', entries: [
                   { date: '15/01/2024', journal: 'ACH', piece: 'ACH-2401-001', label: 'Facture Papier A4', debit: 0, credit: 750000 },
                   { date: '20/01/2024', journal: 'BQ', piece: 'PAY-2401-005', label: 'Paiement Chèque n°774', debit: 750000, credit: 0 },
                 ], solde: 0 },
                 { code: 'ALPHA', name: 'Alpha Services', account: '401100', entries: [
                   { date: '22/01/2024', journal: 'ACH', piece: 'ACH-2401-012', label: 'Maintenance Clim', debit: 0, credit: 125000 },
                 ], solde: -125000 }
               ].map((tiers, tIdx) => (
                 <div key={tIdx} className="space-y-4">
                    <div className="bg-emerald-900 text-white px-6 py-3 rounded-xl flex justify-between items-center shadow-lg shadow-emerald-900/10">
                      <div className="flex items-center gap-4">
                         <span className="text-[10px] font-black bg-emerald-700/50 px-2 py-1 rounded text-emerald-200">CPTE : {tiers.account}</span>
                         <h5 className="text-[13px] font-black uppercase tracking-widest flex items-center gap-3">
                           <span className="text-emerald-400">{tiers.code}</span>
                           <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full" />
                           {tiers.name}
                         </h5>
                      </div>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                           <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">
                              <th className="py-3 px-6 w-32 border-r border-slate-100">DATE OP.</th>
                              <th className="py-3 px-6 w-24 border-r border-slate-100">JOURNAL</th>
                              <th className="py-3 px-6 w-32 border-r border-slate-100">N° COMPTA</th>
                              <th className="py-3 px-6 border-r border-slate-100">LIBELLE</th>
                              <th className="py-3 px-6 w-36 text-right border-r border-slate-100">DEBIT</th>
                              <th className="py-3 px-6 w-36 text-right">CREDIT</th>
                           </tr>
                        </thead>
                        <tbody className="text-[13px]">
                           {tiers.entries.map((entry, eIdx) => (
                             <tr key={eIdx} className="border-b border-slate-50 last:border-0 hover:bg-emerald-50/30 transition-colors">
                                <td className="py-4 px-6 font-bold text-slate-500 border-r border-slate-50">{entry.date}</td>
                                <td className="py-4 px-6 font-black text-emerald-600 border-r border-slate-50">{entry.journal}</td>
                                <td className="py-4 px-6 font-black text-slate-900 border-r border-slate-50">{entry.piece}</td>
                                <td className="py-4 px-6 text-slate-500 font-medium border-r border-slate-50">{entry.label}</td>
                                <td className="py-4 px-6 text-right tabular-nums font-black text-emerald-600 border-r border-slate-50">
                                  {entry.debit > 0 ? entry.debit.toLocaleString() : ''}
                                </td>
                                <td className="py-4 px-6 text-right tabular-nums font-black text-rose-500">
                                  {entry.credit > 0 ? entry.credit.toLocaleString() : ''}
                                </td>
                             </tr>
                           ))}
                        </tbody>
                        <tfoot>
                           <tr className="bg-slate-50/80 font-black text-slate-900 border-t-2 border-slate-200">
                              <td colSpan={4} className="py-4 px-6 text-right uppercase tracking-[0.2em] text-[10px] font-black text-slate-400">Solde auxiliaire</td>
                              <td colSpan={2} className={cn(
                                "py-4 px-6 text-right tabular-nums text-lg bg-white border-l border-slate-100",
                                tiers.solde < 0 ? "text-rose-600" : tiers.solde > 0 ? "text-emerald-600" : "text-slate-400"
                              )}>
                                {Math.abs(tiers.solde).toLocaleString()} 
                                <span className="text-[10px] ml-1">{tiers.solde < 0 ? 'Déficit' : tiers.solde > 0 ? 'Créditeur' : ''}</span>
                              </td>
                           </tr>
                        </tfoot>
                      </table>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="flex justify-between items-center pt-6">
             <button 
              onClick={() => {
                setIsGrandLivreTiersReportOpen(false);
                setIsGrandLivreTiersSelectionModalOpen(true);
              }}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#111] transition-colors cursor-pointer group"
             >
               <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Précédent
             </button>
             <div className="flex gap-3">
                <button 
                  onClick={() => setIsGrandLivreTiersReportOpen(false)}
                  className="px-8 h-12 bg-slate-100 text-slate-600 rounded-2xl text-[13px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer underline-offset-0 ring-0 outline-0 shadow-none"
                >
                  Fermer
                </button>
                <button className="px-8 h-12 bg-[#8B5CF6] text-white rounded-2xl text-[13px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-purple-500/20">
                   <Download className="w-4 h-4" /> Exporter en PDF
                </button>
             </div>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isBalanceSelectionModalOpen} 
        onClose={() => setIsBalanceSelectionModalOpen(false)} 
        title="Critères de la Balance Générale"
      >
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type de balance</label>
            <div className="grid grid-cols-2 gap-2">
               {['2 Colonnes', '4 Colonnes', '6 Colonnes', '8 Colonnes'].map(type => (
                 <button 
                  key={type}
                  onClick={() => setBalanceParams({...balanceParams, type})}
                  className={cn(
                    "h-11 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    balanceParams.type === type 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                  )}
                 >
                   {type}
                 </button>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date de début</label>
              <input 
                type="date" 
                value={balanceParams.startDate}
                onChange={(e) => setBalanceParams({...balanceParams, startDate: e.target.value})}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#8B5CF6] transition-all" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date de fin</label>
              <input 
                type="date" 
                value={balanceParams.endDate}
                onChange={(e) => setBalanceParams({...balanceParams, endDate: e.target.value})}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#8B5CF6] transition-all" 
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              onClick={() => {
                setIsBalanceSelectionModalOpen(false);
                setIsBalanceReportOpen(true);
              }}
              className="flex-1 h-12 bg-[#8B5CF6] text-white rounded-2xl text-[13px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-purple-500/20"
            >
              Générer la Balance
            </button>
            <button 
              onClick={() => setIsBalanceSelectionModalOpen(false)}
              className="h-12 px-6 bg-slate-100 text-slate-600 rounded-2xl text-[13px] font-bold hover:bg-slate-200 transition-all cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isBalanceReportOpen}
        onClose={() => setIsBalanceReportOpen(false)}
        title={`Balance Générale (${balanceParams.type})`}
        subtitle={`Situation des comptes du ${new Date(balanceParams.startDate).toLocaleDateString('fr-FR')} au ${new Date(balanceParams.endDate).toLocaleDateString('fr-FR')}.`}
        maxWidth="max-w-[1300px]"
      >
        <div className="space-y-8 pb-8">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm overflow-hidden">
             {/* Standard Header */}
             <div className="flex border-b border-slate-100 pb-6 mb-6">
                <div className="flex-1 flex items-center gap-6">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center p-3">
                      <Logo iconClassName="w-full h-auto text-purple-600" showText={false} />
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-slate-900 leading-none mb-1">{activeEnterprise?.name || 'Votre Société S.A.'}</h4>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 grayscale opacity-50">
                           <MapPin className="w-3 h-3" />
                           <span className="text-[10px] font-bold">Abidjan, Côte d'Ivoire</span>
                        </div>
                      </div>
                   </div>
                </div>
                <div className="text-right space-y-1">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                     État : <span className="text-slate-900 font-black">Balance Générale</span>
                   </p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                     Type : <span className="text-slate-900 font-black">{balanceParams.type}</span>
                   </p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                     Période : <span className="text-slate-900 font-black">{new Date(balanceParams.startDate).toLocaleDateString()} au {new Date(balanceParams.endDate).toLocaleDateString()}</span>
                   </p>
                </div>
             </div>

             {/* Balance Table */}
             <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    {/* Main headers */}
                    <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest align-middle">
                      <th rowSpan={balanceParams.type === '2 Colonnes' ? 1 : 2} className="py-4 px-6 text-left border-r border-slate-800">N° Compte</th>
                      <th rowSpan={balanceParams.type === '2 Colonnes' ? 1 : 2} className="py-4 px-6 text-left border-r border-slate-800 whitespace-nowrap">Intitulé du compte</th>
                      
                      {balanceParams.type === '8 Colonnes' && (
                         <>
                           <th colSpan={2} className="py-3 px-6 border-b border-slate-800 border-r border-slate-800 text-center bg-slate-800/30">Ouv. (Report)</th>
                           <th colSpan={2} className="py-3 px-6 border-b border-slate-800 border-r border-slate-800 text-center bg-slate-800/50">Mvts Période</th>
                           <th colSpan={2} className="py-3 px-6 border-b border-slate-800 border-r border-slate-800 text-center bg-slate-800/70">Cumuls Mvts</th>
                           <th colSpan={2} className="py-3 px-6 border-b border-slate-800 text-center bg-emerald-900/50">Soldes Finaux</th>
                         </>
                      )}

                      {balanceParams.type === '6 Colonnes' && (
                         <>
                           <th colSpan={2} className="py-3 px-6 border-b border-slate-800 border-r border-slate-800 text-center bg-slate-800/30">Ouv. (Report)</th>
                           <th colSpan={2} className="py-3 px-6 border-b border-slate-800 border-r border-slate-800 text-center bg-slate-800/50">Mvts Période</th>
                           <th colSpan={2} className="py-3 px-6 border-b border-slate-800 text-center bg-emerald-900/50">Soldes Finaux</th>
                         </>
                      )}

                      {balanceParams.type === '4 Colonnes' && (
                         <>
                           <th colSpan={2} className="py-3 px-6 border-b border-slate-800 border-r border-slate-800 text-center bg-slate-800/50">Mouvements</th>
                           <th colSpan={2} className="py-3 px-6 border-b border-slate-800 text-center bg-emerald-900/50">Soldes</th>
                         </>
                      )}

                      {balanceParams.type === '2 Colonnes' && (
                         <>
                           <th className="py-4 px-6 text-right border-r border-slate-800 bg-emerald-900/50">Solde DébiteuR</th>
                           <th className="py-4 px-6 text-right bg-rose-900/50">Solde Créditeur</th>
                         </>
                      )}
                    </tr>
                    
                    {/* Sub-headers */}
                    {(balanceParams.type === '4 Colonnes' || balanceParams.type === '6 Colonnes' || balanceParams.type === '8 Colonnes') && (
                      <tr className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest border-t border-slate-800">
                        {/* Soldes Ouverture for 6 & 8 columns */}
                        {(balanceParams.type === '6 Colonnes' || balanceParams.type === '8 Colonnes') && (
                          <>
                            <th className="py-2 px-6 text-right border-r border-slate-800">Déb.</th>
                            <th className="py-2 px-6 text-right border-r border-slate-800">Créd.</th>
                          </>
                        )}
                        {/* Movements for 4, 6 & 8 columns */}
                        <th className="py-2 px-6 text-right border-r border-slate-800">Débit</th>
                        <th className="py-2 px-6 text-right border-r border-slate-800">Crédit</th>
                        {/* Cumuls for 8 columns only */}
                        {balanceParams.type === '8 Colonnes' && (
                          <>
                            <th className="py-2 px-6 text-right border-r border-slate-800">Débit</th>
                            <th className="py-2 px-6 text-right border-r border-slate-800">Crédit</th>
                          </>
                        )}
                        {/* Final Balances for 4, 6 & 8 columns */}
                        <th className="py-2 px-6 text-right border-r border-slate-800">DébiteuR</th>
                        <th className="py-2 px-6 text-right">Créditeur</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="text-[13px]">
                    {[
                      { id: '101100', label: 'Capital social', ouvD: 0, ouvC: 10000000, mvtD: 0, mvtC: 0, soldeD: 0, soldeC: 10000000 },
                      { id: '211000', label: 'Terrains nus', ouvD: 25000000, ouvC: 0, mvtD: 0, mvtC: 0, soldeD: 25000000, soldeC: 0 },
                      { id: '401100', label: 'Fournisseurs Services', ouvD: 0, ouvC: 0, mvtD: 1180000, mvtC: 1180000, soldeD: 0, soldeC: 0 },
                      { id: '411100', label: 'Clients', ouvD: 0, ouvC: 0, mvtD: 4500000, mvtC: 2500000, soldeD: 2000000, soldeC: 0 },
                      { id: '521100', label: 'Banque', ouvD: 5000000, ouvC: 0, mvtD: 10600000, mvtC: 8400000, soldeD: 7200000, soldeC: 0 },
                      { id: '601100', label: 'Achats marchandises', ouvD: 0, ouvC: 0, mvtD: 850000, mvtC: 0, soldeD: 850000, soldeC: 0 },
                      { id: '701100', label: 'Ventes produits finis', ouvD: 0, ouvC: 0, mvtD: 0, mvtC: 4500000, soldeD: 0, soldeC: 4500000 },
                    ].map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-slate-100 hover:bg-indigo-50/20 transition-colors">
                        <td className="py-3.5 px-6 font-black text-slate-900 border-r border-slate-50">{row.id}</td>
                        <td className="py-3.5 px-6 font-bold text-slate-500 border-r border-slate-50 uppercase tracking-tight">{row.label}</td>
                        
                        {/* Rendering cells based on column layout */}
                        {balanceParams.type === '8 Colonnes' && (
                           <>
                            <td className="py-3.5 px-6 text-right tabular-nums text-slate-400 border-r border-slate-50">{row.ouvD > 0 ? row.ouvD.toLocaleString() : ''}</td>
                            <td className="py-3.5 px-6 text-right tabular-nums text-slate-400 border-r border-slate-50">{row.ouvC > 0 ? row.ouvC.toLocaleString() : ''}</td>
                            <td className="py-3.5 px-6 text-right tabular-nums text-slate-600 border-r border-slate-50">{row.mvtD > 0 ? row.mvtD.toLocaleString() : ''}</td>
                            <td className="py-3.5 px-6 text-right tabular-nums text-slate-600 border-r border-slate-50">{row.mvtC > 0 ? row.mvtC.toLocaleString() : ''}</td>
                            <td className="py-3.5 px-6 text-right tabular-nums text-slate-900 border-r border-slate-50">{(row.ouvD + row.mvtD).toLocaleString()}</td>
                            <td className="py-3.5 px-6 text-right tabular-nums text-slate-900 border-r border-slate-50">{(row.ouvC + row.mvtC).toLocaleString()}</td>
                            <td className="py-3.5 px-6 text-right tabular-nums font-black text-emerald-600 border-r border-slate-50 bg-emerald-50/10">{row.soldeD > 0 ? row.soldeD.toLocaleString() : ''}</td>
                            <td className="py-3.5 px-6 text-right tabular-nums font-black text-rose-600 bg-rose-50/10">{row.soldeC > 0 ? row.soldeC.toLocaleString() : ''}</td>
                           </>
                        )}

                        {balanceParams.type === '6 Colonnes' && (
                           <>
                            <td className="py-3.5 px-6 text-right tabular-nums text-slate-400 border-r border-slate-50">{row.ouvD > 0 ? row.ouvD.toLocaleString() : ''}</td>
                            <td className="py-3.5 px-6 text-right tabular-nums text-slate-400 border-r border-slate-50">{row.ouvC > 0 ? row.ouvC.toLocaleString() : ''}</td>
                            <td className="py-3.5 px-6 text-right tabular-nums text-slate-600 border-r border-slate-50">{row.mvtD > 0 ? row.mvtD.toLocaleString() : ''}</td>
                            <td className="py-3.5 px-6 text-right tabular-nums text-slate-600 border-r border-slate-50">{row.mvtC > 0 ? row.mvtC.toLocaleString() : ''}</td>
                            <td className="py-3.5 px-6 text-right tabular-nums font-black text-emerald-600 border-r border-slate-50 bg-emerald-50/10">{row.soldeD > 0 ? row.soldeD.toLocaleString() : ''}</td>
                            <td className="py-3.5 px-6 text-right tabular-nums font-black text-rose-600 bg-rose-50/10">{row.soldeC > 0 ? row.soldeC.toLocaleString() : ''}</td>
                           </>
                        )}

                        {balanceParams.type === '4 Colonnes' && (
                           <>
                            <td className="py-3.5 px-6 text-right tabular-nums text-slate-600 border-r border-slate-50">
                              {row.mvtD > 0 ? row.mvtD.toLocaleString() : ''}
                            </td>
                            <td className="py-3.5 px-6 text-right tabular-nums text-slate-600 border-r border-slate-50">
                              {row.mvtC > 0 ? row.mvtC.toLocaleString() : ''}
                            </td>
                            <td className="py-3.5 px-6 text-right tabular-nums font-black text-emerald-600 border-r border-slate-50 bg-emerald-50/10">
                              {row.soldeD > 0 ? row.soldeD.toLocaleString() : ''}
                            </td>
                            <td className="py-3.5 px-6 text-right tabular-nums font-black text-rose-600 bg-rose-50/10">
                              {row.soldeC > 0 ? row.soldeC.toLocaleString() : ''}
                            </td>
                           </>
                        )}

                        {balanceParams.type === '2 Colonnes' && (
                           <>
                            <td className="py-3.5 px-6 text-right tabular-nums font-black text-emerald-600 border-r border-slate-50">
                              {row.soldeD > 0 ? row.soldeD.toLocaleString() : ''}
                            </td>
                            <td className="py-3.5 px-6 text-right tabular-nums font-black text-rose-600">
                              {row.soldeC > 0 ? row.soldeC.toLocaleString() : ''}
                            </td>
                           </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 text-[13px] font-black text-slate-900 border-t-2 border-slate-200">
                    <tr>
                      <td colSpan={2} className="py-5 px-6 text-right uppercase tracking-widest text-[11px] font-black text-slate-400">Totaux Balance</td>
                      {balanceParams.type === '8 Colonnes' && (
                         <>
                           <td className="py-5 px-6 text-right border-l border-slate-200">30 000 000</td>
                           <td className="py-5 px-6 text-right border-l border-slate-200">10 000 000</td>
                           <td className="py-5 px-6 text-right border-l border-slate-200">18 130 000</td>
                           <td className="py-5 px-6 text-right border-l border-slate-200">18 130 000</td>
                           <td className="py-5 px-6 text-right border-l border-slate-200">48 130 000</td>
                           <td className="py-5 px-6 text-right border-l border-slate-200">28 130 000</td>
                           <td className="py-5 px-6 text-right border-l border-slate-200 text-emerald-700 bg-white">35 050 000</td>
                           <td className="py-5 px-6 text-right border-l border-slate-200 text-rose-700 bg-white">35 050 000</td>
                         </>
                      )}
                      {balanceParams.type === '6 Colonnes' && (
                         <>
                           <td className="py-5 px-6 text-right border-l border-slate-200">30 000 000</td>
                           <td className="py-5 px-6 text-right border-l border-slate-200">10 000 000</td>
                           <td className="py-5 px-6 text-right border-l border-slate-200">18 130 000</td>
                           <td className="py-5 px-6 text-right border-l border-slate-200">18 130 000</td>
                           <td className="py-5 px-6 text-right border-l border-slate-200 text-emerald-700 bg-white">35 050 000</td>
                           <td className="py-5 px-6 text-right border-l border-slate-200 text-rose-700 bg-white">35 050 000</td>
                         </>
                      )}
                      {balanceParams.type === '4 Colonnes' && (
                         <>
                           <td className="py-5 px-6 text-right border-l border-slate-200">18 130 000</td>
                           <td className="py-5 px-6 text-right border-l border-slate-200">18 130 000</td>
                           <td className="py-5 px-6 text-right border-l border-slate-200 text-emerald-700 bg-white">35 050 000</td>
                           <td className="py-5 px-6 text-right border-l border-slate-200 text-rose-700 bg-white">35 050 000</td>
                         </>
                      )}
                      {balanceParams.type === '2 Colonnes' && (
                         <>
                           <td className="py-5 px-6 text-right border-l border-slate-200 text-emerald-700 bg-white">35 050 000</td>
                           <td className="py-5 px-6 text-right border-l border-slate-200 text-rose-700 bg-white">35 050 000</td>
                         </>
                      )}
                    </tr>
                  </tfoot>
                </table>
             </div>
          </div>

          <div className="flex justify-between items-center pt-6">
             <button 
              onClick={() => {
                setIsBalanceReportOpen(false);
                setIsBalanceSelectionModalOpen(true);
              }}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#111] transition-colors cursor-pointer group"
             >
               <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Précédent
             </button>
             <div className="flex gap-3">
                <button 
                  onClick={() => setIsBalanceReportOpen(false)}
                  className="px-8 h-12 bg-slate-100 text-slate-600 rounded-2xl text-[13px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer shadow-none"
                >
                  Fermer
                </button>
                <button className="px-8 h-12 bg-[#8B5CF6] text-white rounded-2xl text-[13px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-purple-500/20">
                   <Download className="w-4 h-4" /> Exporter en PDF
                </button>
             </div>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isTiersModalOpen} 
        onClose={() => {
          setNewTiersCode('');
          setNewTiersLabel('');
          setNewTiersPhone('');
          setNewTiersEmail('');
          setNewTiersType('FRN');
          setNewTiersRattachement('401100');
          setEditingTiersId(null);
          setIsTiersModalOpen(false);
        }} 
        title={tiersModalMode === 'view' ? "Détails du compte tiers" : editingTiersId ? "Modifier le compte tiers" : "Nouveau compte tiers"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type de tiers</label>
              <select 
                value={newTiersType}
                onChange={e => setNewTiersType(e.target.value as any)}
                disabled={tiersModalMode === 'view'}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#4A9EC9] transition-all cursor-pointer disabled:opacity-75"
              >
                <option value="FRN">Fournisseur</option>
                <option value="CLI">Client</option>
                <option value="PRT">Partenaire</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Code Tiers</label>
              <input 
                type="text" 
                value={newTiersCode}
                onChange={e => setNewTiersCode(e.target.value)}
                disabled={tiersModalMode === 'view'}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#4A9EC9] transition-all disabled:opacity-75" 
                placeholder="Ex: 4011-SOC" 
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Intitulé / Raison sociale</label>
            <input 
              type="text" 
              value={newTiersLabel}
              onChange={e => setNewTiersLabel(e.target.value)}
              disabled={tiersModalMode === 'view'}
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#4A9EC9] transition-all disabled:opacity-75" 
              placeholder="Nom complet" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Téléphone</label>
              <input 
                type="text" 
                value={newTiersPhone}
                onChange={e => setNewTiersPhone(e.target.value)}
                disabled={tiersModalMode === 'view'}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#4A9EC9] transition-all disabled:opacity-75" 
                placeholder="+225 ..." 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</label>
              <input 
                type="email" 
                value={newTiersEmail}
                onChange={e => setNewTiersEmail(e.target.value)}
                disabled={tiersModalMode === 'view'}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#4A9EC9] transition-all disabled:opacity-75" 
                placeholder="email@exemple.com" 
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Compte général rattaché</label>
            <select 
              value={newTiersRattachement}
              onChange={e => setNewTiersRattachement(e.target.value)}
              disabled={tiersModalMode === 'view'}
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#4A9EC9] transition-all cursor-pointer disabled:opacity-75"
            >
              {accounts.filter(a => a.num.startsWith('4')).map(a => (
                <option key={a.id} value={a.num}>{a.num} — {a.label}</option>
              ))}
              {accounts.filter(a => a.num.startsWith('4')).length === 0 && (
                <>
                  <option value="401100">401100 — Fournisseurs d'exploitation</option>
                  <option value="411100">411100 — Clients & Comptes rattachés</option>
                  <option value="444100">444100 — État, impôts sur les bénéfices</option>
                </>
              )}
            </select>
          </div>
          <div className="pt-4 flex gap-3">
            {tiersModalMode !== 'view' && (
              <button 
                onClick={handleCreateTiers}
                className="flex-1 h-11 bg-[#111] text-white rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg cursor-pointer"
              >
                {editingTiersId ? "Enregistrer les modifications" : "Enregistrer le tiers"}
              </button>
            )}
            <button 
              onClick={() => {
                setNewTiersCode('');
                setNewTiersLabel('');
                setNewTiersPhone('');
                setNewTiersEmail('');
                setNewTiersType('FRN');
                setNewTiersRattachement('401100');
                setEditingTiersId(null);
                setIsTiersModalOpen(false);
              }}
              className={cn(
                "h-11 rounded-xl text-xs font-bold transition-all cursor-pointer",
                tiersModalMode === 'view' ? "flex-1 bg-[#111] text-white" : "px-6 bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {tiersModalMode === 'view' ? "Fermer" : "Annuler"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isSaisieModalOpen} 
        onClose={() => setIsSaisieModalOpen(false)} 
        title={modalMode === 'view' ? "Détails de l'écriture" : modalMode === 'edit' ? "Modifier l'écriture" : "Saisie d'une écriture comptable"}
        maxWidth="max-w-[1000px]"
      >
        <div className="space-y-8">
          {/* Header Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date de saisie</label>
              <input 
                type="text" 
                readOnly 
                value={entryForm.dateSaisie || ''}
                className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm text-slate-500 outline-none cursor-not-allowed" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#111]">Journal *</label>
              <select 
                value={entryForm.journal || ''}
                onChange={(e) => setEntryForm({ ...entryForm, journal: e.target.value })}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#4A9EC9] cursor-pointer"
                disabled={modalMode === 'view'}
              >
                <option value="">Sélectionnez un journal</option>
                {journals.map(j => (
                  <option key={j.id} value={j.code}>{j.code} — {j.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#111]">Date de l'opération *</label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 text-sm outline-none focus:border-[#4A9EC9]" 
                  value={entryForm.dateOperation || ''}
                  onChange={(e) => setEntryForm({ ...entryForm, dateOperation: e.target.value })}
                  disabled={modalMode === 'view'}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#111]">N° Pièce *</label>
              <input 
                type="text" 
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#4A9EC9]" 
                placeholder="Ex: FAC-001"
                value={entryForm.piece || ''}
                onChange={(e) => setEntryForm({ ...entryForm, piece: e.target.value })}
                disabled={modalMode === 'view'}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#111]">Libellé de l'opération *</label>
              <input 
                type="text" 
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-[#4A9EC9]" 
                placeholder="Ex: Achat marchandises"
                value={entryForm.libelle || ''}
                onChange={(e) => setEntryForm({ ...entryForm, libelle: e.target.value })}
                disabled={modalMode === 'view'}
              />
            </div>
          </div>

          {/* Lines Table */}
          <div className="space-y-3">
             <div className="flex items-center gap-2 mb-2">
                <ListTree className="w-4 h-4 text-[#111]" />
                <h4 className="text-sm font-bold text-[#111]">Lignes d'écriture</h4>
             </div>
             <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden overflow-x-auto shadow-sm">
                <table className="w-full text-sm min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 w-12 text-center">N°</th>
                      <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-left">Compte général</th>
                      <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-left">Tiers</th>
                      <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-left">Libellé</th>
                      <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Débit</th>
                      <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Crédit</th>
                      <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 w-12 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {entryLines.map((line, idx) => (
                      <tr key={line.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 text-[10px] font-mono font-bold text-slate-300 text-center">{idx + 1}</td>
                        <td className="py-2 px-2 relative min-w-[150px]">
                           <input 
                             type="text" 
                             className="w-full h-10 bg-slate-50 border border-slate-100 rounded-lg px-3 text-[13px] outline-none focus:border-[#4A9EC9] transition-all"
                             placeholder="Saisir un compte"
                             value={line.account || ''}
                             onChange={(e) => {
                               const newLines = [...entryLines];
                               const val = e.target.value;
                               newLines[idx].account = val;
                               if (!isTiersAccount(val)) {
                                 newLines[idx].tiers = '';
                               }
                               setEntryLines(newLines);
                               setActiveLineSearch({ idx, type: 'account' });
                               setSearchValue(val);
                             }}
                             disabled={modalMode === 'view'}
                           />
                           {activeLineSearch?.idx === idx && activeLineSearch.type === 'account' && (
                             <div className="absolute left-2 right-2 top-11 z-[60] bg-white border border-slate-200 rounded-xl shadow-2xl p-2 max-h-48 overflow-y-auto">
                                {accounts
                                  .filter(a => !searchValue || a.num.startsWith(searchValue) || a.label.toLowerCase().includes(searchValue.toLowerCase()))
                                  .slice(0, 10)
                                  .map(a => (
                                    <button 
                                      key={a.id}
                                      type="button"
                                      onClick={() => {
                                        const newLines = [...entryLines];
                                        newLines[idx].account = a.num;
                                        if (!newLines[idx].label) {
                                          newLines[idx].label = a.label;
                                        }
                                        if (!isTiersAccount(a.num)) {
                                          newLines[idx].tiers = '';
                                        }
                                        setEntryLines(newLines);
                                        setActiveLineSearch(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-xs hover:bg-[#F0F9FF] hover:text-[#4A9EC9] rounded-lg font-medium border-b border-[#F8FAFC] last:border-0 cursor-pointer"
                                    >
                                      {a.num} — {a.label}
                                    </button>
                                  ))}
                                {accounts.filter(a => !searchValue || a.num.startsWith(searchValue) || a.label.toLowerCase().includes(searchValue.toLowerCase())).length === 0 && (
                                  <p className="text-[10px] text-slate-400 p-2 text-center">Aucun compte trouvé</p>
                                )}
                             </div>
                           )}
                        </td>
                        <td className="py-2 px-2 relative min-w-[150px]">
                           {!isTiersAccount(line.account) ? (
                             <div className="w-full h-10 flex items-center px-3 text-slate-300 font-mono text-[13px] bg-slate-100/30 rounded-lg select-none">
                               
                             </div>
                           ) : (
                             <>
                               <input 
                                 type="text" 
                                 className="w-full h-10 bg-slate-50 border border-slate-100 rounded-lg px-3 text-[13px] outline-none focus:border-[#4A9EC9] transition-all"
                                 placeholder="Saisir un tiers"
                                 value={line.tiers || ''}
                                 onChange={(e) => {
                                   const newLines = [...entryLines];
                                   newLines[idx].tiers = e.target.value;
                                   setEntryLines(newLines);
                                   setActiveLineSearch({ idx, type: 'tiers' });
                                   setSearchValue(e.target.value);
                                 }}
                                 disabled={modalMode === 'view'}
                               />
                               {activeLineSearch?.idx === idx && activeLineSearch.type === 'tiers' && searchValue.length > 0 && (
                                 <div className="absolute left-2 right-2 top-11 z-[60] bg-white border border-slate-200 rounded-xl shadow-2xl p-2 max-h-48 overflow-y-auto">
                                   {thirdParties.filter(pt => !searchValue || pt.code.toLowerCase().includes(searchValue.toLowerCase()) || pt.label.toLowerCase().includes(searchValue.toLowerCase())).slice(0, 8).map(t => (
                                     <button 
                                       key={t.id}
                                       type="button"
                                       onClick={() => {
                                         const newLines = [...entryLines];
                                         newLines[idx].tiers = t.code;
                                         newLines[idx].account = t.rattachement || '401100';
                                         if (!newLines[idx].label) {
                                           newLines[idx].label = t.label;
                                         }
                                         setEntryLines(newLines);
                                         setActiveLineSearch(null);
                                       }}
                                       className="w-full text-left px-3 py-2 text-xs hover:bg-[#F0F9FF] hover:text-[#4A9EC9] rounded-lg font-medium border-b border-slate-50 last:border-0 cursor-pointer"
                                     >
                                       {t.code} — {t.label} (Ratt.: {t.rattachement})
                                     </button>
                                   ))}
                                 </div>
                               )}
                             </>
                           )}
                        </td>
                        <td className="py-2 px-2">
                           <input 
                             type="text" 
                             className="w-full h-10 bg-slate-50 border border-slate-100 rounded-lg px-3 text-[13px] outline-none focus:border-[#4A9EC9] transition-all"
                             placeholder="Libellé"
                             value={line.label || ''}
                             onChange={(e) => {
                               const newLines = [...entryLines];
                               newLines[idx].label = e.target.value;
                               setEntryLines(newLines);
                             }}
                             disabled={modalMode === 'view'}
                           />
                        </td>
                        <td className="py-2 px-2">
                           <input 
                             type="number" 
                             className="w-32 h-10 bg-slate-50 border border-slate-100 rounded-lg px-3 text-[13px] text-right font-bold outline-none focus:border-[#4A9EC9] transition-all"
                             placeholder="0.00"
                             value={line.debit || ''}
                             onChange={(e) => {
                               const newLines = [...entryLines];
                               newLines[idx].debit = parseFloat(e.target.value) || 0;
                               setEntryLines(newLines);
                             }}
                             disabled={modalMode === 'view'}
                           />
                        </td>
                        <td className="py-2 px-2">
                           <input 
                             type="number" 
                             className="w-32 h-10 bg-slate-50 border border-slate-100 rounded-lg px-3 text-[13px] text-right font-bold outline-none focus:border-[#4A9EC9] transition-all"
                             placeholder="0.00"
                             value={line.credit || ''}
                             onChange={(e) => {
                               const newLines = [...entryLines];
                               newLines[idx].credit = parseFloat(e.target.value) || 0;
                               setEntryLines(newLines);
                             }}
                             disabled={modalMode === 'view'}
                           />
                        </td>
                        <td className="py-2 px-2 text-center">
                           {idx > 1 && modalMode !== 'view' ? (
                             <button 
                               onClick={() => setEntryLines(entryLines.filter((_, i) => i !== idx))}
                               className="w-8 h-8 flex items-center justify-center rounded-lg text-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           ) : (
                             <div className="w-8 h-8" />
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50/50 border-t border-slate-100 font-bold">
                    <tr>
                      <td colSpan={4} className="py-3 px-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Total</td>
                      <td className="py-3 px-4 text-right text-slate-900 border-l border-slate-100/20">
                        {entryLines.reduce((acc, l) => acc + (l.debit || 0), 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-900 border-l border-slate-100/20">
                        {entryLines.reduce((acc, l) => acc + (l.credit || 0), 0).toLocaleString()}
                      </td>
                      <td className="bg-slate-50/30"></td>
                    </tr>
                    <tr className="bg-slate-100/20 border-t border-slate-100/50">
                      <td colSpan={4} className="py-3 px-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Solde</td>
                      <td colSpan={2} className={cn(
                        "py-3 px-4 text-right text-sm font-black transition-colors border-l border-slate-100/20",
                        entryLines.reduce((acc, l) => acc + (l.debit || 0), 0) - entryLines.reduce((acc, l) => acc + (l.credit || 0), 0) === 0 
                          ? "text-[#1DB97E]" 
                          : "text-rose-500"
                      )}>
                        {(entryLines.reduce((acc, l) => acc + (l.debit || 0), 0) - entryLines.reduce((acc, l) => acc + (l.credit || 0), 0)).toLocaleString()} FCFA
                      </td>
                      <td className="bg-slate-100/10"></td>
                    </tr>
                  </tfoot>
                </table>
             </div>

             <div className="flex items-center justify-start pt-4">
                {modalMode !== 'view' && (
                  <button 
                    onClick={() => setEntryLines([...entryLines, { id: Date.now(), account: '', tiers: '', label: '', debit: 0, credit: 0 }])}
                    className="h-10 px-6 bg-[#A855F7] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Ajouter une ligne
                  </button>
                )}
             </div>
          </div>

          <div className="flex justify-end pt-4 gap-3">
             <button 
                onClick={() => setIsSaisieModalOpen(false)}
                className="h-11 px-8 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
              >
                {modalMode === 'view' ? 'Fermer' : 'Annuler'}
              </button>
              {modalMode !== 'view' && (
                <button 
                  disabled={entryLines.reduce((acc, l) => acc + (l.debit || 0), 0) - entryLines.reduce((acc, l) => acc + (l.credit || 0), 0) !== 0}
                  onClick={handleSaveEntry}
                  className="px-10 h-11 bg-[#A855F7] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-purple-200 hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale disabled:scale-100 cursor-pointer"
                >
                  {modalMode === 'edit' ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              )}
          </div>
        </div>
      </Modal>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <AnimatePresence mode="wait">
          {currentModule === 'skom' && (
            <motion.nav 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 228, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-white border-r border-black/5 flex flex-col py-3 overflow-y-auto shrink-0 scrollbar-hide"
            >
              <SidebarLink 
                icon={LayoutDashboard} 
                label="Tableau de bord" 
                active={activePage === 'skom-tdb'} 
                onClick={() => setActivePage('skom-tdb')} 
              />

              <SidebarSection 
                label="Création" 
                isOpen={openSections.has('creation')} 
                onToggle={() => toggleSection('creation')}
              >
                <SidebarLink icon={Notebook} label="Journaux" active={activePage === 'journaux-creation'} onClick={() => setActivePage('journaux-creation')} />
                <SidebarLink icon={ListTree} label="Comptes généraux" active={activePage === 'comptes-generaux'} onClick={() => setActivePage('comptes-generaux')} />
                <SidebarLink icon={Users} label="Comptes tiers" active={activePage === 'comptes-tiers'} onClick={() => setActivePage('comptes-tiers')} />
              </SidebarSection>

              <SidebarSection label="Gestion" isOpen={openSections.has('gestion')} onToggle={() => toggleSection('gestion')}>
                {isAdmin && <SidebarLink icon={ClipboardList} label="Brouillards" active={activePage === 'brouillards'} onClick={() => setActivePage('brouillards')} />}
                <SidebarLink icon={Pencil} label="Saisie comptable" active={activePage === 'saisie-comptable'} onClick={() => setActivePage('saisie-comptable')} />
                <SidebarLink icon={Scan} label="Digitalisation" active={activePage === 'digit-factures'} onClick={() => setActivePage('digit-factures')} />
              </SidebarSection>

              <SidebarSection label="États comptables" isOpen={openSections.has('etats')} onToggle={() => toggleSection('etats')}>
                <SidebarLink icon={FileClock} label="Brouillard" active={activePage === 'etats-brouillard'} onClick={() => setActivePage('etats-brouillard')} />
                <SidebarLink icon={BookText} label="Journal" active={activePage === 'journal'} onClick={() => setActivePage('journal')} />
                <SidebarLink icon={Book} label="Grand livre" active={activePage === 'grand-livre'} onClick={() => setActivePage('grand-livre')} />
                <SidebarLink icon={Contact} label="Grand livre tiers" active={activePage === 'grand-livre-tiers'} onClick={() => setActivePage('grand-livre-tiers')} />
                <SidebarLink icon={BarChart} label="Balance générale" active={activePage === 'balance'} onClick={() => setActivePage('balance')} />
              </SidebarSection>
            </motion.nav>
          )}
        </AnimatePresence>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-[1200px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = "max-w-lg" }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn("relative bg-white w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-auto", maxWidth)}
          >
            <div className="border-b border-slate-100 flex items-center justify-between px-6 py-4 bg-slate-50/50">
              <div className="flex flex-col">
                <h3 className="text-sm font-black uppercase tracking-widest text-[#111]">{title}</h3>
                {subtitle && <p className="text-[10px] font-bold text-slate-400 mt-0.5">{subtitle}</p>}
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-8 max-h-[85vh] overflow-y-auto scrollbar-hide">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Sub-components
function StatCard({ icon: Icon, label, value, badge, badgeType }: any) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 flex flex-col gap-3 group hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div className="w-9 h-9 bg-[#111] rounded-xl flex items-center justify-center text-white">
          <Icon className="w-4 h-4" />
        </div>
        {badge && (
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-md",
            badgeType === 'pos' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function TableRow({ name, id, status, statusType, amount }: any) {
  return (
    <tr className="hover:bg-slate-50/80 cursor-pointer transition-colors group">
      <td className="py-4 px-4">
        <p className="font-bold text-slate-900 group-hover:text-brand transition-colors">{name}</p>
        <p className="text-[10px] font-mono text-slate-400 mt-0.5 uppercase tracking-wider">{id}</p>
      </td>
      <td className="py-4 px-4">
        <span className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold",
          statusType === 'ok' ? "bg-emerald-50 text-emerald-600" : 
          statusType === 'wait' ? "bg-amber-50 text-amber-600" : 
          "bg-rose-50 text-rose-600"
        )}>
          {statusType === 'ok' ? <CheckCircle className="w-3 h-3" /> : 
           statusType === 'wait' ? <Clock className="w-3 h-3" /> : 
           <AlertCircle className="w-3 h-3" />}
          {status}
        </span>
      </td>
      <td className="py-4 px-4 text-right">
        <span className="font-bold text-slate-900">{amount}</span>
        <span className="text-[10px] font-mono text-slate-400 ml-1.5">FCFA</span>
      </td>
    </tr>
  );
}

function EntryRow({ date, journal, type, label, debit, credit }: any) {
  return (
    <tr className="hover:bg-slate-50/80 cursor-pointer transition-colors group">
      <td className="py-4 px-4 text-slate-500 font-medium group-hover:text-slate-900">{date}</td>
      <td className="py-4 px-4">
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
          type === 'info' ? "bg-blue-50 text-blue-600" :
          type === 'ok' ? "bg-emerald-50 text-emerald-600" :
          "bg-amber-50 text-amber-600"
        )}>
          {journal}
        </span>
      </td>
      <td className="py-4 px-4 font-medium text-slate-700">{label}</td>
      <td className="py-4 px-4 text-right font-bold text-slate-900">{debit || ''}</td>
      <td className="py-4 px-4 text-right font-bold text-slate-900">{credit || ''}</td>
    </tr>
  );
}

function JournalRow({ code, label, type, account, status, onView, onEdit, onDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/80 cursor-pointer transition-colors group">
      <td className="py-4 px-4 font-mono font-bold text-slate-900 group-hover:text-brand">{code}</td>
      <td className="py-4 px-4 font-medium text-slate-700">{label}</td>
      <td className="py-4 px-4 text-[13px]">
        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">{type}</span>
      </td>
      <td className="py-4 px-4 font-mono font-bold text-slate-400">{account}</td>
      <td className="py-4 px-4">
        <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm">
          {status}
        </span>
      </td>
      <td className="py-4 px-4 text-right">
        <div className="flex items-center justify-end gap-2 text-right">
          {onView && (
            <button 
              onClick={(e) => { e.stopPropagation(); onView(); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-purple-600 border border-transparent hover:border-slate-100 transition-all cursor-pointer shadow-sm bg-white"
              title="Consulter"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-brand border border-transparent hover:border-slate-100 transition-all cursor-pointer shadow-sm bg-white"
              title="Modifier"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-rose-500 border border-transparent hover:border-slate-100 transition-all cursor-pointer shadow-sm bg-white"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function AccountRow({ idx, num, label, classe, onView, onEdit, onDelete }: any) {
  return (
    <tr className={cn(
      "hover:bg-[#F0F9FF]/30 cursor-pointer transition-colors group",
      parseInt(idx) % 2 === 0 && "bg-slate-50/50"
    )}>
      <td className="py-4 px-4 text-center text-slate-300 font-mono text-[10px]">{idx}</td>
      <td className="py-4 px-4 font-mono font-bold text-slate-900 group-hover:text-brand">{num}</td>
      <td className="py-4 px-4 font-medium text-slate-700">{label}</td>
      <td className="py-4 px-4">
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600"
        )}>
          {classe}
        </span>
      </td>
      <td className="py-4 px-4 text-right">
        <div className="flex items-center justify-end gap-2 text-right">
          {onView && (
            <button 
              onClick={(e) => { e.stopPropagation(); onView(); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-purple-600 border border-transparent hover:border-slate-100 transition-all cursor-pointer shadow-sm bg-white"
              title="Consulter"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-brand border border-transparent hover:border-slate-100 transition-all cursor-pointer shadow-sm bg-white"
              title="Modifier"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-rose-500 border border-transparent hover:border-slate-100 transition-all cursor-pointer shadow-sm bg-white"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function SaisieRow({ idx, id, journal, date, piece, label, stripe, onView, onEdit, onDelete }: any) {
  return (
    <tr className={cn(
      "hover:bg-[#F0F9FF]/30 cursor-pointer transition-colors group",
      stripe && "bg-slate-50/50"
    )}>
      <td className="py-4 px-4 text-center text-slate-300 font-mono text-[10px]">{idx}</td>
      <td className="py-4 px-4 font-mono font-bold text-slate-900 group-hover:text-brand">{id}</td>
      <td className="py-4 px-4">
        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{journal}</span>
      </td>
      <td className="py-4 px-4 font-medium text-slate-500">{date}</td>
      <td className="py-4 px-4 font-mono font-bold text-slate-400">{piece}</td>
      <td className="py-4 px-4 font-medium text-slate-700">{label}</td>
      <td className="py-4 px-4 text-right">
        <div className="flex items-center justify-end gap-2 text-right">
          {onView && (
            <button 
              onClick={(e) => { e.stopPropagation(); onView(); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-purple-600 border border-transparent hover:border-slate-100 transition-all cursor-pointer shadow-sm bg-white"
              title="Consulter"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-brand border border-transparent hover:border-slate-100 transition-all cursor-pointer shadow-sm bg-white"
              title="Modifier"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-rose-500 border border-transparent hover:border-slate-100 transition-all cursor-pointer shadow-sm bg-white"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function BrouillardRow({ idx, date, piece, label, user, status, stripe, onView, onEdit, onValidate, onDelete }: any) {
  return (
    <tr className={cn(
      "hover:bg-[#F0F9FF]/30 cursor-pointer transition-colors group",
      stripe && "bg-slate-50/50"
    )}>
      <td className="py-4 px-4 text-center text-slate-300 font-mono text-[10px]">{idx}</td>
      <td className="py-4 px-4 font-medium text-slate-500">{date}</td>
      <td className="py-4 px-4 font-mono font-bold text-slate-400">{piece}</td>
      <td className="py-4 px-4 font-bold text-slate-900 group-hover:text-brand">{label}</td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">{user.charAt(0)}</div>
          <span className="font-medium text-slate-600">{user}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className={cn(
          "px-2 py-1 rounded-lg text-[10px] font-bold",
          status === 'Brouillon' ? "bg-slate-100 text-slate-500" : "bg-amber-50 text-amber-600 shadow-sm shadow-amber-500/10"
        )}>
          {status}
        </span>
      </td>
      <td className="py-4 px-4 text-right">
        <div className="flex items-center justify-end gap-2 text-right">
          {onView && (
            <button 
              onClick={(e) => { e.stopPropagation(); onView(); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-purple-600 border border-transparent hover:border-slate-100 transition-all cursor-pointer shadow-sm bg-white"
              title="Consulter"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-brand border border-transparent hover:border-slate-100 transition-all cursor-pointer shadow-sm bg-white"
              title="Modifier"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {onValidate && (
            <button 
              onClick={(e) => { e.stopPropagation(); onValidate(); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-emerald-400 hover:bg-emerald-50 hover:shadow-sm hover:text-emerald-600 border border-transparent transition-all cursor-pointer shadow-sm bg-white" 
              title="Valider"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-rose-500 border border-transparent hover:border-slate-100 transition-all cursor-pointer shadow-sm bg-white"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function TiersRow({ idx, code, label, phone, email, rattachement, onView, onEdit, onDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/80 cursor-pointer transition-colors group">
      <td className="py-4 px-4 text-center text-slate-300 font-mono text-[10px]">{idx}</td>
      <td className="py-4 px-4 font-mono font-bold text-slate-900 group-hover:text-brand">{code}</td>
      <td className="py-4 px-4 font-medium text-slate-700">{label}</td>
      <td className="py-4 px-4 font-mono font-bold text-[#4A9EC9]">{rattachement || ''}</td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <Phone className="w-3 h-3 text-slate-300" />
          {phone || ''}
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <Mail className="w-3 h-3 text-slate-300" />
          {email || ''}
        </div>
      </td>
      <td className="py-4 px-4 text-right">
        <div className="flex items-center justify-end gap-2 text-right">
          {onView && (
            <button 
              onClick={(e) => { e.stopPropagation(); onView(); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-purple-600 border border-transparent hover:border-slate-100 transition-all cursor-pointer shadow-sm bg-white"
              title="Consulter"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-brand border border-transparent hover:border-slate-100 transition-all cursor-pointer shadow-sm bg-white"
              title="Modifier"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-rose-500 border border-transparent hover:border-slate-100 transition-all cursor-pointer shadow-sm bg-white"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function SidebarLink({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-6 py-2.5 mx-2 rounded-xl text-sm font-medium transition-all relative group cursor-pointer",
        active 
          ? "bg-[#F0F9FF] text-[#4A9EC9] font-bold shadow-sm shadow-[#4A9EC9]/10 ring-1 ring-[#4A9EC9]/20" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <div className={cn(
        "w-1.5 h-6 absolute left-0 rounded-r-lg transition-all",
        active ? "bg-[#4A9EC9] scale-y-100" : "bg-transparent scale-y-0"
      )} />
      <Icon className={cn("w-4 h-4 shrink-0 transition-all", active ? "text-[#4A9EC9] scale-110" : "opacity-70 group-hover:opacity-100")} />
      {label}
    </button>
  );
}

function SidebarSection({ label, children, isOpen, onToggle }: any) {
  return (
    <div className="mt-6 mb-2">
      <button 
        onClick={onToggle}
        className="flex items-center justify-between w-full px-6 py-2 group cursor-pointer"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-600 transition-colors">
          {label}
        </span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-slate-300 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>
      <div className={cn(
        "space-y-1 mt-1 transition-all duration-300 overflow-hidden",
        isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      )}>
        {children}
      </div>
    </div>
  );
}
