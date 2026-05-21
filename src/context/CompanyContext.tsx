import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from './AuthContext';

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

interface CompanyContextType {
  selectedDossier: Dossier | null;
  setSelectedDossier: (dossier: Dossier | null) => void;
  enterprises: Enterprise[];
  dossiers: Dossier[];
  loading: boolean;
  activeEnterprise: Enterprise | null;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { user, role, loading: authLoading } = useAuth();
  
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);
  
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);

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
      activeEnterprise
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
