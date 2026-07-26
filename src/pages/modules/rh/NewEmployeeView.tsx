import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  MapPin, 
  FileText, 
  Briefcase, 
  Coins, 
  FileUp, 
  Award, 
  Plus, 
  Trash2, 
  Check, 
  Info, 
  AlertCircle,
  GraduationCap,
  Building2,
  BookOpen,
  CheckCircle2,
  Loader2,
  Home,
  Eye,
  Printer,
  Shield
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { saveActionLog } from '../../../lib/auditLogger';
import { Employee } from './PersonnelViews';
import { BulletinModele, Rubrique } from './ParametrageViews';
import { EmployeeA4SheetModal } from '../../../components/modals/EmployeeA4SheetModal';

// Cascading geography database for smart selections
const GEOGRAPHY_DATA: Record<string, Record<string, string[]>> = {
  "Côte d'Ivoire": {
    "Abidjan": ["Cocody", "Marcory", "Plateau", "Treichville", "Yopougon", "Koumassi", "Adjamé", "Port-Bouët", "Abobo", "Bingerville"],
    "Bouaké": ["Bouaké-Commune", "Air France", "N'Gattakro", "Nimbo"],
    "Yamoussoukro": ["Yamoussoukro-Commune", "Morofé", "Assabou", "220 Logements"],
    "San-Pédro": ["San-Pédro-Commune", "Bardot", "Cité"]
  },
  "Sénégal": {
    "Dakar": ["Almadies", "Plateau", "Médina", "Yoff", "Grand Yoff", "Hann Bel-Air"],
    "Thiès": ["Thiès Est", "Thiès Ouest", "Thiès Nord"],
    "Saint-Louis": ["Sor", "Ndar", "Ndiolofène"]
  },
  "France": {
    "Paris": ["1er Arrondissement", "8ème Arrondissement", "15ème Arrondissement", "16ème Arrondissement"],
    "Lyon": ["2ème Arrondissement", "3ème Arrondissement", "6ème Arrondissement"],
    "Marseille": ["1er Arrondissement", "2ème Arrondissement", "8ème Arrondissement"]
  }
};

interface NewEmployeeViewProps {
  selectedDossierId: string | null;
  onBack: () => void;
}

interface EducationEntry {
  id: string;
  degree: string; // BAC, BTS, Licence, Master, etc.
  title: string;  // Nom de la formation / Titre
  school: string; // Établissement
  year: string;   // Année d'obtention
}

interface CertificateEntry {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

interface ChildInfo {
  lastName: string;
  firstNames: string;
  birthDate: string;
  birthCertificate: string; // File attachment state
}

export function NewEmployeeView({ selectedDossierId, onBack }: NewEmployeeViewProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showA4Modal, setShowA4Modal] = useState(false);
  const [templates, setTemplates] = useState<BulletinModele[]>([]);
  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  
  const dossierKey = selectedDossierId || 'default';

  // State for all form fields
  // Step 1: Infos personnelles
  const [personal, setPersonal] = useState({
    matricule: '',
    name: '',
    firstNames: '',
    birthDate: '',
    birthPlace: '',
    maritalStatus: 'Célibataire',
    childrenCount: 0,
    cniNumber: '',
    cmuNumber: '',
    socialSecurityNumber: '',
    nationality: 'Ivoirienne',
    address: '',
    email: '',
    phone: '',
  });

  // Sub-form children details
  const [childrenDetails, setChildrenDetails] = useState<ChildInfo[]>([]);

  // Step 2: Coordonnées & Banque
  const [coords, setCoords] = useState({
    postalCode: '',
    country: "Côte d'Ivoire",
    city: 'Abidjan',
    commune: 'Cocody',
    customCountry: '',
    customCity: '',
    customCommune: '',
    quartier: '',
    emergencyContactName: '',
    emergencyContactRelation: 'Conjoint(e)',
    emergencyContactPhone: '',
    bankName: '',
    rib: '',
  });

  // RIB Input breakdown (West Africa / UEMOA standard format)
  const [ribParts, setRibParts] = useState({
    bankCode: '',    // 5 chars
    branchCode: '',  // 5 chars (guichet)
    accountNumber: '', // 11 chars
    ribKey: ''       // 2 digits
  });

  // Step 3: Contrat
  const [contract, setContract] = useState({
    nature: 'CDI', // CDI, CDD, Stage, Consultant, Interim
    type: 'salarié', // salarié, prestataire, stagiaire
    situation: 'local', // local, expatrié
    hireDate: new Date().toISOString().substring(0, 10),
    startDate: new Date().toISOString().substring(0, 10),
    seniorityDate: new Date().toISOString().substring(0, 10),
    endDate: '',
    durationMonths: 0,
  });

  // Step 4: Poste
  const [position, setPosition] = useState({
    collectiveAgreement: 'Convention Collective Interprofessionnelle (CCI)',
    title: '',
    department: 'Finances',
    service: '',
    category: 'Employé - Collège 1',
    employmentType: '',
    cmuCount: 1,
    igrParts: 1, // number of parts for income tax
  });

  // Step 5: Paie
  const [payroll, setPayroll] = useState({
    templateId: '',
    payrollType: 'Mensuel', // Mensuel, Horaire, Journalier
    baseSalary: 75000,
    transportAllowance: 30000,
    superSalary: 0,
    hourlyRate: 432.70, // auto calculated standard (75000 / 173.33)
    customRubriques: {} as Record<string, number>, // Rubrique ID -> Value
  });

  // Step 6: Dossier (uploaded files)
  const [attachedFiles, setAttachedFiles] = useState<Record<string, { name: string; size: string; status: 'loading' | 'success' }>>({});

  // Step 7: CV détaillé
  const [educations, setEducations] = useState<EducationEntry[]>([]);
  const [certificates, setCertificates] = useState<CertificateEntry[]>([]);
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  // Temp education form
  const [newEdu, setNewEdu] = useState({ degree: 'Licence', title: '', school: '', year: '' });
  // Temp certificate form
  const [newCert, setNewCert] = useState({ name: '', issuer: '', year: '' });
  // Temp experience form
  const [newExp, setNewExp] = useState({ company: '', role: '', period: '', description: '' });

  // Auto-sync children details array size based on personal.childrenCount
  useEffect(() => {
    if (personal.childrenCount > 0) {
      setChildrenDetails(prev => {
        const copy = [...prev];
        if (copy.length < personal.childrenCount) {
          while (copy.length < personal.childrenCount) {
            copy.push({
              lastName: personal.name ? personal.name.toUpperCase() : '',
              firstNames: '',
              birthDate: '',
              birthCertificate: 'Non fourni'
            });
          }
        } else if (copy.length > personal.childrenCount) {
          copy.splice(personal.childrenCount);
        }
        return copy;
      });
    } else {
      setChildrenDetails([]);
    }
  }, [personal.childrenCount, personal.name]);

  // Sync individual RIB parts to main coords.rib string
  useEffect(() => {
    const bank = ribParts.bankCode.trim();
    const branch = ribParts.branchCode.trim();
    const account = ribParts.accountNumber.trim();
    const key = ribParts.ribKey.trim();
    
    let compiled = '';
    if (bank || branch || account || key) {
      compiled = `${bank} ${branch} ${account} ${key}`.trim();
    }
    setCoords(prev => ({ ...prev, rib: compiled }));
  }, [ribParts.bankCode, ribParts.branchCode, ribParts.accountNumber, ribParts.ribKey]);

