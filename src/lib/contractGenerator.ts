export interface SmartContractData {
  employee: any;
  contract: any;
  enterprise?: any;
  templateContent?: string;
}

export function generateSmartContractText({
  employee,
  contract,
  enterprise,
  templateContent
}: SmartContractData): string {
  if (!employee && !contract) {
    return "Aucune donnée de collaborateur disponible pour rédiger le contrat.";
  }

  const emp = employee || {};
  const con = contract || {};
  const ent = enterprise || {};

  // 1. Extract Personal Information
  const lastName = (emp.personalDetails?.name || emp.name?.split(' ')[0] || 'KASSI').toUpperCase();
  const firstNames = emp.personalDetails?.firstNames || emp.name?.split(' ').slice(1).join(' ') || '';
  const fullName = `${lastName} ${firstNames}`.trim();
  const civility = emp.personalDetails?.civility || 'M.';
  const birthDate = emp.personalDetails?.birthDate || 'non précisée';
  const birthPlace = emp.personalDetails?.birthPlace || 'Abidjan';
  const nationality = emp.personalDetails?.nationality || 'Ivoirienne';
  const cniNumber = emp.personalDetails?.cniNumber || 'Non renseignée';
  const cmuNumber = emp.personalDetails?.cmuNumber || 'Non renseignée';
  const socialSecurityNumber = emp.personalDetails?.socialSecurityNumber || 'Non renseignée';
  const maritalStatus = emp.personalDetails?.maritalStatus || 'Célibataire';
  const childrenCount = emp.personalDetails?.childrenCount ?? 0;

  // 2. Extract Coordinates & Emergency
  const phone = emp.coordinates?.phone || emp.phone || 'Non renseigné';
  const email = emp.coordinates?.email || emp.email || 'Non renseigné';
  const address = emp.coordinates?.address || 'Non renseignée';
  const quartier = emp.coordinates?.quartier || '';
  const commune = emp.coordinates?.commune || '';
  const city = emp.coordinates?.city || 'Abidjan';
  const country = emp.coordinates?.country || "Côte d'Ivoire";
  const fullAddress = `${address}${quartier ? `, ${quartier}` : ''}${commune ? `, ${commune}` : ''}, ${city} (${country})`;

  const emergencyName = emp.coordinates?.emergencyContactName || 'Non précisé';
  const emergencyRelation = emp.coordinates?.emergencyContactRelation || '';
  const emergencyPhone = emp.coordinates?.emergencyContactPhone || '';

  // 3. Extract Position & Contract Details
  const matricule = emp.matricule || 'EMP-2026-000';
  const positionTitle = emp.positionDetails?.title || emp.position || 'Collaborateur';
  const department = emp.positionDetails?.department || emp.department || 'Général';
  const service = emp.positionDetails?.service || 'Opérations';
  const superior = emp.positionDetails?.superior || 'Direction Générale';
  const category = emp.positionDetails?.category || 'Cadre M1';

  const contractType = con.type || emp.contractDetails?.nature || 'CDI';
  const trialPeriod = con.trialPeriod || '3 mois';
  const startDate = con.startDate || emp.contractDetails?.startDate || emp.hireDate || new Date().toISOString().substring(0, 10);
  const endDate = con.endDate || emp.contractDetails?.endDate || 'Indéterminée';
  const durationMonths = con.durationMonths || emp.contractDetails?.durationMonths || (contractType === 'CDD' ? '12' : 'N/A');

  // 4. Financial & Payroll Details
  const baseSalaryNum = con.salary || emp.payrollDetails?.baseSalary || emp.salary || 350000;
  const baseSalaryStr = baseSalaryNum.toLocaleString('fr-FR');
  const superSalaryStr = (emp.payrollDetails?.superSalary || 0).toLocaleString('fr-FR');
  const transportStr = (emp.payrollDetails?.transportAllowance || 35000).toLocaleString('fr-FR');

  const bankName = emp.coordinates?.bankName || 'Non précisée';
  const rib = emp.coordinates?.rib || 'Non précisé';

  // 5. Enterprise Details
  const companyName = ent.name || 'SOCIX GROUP S.A.';
  const companyNcc = ent.ncc || '1234567 A';
  const companyCnps = ent.cnps || '98765';
  const companyAddress = ent.address || 'Abidjan, Côte d\'Ivoire';

  // If a template string was provided, substitute placeholders
  if (templateContent && templateContent.trim().length > 0) {
    let text = templateContent;
    text = text.replace(/\{\{NOM\}\}/g, lastName);
    text = text.replace(/\{\{PRENOM\}\}/g, firstNames);
    text = text.replace(/\{\{NOM_COMPLET\}\}/g, fullName);
    text = text.replace(/\{\{CIVILITE\}\}/g, civility);
    text = text.replace(/\{\{MATRICULE\}\}/g, matricule);
    text = text.replace(/\{\{POSTE\}\}/g, positionTitle);
    text = text.replace(/\{\{DEPARTEMENT\}\}/g, department);
    text = text.replace(/\{\{SERVICE\}\}/g, service);
    text = text.replace(/\{\{SUPERIEUR\}\}/g, superior);
    text = text.replace(/\{\{CATEGORIE\}\}/g, category);
    text = text.replace(/\{\{SALAIRE\}\}/g, baseSalaryStr);
    text = text.replace(/\{\{SUR_SALAIRE\}\}/g, superSalaryStr);
    text = text.replace(/\{\{TRANSPORT\}\}/g, transportStr);
    text = text.replace(/\{\{DATE_DEBUT\}\}/g, startDate);
    text = text.replace(/\{\{DATE_FIN\}\}/g, endDate);
    text = text.replace(/\{\{DUREE\}\}/g, String(durationMonths));
    text = text.replace(/\{\{PERIODE_ESSAI\}\}/g, trialPeriod);
    text = text.replace(/\{\{TYPE_CONTRAT\}\}/g, contractType);
    text = text.replace(/\{\{NATIONALITE\}\}/g, nationality);
    text = text.replace(/\{\{DATE_NAISSANCE\}\}/g, birthDate);
    text = text.replace(/\{\{LIEU_NAISSANCE\}\}/g, birthPlace);
    text = text.replace(/\{\{CNI\}\}/g, cniNumber);
    text = text.replace(/\{\{CMU\}\}/g, cmuNumber);
    text = text.replace(/\{\{CNPS\}\}/g, socialSecurityNumber);
    text = text.replace(/\{\{ADRESSE\}\}/g, fullAddress);
    text = text.replace(/\{\{TELEPHONE\}\}/g, phone);
    text = text.replace(/\{\{EMAIL\}\}/g, email);
    text = text.replace(/\{\{ENTREPRISE\}\}/g, companyName);
    text = text.replace(/\{\{ENTREPRISE_NCC\}\}/g, companyNcc);
    text = text.replace(/\{\{ENTREPRISE_CNPS\}\}/g, companyCnps);
    return text;
  }

  // Fallback: Generate an intelligent complete legal contract based on contractType
  if (contractType === 'CDD') {
    return `CONTRAT DE TRAVAIL À DURÉE DÉTERMINÉE (CDD)
Conforme au Code du Travail de Côte d'Ivoire & Normes SYSCOHADA

ENTRE LES SOUSSIGNÉS :

L'entreprise ${companyName}, au capital social régie par les lois en vigueur, immatriculée sous le N° NCC : ${companyNcc} et N° CNPS : ${companyCnps}, dont le siège social est situé à ${companyAddress}, représentée par la Direction des Ressources Humaines, ci-après dénommée "L'Employeur",

D'UNE PART,

ET :

${civility} ${fullName}, de nationalité ${nationality}, né(e) le ${birthDate} à ${birthPlace},
Titulaire de la pièce d'identité (CNI / Passeport) N° : ${cniNumber},
N° CMU : ${cmuNumber}, N° Sécurité Sociale (CNPS) : ${socialSecurityNumber},
Demeurant à : ${fullAddress}, Téléphone : ${phone}, Email : ${email},
Immatriculé(e) sous le Matricule RH : ${matricule},
Ci-après dénommé(e) "Le Salarié",

D'AUTRE PART,

IL A ÉTÉ CONVENU ET ARRÊTÉ CE QUI SUIT :

ARTICLE 1 : ENGAGEMENT ET DURÉE DU CONTRAT
L'Employeur engage le Salarié sous le régime du Contrat de Travail à Durée Déterminée (CDD) pour une durée de ${durationMonths} mois, allant du ${startDate} au ${endDate}.

ARTICLE 2 : FONCTIONS ET AFFECTATION
Le Salarié est recruté en qualité de ${positionTitle}, rattaché(e) au Département ${department} (Service : ${service}).
Il / Elle exercera ses fonctions sous l'autorité directe de ${superior}. Sa catégorie socioprofessionnelle est fixée à : ${category}.

ARTICLE 3 : PÉRIODE D'ESSAI
Le présent contrat est assorti d'une période d'essai de ${trialPeriod}, au cours de laquelle chaque partie pourra rompre le contrat conformément à la législation du travail.

ARTICLE 4 : RÉMUNÉRATION ET AVANTAGES
En contrepartie de la réalisation de ses prestations, le Salarié percevra :
- Un salaire de base mensuel brut de : ${baseSalaryStr} FCFA
- Un sur-salaire mensuel de : ${superSalaryStr} FCFA
- Une indemnité légale de transport de : ${transportStr} FCFA
Règlement opéré par virement à la banque ${bankName} (RIB : ${rib}).

ARTICLE 5 : PERSONNE À PRÉVENIR EN CAS D'URGENCE
En cas de besoin médical ou de force majeure, l'entreprise contactera : ${emergencyName} (${emergencyRelation}), Téléphone : ${emergencyPhone}.

Fait à Abidjan, le ${startDate} en deux (2) exemplaires originaux.

POUR L'EMPLOYEUR (Direction RH)                  LE SALARIÉ (Lu et approuvé)
`;
  }

  if (contractType === 'Stage') {
    return `CONVENTION DE STAGE ET D'IMMERSION PROFESSIONNELLE
Conforme au Code du Travail de Côte d'Ivoire

ENTRE :
${companyName} (NCC: ${companyNcc}), ci-après "L'Organisme d'Accueil",
ET :
${civility} ${fullName} (Matricule: ${matricule}), né(e) le ${birthDate} à ${birthPlace}, de nationalité ${nationality}, demeurant à ${fullAddress}, ci-après "Le Stagiaire".

ARTICLE 1 : OBJET ET DURÉE DU STAGE
Le Stagiaire est accueilli pour accomplir un stage pratique en qualité de ${positionTitle} au sein du département ${department}.
Le stage est conclu pour une durée de ${durationMonths} mois, du ${startDate} au ${endDate}.

ARTICLE 2 : INDEMNITÉ DE STAGE
L'Organisme d'Accueil versera une gratification mensuelle de ${baseSalaryStr} FCFA.

ARTICLE 3 : PERSONNE À PRÉVENIR EN CAS D'URGENCE
Contact d'urgence : ${emergencyName} (${emergencyRelation}) - Tel : ${emergencyPhone}.

Fait à Abidjan, le ${startDate}.

L'ORGANISME D'ACCUEIL                                LE STAGIAIRE`;
  }

  if (contractType === 'Consultant') {
    return `CONTRAT DE PRESTATION DE SERVICES ET CONSULTANCE

ENTRE :
${companyName} (NCC: ${companyNcc}), ci-après "Le Client",
ET :
${civility} ${fullName}, Consultant Indépendant, CNI N° : ${cniNumber}, Téléphone : ${phone}, Email : ${email}, ci-après "Le Prestataire".

ARTICLE 1 : MISSION
Le Prestataire s'engage à exécuter la mission de conseil/expertise en : ${positionTitle} au profit du Département ${department}.
Prise d'effet le ${startDate}.

ARTICLE 2 : HONORAIRES
Les honoraires hors taxes sont convenus à la somme forfaitaire mensuelle de ${baseSalaryStr} FCFA.

Fait à Abidjan, le ${startDate}.

LE CLIENT                                            LE PRESTATAIRE`;
  }

  // Default CDI Template
  return `CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE (CDI)
Conforme au Code du Travail de Côte d'Ivoire & Règlementation SYSCOHADA

ENTRE LES SOUSSIGNÉS :

L'entreprise ${companyName}, au capital social régie par les lois en vigueur, immatriculée sous le N° NCC : ${companyNcc} et N° CNPS : ${companyCnps}, dont le siège social est situé à ${companyAddress}, représentée par la Direction des Ressources Humaines, ci-après dénommée "L'Employeur",

D'UNE PART,

ET :

${civility} ${fullName}, de nationalité ${nationality}, né(e) le ${birthDate} à ${birthPlace},
Titulaire de la pièce d'identité (CNI / Passeport) N° : ${cniNumber},
N° CMU : ${cmuNumber}, N° Sécurité Sociale (CNPS) : ${socialSecurityNumber},
Situation matrimoniale : ${maritalStatus} (${childrenCount} enfant(s) à charge),
Demeurant à : ${fullAddress}, Téléphone : ${phone}, Email : ${email},
Immatriculé(e) sous le Matricule RH : ${matricule},
Ci-après dénommé(e) "Le Salarié",

D'AUTRE PART,

IL A ÉTÉ CONVENU ET ARRÊTÉ CE QUI SUIT :

ARTICLE 1 : ENGAGEMENT ET NATURE DU CONTRAT
L'Employeur engage le Salarié qui l'accepte sous le régime du Contrat de Travail à Durée Indéterminée (CDI) à compter du ${startDate}.

ARTICLE 2 : FONCTIONS ET AFFECTATION
Le Salarié est nommé au poste de : ${positionTitle}, rattaché(e) au Département ${department} (Service : ${service}).
Il / Elle exerera sous la responsabilité de ${superior}. Sa classification professionnelle est : ${category}.

ARTICLE 3 : PÉRIODE D'ESSAI
Le présent contrat comporte une période d'essai de ${trialPeriod}. Durant cette période, chacune des parties pourra résilier le contrat sans préavis ni indemnité conformément aux dispositions légales.

ARTICLE 4 : RÉMUNÉRATION ET AVANTAGES SOCIAUX
En contrepartie de la prestation de travail fournies, le Salarié percevra chaque mois :
- Salaire de base mensuel brut : ${baseSalaryStr} FCFA
- Sur-salaire conventionnel : ${superSalaryStr} FCFA
- Indemnité forfaitaire de transport : ${transportStr} FCFA
Domiciliation bancaire : ${bankName} (RIB : ${rib}).

ARTICLE 5 : PERSONNE À PRÉVENIR EN CAS D'URGENCE
Nom : ${emergencyName} (${emergencyRelation}) — Téléphone : ${emergencyPhone}.

ARTICLE 6 : DISPOSITIONS DIVERSES & CONFIDENTIALITÉ
Le Salarié s'engage à observer une stricte confidentialité sur l'ensemble des données, savoir-faire et secrets d'affaires de l'entreprise.

Fait à Abidjan, le ${startDate} en deux (2) exemplaires originaux.

POUR L'EMPLOYEUR (Direction RH)                  LE SALARIÉ (Lu et approuvé)
`;
}
