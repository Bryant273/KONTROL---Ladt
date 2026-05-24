import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany, Enterprise, Dossier } from '../context/CompanyContext';
import { useAuth } from '../context/AuthContext';
import { handleFirestoreError, OperationType, db } from '../lib/firebase';
import { Button } from '../components/ui/Button';
import { 
  Building2, 
  Settings, 
  PieChart, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Upload,
  Globe,
  Hash,
  Mail,
  Phone,
  MapPin,
  Lock,
  Users,
  Layers,
  ChevronDown,
  Receipt,
  Plus,
  Trash2,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { cn } from '../lib/utils';
import { Logo } from '../components/ui/Logo';
import { parseImportFile, ImportedAccount } from '../lib/importUtils';
import { ECONOMIC_ZONES, SECTORS, CURRENCIES, LEGAL_FORMS, TAX_REGIMES, EconomicZone, Country } from '../data/setupData';

type SetupStep = 'INFO' | 'CONFIG' | 'BALANCE' | 'PERIOD' | 'RECAP';

export default function DossierSetup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeEnterprise, setSelectedDossier } = useCompany();
  const [step, setStep] = useState<SetupStep>(activeEnterprise ? 'CONFIG' : 'INFO');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Enterprise Info (Step 1)
    enterprise: {
      name: activeEnterprise?.name || '',
      acronym: activeEnterprise?.acronym || '',
      description: activeEnterprise?.description || '',
      industry: activeEnterprise?.industry || '',
      industryOther: '',
      ncc: activeEnterprise?.ncc || '',
      cnps: activeEnterprise?.cnps || '',
      rccm: activeEnterprise?.rccm || '',
      legalForm: activeEnterprise?.legalForm || '',
      taxRegime: activeEnterprise?.taxRegime || '',
      website: activeEnterprise?.website || '',
      email: activeEnterprise?.email || '',
      contact: activeEnterprise?.contact || '',
      address: activeEnterprise?.address || '',
      logo: activeEnterprise?.logo || ''
    },
    // Accounting Config (Step 2)
    config: {
      accountLength: 8,
      thirdPartyLength: 8,
      analyticalLength: 8,
      economicZone: 'UEMOA',
      accountingLaw: 'SYSCOHADA Révisé',
      country: 'Côte d\'Ivoire',
      currency: 'FCFA',
      chartOfAccountsType: 'Standard'
    },
    // Initial Balance (Step 3)
    balance: {
      type: 'scratch' as 'manual' | 'import' | 'scratch',
      periodStart: new Date().getFullYear(),
      actif: [
        { account: '21', label: 'Immobilisations Incorporelles', amount: 0 },
        { account: '24', label: 'Immobilisations Corporelles', amount: 0 },
        { account: '27', label: 'Immobilisations Financières', amount: 0 },
        { account: '31', label: 'Sstocks de Marchandises', amount: 0 },
        { account: '41', label: 'Clients et Comptes Rattachés', amount: 0 },
        { account: '52', label: 'Banques', amount: 0 },
        { account: '57', label: 'Caisse', amount: 0 }
      ],
      passif: [
        { account: '10', label: 'Capital Social', amount: 0 },
        { account: '11', label: 'Réserves', amount: 0 },
        { account: '13', label: 'Résultat de l\'Exercice', amount: 0 },
        { account: '16', label: 'Emprunts et Dettes Financières', amount: 0 },
        { account: '40', label: 'Fournisseurs et Comptes Rattachés', amount: 0 },
        { account: '42', label: 'Personnel', amount: 0 },
        { account: '44', label: 'État et Collectivités Publiques', amount: 0 }
      ]
    },
    // Fiscal Period (Step 4)
    exercise: (new Date().getFullYear() + 1).toString(),
    periodStart: `${new Date().getFullYear() + 1}-01-01`,
    periodEnd: `${new Date().getFullYear() + 1}-12-31`
  });

  const nextStep = () => {
    if (step === 'INFO' && (!formData.enterprise.acronym || !formData.enterprise.name)) {
      alert('La raison sociale et le sigle sont obligatoires.');
      return;
    }
    
    if (step === 'BALANCE' && formData.balance.type === 'manual') {
      const totalActif = formData.balance.actif.reduce((sum, item) => sum + item.amount, 0);
      const totalPassif = formData.balance.passif.reduce((sum, item) => sum + item.amount, 0);
      if (Math.abs(totalActif - totalPassif) > 0.01) {
        alert('Déséquilibre détecté. Le total Actif doit être égal au total Passif.');
        return;
      }
    }

    if (step === 'PERIOD') {
      const start = new Date(formData.periodStart);
      const end = new Date(formData.periodEnd);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44);
      
      if (diffMonths > 18) {
        alert('La durée de l\'exercice comptable ne peut excéder 18 mois.');
        return;
      }
      if (start >= end) {
        alert('La date de début doit être antérieure à la date de fin.');
        return;
      }
    }

    const order: SetupStep[] = ['INFO', 'CONFIG', 'BALANCE', 'PERIOD', 'RECAP'];
    const currIdx = order.indexOf(step);
    if (currIdx < order.length - 1) setStep(order[currIdx + 1]);
  };

  const prevStep = () => {
    const order: SetupStep[] = ['INFO', 'CONFIG', 'BALANCE', 'PERIOD', 'RECAP'];
    const currIdx = order.indexOf(step);
    if (currIdx > 0) setStep(order[currIdx - 1]);
  };

  const handleFinish = async () => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      let entId = activeEnterprise?.id;

      // 1. Create or Update Enterprise if it's the first dossier or we edited the info
      if (!entId) {
        const entRef = await addDoc(collection(db, 'enterprises'), {
          ...formData.enterprise,
          ownerId: user.uid,
          createdAt: new Date().toISOString(),
          subscription: {
            type: 'demo',
            startDate: new Date().toISOString(),
            trialEndsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
          }
        });
        entId = entRef.id;
      }

      // 2. Create Dossier
      const filename = `GEST-${formData.enterprise.acronym || 'ENT'}-${formData.exercise}`;
      const dossierRef = await addDoc(collection(db, 'dossiers'), {
        enterpriseId: entId,
        filename,
        exercise: formData.exercise,
        periodStart: formData.periodStart,
        periodEnd: formData.periodEnd,
        ownerId: user.uid,
        status: 'open',
        createdAt: new Date().toISOString(),
        accountingConfig: formData.config,
        initialBalance: formData.balance
      });

      const newDossier: Dossier = {
          id: dossierRef.id,
          enterpriseId: entId as string,
          filename,
          exercise: formData.exercise,
          ownerId: user.uid,
          status: 'open',
          createdAt: new Date().toISOString()
      };

      setSelectedDossier(newDossier);
      navigate('/app');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'setup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'INFO':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Logo Selection UI */}
              <div className="shrink-0 flex flex-col items-center gap-4">
                 <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-center relative group overflow-hidden transition-all hover:border-brand/40">
                    {formData.enterprise.logo ? (
                      <img src={formData.enterprise.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300 mb-2 group-hover:text-brand transition-colors">
                           <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-300 px-4">Importer Logo</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, enterprise: { ...formData.enterprise, logo: reader.result as string } });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {formData.enterprise.logo && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData({ ...formData, enterprise: { ...formData.enterprise, logo: '' } });
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                 </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 italic">Raison Sociale</label>
                    <input 
                      value={formData.enterprise.name}
                      onChange={e => setFormData({ ...formData, enterprise: { ...formData.enterprise, name: e.target.value } })}
                      className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 focus:outline-none focus:border-brand font-bold text-sm"
                      placeholder="Nom de l'entité"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 italic">Sigle Officiel</label>
                    <input 
                      value={formData.enterprise.acronym}
                      onChange={e => setFormData({ ...formData, enterprise: { ...formData.enterprise, acronym: e.target.value.toUpperCase() } })}
                      className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 focus:outline-none focus:border-brand font-black text-brand tracking-widest uppercase text-sm"
                      placeholder="E.g. UNK-CI"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 italic">Email Corporate</label>
                    <input 
                      type="email"
                      value={formData.enterprise.email}
                      onChange={e => setFormData({ ...formData, enterprise: { ...formData.enterprise, email: e.target.value } })}
                      className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 focus:outline-none focus:border-brand font-bold text-sm"
                      placeholder="admin@enterprise.com"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 italic">Contact Tél.</label>
                    <input 
                      value={formData.enterprise.contact}
                      onChange={e => setFormData({ ...formData, enterprise: { ...formData.enterprise, contact: e.target.value } })}
                      className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 focus:outline-none focus:border-brand font-bold text-sm"
                      placeholder="+225 07..."
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 italic">Secteur Principal</label>
                    <select 
                      value={formData.enterprise.industry}
                      onChange={e => setFormData({ ...formData, enterprise: { ...formData.enterprise, industry: e.target.value } })}
                      className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 font-bold text-xs appearance-none"
                    >
                      <option value="">-- Choisir --</option>
                      {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 italic">Description Activité</label>
                   <textarea 
                     value={formData.enterprise.description}
                     onChange={e => setFormData({ ...formData, enterprise: { ...formData.enterprise, description: e.target.value } })}
                     className="w-full h-20 bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:outline-none focus:border-brand font-medium text-xs leading-relaxed resize-none"
                     placeholder="Décrivez brièvement les activités de votre organisation..."
                   />
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 italic">N° Fiscal (NCC)</label>
                      <input 
                        value={formData.enterprise.ncc}
                        onChange={e => setFormData({ ...formData, enterprise: { ...formData.enterprise, ncc: e.target.value } })}
                        className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 focus:outline-none focus:border-brand font-bold text-sm"
                        placeholder="N° Contribuable"
                      />
                   </div>
                   <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 italic">N° CNPS</label>
                      <input 
                        value={formData.enterprise.cnps}
                        onChange={e => setFormData({ ...formData, enterprise: { ...formData.enterprise, cnps: e.target.value } })}
                        className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 focus:outline-none focus:border-brand font-bold text-sm"
                        placeholder="Code Employeur CNPS"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 italic">N° RCCM</label>
                      <input 
                        value={formData.enterprise.rccm}
                        onChange={e => setFormData({ ...formData, enterprise: { ...formData.enterprise, rccm: e.target.value } })}
                        className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 focus:outline-none focus:border-brand font-bold text-sm"
                        placeholder="Registre Commerce"
                      />
                   </div>
                   <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 italic">Forme Juridique</label>
                      <select 
                        value={formData.enterprise.legalForm}
                        onChange={e => setFormData({ ...formData, enterprise: { ...formData.enterprise, legalForm: e.target.value } })}
                        className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 font-bold text-xs appearance-none"
                      >
                        <option value="">-- Choisir --</option>
                        {LEGAL_FORMS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 italic">Régime Fiscal</label>
                      <select 
                        value={formData.enterprise.taxRegime}
                        onChange={e => setFormData({ ...formData, enterprise: { ...formData.enterprise, taxRegime: e.target.value } })}
                        className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 font-bold text-xs appearance-none"
                      >
                        <option value="">-- Régime --</option>
                        {TAX_REGIMES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                   </div>
                   <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 italic">Site Web (Optionnel)</label>
                      <input 
                        value={formData.enterprise.website}
                        onChange={e => setFormData({ ...formData, enterprise: { ...formData.enterprise, website: e.target.value } })}
                        className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 focus:outline-none focus:border-brand font-bold text-sm"
                        placeholder="https://www.exemple.com"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                   <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 italic">Adresse Logistique (Siège)</label>
                      <input 
                        value={formData.enterprise.address}
                        onChange={e => setFormData({ ...formData, enterprise: { ...formData.enterprise, address: e.target.value } })}
                        className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 focus:outline-none focus:border-brand font-bold text-sm"
                        placeholder="Siège, Ville, Pays"
                      />
                   </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'CONFIG':
        const currentZone = ECONOMIC_ZONES.find(z => z.id === formData.config.economicZone);
        
        return (
          <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { k: 'accountLength', l: 'Généraux', icon: Hash },
                  { k: 'thirdPartyLength', l: 'Tiers', icon: Users },
                  { k: 'analyticalLength', l: 'Analytique', icon: Layers }
                ].map(item => (
                  <div key={item.k}>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 block text-center italic">Digits {item.l}</label>
                    <div className="flex items-center justify-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                       <button 
                        onClick={() => {
                          const minVal = item.k === 'accountLength' ? 8 : 4;
                          setFormData({ ...formData, config: { ...formData.config, [item.k]: Math.max(minVal, (formData.config[item.k as keyof typeof formData.config] as number) - 1) } });
                        }}
                        className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center font-black text-slate-900 border border-slate-100 hover:bg-slate-50"
                       >-</button>
                       <span className="text-xl font-black text-slate-900 tabular-nums">{formData.config[item.k as keyof typeof formData.config]}</span>
                       <button 
                        onClick={() => {
                          const maxVal = item.k === 'accountLength' ? 14 : 12;
                          setFormData({ ...formData, config: { ...formData.config, [item.k]: Math.min(maxVal, (formData.config[item.k as keyof typeof formData.config] as number) + 1) } });
                        }}
                        className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center font-black text-slate-900 border border-slate-100 hover:bg-slate-50"
                       >+</button>
                    </div>
                  </div>
                ))}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                   <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 italic">Zone Économique</label>
                      <select 
                        value={formData.config.economicZone}
                        onChange={e => {
                          const zoneId = e.target.value;
                          const zone = ECONOMIC_ZONES.find(z => z.id === zoneId);
                          if (zone && zone.countries.length > 0) {
                            const firstCountry = zone.countries[0];
                            setFormData({ 
                              ...formData, 
                              config: { 
                                ...formData.config, 
                                economicZone: zoneId,
                                country: firstCountry.name,
                                accountingLaw: firstCountry.accountingPlan,
                                currency: firstCountry.currency
                              } 
                            });
                          }
                        }}
                        className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 font-black text-[11px] appearance-none"
                      >
                        {ECONOMIC_ZONES.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                      </select>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 italic">Pays Résidant</label>
                        <select 
                          value={formData.config.country}
                          onChange={e => {
                            const countryName = e.target.value;
                            const country = currentZone?.countries.find(c => c.name === countryName);
                            if (country) {
                              setFormData({ 
                                ...formData, 
                                config: { 
                                  ...formData.config, 
                                  country: countryName,
                                  accountingLaw: country.accountingPlan,
                                  currency: country.currency
                                } 
                              });
                            }
                          }}
                          className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 font-bold text-xs"
                        >
                          {currentZone?.countries.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 italic">Devise</label>
                        <select 
                          value={formData.config.currency}
                          onChange={e => setFormData({ ...formData, config: { ...formData.config, currency: e.target.value } })}
                          className="w-full h-11 bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 font-black text-brand text-xs appearance-none"
                        >
                          {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                   </div>
                   <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 italic">Référentiel Comptable</label>
                      <div className="h-11 bg-emerald-50/30 border border-emerald-100 rounded-xl px-4 flex items-center font-black text-emerald-600 text-[10px] uppercase tracking-wider">
                        {formData.config.accountingLaw}
                      </div>
                   </div>
                </div>
                
                <div 
                   onClick={() => document.getElementById('coa-import')?.click()}
                   className="p-6 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30 flex flex-col items-center justify-center text-center group hover:border-brand/40 hover:bg-white transition-all cursor-pointer relative"
                >
                   <input 
                      id="coa-import"
                      type="file"
                      className="hidden"
                      accept=".ukp,.xls,.xlsx,.csv"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const accounts = await parseImportFile(file);
                            setFormData({ ...formData, config: { ...formData.config, chartOfAccountsType: `Importé (${accounts.length} comptes)` } });
                            alert(`${accounts.length} comptes importés avec succès.`);
                          } catch (err) {
                            alert('Erreur lors de l\'importation: ' + (err as Error).message);
                          }
                        }
                      }}
                   />
                   <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300 group-hover:text-brand mb-3">
                      <FileSpreadsheet className="w-5 h-5" />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900">Importation du Plan Master</p>
                   <p className="text-[8px] text-slate-300 font-bold uppercase mt-2 max-w-[150px] leading-relaxed">Pré-configurer via UKP, XLS ou CSV</p>
                   
                   {/* Tooltip implementation */}
                   <div className="absolute inset-0 bg-[#09090b]/95 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] flex flex-col items-center justify-center p-6 text-white">
                      <p className="text-[9px] font-black uppercase tracking-widest mb-3 text-brand">Formats supportés</p>
                      <div className="space-y-2 text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                         <p>• .UKP (Fichier Quantum Unikorp)</p>
                         <p>• .XLS / .CSV (Structure standard)</p>
                         <p className="pt-2 text-[7px] text-brand/50">Colonnes obligatoires: N° Compte, Intitulé</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );
      case 'BALANCE':
        const totalActif = formData.balance.actif.reduce((sum, item) => sum + item.amount, 0);
        const totalPassif = formData.balance.passif.reduce((sum, item) => sum + item.amount, 0);
        const balanceDiff = totalActif - totalPassif;

        return (
          <div className="space-y-10">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'scratch', title: 'Nouveau Départ', desc: 'Saisie vide', icon: Plus },
                  { id: 'manual', title: 'Bilan d\'Ouverture', desc: 'Saisie Actif/Passif', icon: Receipt },
                  { id: 'import', title: 'Import Balance', desc: '.ukp, .xls, .csv', icon: FileSpreadsheet },
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => setFormData({ ...formData, balance: { ...formData.balance, type: item.id as any } })}
                    className={cn(
                      "p-6 rounded-[2rem] border flex flex-col items-center text-center gap-4 transition-all",
                      formData.balance.type === item.id 
                        ? "bg-[#09090b] text-white border-transparent shadow-xl" 
                        : "bg-slate-50 border-slate-100 text-slate-900 hover:bg-white hover:border-brand"
                    )}
                  >
                     <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all", 
                       formData.balance.type === item.id ? "bg-brand text-white" : "bg-white text-slate-400"
                     )}>
                        <item.icon className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="font-black tracking-tight uppercase text-[10px] mb-1">{item.title}</h4>
                        <p className={cn("text-[8px] font-bold uppercase tracking-widest leading-relaxed", 
                          formData.balance.type === item.id ? "text-slate-500" : "text-slate-400"
                        )}>{item.desc}</p>
                     </div>
                  </button>
                ))}
             </div>
             
             {formData.balance.type === 'manual' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Actif */}
                    <div className="bg-slate-50 rounded-[2.5rem] p-6 space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Tableau Actif</h5>
                        <PieChart className="w-3 h-3 text-slate-300" />
                      </div>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                         {formData.balance.actif.map((item, idx) => (
                           <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-100 transition-all focus-within:ring-2 focus-within:ring-brand/10">
                             <span className="w-8 text-[9px] font-black text-brand text-center">{item.account}</span>
                             <span className="flex-1 text-[9px] font-bold uppercase text-slate-500 truncate">{item.label}</span>
                             <input 
                               type="number"
                               value={item.amount || ''}
                               onChange={e => {
                                 const val = e.target.value;
                                 if (val !== '' && isNaN(parseFloat(val))) return;
                                 const newVal = [...formData.balance.actif];
                                 newVal[idx].amount = parseFloat(val) || 0;
                                 setFormData({ ...formData, balance: { ...formData.balance, actif: newVal } });
                               }}
                               className="w-24 h-8 text-right font-black text-slate-900 focus:outline-none text-xs pr-2"
                               placeholder="0"
                             />
                           </div>
                         ))}
                      </div>
                      <div className="pt-3 border-t border-slate-200 flex justify-between items-center px-4">
                         <span className="text-[9px] font-black uppercase text-slate-400">Total Actif</span>
                         <span className="text-lg font-black text-slate-900 tabular-nums">{totalActif.toLocaleString()} {formData.config.currency}</span>
                      </div>
                    </div>

                    {/* Passif */}
                    <div className="bg-slate-50 rounded-[2.5rem] p-6 space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Tableau Passif</h5>
                        <PieChart className="w-3 h-3 text-slate-300 transform rotate-180" />
                      </div>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                         {formData.balance.passif.map((item, idx) => (
                           <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-100 transition-all focus-within:ring-2 focus-within:ring-brand/10">
                             <span className="w-8 text-[9px] font-black text-indigo-500 text-center">{item.account}</span>
                             <span className="flex-1 text-[9px] font-bold uppercase text-slate-500 truncate">{item.label}</span>
                             <input 
                               type="number"
                               value={item.amount || ''}
                               onChange={e => {
                                 const val = e.target.value;
                                 if (val !== '' && isNaN(parseFloat(val))) return;
                                 const newVal = [...formData.balance.passif];
                                 newVal[idx].amount = parseFloat(val) || 0;
                                 setFormData({ ...formData, balance: { ...formData.balance, passif: newVal } });
                               }}
                               className="w-24 h-8 text-right font-black text-slate-900 focus:outline-none text-xs pr-2"
                               placeholder="0"
                             />
                           </div>
                         ))}
                      </div>
                      <div className="pt-3 border-t border-slate-200 flex justify-between items-center px-4">
                         <span className="text-[9px] font-black uppercase text-slate-400">Total Passif</span>
                         <span className="text-lg font-black text-slate-900 tabular-nums">{totalPassif.toLocaleString()} {formData.config.currency}</span>
                      </div>
                    </div>
                  </div>

                  {/* Validator */}
                  <div className={cn(
                    "p-4 rounded-2xl flex items-center justify-between transition-all",
                    balanceDiff === 0 
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                      : "bg-rose-50 text-rose-500 border border-rose-100"
                  )}>
                     <div className="flex items-center gap-3">
                        {balanceDiff === 0 ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest">{balanceDiff === 0 ? 'Bilan Équilibré' : 'Bilan Déséquilibré'}</p>
                          <p className="text-[8px] font-bold opacity-70">Différence: {balanceDiff.toLocaleString()} {formData.config.currency}</p>
                        </div>
                     </div>
                  </div>
               </div>
             )}

             {formData.balance.type === 'import' && (
               <div className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center text-center animate-in zoom-in-95">
                  <input 
                    id="balance-import"
                    type="file"
                    className="hidden"
                    accept=".ukp,.xls,.xlsx,.csv"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const accounts = await parseImportFile(file);
                          // Separate into Actif (approx 1-3) and Passif (approx 1, 4-5) or just use standard logic
                          // For simplicity, we'll try to match by account number prefixes: 1-3 Actif, 1,4,5 Passif (SYSCOHADA)
                          const actif = accounts.filter(a => ['2', '3', '41', '5'].some(p => a.account.startsWith(p)));
                          const passif = accounts.filter(a => ['1', '16', '40', '42', '44'].some(p => a.account.startsWith(p)));
                          
                          setFormData({ 
                            ...formData, 
                            balance: { 
                              ...formData.balance, 
                              type: 'manual', // Switch to manual to show the results
                              actif: actif.map(a => ({ account: a.account, label: a.label, amount: a.amount || 0 })),
                              passif: passif.map(a => ({ account: a.account, label: a.label, amount: a.amount || 0 }))
                            } 
                          });
                        } catch (err) {
                          alert('Erreur lors de l\'importation: ' + (err as Error).message);
                        }
                      }
                    }}
                  />
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand mb-4">
                    <FileSpreadsheet className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 uppercase mb-2">Importation Intelligente</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest max-w-xs mb-6Leading-relaxed">Détection automatique des comptes et des soldes.</p>
                  <Button 
                    onClick={() => document.getElementById('balance-import')?.click()}
                    className="h-10 bg-[#09090b] text-white rounded-xl px-8 text-[9px] font-black uppercase tracking-widest"
                  >Parcourir fichiers</Button>
               </div>
             )}
          </div>
        );
      case 'PERIOD':
        const start = new Date(formData.periodStart);
        const end = new Date(formData.periodEnd);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
        
        return (
          <div className="flex flex-col items-center justify-center space-y-10 py-6">
             <div className="w-20 h-20 bg-brand/10 rounded-[2rem] flex items-center justify-center text-brand mb-2 ring-4 ring-brand/5">
                <Calendar className="w-10 h-10" />
             </div>
             <div className="text-center space-y-8 w-full max-w-lg px-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Exercice Comptable</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] max-w-xs mx-auto leading-relaxed">
                     Définissez les dates de début et de fin de l'exercice (Max 18 mois).
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Date de Début</label>
                      <input 
                        type="date"
                        value={formData.periodStart}
                        onChange={e => {
                          const date = e.target.value;
                          const year = date.split('-')[0];
                          setFormData({ 
                            ...formData, 
                            periodStart: date,
                            exercise: year // Auto-detect year
                          });
                        }}
                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 font-black text-xs text-slate-900 focus:border-brand transition-all"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Date de Fin</label>
                      <input 
                        type="date"
                        value={formData.periodEnd}
                        onChange={e => setFormData({ ...formData, periodEnd: e.target.value })}
                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 font-black text-xs text-slate-900 focus:border-brand transition-all"
                      />
                   </div>
                </div>

                <div className={cn(
                  "p-4 rounded-2xl flex items-center justify-between border-2 border-dashed",
                  diffMonths > 18 ? "bg-rose-50 border-rose-100 text-rose-500" : "bg-emerald-50 border-emerald-100 text-emerald-600"
                )}>
                   <div className="flex items-center gap-3">
                      {diffMonths > 18 ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span className="text-[10px] font-black uppercase tracking-widest">Durée de l'exercice : {diffMonths} Mois</span>
                   </div>
                   {diffMonths > 18 && (
                     <span className="text-[8px] font-bold uppercase underline">Trop long ({'>'}18m)</span>
                   )}
                </div>

                <div className="flex flex-col gap-4">
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Année Fiscale de référence</label>
                   <select
                     value={formData.exercise}
                     onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
                     className="w-full h-12 bg-white border border-slate-100 rounded-xl px-6 font-black text-sm text-slate-900 appearance-none text-center cursor-pointer hover:border-brand"
                   >
                     {Array.from({ length: 11 }, (_, i) => (new Date().getFullYear() - 5 + i).toString()).map(y => (
                       <option key={y} value={y}>{y}</option>
                     ))}
                   </select>
                   {formData.balance.type !== 'scratch' && (
                     <div className="flex items-center gap-2 justify-center py-2 animate-in fade-in zoom-in-95">
                        <AlertCircle className="w-3 h-3 text-brand" />
                        <p className="text-[8px] font-black text-brand uppercase tracking-widest">Ouverture conseillée : Exercice {formData.balance.periodStart + 1}</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );
      case 'RECAP':
        const actifFinal = formData.balance.actif.reduce((sum, item) => sum + item.amount, 0);
        const passifFinal = formData.balance.passif.reduce((sum, item) => sum + item.amount, 0);

        return (
          <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   {/* Enterprise Section */}
                   <div className="p-8 bg-[#09090b] rounded-[3rem] text-white relative overflow-hidden group shadow-xl">
                      <button 
                        onClick={() => setStep('INFO')}
                        className="absolute top-6 right-6 w-8 h-8 bg-white/10 hover:bg-brand rounded-full flex items-center justify-center transition-all group/edit z-20"
                      >
                         <Settings className="w-3.5 h-3.5 text-white" />
                         <span className="absolute right-10 whitespace-nowrap bg-brand text-[8px] font-black uppercase px-2 py-1 rounded opacity-0 group-hover/edit:opacity-100 transition-opacity">Modifier</span>
                      </button>
                      
                      <div className="flex items-center gap-4 mb-6 relative z-10">
                         <div className="w-14 h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center justify-center">
                            {formData.enterprise.logo ? (
                              <img src={formData.enterprise.logo} alt="L" className="w-full h-full object-contain" />
                            ) : (
                              <Logo iconClassName="text-white w-6 h-6" showText={false} />
                            )}
                         </div>
                         <div>
                            <p className="text-[8px] font-black text-brand uppercase tracking-[0.4em] mb-1">Identification</p>
                            <h4 className="text-xl font-black tracking-tighter uppercase truncate max-w-[200px]">{formData.enterprise.name}</h4>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[8px]">{formData.enterprise.acronym} • {formData.enterprise.industry}</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 relative z-10 pt-6 border-t border-white/5">
                         <div>
                            <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest italic">N° Fiscal (NCC)</p>
                            <p className="text-xs font-bold tracking-wider">{formData.enterprise.ncc || 'N/D'}</p>
                         </div>
                         <div>
                            <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest italic">N° CNPS</p>
                            <p className="text-xs font-bold tracking-wider">{formData.enterprise.cnps || 'N/D'}</p>
                         </div>
                         <div>
                            <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest italic">N° RCCM</p>
                            <p className="text-xs font-bold tracking-wider">{formData.enterprise.rccm || 'N/D'}</p>
                         </div>
                         <div>
                            <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest italic">Forme Juridique</p>
                            <p className="text-xs font-bold tracking-wider truncate">{formData.enterprise.legalForm || 'N/D'}</p>
                         </div>
                         <div className="col-span-2 mt-2 pt-2 border-t border-white/5 space-y-3">
                            <div className="flex justify-between items-center">
                               <div>
                                  <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest italic">Régime Fiscal</p>
                                  <p className="text-xs font-bold">{formData.enterprise.taxRegime || 'N/D'}</p>
                               </div>
                               <div className="text-right">
                                  <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest italic">Site Web</p>
                                  <p className="text-xs font-bold truncate max-w-[120px]">{formData.enterprise.website || 'N/D'}</p>
                               </div>
                            </div>
                            <div>
                               <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest italic">Siège Social & Contact</p>
                               <p className="text-xs font-bold truncate">{formData.enterprise.address || 'N/D'} • {formData.enterprise.email || 'N/D'} • {formData.enterprise.contact || 'N/D'}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   {/* Config Section */}
                   <div className="p-6 border border-slate-100 rounded-[2.5rem] bg-slate-50/30 relative group">
                      <button 
                        onClick={() => setStep('CONFIG')}
                        className="absolute top-4 right-4 w-6 h-6 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                      >
                         <Settings className="w-2.5 h-2.5" />
                      </button>
                      <div className="flex items-center gap-3 mb-6">
                         <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-900 border border-slate-50">
                            <Layers className="w-4 h-4" />
                         </div>
                         <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Configuration</h5>
                      </div>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                         {[
                           { label: 'Référentiel', value: formData.config.accountingLaw },
                           { label: 'Pays / Devise', value: `${formData.config.country} (${formData.config.currency})` },
                           { label: 'Structure ID', value: `G:${formData.config.accountLength} / T:${formData.config.thirdPartyLength}` },
                           { label: 'Comptabilité', value: formData.config.chartOfAccountsType }
                         ].map(item => (
                           <div key={item.label}>
                             <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                             <p className="text-[10px] font-bold text-slate-900">{item.value}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   {/* Period Section */}
                   <div className="p-6 border border-brand/10 rounded-[2.5rem] bg-brand/5 relative group">
                      <button 
                        onClick={() => setStep('PERIOD')}
                        className="absolute top-4 right-4 w-6 h-6 bg-brand/10 hover:bg-brand hover:text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 text-brand"
                      >
                         <Calendar className="w-2.5 h-2.5" />
                      </button>
                      <div className="flex items-center gap-3 mb-6">
                         <div className="w-8 h-8 bg-brand rounded-xl shadow-lg shadow-brand/20 flex items-center justify-center text-white">
                            <Calendar className="w-4 h-4" />
                         </div>
                         <h5 className="text-[10px] font-black uppercase tracking-widest text-brand">Période Fiscale</h5>
                      </div>
                      <div className="flex items-end justify-between">
                         <div className="space-y-1">
                            <p className="text-[7px] font-black text-brand-dark/40 uppercase tracking-widest">Exercice de référence</p>
                            <span className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">{formData.exercise}</span>
                         </div>
                         <div className="text-right">
                            <p className="text-[7px] font-black text-brand-dark/40 uppercase tracking-widest">Du {new Date(formData.periodStart).toLocaleDateString()}</p>
                            <p className="text-[7px] font-black text-brand-dark/40 uppercase tracking-widest">Au {new Date(formData.periodEnd).toLocaleDateString()}</p>
                         </div>
                      </div>
                   </div>

                   {/* Balance Section */}
                   <div className={cn(
                     "p-8 rounded-[3rem] text-center transition-all border-2 border-dashed relative group",
                     actifFinal === passifFinal && actifFinal > 0
                        ? "bg-slate-50 border-emerald-200"
                        : actifFinal === 0 
                          ? "bg-slate-50 border-slate-100"
                          : "bg-rose-50 border-rose-100"
                   )}>
                      <button 
                        onClick={() => setStep('BALANCE')}
                        className="absolute top-4 right-4 w-6 h-6 bg-white hover:bg-slate-900 hover:text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                      >
                         <Receipt className="w-2.5 h-2.5" />
                      </button>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-6 text-slate-400">Rapport de Solde Initial</p>
                      <div className="grid grid-cols-2 gap-8">
                         <div>
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Total Actif</p>
                            <p className="text-xl font-black text-slate-900 tracking-tight">{actifFinal.toLocaleString()} <span className="text-[10px] text-slate-400">{formData.config.currency}</span></p>
                         </div>
                         <div>
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Total Passif</p>
                            <p className="text-xl font-black text-slate-900 tracking-tight">{passifFinal.toLocaleString()} <span className="text-[10px] text-slate-400">{formData.config.currency}</span></p>
                         </div>
                      </div>
                      <div className="mt-6 pt-6 border-t border-slate-200/50 flex flex-col items-center gap-1">
                        {actifFinal === passifFinal ? (
                           <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                              <CheckCircle2 className="w-3 h-3" /> Bilan Certifié Équilibré
                           </div>
                        ) : (
                           <div className="flex items-center gap-1.5 text-[9px] font-black text-rose-500 uppercase tracking-widest">
                              <AlertCircle className="w-3 h-3" /> Écart : {Math.abs(actifFinal - passifFinal).toLocaleString()} {formData.config.currency}
                           </div>
                        )}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'INFO': return 'Identité Enterprise';
      case 'CONFIG': return 'Configuration Système';
      case 'BALANCE': return 'Solde Initial';
      case 'PERIOD': return 'Période Fiscale';
      case 'RECAP': return 'Validation Finale';
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-['Inter',sans-serif] flex flex-col relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-brand/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-indigo-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Modern Top Header */}
      <nav className="h-[100px] bg-white border-b border-slate-50 px-12 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-10">
          <Logo 
            iconClassName="w-10 h-10 bg-[#09090b] text-brand rounded-xl shadow-xl" 
            showText={false}
          />
          <div className="h-6 w-px bg-slate-100"></div>
          <div className="flex flex-col">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">Architecture ERP</p>
            <p className="text-[12px] font-extrabold text-slate-900 uppercase">Ouverture d'exercice</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <button onClick={() => navigate('/app')} className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
             <ArrowLeft className="w-3.5 h-3.5" /> Quitter
           </button>
           <div className="h-6 w-px bg-slate-100"></div>
           <div className="flex gap-2">
             {['INFO', 'CONFIG', 'BALANCE', 'PERIOD', 'RECAP'].map((s, i) => (
                <div key={s} className={cn("w-2 h-2 rounded-full transition-all duration-500", 
                  step === s ? "bg-brand w-6" : "bg-slate-100"
                )}></div>
             ))}
           </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center py-12 px-6 relative z-10">
        <div className="max-w-4xl w-full">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-indigo-50 pb-12">
              <div className="space-y-3">
                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{getStepTitle()}</h2>
                 <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[9px] pl-2">Étape {['INFO', 'CONFIG', 'BALANCE', 'PERIOD', 'RECAP'].indexOf(step) + 1} sur 5 • Architecture Unikorp</p>
              </div>
              <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                 <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                    <Lock className="w-4 h-4" />
                 </div>
                 <div className="pr-4">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-tight">VOS DONNÉES SONT CHIFFRÉES ET GÉRÉES PAR INNOV'KORP</p>
                    <p className="text-[11px] font-bold text-slate-900 truncate max-w-[120px]">{user?.displayName}</p>
                 </div>
              </div>
           </div>

           <motion.div 
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-indigo-500/5 min-h-[450px] flex flex-col justify-between border border-slate-100"
           >
              <div className="flex-1">
                {renderStep()}
              </div>

              <div className="flex items-center justify-between pt-12 border-t border-slate-50 mt-12">
                 {step !== 'INFO' ? (
                   <button 
                    onClick={prevStep}
                    className="h-14 px-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors group"
                   >
                     <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour
                   </button>
                 ) : <div></div>}

                 <Button 
                   onClick={step === 'RECAP' ? handleFinish : nextStep}
                   loading={isSubmitting}
                   className="h-14 px-12 bg-[#09090b] text-white hover:bg-black rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-black/10 border-0 flex items-center gap-4"
                 >
                   {step === 'RECAP' ? 'Déployer Architecture' : 'Étape Suivante'} 
                   <ArrowRight className="w-4 h-4 text-brand" />
                 </Button>
              </div>
           </motion.div>

           <div className="mt-12 flex justify-center items-center gap-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
              <span>Quantum Engine v3.5</span>
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
              <span>End-to-End Encryption</span>
           </div>
        </div>
      </main>
    </div>
  );
}

// Sub-components helpers if needed