  // Load bulletin templates & rubriques
  useEffect(() => {
    const templateKey = `bulletin_templates_${dossierKey}`;
    const savedTemplates = localStorage.getItem(templateKey);
    const rubKey = `payroll_rubriques_${dossierKey}`;
    const savedRubs = localStorage.getItem(rubKey);

    let activeRubs: Rubrique[] = [];
    if (savedRubs) {
      activeRubs = JSON.parse(savedRubs);
      setRubriques(activeRubs);
    }

    if (savedTemplates) {
      const parsed: BulletinModele[] = JSON.parse(savedTemplates);
      setTemplates(parsed);
      if (parsed.length > 0 && !payroll.templateId) {
        setPayroll(p => ({ ...p, templateId: parsed[0].id }));
      }
    } else {
      // Fallback templates
      const defaultTemplates: BulletinModele[] = [
        {
          id: 'tpl-1',
          name: 'Modèle Employé SYSCOHADA (Standard)',
          description: 'Structure de bulletin standard pour employés non-cadres.',
          category: 'Non-Cadre',
          rubriqueIds: ['rub-101', 'rub-104', 'rub-115', 'rub-301', 'rub-310', 'rub-320', 'rub-330', 'rub-401'],
          status: 'Actif'
        },
        {
          id: 'tpl-2',
          name: 'Modèle Cadre de Direction',
          description: 'Modèle de paie complet pour cadres supérieurs.',
          category: 'Cadre',
          rubriqueIds: ['rub-101', 'rub-104', 'rub-110', 'rub-115', 'rub-301', 'rub-310', 'rub-320', 'rub-330', 'rub-401'],
          status: 'Actif'
        }
      ];
      setTemplates(defaultTemplates);
      if (!payroll.templateId) {
        setPayroll(p => ({ ...p, templateId: defaultTemplates[0].id }));
      }
    }

    // Auto generate matricule on mount
    const empKey = `employees_${dossierKey}`;
    const savedEmps = localStorage.getItem(empKey);
    const count = savedEmps ? JSON.parse(savedEmps).length : 0;
    setPersonal(p => ({
      ...p,
      matricule: `EMP2026-${String(count + 1).padStart(3, '0')}`
    }));
  }, [dossierKey]);

  // Update dates intelligently based on Hire Date
  const handleHireDateChange = (val: string) => {
    setContract(c => ({
      ...c,
      hireDate: val,
      startDate: val,
      seniorityDate: val
    }));
  };

