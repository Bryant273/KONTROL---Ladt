import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { getSystemChartTemplate, getSystemChartID } from '../data/charts';

export interface Enterprise {
  id: string;
  name: string;
  acronym?: string;
  industry?: string;
  ncc?: string;
  cnps?: string;
  address?: string;
  logo?: string;
  contact?: string;
  email?: string;
  ownerId: string;
  subscription?: {
    type: 'demo' | 'free' | 'standard' | 'pro';
    startDate: string;
    trialEndsAt: string;
  };
}

export interface Dossier {
  id: string;
  enterpriseId: string;
  filename: string;
  exercise: string;
  period?: {
    start: string;
    end: string;
  };
  accountingConfig?: {
    accountLength: number;
    thirdPartyLength: number;
    analyticalLength: number;
    economicZone: string;
    accountingLaw: string;
    country: string;
    chartOfAccountsType: string;
  };
  initialBalanceType?: 'manual' | 'import' | 'scratch';
  ownerId: string;
  status: 'open' | 'closed';
  createdAt: string;
}

export interface DuplicatedAccount {
  id: string;
  num: string;
  label: string;
  classe: string;
}

export interface DuplicatedTiers {
  id: string;
  code: string;
  label: string;
  phone: string;
  email: string;
  type: 'FRN' | 'CLI' | 'PRT';
  rattachement?: string;
}

export interface CustomJournal {
  id: string;
  code: string;
  label: string;
  type: string; // 'Achats' | 'Ventes' | 'Trésorerie' | 'Général'
  account: string; // e.g., '521100' or '—'
  status: 'Actif' | 'Inactif';
}

export interface JournalEntryLine {
  id: string | number;
  account: string;
  tiers?: string;
  label: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  numSaisie: string;
  journal: string; // e.g. 'ACH'
  dateSaisie: string;
  dateOperation: string;
  piece: string;
  libelle: string;
  lines: JournalEntryLine[];
}

interface CompanyContextType {
  selectedDossier: Dossier | null;
  setSelectedDossier: (dossier: Dossier | null) => void;
  enterprises: Enterprise[];
  dossiers: Dossier[];
  loading: boolean;
  activeEnterprise: Enterprise | null;
  
  // Duplicated / Custom Chart of Accounts Properties
  systemChartId: string | null;
  duplicatedChartId: string | null;
  accounts: DuplicatedAccount[];
  thirdParties: DuplicatedTiers[];
  
  // Custom mutations to persist per enterprise/dossier
  addAccount: (num: string, label: string, classe: string) => void;
  updateAccount: (id: string, num: string, label: string, classe: string) => void;
  deleteAccount: (id: string) => void;
  addTiers: (tiers: Omit<DuplicatedTiers, 'id'>) => void;
  updateTiers: (id: string, tiers: Partial<Omit<DuplicatedTiers, 'id'>>) => void;
  deleteTiers: (id: string) => void;

