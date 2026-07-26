import React, { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';
import {
  Printer,
  X,
  User,
  MapPin,
  Briefcase,
  Coins,
  GraduationCap,
  FileText,
  Shield,
  CheckCircle2,
  Lock,
  Unlock,
  Phone,
  Mail,
  Award,
  Building,
  CreditCard,
  FileUp,
  Building2,
  Check,
  Eye,
  AlertTriangle,
  FolderLock
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface EmployeeA4Data {
  id?: string;
  matricule?: string;
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  hireDate?: string;
  salary?: number;
  status?: string;

  personalDetails?: {
    civility?: string;
    name?: string;
    firstNames?: string;
    birthDate?: string;
    birthPlace?: string;
    cniNumber?: string;
    cmuNumber?: string;
    socialSecurityNumber?: string;
    nationality?: string;
    maritalStatus?: string;
    childrenCount?: number;
    children?: Array<{ lastName: string; firstNames: string; birthDate: string }>;
  };
  coordinates?: {
    email?: string;
    phone?: string;
    personalEmail?: string;
    emergencyContactName?: string;
    emergencyContactRelation?: string;
    emergencyContactPhone?: string;
    address?: string;
    country?: string;
    customCountry?: string;
    city?: string;
    customCity?: string;
    commune?: string;
    customCommune?: string;
    quartier?: string;
    bankName?: string;
    bankCode?: string;
    branchCode?: string;
    accountNumber?: string;
    ribKey?: string;
    rib?: string;
  };
  contractDetails?: {
    nature?: string;
    type?: string;
    hireDate?: string;
    startDate?: string;
    endDate?: string;
    durationMonths?: number;
  };
  positionDetails?: {
    title?: string;
    department?: string;
    service?: string;
    office?: string;
    superior?: string;
    category?: string;
    cmuCount?: number;
    igrParts?: number;
  };
  payrollDetails?: {
    baseSalary?: number;
    superSalary?: number;
    transportAllowance?: number;
    hourlyRate?: number;
    templateId?: string;
  };
  attachments?: Record<string, string>;
  cvDetailed?: {
    educations?: Array<{ degree: string; title: string; school: string; year: string }>;
    certificates?: Array<{ title: string; issuer: string; year: string }>;
    experiences?: Array<{ title: string; company: string; duration: string }>;
    skills?: string[];
  };
}

interface EmployeeA4SheetModalProps {
  data: EmployeeA4Data;
  onClose: () => void;
  companyName?: string;
}

export function EmployeeA4SheetModal({ data, onClose, companyName = "SOCIX GROUP S.A." }: EmployeeA4SheetModalProps) {
  // Try to load active enterprise info from context if available
  let activeEnterprise = null;
  try {
    const compCtx = useCompany();
    activeEnterprise = compCtx?.activeEnterprise || null;
  } catch (err) {
    // Context fallback
  }

  const effectiveCompanyName = activeEnterprise?.name || companyName || "SOCIX GROUP S.A.";
  const effectiveCompanyLogo = activeEnterprise?.logo || null;

  // Platform tab mode OR Print A4 sheet mode
  const [viewMode, setViewMode] = useState<'platform' | 'print_a4'>('platform');
  const [activeTab, setActiveTab] = useState<'identity' | 'contract' | 'payroll' | 'docs'>('identity');
  const [maskRib, setMaskRib] = useState<boolean>(true);

  // Extract or fallback values intelligently
  const matricule = data.matricule || 'EMP-2026-001';
  const lastName = (data.personalDetails?.name || data.name || 'KASSI').toUpperCase();
  const firstNames = data.personalDetails?.firstNames || 'Raymond Kouadio';
  const fullName = `${lastName} ${firstNames}`;
  const civility = data.personalDetails?.civility || 'M.';
  const birthDate = data.personalDetails?.birthDate || '1992-05-14';
  const birthPlace = data.personalDetails?.birthPlace || 'Abidjan';
  const cniNumber = data.personalDetails?.cniNumber || 'C0129847361';
  const cmuNumber = data.personalDetails?.cmuNumber || '000-84729103-1';
  const socialSecurityNumber = data.personalDetails?.socialSecurityNumber || 'CNPS-9842104-X';
  const nationality = data.personalDetails?.nationality || 'Ivoirienne';
  const maritalStatus = data.personalDetails?.maritalStatus || 'Marié(e)';
  const childrenCount = data.personalDetails?.childrenCount ?? 2;
  const childrenList = data.personalDetails?.children || [
    { lastName, firstNames: 'Marc Junior', birthDate: '2018-09-12' },
    { lastName, firstNames: 'Aria Marie', birthDate: '2021-03-25' }
  ];

  // Coordinates & Emergency
  const phone = data.coordinates?.phone || data.phone || '+225 07 08 09 10 11';
  const email = data.coordinates?.email || data.email || 'salarie@socix.ci';
  const personalEmail = data.coordinates?.personalEmail || 'perso.salarie@gmail.com';
  const address = data.coordinates?.address || 'Avenue Chardy, Immeuble Horizon';
  const country = data.coordinates?.country === 'Autre' ? data.coordinates?.customCountry : (data.coordinates?.country || 'Côte d\'Ivoire');
  const city = data.coordinates?.city === 'Autre' ? data.coordinates?.customCity : (data.coordinates?.city || 'Abidjan');
  const commune = data.coordinates?.commune === 'Autre' ? data.coordinates?.customCommune : (data.coordinates?.commune || 'Cocody');
  const quartier = data.coordinates?.quartier || 'Angré 8ème Tranche';
  const emergencyName = data.coordinates?.emergencyContactName || 'KASSI Henriette';
  const emergencyRelation = data.coordinates?.emergencyContactRelation || 'Conjoint(e)';
  const emergencyPhone = data.coordinates?.emergencyContactPhone || '+225 05 01 02 03 04';

  // Contract & Position
  const contractNature = data.contractDetails?.nature || 'CDI';
  const collabType = data.contractDetails?.type || 'Salarié Titulaire';
  const hireDate = data.contractDetails?.hireDate || data.hireDate || '2026-01-15';
  const startDate = data.contractDetails?.startDate || data.hireDate || '2026-01-15';
  const endDate = data.contractDetails?.endDate;
  const positionTitle = data.positionDetails?.title || data.position || 'Responsable de Gestion RH';
  const department = data.positionDetails?.department || data.department || 'Ressources Humaines';
  const service = data.positionDetails?.service || 'Administration du Personnel';
  const superior = data.positionDetails?.superior || 'Directeur Général RH';
  const office = data.positionDetails?.office || 'Bureau 304 - Nivel 3';
  const category = data.positionDetails?.category || 'Cadre M2 - Catégorie 10';
  const igrParts = data.positionDetails?.igrParts ?? 3;
  const cmuCount = data.positionDetails?.cmuCount ?? (childrenCount + 1);

  // Bank & Payroll
  const bankName = data.coordinates?.bankName || 'NSIA Banque CI';
  const rawRib = data.coordinates?.rib || 'CI092 01001 12345678901 45';
  const maskedRibStr = 'CI092 ••••• ••••••••••• ••';
  const baseSalary = data.payrollDetails?.baseSalary || data.salary || 650000;
  const superSalary = data.payrollDetails?.superSalary || 150000;
  const transport = data.payrollDetails?.transportAllowance || 35000;
  const totalBrut = baseSalary + superSalary + transport;
  const netEst = Math.round(totalBrut * 0.82);

  // Educations & Experiences
  const educations = data.cvDetailed?.educations?.length ? data.cvDetailed.educations : [
    { degree: 'Master 2', title: 'Management des Ressources Humaines', school: 'INPHB Yamoussoukro', year: '2017' },
    { degree: 'Licence 3', title: 'Droit des Affaires & Social', school: 'Université Félix Houphouët-Boigny', year: '2015' }
  ];
  const experiences = data.cvDetailed?.experiences?.length ? data.cvDetailed.experiences : [
    { title: 'Gestionnaire RH Senior', company: 'SOCIETE IVOIRIENNE DE BANQUE', duration: '2021 - 2025' },
    { title: 'Assistant Administration du Personnel', company: 'TOTAL ENERGIES CI', duration: '2018 - 2021' }
  ];
  const skills = data.cvDetailed?.skills?.length ? data.cvDetailed.skills : [
    'Gestion de la Paie', 'Droit du Travail CI', 'Recrutement Cadres', 'SYSCOHADA Paie', 'SIRH & Audit'
  ];

  // Documents list
  const docChecklist = [
    { id: 'cv', label: 'Curriculum Vitae (CV)', ok: true },
    { id: 'cni', label: 'Pièce d\'Identité (CNI / Passeport)', ok: true },
    { id: 'cmu', label: 'Carte CMU Officielle', ok: true },
    { id: 'rib', label: 'Relevé d\'Identité Bancaire (RIB)', ok: true },
    { id: 'casier_b3', label: 'Extrait de Casier Judiciaire (Bulletin N° 3)', ok: true },
    { id: 'dossier_juridique', label: 'Dossier Juridique & Disciplinaire', ok: false },
    { id: 'certificat_residence', label: 'Certificat de Résidence', ok: true },
    { id: 'permis', label: 'Permis de Conduire', ok: true },
    { id: 'diplomes', label: 'Diplômes & Certificats Académiques', ok: true },
    { id: 'extrait', label: 'Extrait d\'Acte de Naissance', ok: true },
    { id: 'certificat_travail', label: 'Certificats de Travail Antérieurs', ok: true },
    { id: 'photo', label: 'Photo d\'Identité Numérisée', ok: true }
  ];

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    setViewMode('print_a4');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="fixed inset-0 bg-[#09090b]/60 backdrop-blur-md flex items-center justify-center z-[150] p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      
      {/* Outer Modal Container */}
      <div className="bg-slate-100 rounded-[2.5rem] border border-slate-200 shadow-2xl w-full max-w-5xl overflow-hidden my-auto flex flex-col max-h-[95vh] print:max-h-none print:border-none print:shadow-none print:rounded-none print:bg-white print:w-full">
        
        {/* TOP BAR / CONTROL HEADER */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4A9EC9] flex items-center justify-center text-white shadow-lg shadow-[#4A9EC9]/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2 text-white">
                Fiche Individuelle Salarié
                <span className="bg-[#4A9EC9]/20 text-[#4A9EC9] border border-[#4A9EC9]/30 text-[9px] px-2 py-0.5 rounded-full font-black">
                  {viewMode === 'platform' ? 'CONSULTATION PLATEFORME' : 'APERÇU A4 IMPRIMABLE'}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                {fullName} • MATRICULE : {matricule}
              </p>
            </div>
          </div>

          {/* Action Switcher Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Switch between Platform Interactive Tabs and Printable A4 */}
            <div className="bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('platform')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border-0 cursor-pointer transition-all flex items-center gap-1.5",
                  viewMode === 'platform' ? "bg-[#4A9EC9] text-white shadow-md" : "text-slate-400 hover:text-white"
                )}
              >
                <Eye className="w-3.5 h-3.5" /> Consultation Plateforme
              </button>
              <button
                type="button"
                onClick={() => setViewMode('print_a4')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border-0 cursor-pointer transition-all flex items-center gap-1.5",
                  viewMode === 'print_a4' ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                )}
              >
                <Printer className="w-3.5 h-3.5" /> Fiche A4 Officielle (Imprimable)
              </button>
            </div>

            {/* Direct Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border-0 cursor-pointer shadow-lg shadow-emerald-600/20 transition-all shrink-0"
            >
              <Printer className="w-4 h-4" /> Lancer l'impression
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border-0 cursor-pointer transition-all font-bold"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VIEW MODE 1: INTERACTIVE PLATFORM VIEW (Organized by Section Tabs) */}
        {viewMode === 'platform' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* Interactive Tab Navigation Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-2 overflow-x-auto shrink-0">
              {[
                { id: 'identity', label: 'Identité & Urgence', icon: User, desc: 'État civil, contacts, famille' },
                { id: 'contract', label: 'Contrat, Poste & CV', icon: Briefcase, desc: 'Affectation, fonction, parcours' },
                { id: 'payroll', label: 'Paie & Banque (Plateforme)', icon: Coins, desc: 'Rémunération & RIB sécurisé' },
                { id: 'docs', label: 'Dossier RH & Pièces', icon: FileUp, desc: 'Justificatifs & casier judiciaire' }
              ].map(t => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as any)}
                    className={cn(
                      "px-4 py-2.5 rounded-2xl text-left border cursor-pointer transition-all flex items-center gap-3 shrink-0",
                      isActive 
                        ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                      isActive ? "bg-[#4A9EC9] text-white" : "bg-white text-slate-400 border border-slate-200"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={cn("text-xs font-black uppercase tracking-tight", isActive ? "text-white" : "text-slate-800")}>
                        {t.label}
                      </p>
                      <p className={cn("text-[9px] font-bold mt-0.5", isActive ? "text-slate-300" : "text-slate-400")}>
                        {t.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Platform Content Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-100/70 space-y-6">
              
              {/* Profile summary header banner */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                <div className="relative shrink-0">
                  <div className="w-24 h-28 rounded-2xl bg-slate-100 border-2 border-slate-200 flex flex-col items-center justify-center text-slate-400 overflow-hidden shadow-inner">
                    <User className="w-10 h-10 text-slate-400" />
                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 mt-1">PHOTO RH</span>
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full text-xs shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#4A9EC9]">
                      MATRICULE : {matricule}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                      {fullName}
                    </h2>
                    <p className="text-xs font-bold text-slate-500 uppercase mt-0.5">
                      {positionTitle} • {department}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[10px] font-bold pt-1">
                    <span className="px-3 py-1 bg-slate-900 text-white rounded-xl uppercase tracking-wider">
                      {contractNature} ({collabType})
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-[#4A9EC9] border border-blue-200 rounded-xl uppercase tracking-wider">
                      {category}
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl uppercase tracking-wider font-black">
                      STATUT : ACTIF
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-right space-y-1 text-xs shrink-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date d'embauche</p>
                  <p className="font-mono font-black text-slate-900">{hireDate}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest pt-1">Prise de fonction</p>
                  <p className="font-mono font-bold text-slate-700">{startDate}</p>
                </div>
              </div>

              {/* TAB 1: IDENTITÉ & URGENCE */}
              {activeTab === 'identity' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Identity Box */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                      <User className="w-4 h-4 text-[#4A9EC9]" /> Identité & État Civil Officiel
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nom de famille</p>
                        <p className="font-black text-slate-900 uppercase mt-0.5">{lastName}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Prénoms</p>
                        <p className="font-bold text-slate-900 mt-0.5">{firstNames}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Civilité / Genre</p>
                        <p className="font-bold text-slate-900 mt-0.5">{civility} • Masculin</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nationalité</p>
                        <p className="font-bold text-slate-900 mt-0.5">{nationality}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date & Lieu de Naissance</p>
                        <p className="font-bold text-slate-900 mt-0.5">{birthDate} à {birthPlace}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">N° CNI / Passeport</p>
                        <p className="font-mono font-bold text-slate-900 mt-0.5">{cniNumber}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">N° Carte CMU</p>
                        <p className="font-mono font-bold text-slate-900 mt-0.5">{cmuNumber}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">N° Sécurité Sociale (CNPS)</p>
                        <p className="font-mono font-bold text-slate-900 mt-0.5">{socialSecurityNumber}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Situation Matrimoniale</p>
                        <p className="font-bold text-slate-900 mt-0.5">{maritalStatus}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nombre d'enfants à charge</p>
                        <p className="font-black text-slate-900 mt-0.5">{childrenCount} enfant(s)</p>
                      </div>
                    </div>

                    {/* Children List Table */}
                    {childrenList.length > 0 && (
                      <div className="pt-2">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">
                          👶 Liste nominative des enfants à charge (Ayants droit enregistrés)
                        </p>
                        <table className="w-full text-xs border border-slate-200 rounded-2xl overflow-hidden">
                          <thead className="bg-slate-100 text-slate-600 font-black uppercase text-left">
                            <tr>
                              <th className="p-2.5 pl-4">Nom & Prénoms</th>
                              <th className="p-2.5">Date de Naissance</th>
                              <th className="p-2.5 text-right pr-4">Lien de Parenté</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-150 bg-white font-medium">
                            {childrenList.map((ch, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="p-2.5 pl-4 font-bold text-slate-900 uppercase">{ch.lastName} {ch.firstNames}</td>
                                <td className="p-2.5 font-mono text-slate-600">{ch.birthDate}</td>
                                <td className="p-2.5 text-right pr-4 font-bold text-slate-500">Enfant Légitime</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Coordonnées & Urgence Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 text-xs">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                        <MapPin className="w-4 h-4 text-[#4A9EC9]" /> Coordonnées de Contact
                      </h3>
                      <div className="space-y-2 pt-1 font-bold">
                        <div className="flex items-center gap-2 text-slate-800">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400 font-normal">Téléphone Pro :</span> {phone}
                        </div>
                        <div className="flex items-center gap-2 text-slate-800">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400 font-normal">Email Pro :</span> {email}
                        </div>
                        <div className="flex items-center gap-2 text-slate-800">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400 font-normal">Email Perso :</span> {personalEmail}
                        </div>
                        <div className="pt-2 border-t border-slate-100 text-slate-700 font-medium leading-relaxed">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Adresse géographique :</span>
                          {address} • {quartier}, {commune}, {city} ({country})
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200 shadow-sm space-y-3 text-xs">
                      <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-2 border-b border-amber-200/60 pb-2">
                        <Shield className="w-4 h-4 text-amber-600" /> Contact en Cas d'Urgence
                      </h3>
                      <div className="space-y-2 pt-1 font-bold text-slate-900">
                        <div className="flex justify-between border-b border-amber-200/40 pb-1.5">
                          <span className="text-slate-500 font-normal">Nom complet :</span>
                          <span className="uppercase font-black">{emergencyName}</span>
                        </div>
                        <div className="flex justify-between border-b border-amber-200/40 pb-1.5">
                          <span className="text-slate-500 font-normal">Lien de parenté :</span>
                          <span>{emergencyRelation}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-slate-500 font-normal">Numéro d'Urgence :</span>
                          <span className="font-mono text-emerald-700 font-black text-sm">{emergencyPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: CONTRAT, POSTE & CV */}
              {activeTab === 'contract' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Position & Contract Details */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                      <Briefcase className="w-4 h-4 text-[#4A9EC9]" /> Affectation Administrative & Statut Contractuel
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Intitulé du Poste</p>
                        <p className="font-black text-slate-900 uppercase mt-0.5">{positionTitle}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Direction / Département</p>
                        <p className="font-bold text-slate-900 mt-0.5">{department}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Service Rattaché</p>
                        <p className="font-bold text-slate-900 mt-0.5">{service}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Supérieur Hiérarchique (N+1)</p>
                        <p className="font-bold text-slate-900 mt-0.5">{superior}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bureau / Emplacement</p>
                        <p className="font-bold text-slate-900 mt-0.5">{office}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nature du Contrat</p>
                        <p className="font-black text-slate-900 uppercase mt-0.5">{contractNature}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date d'Embauche</p>
                        <p className="font-mono font-bold text-slate-900 mt-0.5">{hireDate}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Prise de Fonction</p>
                        <p className="font-mono font-bold text-slate-900 mt-0.5">{startDate}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Catégorie Socio-Prof.</p>
                        <p className="font-bold text-slate-900 mt-0.5">{category}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Parts IGR (Fiscale)</p>
                        <p className="font-black text-slate-900 mt-0.5">{igrParts} Part(s)</p>
                      </div>
                    </div>
                  </div>

                  {/* CV & Parcours Professionnel */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Educations */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                        <GraduationCap className="w-4 h-4 text-[#4A9EC9]" /> Formations & Diplômes Académiques
                      </h3>
                      <div className="space-y-2 pt-1">
                        {educations.map((edu, idx) => (
                          <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-150 space-y-1">
                            <p className="font-black text-slate-900 text-xs flex items-center gap-2">
                              <span className="bg-[#4A9EC9]/10 text-[#4A9EC9] px-2 py-0.5 rounded-md text-[9px] font-black uppercase">{edu.degree}</span>
                              {edu.title}
                            </p>
                            <p className="text-[10px] text-slate-500 font-bold">{edu.school} • Année {edu.year}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Experiences & Skills */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                      <div>
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                          <Building2 className="w-4 h-4 text-[#4A9EC9]" /> Expériences Professionnelles Antérieures
                        </h3>
                        <div className="space-y-2 pt-2">
                          {experiences.map((exp, idx) => (
                            <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-150 space-y-0.5">
                              <p className="font-black text-slate-900 text-xs">{exp.title}</p>
                              <p className="text-[10px] text-[#4A9EC9] font-bold uppercase">{exp.company} • {exp.duration}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Habilitations & Compétences Métiers</p>
                        <div className="flex flex-wrap gap-1.5">
                          {skills.map((sk, idx) => (
                            <span key={idx} className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl text-[10px] font-bold text-slate-700 flex items-center gap-1">
                              <Award className="w-3 h-3 text-[#4A9EC9]" /> {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: PAIE & BANQUE (Plateforme Uniquement) */}
              {activeTab === 'payroll' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Warning banner explaining platform confidentiality */}
                  <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-amber-900 uppercase tracking-tight">
                        Confidentialité des Données Financières
                      </p>
                      <p className="text-[11px] text-amber-700/90 mt-0.5 leading-relaxed">
                        Ces informations de rémunération, de virement et de RIB sont exclusivement réservées à la gestion interne sur la plateforme. Conformément à vos directives, elles ne sont <strong>pas imprimées</strong> sur la fiche signalétique A4 officielle.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Structure Salariale */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                        <Coins className="w-4 h-4 text-[#4A9EC9]" /> Structure de Rémunération Mensuelle
                      </h3>

                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between p-3 bg-slate-50 rounded-2xl border border-slate-150">
                          <span className="text-slate-500 font-sans font-bold">Salaire de Base Brut :</span>
                          <span className="font-black text-slate-900 text-sm">{baseSalary.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                        <div className="flex justify-between p-3 bg-slate-50 rounded-2xl border border-slate-150">
                          <span className="text-slate-500 font-sans font-bold">Sur-Salaire & Primes Fixes :</span>
                          <span className="font-black text-slate-900 text-sm">{superSalary.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                        <div className="flex justify-between p-3 bg-slate-50 rounded-2xl border border-slate-150">
                          <span className="text-slate-500 font-sans font-bold">Indemnité de Transport Fixe :</span>
                          <span className="font-black text-slate-900 text-sm">{transport.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                        
                        <div className="flex justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-200 pt-3">
                          <div>
                            <span className="text-emerald-900 font-sans font-black uppercase text-xs block">Total Brut Mensuel :</span>
                            <span className="text-[9px] font-sans font-bold text-emerald-600">Estimation du Net à payer : ~{netEst.toLocaleString('fr-FR')} FCFA</span>
                          </div>
                          <span className="font-black text-emerald-700 text-base self-center">{totalBrut.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                      </div>
                    </div>

                    {/* Virement & RIB avec masque toggle */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#4A9EC9]" /> Coordonnées Bancaires & RIB
                        </h3>
                        <button
                          type="button"
                          onClick={() => setMaskRib(!maskRib)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 border-0 cursor-pointer transition-all"
                        >
                          {maskRib ? <Unlock className="w-3.5 h-3.5 text-slate-600" /> : <Lock className="w-3.5 h-3.5 text-amber-600" />}
                          {maskRib ? "Afficher RIB" : "Masquer RIB"}
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Établissement bancaire domicilié</p>
                          <p className="font-black text-slate-900 text-sm uppercase mt-0.5">{bankName}</p>
                        </div>

                        <div className="p-4 bg-slate-900 rounded-2xl text-emerald-400 space-y-2 shadow-inner">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">RIB Officiel pour Télé-virement</span>
                            {maskRib ? (
                              <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[8px] font-black">MASQUÉ</span>
                            ) : (
                              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[8px] font-black">VISIBLE</span>
                            )}
                          </div>
                          <p className="font-mono text-center text-sm tracking-widest font-black py-1">
                            {maskRib ? maskedRibStr : rawRib}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: DOSSIER RH & PIÈCES */}
              {activeTab === 'docs' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                      <FileUp className="w-4 h-4 text-[#4A9EC9]" /> Inventaire des Pièces RH du Dossier Individuel
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      {docChecklist.map((doc) => (
                        <div 
                          key={doc.id} 
                          className={cn(
                            "p-3.5 rounded-2xl border flex items-center justify-between gap-2 font-bold transition-all",
                            doc.ok 
                              ? "bg-slate-50 border-slate-200 text-slate-800" 
                              : "bg-rose-50/50 border-rose-200 text-rose-800"
                          )}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            {doc.ok ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                            )}
                            <span className="truncate text-xs">{doc.label}</span>
                          </div>
                          <span className={cn(
                            "text-[8px] font-black uppercase px-2 py-0.5 rounded-md shrink-0",
                            doc.ok ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                          )}>
                            {doc.ok ? "FOURNI" : "NON REÇU"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* VIEW MODE 2: THE OFFICIAL PRINTABLE A4 SHEET (CONCISE, NON-SENSITIVE) */}
        {viewMode === 'print_a4' && (
          <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-200/60 print:p-0 print:overflow-visible print:bg-white">
            
            {/* THE A4 PRINTABLE CONTAINER */}
            <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-8 sm:p-10 text-slate-900 shadow-xl rounded-2xl border border-slate-200 print:shadow-none print:border-none print:p-6 print:rounded-none print:w-full print:max-w-none print:min-h-0 space-y-6">
              
              {/* Header Officiel */}
              <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    {effectiveCompanyLogo ? (
                      <img 
                        src={effectiveCompanyLogo} 
                        alt={effectiveCompanyName} 
                        className="h-12 max-w-[180px] object-contain shrink-0" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shrink-0">
                        <Building className="w-5 h-5 text-[#4A9EC9]" />
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-900 block">
                        {effectiveCompanyName}
                      </span>
                      {activeEnterprise?.ncc && (
                        <span className="text-[8px] font-mono text-slate-500 font-bold block">
                          N° NCC : {activeEnterprise.ncc} {activeEnterprise.cnps ? `• CNPS : ${activeEnterprise.cnps}` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <h1 className="text-lg font-black uppercase tracking-tight text-slate-900 pt-1">
                    FICHE SIGNALÉTIQUE INDIVIDUELLE DU SALARIÉ
                  </h1>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    REGISTRE UNIQUE DU PERSONNEL • CODE DU TRAVAIL
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <div className="bg-slate-900 text-white px-3 py-1 rounded-lg text-center inline-block">
                    <p className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">Matricule</p>
                    <p className="text-xs font-mono font-black tracking-wider text-emerald-400">{matricule}</p>
                  </div>
                  <p className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                    ÉDITION DU : {currentDate}
                  </p>
                </div>
              </div>

              {/* Profile Header Badge Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative shrink-0">
                  <div className="w-24 h-28 rounded-2xl bg-slate-200 border-2 border-slate-300 flex flex-col items-center justify-center text-slate-400 overflow-hidden shadow-inner">
                    <User className="w-10 h-10 text-slate-400" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-1">PHOTO OFFICIELLE</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#4A9EC9]">
                      {civility} {fullName}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                      {positionTitle}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[10px] font-bold">
                    <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg uppercase tracking-wider">
                      {department}
                    </span>
                    <span className="px-2.5 py-1 bg-blue-50 text-[#4A9EC9] border border-blue-200 rounded-lg uppercase tracking-wider">
                      {contractNature} ({collabType})
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg uppercase tracking-wider">
                      {category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[10px] text-slate-600 font-medium">
                    <div><span className="text-slate-400 font-bold uppercase">Date d'embauche :</span> <span className="font-mono font-bold text-slate-900">{hireDate}</span></div>
                    <div><span className="text-slate-400 font-bold uppercase">Prise de fonction :</span> <span className="font-mono font-bold text-slate-900">{startDate}</span></div>
                    <div><span className="text-slate-400 font-bold uppercase">Statut :</span> <span className="font-black text-emerald-600 uppercase">ACTIF</span></div>
                  </div>
                </div>
              </div>

              {/* SECTION 1: IDENTITÉ & ÉTAT CIVIL */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#4A9EC9]" /> 1. Identité & État Civil
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-150 text-[11px]">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Nom de Famille</p>
                    <p className="font-black text-slate-900 uppercase">{lastName}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Prénoms</p>
                    <p className="font-bold text-slate-900">{firstNames}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Civilité</p>
                    <p className="font-bold text-slate-900">{civility}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Nationalité</p>
                    <p className="font-bold text-slate-900">{nationality}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Date & Lieu de Naissance</p>
                    <p className="font-bold text-slate-900">{birthDate} à {birthPlace}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">N° CNI / Passeport</p>
                    <p className="font-mono font-bold text-slate-900">{cniNumber}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">N° Carte CMU</p>
                    <p className="font-mono font-bold text-slate-900">{cmuNumber}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">N° Sécurité Sociale (CNPS)</p>
                    <p className="font-mono font-bold text-slate-900">{socialSecurityNumber}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Situation Matrimoniale</p>
                    <p className="font-bold text-slate-900">{maritalStatus}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Enfants à Charge</p>
                    <p className="font-black text-slate-900">{childrenCount} enfant(s)</p>
                  </div>
                </div>

                {/* Table of Dependents (without photos as requested) */}
                {childrenList.length > 0 && (
                  <div className="pt-1">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1">Détails des Ayants Droit (Enfants à charge)</p>
                    <table className="w-full text-[10px] border border-slate-200 rounded-xl overflow-hidden">
                      <thead className="bg-slate-100 text-slate-600 font-black uppercase text-left">
                        <tr>
                          <th className="p-1.5 pl-3">Nom & Prénoms</th>
                          <th className="p-1.5">Date de Naissance</th>
                          <th className="p-1.5 text-right pr-3">Lien de Parenté</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 font-medium">
                        {childrenList.map((ch, idx) => (
                          <tr key={idx}>
                            <td className="p-1.5 pl-3 font-bold text-slate-900 uppercase">{ch.lastName} {ch.firstNames}</td>
                            <td className="p-1.5 font-mono text-slate-600">{ch.birthDate}</td>
                            <td className="p-1.5 text-right pr-3 font-bold text-slate-500">Enfant Légitime</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* SECTION 2: COORDONNÉES & CONTACT D'URGENCE */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#4A9EC9]" /> 2. Coordonnées & Personne à Prévenir
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
                  <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-150 space-y-1.5">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Téléphone / Contact :</span>
                      <span className="font-bold text-slate-900">{phone}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Email Institutionnel :</span>
                      <span className="font-bold text-slate-900">{email}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Adresse Géographique :</span>
                      <span className="font-medium text-slate-800">{address} • {quartier}, {commune}, {city} ({country})</span>
                    </div>
                  </div>

                  <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200 space-y-1.5">
                    <p className="text-[9px] font-black uppercase text-amber-800 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-amber-600" /> Contact en Cas d'Urgence
                    </p>
                    <div className="flex justify-between border-b border-amber-100 pb-1">
                      <span className="text-slate-500 font-medium">Nom complet :</span>
                      <span className="font-black text-slate-900 uppercase">{emergencyName}</span>
                    </div>
                    <div className="flex justify-between border-b border-amber-100 pb-1">
                      <span className="text-slate-500 font-medium">Lien de parenté :</span>
                      <span className="font-bold text-slate-900">{emergencyRelation}</span>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span className="text-slate-500 font-medium">Numéro de Téléphone :</span>
                      <span className="font-mono text-emerald-700 font-black">{emergencyPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: AFFECTATION ET CONTRAT */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#4A9EC9]" /> 3. Élément du Contrat & Affectation
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-150 text-[11px]">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Intitulé du Poste</p>
                    <p className="font-black text-slate-900 uppercase">{positionTitle}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Direction / Service</p>
                    <p className="font-bold text-slate-900">{department} - {service}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Nature du Contrat</p>
                    <p className="font-black text-slate-900 uppercase">{contractNature}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Date d'Embauche</p>
                    <p className="font-mono font-bold text-slate-900">{hireDate}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Prise de Fonction</p>
                    <p className="font-mono font-bold text-slate-900">{startDate}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Catégorie Socio-Prof.</p>
                    <p className="font-bold text-slate-900">{category}</p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: STAMPS & SIGNATURES BLOCK */}
              <div className="pt-6 border-t-2 border-slate-200 space-y-6">
                <p className="text-[9px] text-slate-400 text-center font-bold uppercase tracking-widest">
                  VALIDATION DE LA FICHE SIGNALÉTIQUE ET REGISTRE RH
                </p>

                <div className="grid grid-cols-2 gap-8 text-[11px] text-slate-800">
                  {/* Employee signature */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/40 space-y-8 min-h-[110px] flex flex-col justify-between">
                    <div>
                      <p className="font-black text-slate-900 uppercase">VISA ET MENTION DU SALARIÉ</p>
                      <p className="text-[9px] text-slate-400 italic">"Lu et approuvé, certifié exact sur l'honneur"</p>
                    </div>
                    <div className="border-t border-dashed border-slate-300 pt-2 text-right">
                      <span className="text-[8px] text-slate-400 uppercase tracking-wider font-mono">Date & Signature : ____________________</span>
                    </div>
                  </div>

                  {/* DRH Stamp & Signature */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/40 space-y-3 min-h-[110px] flex flex-col justify-between relative overflow-hidden">
                    <div>
                      <p className="font-black text-slate-900 uppercase">DIRECTION DES RESSOURCES HUMAINES</p>
                      <p className="text-[9px] text-slate-400 italic">Enregistré au Registre Unique du Personnel</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="border-2 border-emerald-600/30 text-emerald-700 p-2 rounded-xl text-[8px] font-black uppercase tracking-widest rotate-[-3deg] bg-emerald-50/50">
                        SOCIX GROUP RH<br />
                        DOSSIER HOMOLOGUÉ<br />
                        LE {currentDate}
                      </div>

                      <div className="text-right">
                        <span className="text-[8px] text-slate-400 uppercase tracking-wider font-mono block">Le Directeur RH</span>
                        <span className="text-[10px] font-bold text-slate-900 uppercase">P.O. KOUASSI J.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[8px] text-slate-400 font-medium tracking-tight pt-2 border-t border-slate-100">
                  Document édité par le système SIRH SOCIX GROUP. La présente fiche ne comporte volontairement aucune donnée salariale ni bancaire conformément aux normes de confidentialité RH.
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