  // End Date & Duration Calculations
  const calculateEndDate = (startDate: string, months: number) => {
    if (!startDate || !months) return '';
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + Number(months));
    return date.toISOString().substring(0, 10);
  };

  const calculateMonths = (start: string, end: string) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diffYears = e.getFullYear() - s.getFullYear();
    const diffMonths = e.getMonth() - s.getMonth();
    return Math.max(0, diffYears * 12 + diffMonths);
  };

  const handleContractFieldChange = (field: string, value: any) => {
    setContract(prev => {
      const updated = { ...prev, [field]: value };
      
      // Reactive date logic
      if (field === 'startDate') {
        if (updated.durationMonths > 0) {
          updated.endDate = calculateEndDate(value, updated.durationMonths);
        } else if (updated.endDate) {
          updated.durationMonths = calculateMonths(value, updated.endDate);
        }
      } else if (field === 'endDate') {
        updated.durationMonths = calculateMonths(updated.startDate, value);
      } else if (field === 'durationMonths') {
        updated.endDate = calculateEndDate(updated.startDate, Number(value));
      }
      
      return updated;
    });
  };

  // Auto adjust base salary and transport allowance based on contract type
  useEffect(() => {
    if (contract.type === 'stagiaire') {
      setPayroll(p => ({
        ...p,
        baseSalary: 75000,
        transportAllowance: 0,
        superSalary: 0
      }));
    } else {
      setPayroll(p => ({
        ...p,
        baseSalary: 75000,
        transportAllowance: 30000,
        superSalary: 0
      }));
    }
  }, [contract.type]);

  // Update hourly rate automatically when base salary or sur-salaire changes (standard monthly hours = 173.33)
  useEffect(() => {
    const computedHourlyRate = Number(((payroll.baseSalary + (payroll.superSalary || 0)) / 173.33).toFixed(2));
    setPayroll(p => ({
      ...p,
      hourlyRate: computedHourlyRate
    }));
  }, [payroll.baseSalary, payroll.superSalary]);

  // Handle email auto generation based on Nom and Prénom
  const handleNameOrFirstNamesChange = (field: 'name' | 'firstNames', val: string) => {
    setPersonal(prev => {
      const updated = { ...prev, [field]: val };
      const cleanedFirst = updated.firstNames ? updated.firstNames.trim().split(' ')[0].toLowerCase() : '';
      const cleanedLast = updated.name ? updated.name.trim().replace(/\s+/g, '').toLowerCase() : '';
      
      if (cleanedFirst && cleanedLast) {
        updated.email = `${cleanedFirst}.${cleanedLast}@socix.ci`;
      }
      return updated;
    });
  };

  // Simulating drag-and-drop or manual upload
  const handleSimulateUpload = (docType: string, fileName: string) => {
    setAttachedFiles(prev => ({
      ...prev,
      [docType]: { name: fileName, size: '2.1 MB', status: 'loading' }
    }));

    setTimeout(() => {
      setAttachedFiles(prev => ({
        ...prev,
        [docType]: { ...prev[docType], status: 'success' }
      }));
    }, 1200);
  };

  const handleFileDrop = (e: React.DragEvent, docType: string) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleSimulateUpload(docType, files[0].name);
    }
  };

  // Cascading Address Handlers
  const handleCountrySelectChange = (val: string) => {
    if (val === 'Autre') {
      setCoords(prev => ({
        ...prev,
        country: 'Autre',
        city: 'Autre',
        commune: 'Autre',
        customCountry: '',
        customCity: '',
        customCommune: ''
      }));
    } else {
      const availableCities = Object.keys(GEOGRAPHY_DATA[val] || {});
      const fallbackCity = availableCities[0] || '';
      const availableCommunes = GEOGRAPHY_DATA[val]?.[fallbackCity] || [];
      const fallbackCommune = availableCommunes[0] || '';
      setCoords(prev => ({
        ...prev,
        country: val,
        city: fallbackCity,
        commune: fallbackCommune,
        customCountry: '',
        customCity: '',
        customCommune: ''
      }));
    }
  };

  const handleCitySelectChange = (val: string) => {
    if (val === 'Autre') {
      setCoords(prev => ({
        ...prev,
        city: 'Autre',
        commune: 'Autre',
        customCity: '',
        customCommune: ''
      }));
    } else {
      const availableCommunes = GEOGRAPHY_DATA[coords.country]?.[val] || [];
      const fallbackCommune = availableCommunes[0] || '';
      setCoords(prev => ({
        ...prev,
        city: val,
        commune: fallbackCommune,
        customCity: '',
        customCommune: ''
      }));
    }
  };

  // Key-press tab trigger for RIB inputs
  const handleRibPartChange = (field: keyof typeof ribParts, val: string, maxLen: number, nextInputId?: string) => {
    const cleaned = val.replace(/\D/g, '').substring(0, maxLen); // keep only digits
    setRibParts(prev => ({ ...prev, [field]: cleaned }));
    if (cleaned.length === maxLen && nextInputId) {
      const el = document.getElementById(nextInputId);
      if (el) el.focus();
    }
  };

  // Add items inside CV Detailed
  const addEducation = () => {
    if (!newEdu.degree || !newEdu.title || !newEdu.school || !newEdu.year) return;
    setEducations([...educations, { id: `edu-${Date.now()}`, ...newEdu }]);
    setNewEdu({ degree: 'Licence', title: '', school: '', year: '' });
  };

  const addCertificate = () => {
    if (!newCert.name || !newCert.issuer || !newCert.year) return;
    setCertificates([...certificates, { id: `cert-${Date.now()}`, ...newCert }]);
    setNewCert({ name: '', issuer: '', year: '' });
  };

  const addExperience = () => {
    if (!newExp.company || !newExp.role || !newExp.period) return;
    setExperiences([...experiences, { id: `exp-${Date.now()}`, ...newExp }]);
    setNewExp({ company: '', role: '', period: '', description: '' });
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (tag: string) => {
    setSkills(skills.filter(s => s !== tag));
  };

  // Form submit
  const handleFinalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!personal.name || !personal.firstNames) {
      alert("Veuillez remplir au moins le nom et les prénoms de l'employé.");
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Resolve cascading locations
      const resolvedCountry = coords.country === 'Autre' ? coords.customCountry : coords.country;
      const resolvedCity = coords.city === 'Autre' ? coords.customCity : coords.city;
      const resolvedCommune = coords.commune === 'Autre' ? coords.customCommune : coords.commune;

      const finalCoords = {
        ...coords,
        country: resolvedCountry,
        city: resolvedCity,
        commune: resolvedCommune
      };

      // Structure the complete employee object with rich details
      const fullEmployeeData = {
        id: `emp-${Date.now()}`,
        matricule: personal.matricule || `EMP2026-${String(Date.now()).substring(7)}`,
        name: `${personal.name.toUpperCase()} ${personal.firstNames}`,
        email: personal.email,
        phone: personal.phone,
        department: position.department,
        position: position.title || 'Salarié',
        hireDate: contract.hireDate,
        salary: payroll.baseSalary,
        status: 'Actif' as const,
        
        // Extended Rich Attributes captured in this wizard
        personalDetails: { 
          ...personal,
          childrenCount: personal.childrenCount,
          children: childrenDetails
        },
        coordinates: finalCoords,
        contractDetails: { ...contract },
        positionDetails: { ...position },
        payrollDetails: { ...payroll },
        attachments: Object.keys(attachedFiles).reduce((acc, key) => {
          if (attachedFiles[key].status === 'success') {
            acc[key] = attachedFiles[key].name;
          }
          return acc;
        }, {} as Record<string, string>),
        cvDetailed: {
          educations,
          certificates,
          experiences,
          skills
        }
      };

      // Load employees list, prepend, and save
      const empKey = `employees_${dossierKey}`;
      const savedEmps = localStorage.getItem(empKey);
      const currentList: Employee[] = savedEmps ? JSON.parse(savedEmps) : [];
      const updatedList = [fullEmployeeData, ...currentList];
      localStorage.setItem(empKey, JSON.stringify(updatedList));

      // Create a contract row in contracts view list as well for consistency
      const contractKey = `contracts_${dossierKey}`;
      const savedContracts = localStorage.getItem(contractKey);
      const currentContracts = savedContracts ? JSON.parse(savedContracts) : [];
      const newContractRow = {
        id: `c-${Date.now()}`,
        employeeId: fullEmployeeData.id,
        employeeName: fullEmployeeData.name,
        type: contract.nature as any,
        startDate: contract.startDate,
        endDate: contract.endDate || undefined,
        salary: payroll.baseSalary,
        trialPeriod: '3 mois',
        status: 'Actif' as const
      };
      localStorage.setItem(contractKey, JSON.stringify([newContractRow, ...currentContracts]));

      // Write action log
      saveActionLog(dossierKey, {
        type: 'Création',
        desc: "Fiche d'embauche unique complétée",
        details: `Embauche de ${fullEmployeeData.name} (${fullEmployeeData.matricule}) enregistrée avec succès. Modèle de bulletin lié : ${payroll.templateId || 'Par défaut'}.`
      });

      setIsSubmitting(false);
      onBack();
    }, 1500);
  };

  const steps = [
    { num: 1, label: 'Infos personnelles', icon: User },
    { num: 2, label: 'Coordonnées', icon: MapPin },
    { num: 3, label: 'Contrat', icon: FileText },
    { num: 4, label: 'Poste', icon: Briefcase },
    { num: 5, label: 'Paie', icon: Coins },
    { num: 6, label: 'Dossier', icon: FileUp },
    { num: 7, label: 'CV détaillé', icon: Award },
    { num: 8, label: 'Récapitulatif', icon: CheckCircle2 }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header and Back bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-150 cursor-pointer shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Fiche d'embauche unique</h2>
            <p className="text-xs text-slate-400">Processus réglementaire de création de profil collaborateur</p>
          </div>
        </div>
        
        <div className="bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
            Dossier Actif : <span className="text-slate-800">{dossierKey}</span>
          </span>
        </div>
      </div>

      {/* Stepper Wizard Indicator */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-center gap-2">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > step.num;
            const isActive = currentStep === step.num;
            
            return (
              <React.Fragment key={step.num}>
                <div 
                  onClick={(e) => { e.preventDefault(); setCurrentStep(step.num); }}
                  className="flex items-center gap-2.5 cursor-pointer group shrink-0"
                >
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border font-bold text-xs",
                    isActive ? "bg-slate-900 text-white border-transparent scale-110 shadow-md shadow-slate-900/10" :
                    isCompleted ? "bg-emerald-50 text-emerald-600 border-transparent" :
                    "bg-slate-50 text-slate-400 border-slate-200 group-hover:bg-slate-100 group-hover:text-slate-600"
                  )}>
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.num}
                  </div>
                  
                  <div className="text-left hidden md:block">
                    <p className={cn(
                      "text-[9px] font-black uppercase tracking-wider leading-none",
                      isActive ? "text-slate-900" : "text-slate-400"
                    )}>
                      Étape 0{step.num}
                    </p>
                    <p className={cn(
                      "text-xs font-bold mt-1",
                      isActive ? "text-slate-900" :
                      isCompleted ? "text-slate-600 font-semibold" :
                      "text-slate-400 font-medium"
                    )}>
                      {step.label}
                    </p>
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block h-[1px] bg-slate-150 flex-1 mx-2" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Primary Form Card */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[420px] flex flex-col justify-between">
        
        {/* Step Contents */}
        <div className="p-8">
          
          {/* STEP 1: INFOS PERSONNELLES */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-[#4A9EC9]" /> Informations personnelles d'identité
                </h3>
                <p className="text-xs text-slate-400 mt-1">Identité civile légale et coordonnées primaires pour la sécurité sociale</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Matricule Interne *</label>
                  <input 
                    type="text" 
                    required
                    value={personal.matricule}
                    onChange={e => setPersonal({...personal, matricule: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-black text-slate-800 focus:border-[#4A9EC9] outline-none"
                    placeholder="ex: EMP2026-005"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom de famille *</label>
                  <input 
                    type="text" 
                    required
                    value={personal.name}
                    onChange={e => handleNameOrFirstNamesChange('name', e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] uppercase"
                    placeholder="ex: TOURE"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prénoms *</label>
                  <input 
                    type="text" 
                    required
                    value={personal.firstNames}
                    onChange={e => handleNameOrFirstNamesChange('firstNames', e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9]"
                    placeholder="ex: Mamadou"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date de Naissance *</label>
                  <input 
                    type="date" 
                    required
                    value={personal.birthDate}
                    onChange={e => setPersonal({...personal, birthDate: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lieu de naissance *</label>
                  <input 
                    type="text" 
                    required
                    value={personal.birthPlace}
                    onChange={e => setPersonal({...personal, birthPlace: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9]"
                    placeholder="ex: Bouaké, Côte d'Ivoire"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nationalité *</label>
                  <select 
                    value={personal.nationality}
                    onChange={e => setPersonal({...personal, nationality: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9] cursor-pointer"
                  >
                    <option value="Ivoirienne">Ivoirienne</option>
                    <option value="Sénégalaise">Sénégalaise</option>
                    <option value="Malienne">Malienne</option>
                    <option value="Burkinabé">Burkinabé</option>
                    <option value="Guinéenne">Guinéenne</option>
                    <option value="Togolaise">Togolaise</option>
                    <option value="Béninoise">Béninoise</option>
                    <option value="Camerounaise">Camerounaise</option>
                    <option value="Gabonaise">Gabonaise</option>
                    <option value="Congolaise">Congolaise</option>
                    <option value="Française">Française</option>
                    <option value="Autre">Autre...</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut matrimonial</label>
                  <select 
                    value={personal.maritalStatus}
                    onChange={e => setPersonal({...personal, maritalStatus: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9]"
                  >
                    <option value="Célibataire">Célibataire</option>
                    <option value="Marié(e)">Marié(e)</option>
                    <option value="Divorcé(e)">Divorcé(e)</option>
                    <option value="Veuf(ve)">Veuf(ve)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre d'enfants à charge</label>
                  <input 
                    type="number" 
                    min="0"
                    value={personal.childrenCount}
                    onChange={e => setPersonal({...personal, childrenCount: Math.max(0, Number(e.target.value))})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Numéro CNI / Passeport</label>
                  <input 
                    type="text" 
                    value={personal.cniNumber}
                    onChange={e => setPersonal({...personal, cniNumber: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold outline-none focus:border-[#4A9EC9]"
                    placeholder="ex: C0123456789"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Numéro CMU (Couverture Maladie)</label>
                  <input 
                    type="text" 
                    value={personal.cmuNumber}
                    onChange={e => setPersonal({...personal, cmuNumber: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold outline-none focus:border-[#4A9EC9]"
                    placeholder="ex: 000-12345678-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Numéro Sécurité Sociale (CNPS)</label>
                  <input 
                    type="text" 
                    value={personal.socialSecurityNumber}
                    onChange={e => setPersonal({...personal, socialSecurityNumber: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold outline-none focus:border-[#4A9EC9]"
                    placeholder="ex: 1-00123456-78"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="col-span-1 md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adresse Principale (Quartier / Ville)</label>
                  <input 
                    type="text" 
                    value={personal.address}
                    onChange={e => setPersonal({...personal, address: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9]"
                    placeholder="ex: Cocody Mermoz, Rue des Banquiers"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">N° de Contact Téléphone *</label>
                  <input 
                    type="text" 
                    required
                    value={personal.phone}
                    onChange={e => setPersonal({...personal, phone: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9]"
                    placeholder="ex: +225 07 88 99 00 11"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adresse Email Institutionnelle</label>
                <input 
                  type="email" 
                  value={personal.email}
                  onChange={e => setPersonal({...personal, email: e.target.value})}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9]"
                  placeholder="ex: m.toure@socix.ci"
                />
              </div>

              {/* Child Info sub-forms (Smart section based on children count > 0) */}
              {personal.childrenCount > 0 && (
                <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-6 mt-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    👶 Informations détaillées des {personal.childrenCount} enfant(s) à charge
                  </span>

                  <div className="space-y-4">
                    {childrenDetails.map((child, index) => (
                      <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 relative">
                        <span className="absolute top-3 right-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                          Enfant #{index + 1}
                        </span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Nom de famille *</label>
                            <input 
                              type="text"
                              required
                              value={child.lastName}
                              onChange={e => {
                                const copy = [...childrenDetails];
                                copy[index].lastName = e.target.value.toUpperCase();
                                setChildrenDetails(copy);
                              }}
                              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-[#4A9EC9]"
                              placeholder="NOM"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Prénoms *</label>
                            <input 
                              type="text"
                              required
                              value={child.firstNames}
                              onChange={e => {
                                const copy = [...childrenDetails];
                                copy[index].firstNames = e.target.value;
                                setChildrenDetails(copy);
                              }}
                              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-[#4A9EC9]"
                              placeholder="Prénoms"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Date de naissance *</label>
                            <input 
                              type="date"
                              required
                              value={child.birthDate}
                              onChange={e => {
                                const copy = [...childrenDetails];
                                copy[index].birthDate = e.target.value;
                                setChildrenDetails(copy);
                              }}
                              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-[#4A9EC9]"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Extrait de naissance :</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const copy = [...childrenDetails];
                                copy[index].birthCertificate = `EXTRAIT_ENFANT_${index + 1}_${personal.name || 'EMPLOYE'}.pdf`;
                                setChildrenDetails(copy);
                              }}
                              className={cn(
                                "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border cursor-pointer transition-all flex items-center gap-1",
                                child.birthCertificate !== 'Non fourni' 
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" 
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              )}
                            >
                              <FileUp className="w-3 h-3" />
                              {child.birthCertificate !== 'Non fourni' ? "Extrait joint" : "Joindre l'extrait"}
                            </button>
                            {child.birthCertificate !== 'Non fourni' && (
                              <span className="text-[9px] text-slate-400 font-bold font-mono">
                                {child.birthCertificate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: COORDONNEES & BANQUE */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#4A9EC9]" /> Coordonnées de résidence & Banque
                </h3>
                <p className="text-xs text-slate-400 mt-1">Données géographiques de contact et informations d'identité bancaire</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Dependent Country Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pays *</label>
                  <select 
                    value={coords.country}
                    onChange={e => handleCountrySelectChange(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    <option value="Sénégal">Sénégal</option>
                    <option value="France">France</option>
                    <option value="Autre">Autre...</option>
                  </select>
                  {coords.country === 'Autre' && (
                    <input 
                      type="text"
                      required
                      placeholder="Saisir le pays..."
                      value={coords.customCountry}
                      onChange={e => setCoords({...coords, customCountry: e.target.value})}
                      className="w-full h-10 px-4 mt-2 bg-white border border-amber-300 rounded-xl text-xs font-bold outline-none focus:border-amber-400 animate-in slide-in-from-top-1"
                    />
                  )}
                </div>

                {/* Dependent City Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ville / Province *</label>
                  {coords.country === 'Autre' ? (
                    <input 
                      type="text"
                      required
                      placeholder="Saisir la ville..."
                      value={coords.customCity}
                      onChange={e => setCoords({...coords, customCity: e.target.value, city: 'Autre'})}
                      className="w-full h-11 px-4 bg-white border border-amber-300 rounded-xl text-xs font-bold outline-none focus:border-amber-400"
                    />
                  ) : (
                    <>
                      <select 
                        value={coords.city}
                        onChange={e => handleCitySelectChange(e.target.value)}
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
                      >
                        {Object.keys(GEOGRAPHY_DATA[coords.country] || {}).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                        <option value="Autre">Autre...</option>
                      </select>
                      {coords.city === 'Autre' && (
                        <input 
                          type="text"
                          required
                          placeholder="Saisir la ville..."
                          value={coords.customCity}
                          onChange={e => setCoords({...coords, customCity: e.target.value})}
                          className="w-full h-10 px-4 mt-2 bg-white border border-amber-300 rounded-xl text-xs font-bold outline-none focus:border-amber-400 animate-in slide-in-from-top-1"
                        />
                      )}
                    </>
                  )}
                </div>

                {/* Code Postal */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Code Postal</label>
                  <input 
                    type="text" 
                    value={coords.postalCode}
                    onChange={e => setCoords({...coords, postalCode: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    placeholder="BP 450 Abidjan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Dependent Commune Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commune *</label>
                  {coords.country === 'Autre' || coords.city === 'Autre' ? (
                    <input 
                      type="text"
                      required
                      placeholder="Saisir la commune..."
                      value={coords.customCommune}
                      onChange={e => setCoords({...coords, customCommune: e.target.value, commune: 'Autre'})}
                      className="w-full h-11 px-4 bg-white border border-amber-300 rounded-xl text-xs font-bold outline-none focus:border-amber-400"
                    />
                  ) : (
                    <>
                      <select 
                        value={coords.commune}
                        onChange={e => setCoords({...coords, commune: e.target.value})}
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
                      >
                        {(GEOGRAPHY_DATA[coords.country]?.[coords.city] || []).map(comm => (
                          <option key={comm} value={comm}>{comm}</option>
                        ))}
                        <option value="Autre">Autre...</option>
                      </select>
                      {coords.commune === 'Autre' && (
                        <input 
                          type="text"
                          required
                          placeholder="Saisir la commune..."
                          value={coords.customCommune}
                          onChange={e => setCoords({...coords, customCommune: e.target.value})}
                          className="w-full h-10 px-4 mt-2 bg-white border border-amber-300 rounded-xl text-xs font-bold outline-none focus:border-amber-400 animate-in slide-in-from-top-1"
                        />
                      )}
                    </>
                  )}
                </div>

                {/* Quartier / Précisions */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quartier / Précisions d'adresse</label>
                  <input 
                    type="text" 
                    value={coords.quartier}
                    onChange={e => setCoords({...coords, quartier: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    placeholder="ex: Zone 4, Rue du Canal"
                  />
                </div>
              </div>

              {/* Personne à prévenir en cas d'urgence */}
              <div className="bg-amber-50/60 rounded-2xl border border-amber-200/80 p-6 space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-900 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-amber-600" /> Personne à Prévenir en Cas d'Urgence
                  </span>
                  <p className="text-[11px] text-amber-800/80 mt-0.5">Coordonnées de la personne référente à contacter en priorité en cas d'accident ou d'urgence médicale.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nom & Prénoms du Contact *</label>
                    <input 
                      type="text"
                      required
                      value={coords.emergencyContactName}
                      onChange={e => setCoords({...coords, emergencyContactName: e.target.value})}
                      className="w-full h-11 px-4 bg-white border border-amber-200 rounded-xl text-xs font-bold outline-none focus:border-amber-500"
                      placeholder="ex: KASSI Henriette"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lien de Parenté / Relation</label>
                    <select
                      value={coords.emergencyContactRelation}
                      onChange={e => setCoords({...coords, emergencyContactRelation: e.target.value})}
                      className="w-full h-11 px-4 bg-white border border-amber-200 rounded-xl text-xs font-bold outline-none cursor-pointer focus:border-amber-500"
                    >
                      <option value="Conjoint(e)">Conjoint(e)</option>
                      <option value="Père / Mère">Père / Mère</option>
                      <option value="Frère / Sœur">Frère / Sœur</option>
                      <option value="Enfant Major">Enfant Majeur</option>
                      <option value="Oncle / Tante">Oncle / Tante</option>
                      <option value="Ami(e) / Proche">Ami(e) / Proche</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Numéro Téléphone d'Urgence *</label>
                    <input 
                      type="text"
                      required
                      value={coords.emergencyContactPhone}
                      onChange={e => setCoords({...coords, emergencyContactPhone: e.target.value})}
                      className="w-full h-11 px-4 bg-white border border-amber-200 rounded-xl text-xs font-mono font-black outline-none focus:border-amber-500 text-emerald-800"
                      placeholder="ex: +225 05 01 02 03 04"
                    />
                  </div>
                </div>
              </div>

              {/* Bank accounts and Splitted RIB inputs */}
              <div className="bg-slate-50/50 rounded-2xl border border-slate-150 p-6 space-y-5">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Détails de virement bancaire & Relevé d'Identité Bancaire (RIB)</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Veuillez décomposer le RIB ci-dessous pour assurer la conformité des télé-paiements bancaires.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Établissement bancaire</label>
                    <input 
                      type="text" 
                      value={coords.bankName}
                      onChange={e => setCoords({...coords, bankName: e.target.value})}
                      className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9]"
                      placeholder="ex: SIB (Société Ivoirienne de Banque)"
                    />
                  </div>

                  {/* Splitted RIB Layout */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saisie découpée du RIB (West Africa Standard)</label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-150">
                      
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Code Banque (5)</span>
                        <input 
                          type="text" 
                          id="rib-bank-code"
                          value={ribParts.bankCode}
                          onChange={e => handleRibPartChange('bankCode', e.target.value, 5, 'rib-branch-code')}
                          placeholder="CI056"
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-black text-center outline-none focus:border-[#4A9EC9]"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Code Guichet (5)</span>
                        <input 
                          type="text" 
                          id="rib-branch-code"
                          value={ribParts.branchCode}
                          onChange={e => handleRibPartChange('branchCode', e.target.value, 5, 'rib-account-number')}
                          placeholder="01001"
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-black text-center outline-none focus:border-[#4A9EC9]"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">N° de Compte (11)</span>
                        <input 
                          type="text" 
                          id="rib-account-number"
                          value={ribParts.accountNumber}
                          onChange={e => handleRibPartChange('accountNumber', e.target.value, 11, 'rib-key')}
                          placeholder="00123456789"
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-black text-center outline-none focus:border-[#4A9EC9]"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Clé RIB (2)</span>
                        <input 
                          type="text" 
                          id="rib-key"
                          value={ribParts.ribKey}
                          onChange={e => handleRibPartChange('ribKey', e.target.value, 2)}
                          placeholder="32"
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-black text-center outline-none focus:border-[#4A9EC9]"
                        />
                      </div>

                    </div>
                    {coords.rib && (
                      <p className="text-[9px] text-[#4A9EC9] font-mono font-bold">
                        RIB Assemblé : <span className="bg-[#4A9EC9]/10 px-2 py-0.5 rounded-md text-slate-700 font-black">{coords.rib}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONTRAT */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#4A9EC9]" /> Caractéristiques du Contrat
                </h3>
                <p className="text-xs text-slate-400 mt-1">Définition de la nature du contrat, des types de collaborations et des dates clefs</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nature du contrat *</label>
                  <select 
                    value={contract.nature}
                    onChange={e => handleContractFieldChange('nature', e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="CDI">CDI (Contrat à Durée Indéterminée)</option>
                    <option value="CDD">CDD (Contrat à Durée Déterminée)</option>
                    <option value="Stage">Stage (École ou de Perfectionnement)</option>
                    <option value="Consultant">Consultant / Freelance externe</option>
                    <option value="Interim">Contrat Intérimaire</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type de Collaborateur *</label>
                  <select 
                    value={contract.type}
                    onChange={e => handleContractFieldChange('type', e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer capitalize"
                  >
                    <option value="salarié">salarié</option>
                    <option value="prestataire">prestataire</option>
                    <option value="stagiaire">stagiaire</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Situation *</label>
                  <select 
                    value={contract.situation || 'local'}
                    onChange={e => handleContractFieldChange('situation', e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer capitalize"
                  >
                    <option value="local">local</option>
                    <option value="expatrié">expatrié</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date d'embauche officielle *</label>
                  <input 
                    type="date" 
                    required
                    value={contract.hireDate}
                    onChange={e => handleHireDateChange(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9]"
                  />
                  <p className="text-[10px] text-[#4A9EC9] font-bold">Renseigne automatiquement les dates suivantes.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date d'effet / de début *</label>
                  <input 
                    type="date" 
                    required
                    value={contract.startDate}
                    onChange={e => handleContractFieldChange('startDate', e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date d'ancienneté calculée *</label>
                  <input 
                    type="date" 
                    required
                    value={contract.seniorityDate}
                    onChange={e => handleContractFieldChange('seniorityDate', e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  />
                </div>
              </div>

              {/* Toggle Date de Fin & Durée if not CDI */}
              {contract.nature !== 'CDI' && (
                <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-6 space-y-4 animate-in slide-in-from-top-4 duration-350">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Info className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Durée contractuelle obligatoire</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-amber-900/60 uppercase tracking-widest">Durée contractuelle (Mois) *</label>
                      <input 
                        type="number" 
                        min="1"
                        required
                        value={contract.durationMonths || ''}
                        onChange={e => handleContractFieldChange('durationMonths', Number(e.target.value))}
                        className="w-full h-11 px-4 bg-white border border-amber-200 rounded-xl text-xs font-bold outline-none focus:border-amber-400 text-amber-900"
                        placeholder="Ex: 6, 12..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-amber-900/60 uppercase tracking-widest">Date de fin du contrat *</label>
                      <input 
                        type="date" 
                        required
                        value={contract.endDate}
                        onChange={e => handleContractFieldChange('endDate', e.target.value)}
                        className="w-full h-11 px-4 bg-white border border-amber-200 rounded-xl text-xs font-bold outline-none focus:border-amber-400 text-amber-900"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: POSTE */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#4A9EC9]" /> Affectation & Structure du Poste
                </h3>
                <p className="text-xs text-slate-400 mt-1">Configuration hiérarchique, conventions collectives et taxes sur le revenu (Parts IGR)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intitulé du Poste / Emploi *</label>
                  <input 
                    type="text" 
                    required
                    value={position.title}
                    onChange={e => setPosition({...position, title: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9]"
                    placeholder="ex: Contrôleur de Gestion"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Convention Collective Applicable</label>
                  <select 
                    value={position.collectiveAgreement}
                    onChange={e => setPosition({...position, collectiveAgreement: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="Convention Collective Interprofessionnelle (CCI)">Convention Collective Interprofessionnelle (CCI)</option>
                    <option value="Convention Collective des Banques & Établissements Financiers">Convention Collective des Banques & Financier</option>
                    <option value="Convention Collective des Industries Forestières">Convention Collective des Industries Forestières</option>
                    <option value="Régime Spécial de Consultation Unikorp">Régime Spécial de Consultation Unikorp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Département d'appartenance *</label>
                  <select 
                    value={position.department}
                    onChange={e => setPosition({...position, department: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="Finances">Finances & Comptabilité</option>
                    <option value="RH">Ressources Humaines</option>
                    <option value="Logistique">Logistique & Transit</option>
                    <option value="Marketing">Marketing & Comm</option>
                    <option value="Informatique">Systèmes d'Information</option>
                    <option value="Direction">Direction Générale</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service spécifique</label>
                  <input 
                    type="text" 
                    value={position.service}
                    onChange={e => setPosition({...position, service: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    placeholder="ex: Trésorerie Internationale"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filière / Métier (Emploi)</label>
                  <input 
                    type="text" 
                    value={position.employmentType}
                    onChange={e => setPosition({...position, employmentType: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    placeholder="ex: Finances & Comptabilité"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie Socioprofessionnelle</label>
                  <select 
                    value={position.category}
                    onChange={e => setPosition({...position, category: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="Employé - Collège 1">Employé - Collège 1</option>
                    <option value="Agent de Maîtrise - Collège 2">Agent de Maîtrise - Collège 2</option>
                    <option value="Cadre - Collège 3 (A)">Cadre - Collège 3 (A)</option>
                    <option value="Cadre Supérieur - Collège 3 (B)">Cadre Supérieur - Collège 3 (B)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre de personnes CMU</label>
                  <input 
                    type="number" 
                    min="1"
                    value={position.cmuCount}
                    onChange={e => setPosition({...position, cmuCount: Number(e.target.value)})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre de Parts IGR (Fisc) *</label>
                  <select 
                    value={position.igrParts}
                    onChange={e => setPosition({...position, igrParts: Number(e.target.value)})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="1">1 part (Célibataire)</option>
                    <option value="1.5">1.5 part</option>
                    <option value="2">2 parts (Marié sans enfant)</option>
                    <option value="2.5">2.5 parts</option>
                    <option value="3">3 parts</option>
                    <option value="3.5">3.5 parts</option>
                    <option value="4">4 parts</option>
                    <option value="4.5">4.5 parts</option>
                    <option value="5">5 parts (Maximum légal)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PAIE (SIMPLIFIED) */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#4A9EC9]" /> Éléments financiers de paie
                </h3>
                <p className="text-xs text-slate-400 mt-1">Liaison au gabarit de salaire, primes forfaitaires et calcul automatique du taux horaire réglementaire</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bulletin Modèle lié *</label>
                  <select 
                    value={payroll.templateId}
                    onChange={e => setPayroll({...payroll, templateId: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
                  >
                    {templates.map(tpl => (
                      <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Périodicité de calcul</label>
                  <select 
                    value={payroll.payrollType}
                    onChange={e => setPayroll({...payroll, payrollType: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="Mensuel">Mensuel (Standard)</option>
                    <option value="Horaire">Horaire (Saisonnier)</option>
                    <option value="Journalier">Journalier (Chantier)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Heures mensuelles *</label>
                    <span className="text-[8px] text-[#4A9EC9] font-black uppercase tracking-wider bg-[#4A9EC9]/10 px-2 py-0.5 rounded-full">Légal</span>
                  </div>
                  <input 
                    type="text" 
                    readOnly
                    value="173,33"
                    className="w-full h-11 px-4 bg-slate-100 border border-slate-200 rounded-xl text-xs font-black text-slate-500 font-mono outline-none cursor-not-allowed"
                    placeholder="173,33"
                  />
                  <p className="text-[9px] text-slate-400 font-medium">Auto-estimé sur la base de : Salaire de base / 173.33 heures réglementaires.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {contract.type === 'stagiaire' ? 'Prime de stage (FCFA) *' : 'Salaire de Base Mensuel Brut (FCFA) *'}
                  </label>
                  <input 
                    type="number" 
                    required
                    value={payroll.baseSalary}
                    onChange={e => setPayroll({...payroll, baseSalary: Number(e.target.value)})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-black text-slate-900 outline-none"
                    placeholder="Ex: 75000"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sur Salaire Mensuel Brut (FCFA)</label>
                  <input 
                    type="number" 
                    value={payroll.superSalary || 0}
                    onChange={e => setPayroll({...payroll, superSalary: Number(e.target.value)})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-black text-slate-900 outline-none"
                    placeholder="Ex: 0"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prime de Transport (FCFA)</label>
                  <input 
                    type="number" 
                    value={payroll.transportAllowance}
                    onChange={e => setPayroll({...payroll, transportAllowance: Number(e.target.value)})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-black text-[#111] outline-none"
                    placeholder="Ex: 30000"
                  />
                </div>
              </div>

              {/* Simplified payroll notification banner */}
              <div className="bg-slate-50 rounded-2xl border border-slate-150 p-5 flex items-start gap-4">
                <div className="p-2 rounded-xl bg-white border border-slate-200 text-[#4A9EC9]">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Traitement automatique simplifié</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Les charges sociales (CNPS, Assurance Maladie) et fiscales (IGR, IS, TA) seront automatiquement ventilées lors du calcul des bulletins en fonction des paramètres du bulletin modèle rattaché à ce collaborateur.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: DOSSIER */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileUp className="w-4 h-4 text-[#4A9EC9]" /> Pièces justificatives du dossier RH
                </h3>
                <p className="text-xs text-slate-400 mt-1">Indexation des documents officiels requis pour la conformité administrative</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  { id: 'cv', label: 'Curriculum Vitae (CV) *', placeholder: 'Attacher le CV de l\'employé (PDF)' },
                  { id: 'cni', label: 'Pièce d\'identité (CNI / Passeport) *', placeholder: 'Justificatif d\'identité nationale' },
                  { id: 'cmu', label: 'Carte CMU (Couverture Maladie) *', placeholder: 'Scanné de la carte CMU officielle de l\'employé' },
                  { id: 'rib', label: 'Relevé d\'Identité Bancaire (RIB) *', placeholder: 'Scan du RIB pour le virement des salaires' },
                  { id: 'casier_b3', label: 'Extrait de Casier Judiciaire (Bulletin N° 3) *', placeholder: 'Bulletin de casier judiciaire datant de moins de 3 mois' },
                  { id: 'dossier_juridique', label: 'Dossier Juridique & Disciplinaire', placeholder: 'Documents contentieux ou affaires judiciaires le cas échéant' },
                  { id: 'certificat_residence', label: 'Certificat de Résidence & Domiciliation', placeholder: 'Certificat de résidence délivré par la mairie ou sous-préfecture' },
                  { id: 'permis', label: 'Permis de Conduire', placeholder: 'Copie numérisée du permis de conduire valide' },
                  { id: 'diplomes', label: 'Diplômes & Certifications *', placeholder: 'Scans des diplômes académiques & certificats' },
                  { id: 'extrait', label: 'Extrait d\'Acte de Naissance', placeholder: 'Copie certifiée de l\'extrait de naissance' },
                  { id: 'certificat_travail', label: 'Certificats de Travail Antérieurs', placeholder: 'Attestations et certificats de travail passés' },
                  { id: 'photo', label: 'Photo d\'Identité Officielle', placeholder: 'Photo d\'identité au format PNG ou JPG' }
                ].map((doc) => {
                  const fileState = attachedFiles[doc.id];
                  
                  return (
                    <div 
                      key={doc.id}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleFileDrop(e, doc.id)}
                      className="border-2 border-dashed border-slate-200 hover:border-[#4A9EC9] rounded-2xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-center items-center text-center space-y-2.5 cursor-pointer group"
                      onClick={() => handleSimulateUpload(doc.id, `JUSTIF_${doc.id.toUpperCase()}_${personal.name || 'EMPLOYE'}.pdf`)}
                    >
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-150 flex items-center justify-center text-slate-400 group-hover:text-[#4A9EC9] transition-all shadow-xs">
                        {fileState?.status === 'loading' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <FileUp className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{doc.label}</p>
                        <p className="text-[9px] text-slate-400 font-medium mt-0.5">{doc.placeholder}</p>
                      </div>

                      {fileState?.status === 'success' ? (
                        <div className="bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Téléchargé avec succès
                        </div>
                      ) : fileState?.status === 'loading' ? (
                        <p className="text-[8px] text-slate-400 font-bold animate-pulse">Indexation en cours...</p>
                      ) : (
                        <p className="text-[8px] text-slate-400 font-bold">Glisser-déposer ou cliquer pour attacher</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: CV DETAILLE */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#4A9EC9]" /> Curriculum Vitae Détaillé
                </h3>
                <p className="text-xs text-slate-400 mt-1">Renseignez le parcours académique, professionnel et les compétences métiers clefs</p>
              </div>

              {/* 1. Formations / Études */}
              <div className="bg-slate-50/50 rounded-2xl border border-slate-150 p-6 space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-slate-400" /> Formations académiques & Diplômes
                </span>
                
                {/* Education list */}
                <div className="space-y-2">
                  {educations.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                      <div>
                        <p className="text-xs font-black text-slate-800">
                          <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider mr-2 font-black">{edu.degree}</span>
                          {edu.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{edu.school} • {edu.year}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setEducations(educations.filter(e => e.id !== edu.id))}
                        className="w-7 h-7 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center border-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Quick Add Form */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Diplôme</label>
                    <select
                      value={newEdu.degree}
                      onChange={e => setNewEdu({...newEdu, degree: e.target.value})}
                      className="w-full h-10 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none cursor-pointer"
                    >
                      <option value="BAC">BAC</option>
                      <option value="BTS">BTS</option>
                      <option value="Licence">Licence</option>
                      <option value="Master">Master</option>
                      <option value="Doctorat">Doctorat</option>
                      <option value="Ingénieur">Ingénieur</option>
                    </select>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Titre / Nom de la formation</label>
                    <input 
                      type="text" 
                      placeholder="ex: Audit et Contrôle de Gestion"
                      value={newEdu.title}
                      onChange={e => setNewEdu({...newEdu, title: e.target.value})}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-[#4A9EC9]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Établissement d'obtention</label>
                    <input 
                      type="text" 
                      placeholder="ex: INPHB Yamoussoukro"
                      value={newEdu.school}
                      onChange={e => setNewEdu({...newEdu, school: e.target.value})}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-[#4A9EC9]"
                    />
                  </div>
                  <div className="md:col-span-4 flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <input 
                      type="text" 
                      placeholder="Année (ex: 2024)"
                      value={newEdu.year}
                      onChange={e => setNewEdu({...newEdu, year: e.target.value})}
                      className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none w-36"
                    />
                    <button 
                      type="button"
                      onClick={addEducation}
                      className="bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:opacity-90 px-5 border-0 cursor-pointer flex items-center justify-center"
                    >
                      Ajouter ce diplôme
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Expérience Professionnelle */}
              <div className="bg-slate-50/50 rounded-2xl border border-slate-150 p-6 space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-400" /> Expériences professionnelles passées
                </span>

                {/* Experience list */}
                <div className="space-y-2">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="flex justify-between items-start bg-white p-3 rounded-xl border border-slate-200">
                      <div>
                        <p className="text-xs font-black text-slate-800">{exp.role}</p>
                        <p className="text-[10px] text-[#4A9EC9] font-bold uppercase">{exp.company} • {exp.period}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">{exp.description}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setExperiences(experiences.filter(e => e.id !== exp.id))}
                        className="w-7 h-7 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center border-0 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Quick Add Form */}
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input 
                      type="text" 
                      placeholder="Entreprise (ex: PwC Côte d'Ivoire)"
                      value={newExp.company}
                      onChange={e => setNewExp({...newExp, company: e.target.value})}
                      className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="Poste occupé (ex: Assistant Auditeur)"
                      value={newExp.role}
                      onChange={e => setNewExp({...newExp, role: e.target.value})}
                      className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="Période (ex: 2024 - 2025)"
                      value={newExp.period}
                      onChange={e => setNewExp({...newExp, period: e.target.value})}
                      className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Brève description des réalisations..."
                      value={newExp.description}
                      onChange={e => setNewExp({...newExp, description: e.target.value})}
                      className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    />
                    <button 
                      type="button"
                      onClick={addExperience}
                      className="px-5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 border-0 cursor-pointer flex items-center justify-center"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Certifications & Compétences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Certifications */}
                <div className="bg-slate-50/50 rounded-2xl border border-slate-150 p-6 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Certifications obtenues</span>
                  
                  <div className="space-y-2">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                        <div>
                          <p className="text-xs font-black text-slate-800">{cert.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{cert.issuer} • {cert.year}</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setCertificates(certificates.filter(c => c.id !== cert.id))}
                          className="w-7 h-7 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center border-0 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="Certification (ex: PMP)"
                      value={newCert.name}
                      onChange={e => setNewCert({...newCert, name: e.target.value})}
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Organisme émetteur"
                        value={newCert.issuer}
                        onChange={e => setNewCert({...newCert, issuer: e.target.value})}
                        className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                      />
                      <input 
                        type="text" 
                        placeholder="Année"
                        value={newCert.year}
                        onChange={e => setNewCert({...newCert, year: e.target.value})}
                        className="w-16 h-10 px-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none text-center"
                      />
                      <button 
                        type="button"
                        onClick={addCertificate}
                        className="bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 border-0 cursor-pointer flex items-center justify-center px-4"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>

                {/* Compétences Tags */}
                <div className="bg-slate-50/50 rounded-2xl border border-slate-150 p-6 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Compétences métiers & Savoir-faire</span>
                  
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Taper une compétence puis appuyer sur Entrée..."
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                      className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#4A9EC9]"
                    />

                    <div className="flex flex-wrap gap-2 min-h-16 p-3 bg-white rounded-2xl border border-slate-200">
                      {skills.map((skill) => (
                        <span 
                          key={skill} 
                          className="px-2.5 py-1 bg-slate-50 border border-slate-150 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-xl flex items-center gap-1 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-250 cursor-pointer transition-colors"
                          onClick={() => removeSkill(skill)}
                          title="Cliquez pour supprimer"
                        >
                          {skill} ×
                        </span>
                      ))}
                      {skills.length === 0 && (
                        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest m-auto">Aucune compétence ajoutée</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 8: RECAPITULATIF (BENTO-GRID STYLE REVIEW) */}
          {currentStep === 8 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-5 rounded-2xl shadow-lg">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Récapitulatif global de l'embauche
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">Veuillez relire attentivement l'ensemble des fiches indexées ou prévisualiser la Fiche Signalétique A4 avant validation.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowA4Modal(true)}
                  className="px-4 py-2.5 bg-[#4A9EC9] hover:bg-[#3D8CB7] text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border-0 cursor-pointer shadow-lg shadow-[#4A9EC9]/30 transition-all shrink-0"
                >
                  <Eye className="w-4 h-4" /> Visualiser la Fiche A4 (Printable)
                </button>
              </div>

              {/* Bento Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. Identity Box */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Identité & État civil
                  </span>
                  
                  <div className="space-y-1.5 text-xs font-bold text-slate-800">
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400">Matricule :</span>
                      <span className="font-mono text-[11px] text-slate-900">{personal.matricule}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400">Nom complet :</span>
                      <span className="uppercase text-slate-900">{personal.name} {personal.firstNames}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400">Né(e) le :</span>
                      <span>{personal.birthDate} à {personal.birthPlace}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400">N° CNI :</span>
                      <span className="font-mono text-[11px] text-slate-900">{personal.cniNumber || 'Non renseigné'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400">N° CMU :</span>
                      <span className="font-mono text-[11px] text-slate-900">{personal.cmuNumber || 'Non renseigné'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400">N° CNPS :</span>
                      <span className="font-mono text-[11px] text-slate-900">{personal.socialSecurityNumber || 'Non renseigné'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400">Statut :</span>
                      <span>{personal.maritalStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Enfants à charge :</span>
                      <span className="bg-[#4A9EC9]/10 px-2 py-0.5 rounded text-xs text-[#4A9EC9] font-black">
                        {personal.childrenCount}
                      </span>
                    </div>
                  </div>

                  {/* Children mini recap */}
                  {childrenDetails.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200 space-y-1">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Détails Enfants :</span>
                      <div className="space-y-1 text-[10px] text-slate-600 font-bold">
                        {childrenDetails.map((c, i) => (
                          <div key={i} className="flex justify-between bg-white px-2 py-1 rounded border border-slate-150">
                            <span>{c.lastName} {c.firstNames}</span>
                            <span className="text-[9px] text-slate-400 font-mono">{c.birthDate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Coordonnées & Banque */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Résidence & Banque
                  </span>

                  <div className="space-y-1.5 text-xs font-bold text-slate-800">
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400">Pays :</span>
                      <span>{coords.country === 'Autre' ? coords.customCountry : coords.country}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400">Ville / Province :</span>
                      <span>{coords.city === 'Autre' ? coords.customCity : coords.city}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400">Commune / Quartier :</span>
                      <span className="truncate max-w-[150px]">
                        {coords.commune === 'Autre' ? coords.customCommune : coords.commune} • {coords.quartier || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400">Banque :</span>
                      <span className="truncate max-w-[150px]">{coords.bankName || 'Non spécifié'}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-400 text-[10px]">RIB complet :</span>
                      <span className="bg-slate-900 text-emerald-400 font-mono text-[10px] px-2 py-1 rounded text-center truncate tracking-wider">
                        {coords.rib || 'Aucun'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Contrat de travail */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Contrat & Dates Clés
                  </span>

                  <div className="space-y-1.5 text-xs font-bold text-slate-800">
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400">Nature :</span>
                      <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase">
                        {contract.nature}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400">Type de collab. :</span>
                      <span>{contract.type}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400 font-mono">Date d'embauche :</span>
                      <span className="font-mono text-slate-900">{contract.hireDate}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400 font-mono">Date de début :</span>
                      <span className="font-mono text-slate-900">{contract.startDate}</span>
                    </div>
                    {contract.nature !== 'CDI' && (
                      <div className="flex justify-between bg-amber-100 text-amber-800 p-1.5 rounded text-[11px]">
                        <span>Fin de CDD ({contract.durationMonths} mois) :</span>
                        <span className="font-black">{contract.endDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Poste affecté */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> Poste & Structure
                  </span>

                  <div className="space-y-1.5 text-xs font-bold text-slate-800">
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400">Intitulé :</span>
                      <span className="text-slate-900 truncate max-w-[160px]">{position.title || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400">Département :</span>
                      <span className="bg-[#4A9EC9]/10 text-slate-700 px-2 py-0.5 rounded text-[10px] uppercase font-black">
                        {position.department}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400">Service :</span>
                      <span>{position.service || 'Aucun'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400">CMU Assujettis :</span>
                      <span>{position.cmuCount} personne(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[10px]">Parts IGR (Impôts) :</span>
                      <span className="font-black text-slate-900 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-xs">
                        {position.igrParts} part(s)
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5. Conditions financières */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5" /> Paie & Rémunération
                  </span>

                  <div className="space-y-1.5 text-xs font-bold text-slate-800 font-mono">
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400 font-sans font-bold">Catégorie :</span>
                      <span className="text-slate-900 font-sans font-black">{position.category}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400 font-sans font-bold">
                        {contract.type === 'stagiaire' ? 'Prime de stage :' : 'Salaire de Base :'}
                      </span>
                      <span className="text-slate-900 font-black">{payroll.baseSalary.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    {payroll.superSalary > 0 && (
                      <div className="flex justify-between border-b border-slate-200 pb-1">
                        <span className="text-slate-400 font-sans font-bold">Sur Salaire :</span>
                        <span className="text-slate-900 font-black">{payroll.superSalary.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400 font-sans font-bold">Prime de Transport :</span>
                      <span className="text-slate-900 font-black">{payroll.transportAllowance.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-400 font-sans font-bold">Taux horaire :</span>
                      <span className="text-[#4A9EC9] font-black">{payroll.hourlyRate.toLocaleString('fr-FR')} FCFA / H</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans font-bold text-[10px]">Type de bulletin lié :</span>
                      <span className="font-sans font-bold text-[10px] text-slate-500 max-w-[120px] truncate text-right">
                        {templates.find(t => t.id === payroll.templateId)?.name || 'Aucun'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6. CV & Études */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" /> Formation
                  </span>

                  <div className="space-y-2 max-h-[140px] overflow-y-auto">
                    {educations.length === 0 ? (
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center py-4">Aucune formation renseignée</p>
                    ) : (
                      educations.map((edu, i) => (
                        <div key={i} className="text-[11px] font-bold text-slate-800 bg-white p-2 rounded border border-slate-200">
                          <p className="font-black leading-tight text-slate-900">
                            <span className="bg-slate-100 text-slate-600 px-1 py-0.5 rounded text-[9px] mr-1 uppercase">{edu.degree}</span>
                            {edu.title}
                          </p>
                          <p className="text-[9px] text-slate-400 font-medium mt-0.5">{edu.school} • {edu.year}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Attachments status banner */}
              <div className="bg-slate-50 rounded-2xl border border-slate-150 p-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-2">
                  <FileUp className="w-3.5 h-3.5" /> Pièces jointes vérifiées
                </span>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {[
                    { id: 'cv', label: 'CV' },
                    { id: 'cni', label: 'CNI / Passeport' },
                    { id: 'cmu', label: 'Carte CMU' },
                    { id: 'rib', label: 'RIB Bancaire' },
                    { id: 'casier_b3', label: 'Casier B3' },
                    { id: 'dossier_juridique', label: 'Affaires Juridiques' },
                    { id: 'certificat_residence', label: 'Résidence' },
                    { id: 'permis', label: 'Permis Conduire' },
                    { id: 'diplomes', label: 'Diplômes' },
                    { id: 'extrait', label: 'Extrait Naissance' },
                    { id: 'certificat_travail', label: 'Attestations Travail' },
                    { id: 'photo', label: 'Photo ID' }
                  ].map(docItem => {
                    const isAttached = attachedFiles[docItem.id]?.status === 'success';
                    return (
                      <div key={docItem.id} className={cn(
                        "p-2 rounded-xl border flex items-center gap-2 font-bold text-[10px]",
                        isAttached ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-slate-400 border-slate-200"
                      )}>
                        <Check className={cn("w-3.5 h-3.5 shrink-0", isAttached ? "text-emerald-600" : "text-slate-200")} />
                        <span className="truncate uppercase font-black">
                          {docItem.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          
          {/* Previous Button */}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); currentStep > 1 && setCurrentStep(currentStep - 1); }}
            disabled={currentStep === 1 || isSubmitting}
            className={cn(
              "h-11 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 flex items-center gap-2 transition-all cursor-pointer",
              currentStep === 1 
                ? "opacity-40 bg-slate-100 text-slate-400 cursor-not-allowed border-transparent" 
                : "bg-white text-slate-600 hover:bg-slate-100"
            )}
          >
            <ArrowLeft className="w-4 h-4" /> Précédent
          </button>

          {/* Indicators */}
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            Étape {currentStep} de {steps.length}
          </span>

          {/* Next / Submit Button */}
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setCurrentStep(currentStep + 1); }}
              className="h-11 bg-slate-900 text-white px-5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 flex items-center gap-2 border-0 cursor-pointer shadow-md shadow-slate-900/5 transition-all"
            >
              Suivant <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleFinalSubmit()}
              disabled={isSubmitting}
              className="h-11 bg-emerald-600 text-white px-6 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 flex items-center gap-2 border-0 cursor-pointer shadow-lg shadow-emerald-500/10 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...
                </>
              ) : (
                <>
                  Valider l'Embauche <Check className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          )}

        </div>

      </div>

      {/* A4 Sheet Preview Modal */}
      {showA4Modal && (
        <EmployeeA4SheetModal
          data={{
            id: `temp-${Date.now()}`,
            matricule: personal.matricule || 'EMP-2026-TEMP',
            name: personal.name,
            email: personal.email,
            phone: personal.phone,
            department: position.department,
            position: position.title,
            hireDate: contract.hireDate,
            salary: payroll.baseSalary,
            status: 'Actif',
            personalDetails: { ...personal, children: childrenDetails },
            coordinates: { ...coords },
            contractDetails: { ...contract },
            positionDetails: { ...position },
            payrollDetails: { ...payroll },
            attachments: Object.keys(attachedFiles).reduce((acc, key) => {
              if (attachedFiles[key].status === 'success') {
                acc[key] = attachedFiles[key].name;
              }
              return acc;
            }, {} as Record<string, string>),
            cvDetailed: {
              educations,
              certificates,
              experiences,
              skills
            }
          }}
          onClose={() => setShowA4Modal(false)}
        />
      )}
    </div>
  );
}