  // Dynamic Journals & Saisie Entries
  journals: CustomJournal[];
  entries: JournalEntry[];
  addJournal: (code: string, label: string, type: string, account?: string) => void;
  deleteJournal: (id: string) => void;
  updateJournal: (id: string, journal: Partial<Omit<CustomJournal, 'id'>>) => void;
  addEntry: (entry: Omit<JournalEntry, 'id' | 'numSaisie'>) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, entry: Partial<JournalEntry>) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { user, role, loading: authLoading } = useAuth();
  
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);
  
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);

  // States for isolated, growable company chart of accounts
  const [systemChartId, setSystemChartId] = useState<string | null>(null);
  const [duplicatedChartId, setDuplicatedChartId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<DuplicatedAccount[]>([]);
  const [thirdParties, setThirdParties] = useState<DuplicatedTiers[]>([]);

  // States for journals and accounting entries
  const [journals, setJournals] = useState<CustomJournal[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  // Keep duplicated accounts & third-parties in sync with active dossier
  useEffect(() => {
    if (!selectedDossier) {
      setSystemChartId(null);
      setDuplicatedChartId(null);
      setAccounts([]);
      setThirdParties([]);
      setJournals([]);
      setEntries([]);
      return;
    }

    const sysId = getSystemChartID(selectedDossier.accountingConfig?.accountingLaw || '');
    const dupId = `dup-coa-${selectedDossier.id}`;
    
    setSystemChartId(sysId);
    setDuplicatedChartId(dupId);

    // Initial load for accounts - load custom or duplicate standard template
    const localStoreAccounts = localStorage.getItem(dupId);
    let loadedAccounts: DuplicatedAccount[] = [];
    
    const template = getSystemChartTemplate(selectedDossier.accountingConfig?.accountingLaw || '');
    const rawLen = selectedDossier.accountingConfig?.accountLength || 8;
    const len = Math.max(8, Math.min(14, rawLen));
    const templateAccounts: DuplicatedAccount[] = template.map((acc, index) => {
      const clean = acc.num.replace(/\s/g, '');
      const paddedNum = clean.length < len ? clean.padEnd(len, '0') : clean.substring(0, len);
      return {
        id: `${selectedDossier.id}-acc-${paddedNum}-${index}`,
        num: paddedNum,
        label: acc.label,
        classe: acc.classe
      };
    });

    if (localStoreAccounts) {
      const existingAccounts: DuplicatedAccount[] = JSON.parse(localStoreAccounts);
      const existingNums = new Set(existingAccounts.map(a => a.num));
      const missingFromTemplate = templateAccounts.filter(ta => !existingNums.has(ta.num));
      
      if (missingFromTemplate.length > 0) {
        loadedAccounts = [...existingAccounts, ...missingFromTemplate].sort((a, b) => a.num.localeCompare(b.num));
        localStorage.setItem(dupId, JSON.stringify(loadedAccounts));
      } else {
        loadedAccounts = existingAccounts;
      }
    } else {
      loadedAccounts = templateAccounts;
      localStorage.setItem(dupId, JSON.stringify(loadedAccounts));
    }
    setAccounts(loadedAccounts);

    // Initial load for third parties
    const tiersKey = `tiers-${selectedDossier.id}`;
    const localStoreTiers = localStorage.getItem(tiersKey);
    if (localStoreTiers) {
      setThirdParties(JSON.parse(localStoreTiers));
    } else {
      const defaultTiers: DuplicatedTiers[] = [
        { id: `${selectedDossier.id}-tp-1`, code: '4011-SOC', label: 'SOCIX SARL', phone: '+225 07 07 20 20', email: 'contact@socix.ci', type: 'FRN', rattachement: '401100' },
        { id: `${selectedDossier.id}-tp-2`, code: '4011-MTN', label: "MTN COTE D'IVOIRE", phone: '+225 05 05 10 10', email: 'billing@mtn.ci', type: 'FRN', rattachement: '401100' },
        { id: `${selectedDossier.id}-tp-3`, code: '4111-AXA', label: 'AXA ASSURANCES', phone: '+225 01 01 30 30', email: 'clients@axa.ci', type: 'CLI', rattachement: '411100' },
        { id: `${selectedDossier.id}-tp-4`, code: '4111-BICI', label: 'BICICI PLATEAU', phone: '+225 27 20 20 20', email: 'service@bicici.ci', type: 'CLI', rattachement: '411100' },
      ];
      localStorage.setItem(tiersKey, JSON.stringify(defaultTiers));
      setThirdParties(defaultTiers);
    }

    // Initial load for journals
    const journalsKey = `journals-${selectedDossier.id}`;
    const localStoreJournals = localStorage.getItem(journalsKey);
    if (localStoreJournals) {
      setJournals(JSON.parse(localStoreJournals));
    } else {
      const defaultJournals: CustomJournal[] = [
        { id: `${selectedDossier.id}-jrn-ach`, code: 'ACH', label: 'Journal des achats', type: 'Achats', account: '—', status: 'Actif' },
        { id: `${selectedDossier.id}-jrn-vte`, code: 'VTE', label: 'Journal des ventes', type: 'Ventes', account: '—', status: 'Actif' },
        { id: `${selectedDossier.id}-jrn-bq`, code: 'BQ', label: 'Journal de banque', type: 'Trésorerie', account: '521100', status: 'Actif' },
        { id: `${selectedDossier.id}-jrn-od`, code: 'OD', label: 'Opérations diverses', type: 'Général', account: '—', status: 'Actif' },
      ];
      localStorage.setItem(journalsKey, JSON.stringify(defaultJournals));
      setJournals(defaultJournals);
    }

    // Initial load for entries
    const entriesKey = `entries-${selectedDossier.id}`;
    const localStoreEntries = localStorage.getItem(entriesKey);
    if (localStoreEntries) {
      setEntries(JSON.parse(localStoreEntries));
    } else {
      const defaultEntries: JournalEntry[] = [
        {
          id: `${selectedDossier.id}-ent-1`,
          numSaisie: 'S-0001',
          journal: 'ACH',
          dateSaisie: '16/05/2026',
          dateOperation: '16/05/2026',
          piece: 'FAC-SOCIX-01',
          libelle: 'Achat fournitures bureau',
          lines: [
            { id: 1, account: '601100', tiers: '4011-SOC', label: 'Achat fournitures de bureau', debit: 45000, credit: 0 },
            { id: 2, account: '401100', tiers: '4011-SOC', label: 'Facture SOCIX SARL', debit: 0, credit: 45000 }
          ]
        },
        {
          id: `${selectedDossier.id}-ent-2`,
          numSaisie: 'S-0002',
          journal: 'VTE',
          dateSaisie: '15/05/2026',
          dateOperation: '15/05/2026',
          piece: 'FAC-BICI-02',
          libelle: 'Vente licences',
          lines: [
            { id: 1, account: '411100', tiers: '4111-BICI', label: 'Facture BICICI PLATEAU', debit: 150000, credit: 0 },
            { id: 2, account: '701100', tiers: '4111-BICI', label: 'Prestation de services licences', debit: 0, credit: 150000 }
          ]
        },
        {
          id: `${selectedDossier.id}-ent-3`,
          numSaisie: 'S-0003',
          journal: 'BQ',
          dateSaisie: '15/05/2026',
          dateOperation: '15/05/2026',
          piece: 'BQ-092',
          libelle: 'Versement espèces',
          lines: [
            { id: 1, account: '521100', tiers: '', label: 'Versement en banque', debit: 25000, credit: 0 },
            { id: 2, account: '571100', tiers: '', label: 'Retrait caisse principale', debit: 0, credit: 25000 }
          ]
        }
      ];
      localStorage.setItem(entriesKey, JSON.stringify(defaultEntries));
      setEntries(defaultEntries);
    }
  }, [selectedDossier]);

  const addAccount = (num: string, label: string, classe: string) => {
    if (!selectedDossier || !duplicatedChartId) return;
    const rawLen = selectedDossier.accountingConfig?.accountLength || 8;
    const len = Math.max(8, Math.min(14, rawLen));
    const cleanNum = num.replace(/\s/g, '');
    const formattedNum = cleanNum.length < len ? cleanNum.padEnd(len, '0') : cleanNum.substring(0, len);

    const newAccount: DuplicatedAccount = {
      id: `${selectedDossier.id}-acc-${formattedNum}-${Date.now()}`,
      num: formattedNum,
      label,
      classe
    };
    const updated = [...accounts, newAccount].sort((a, b) => a.num.localeCompare(b.num));
    setAccounts(updated);
    localStorage.setItem(duplicatedChartId, JSON.stringify(updated));
  };

  const updateAccount = (id: string, num: string, label: string, classe: string) => {
    if (!selectedDossier || !duplicatedChartId) return;
    const rawLen = selectedDossier.accountingConfig?.accountLength || 8;
    const len = Math.max(8, Math.min(14, rawLen));
    const cleanNum = num.replace(/\s/g, '');
    const formattedNum = cleanNum.length < len ? cleanNum.padEnd(len, '0') : cleanNum.substring(0, len);

    const updated = accounts.map(a => a.id === id ? { ...a, num: formattedNum, label, classe } : a).sort((a, b) => a.num.localeCompare(b.num));
    setAccounts(updated);
    localStorage.setItem(duplicatedChartId, JSON.stringify(updated));
  };

  const deleteAccount = (id: string) => {
    if (!selectedDossier || !duplicatedChartId) return;
    const updated = accounts.filter(a => a.id !== id);
    setAccounts(updated);
    localStorage.setItem(duplicatedChartId, JSON.stringify(updated));
  };

  const addTiers = (tiers: Omit<DuplicatedTiers, 'id'>) => {
    if (!selectedDossier) return;
    const tiersKey = `tiers-${selectedDossier.id}`;
    const newTiersItem: DuplicatedTiers = {
      ...tiers,
      id: `${selectedDossier.id}-tp-${tiers.code}-${Date.now()}`
    };
    const updated = [...thirdParties, newTiersItem];
    setThirdParties(updated);
    localStorage.setItem(tiersKey, JSON.stringify(updated));
  };

  const updateTiers = (id: string, updatedData: Partial<Omit<DuplicatedTiers, 'id'>>) => {
    if (!selectedDossier) return;
    const tiersKey = `tiers-${selectedDossier.id}`;
    const updated = thirdParties.map(t => t.id === id ? { ...t, ...updatedData } : t);
    setThirdParties(updated);
    localStorage.setItem(tiersKey, JSON.stringify(updated));
  };

  const deleteTiers = (id: string) => {
    if (!selectedDossier) return;
    const tiersKey = `tiers-${selectedDossier.id}`;
    const updated = thirdParties.filter(t => t.id !== id);
    setThirdParties(updated);
    localStorage.setItem(tiersKey, JSON.stringify(updated));
  };

  // Journal Mutations
  const addJournal = (code: string, label: string, type: string, account?: string) => {
    if (!selectedDossier) return;
    const journalsKey = `journals-${selectedDossier.id}`;
    const newJournal: CustomJournal = {
      id: `${selectedDossier.id}-jrn-${code}-${Date.now()}`,
      code: code.toUpperCase(),
      label,
      type,
      account: account || '—',
      status: 'Actif'
    };
    const updated = [...journals, newJournal];
    setJournals(updated);
    localStorage.setItem(journalsKey, JSON.stringify(updated));
  };

  const deleteJournal = (id: string) => {
    if (!selectedDossier) return;
    const journalsKey = `journals-${selectedDossier.id}`;
    const updated = journals.filter(j => j.id !== id);
    setJournals(updated);
    localStorage.setItem(journalsKey, JSON.stringify(updated));
  };

  const updateJournal = (id: string, updatedData: Partial<Omit<CustomJournal, 'id'>>) => {
    if (!selectedDossier) return;
    const journalsKey = `journals-${selectedDossier.id}`;
    const updated = journals.map(j => j.id === id ? { ...j, ...updatedData } : j);
    setJournals(updated);
    localStorage.setItem(journalsKey, JSON.stringify(updated));
  };

  // Saisie Entry Mutations
  const addEntry = (entry: Omit<JournalEntry, 'id' | 'numSaisie'>) => {
    if (!selectedDossier) return;
    const entriesKey = `entries-${selectedDossier.id}`;
    
    // Generate sequential number composed of Journal + Year + 5-digit sequence (e.g., ACH-2026-00001)
    const entryYear = entry.dateOperation ? entry.dateOperation.substring(0, 4) : new Date().getFullYear().toString();
    const journalMatches = entries.filter(e => e.journal === entry.journal && e.dateOperation.startsWith(entryYear));
    const nextSeq = journalMatches.length + 1;
    const seqStr = nextSeq.toString().padStart(5, '0');
    const numSaisie = `${entry.journal || 'G'}-${entryYear}-${seqStr}`;

    const newEntryItem: JournalEntry = {
      ...entry,
      id: `${selectedDossier.id}-ent-${Date.now()}`,
      numSaisie
    };

    const updated = [newEntryItem, ...entries];
    setEntries(updated);
    localStorage.setItem(entriesKey, JSON.stringify(updated));
  };

  const deleteEntry = (id: string) => {
    if (!selectedDossier) return;
    const entriesKey = `entries-${selectedDossier.id}`;
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem(entriesKey, JSON.stringify(updated));
  };

  const updateEntry = (id: string, entryUpdates: Partial<JournalEntry>) => {
    if (!selectedDossier) return;
    const entriesKey = `entries-${selectedDossier.id}`;
    const updated = entries.map(e => e.id === id ? { ...e, ...entryUpdates } : e);
    setEntries(updated);
    localStorage.setItem(entriesKey, JSON.stringify(updated));
  };

  // Auto-select active enterprise (the first one for now)
  const activeEnterprise = enterprises.length > 0 ? enterprises[0] : null;

  useEffect(() => {
    if (!user || authLoading) {
      if (!authLoading && !user) {
        setEnterprises([]);
        setDossiers([]);
        setSelectedDossier(null);
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    
    // Listen to Enterprises
    const entPath = 'enterprises';
    const entQ = role === 'SYSTEM_ADMIN' 
      ? query(collection(db, entPath))
      : query(collection(db, entPath), where('ownerId', '==', user.uid));

    const unsubEnt = onSnapshot(entQ, (snapshot) => {
      console.log(`[Quantum Engine] Enterprises sync: ${snapshot.size} docs`);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Enterprise[];
      setEnterprises(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, entPath, false);
      // Fallback: if dossiers fires but not this, we still want to stop loading
      setLoading(prev => prev && dossiers.length === 0 ? true : false);
    });

    // Listen to Dossiers
    const dosPath = 'dossiers';
    const dosQ = role === 'SYSTEM_ADMIN'
      ? query(collection(db, dosPath))
      : query(collection(db, dosPath), where('ownerId', '==', user.uid));

    const unsubDos = onSnapshot(dosQ, (snapshot) => {
      console.log(`[Quantum Engine] Dossiers sync: ${snapshot.size} docs`);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Dossier[];
      setDossiers(list);
      setLoading(false);
    }, (err) => {
      console.error("[Quantum Engine] Dossiers sync error:", err);
      handleFirestoreError(err, OperationType.LIST, dosPath, false);
      setLoading(false);
    });

    // Safety timeout: stop loading after 5 seconds no matter what
    const timeout = setTimeout(() => {
      setLoading((current) => {
        if (current) {
          console.warn("[Quantum Engine] Data sync timed out. Releasing UI lock.");
          return false;
        }
        return false;
      });
    }, 5000);

    return () => {
      clearTimeout(timeout);
      unsubEnt();
      unsubDos();
    };
  }, [user, role]);

  return (
    <CompanyContext.Provider value={{ 
      selectedDossier, 
      setSelectedDossier, 
      enterprises, 
      dossiers, 
      loading,
      activeEnterprise,
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
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}
