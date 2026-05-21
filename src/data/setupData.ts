export interface Country {
  name: string;
  code: string;
  currency: string;
  accountingPlan: string;
}

export interface EconomicZone {
  id: string;
  name: string;
  countries: Country[];
}

export const ECONOMIC_ZONES: EconomicZone[] = [
  {
    id: 'UEMOA',
    name: 'UEMOA (Afrique de l\'Ouest)',
    countries: [
      { name: 'Côte d\'Ivoire', code: 'CI', currency: 'FCFA', accountingPlan: 'SYSCOHADA Révisé' },
      { name: 'Sénégal', code: 'SN', currency: 'FCFA', accountingPlan: 'SYSCOHADA Révisé' },
      { name: 'Bénin', code: 'BJ', currency: 'FCFA', accountingPlan: 'SYSCOHADA Révisé' },
      { name: 'Burkina Faso', code: 'BF', currency: 'FCFA', accountingPlan: 'SYSCOHADA Révisé' },
      { name: 'Guinée-Bissau', code: 'GW', currency: 'FCFA', accountingPlan: 'SYSCOHADA Révisé' },
      { name: 'Mali', code: 'ML', currency: 'FCFA', accountingPlan: 'SYSCOHADA Révisé' },
      { name: 'Niger', code: 'NE', currency: 'FCFA', accountingPlan: 'SYSCOHADA Révisé' },
      { name: 'Togo', code: 'TG', currency: 'FCFA', accountingPlan: 'SYSCOHADA Révisé' },
    ]
  },
  {
    id: 'CEMAC',
    name: 'CEMAC (Afrique Centrale)',
    countries: [
      { name: 'Cameroun', code: 'CM', currency: 'FCFA', accountingPlan: 'SYSCOHADA Révisé' },
      { name: 'Gabon', code: 'GA', currency: 'FCFA', accountingPlan: 'SYSCOHADA Révisé' },
      { name: 'Congo', code: 'CG', currency: 'FCFA', accountingPlan: 'SYSCOHADA Révisé' },
      { name: 'Tchad', code: 'TD', currency: 'FCFA', accountingPlan: 'SYSCOHADA Révisé' },
      { name: 'RCA', code: 'CF', currency: 'FCFA', accountingPlan: 'SYSCOHADA Révisé' },
      { name: 'Guinée Équatoriale', code: 'GQ', currency: 'FCFA', accountingPlan: 'SYSCOHADA Révisé' },
    ]
  },
  {
    id: 'EU',
    name: 'Union Européenne',
    countries: [
      { name: 'France', code: 'FR', currency: 'EUR', accountingPlan: 'PCG France' },
      { name: 'Belgique', code: 'BE', currency: 'EUR', accountingPlan: 'PCMN Belgique' },
      { name: 'Luxembourg', code: 'LU', currency: 'EUR', accountingPlan: 'PCN Luxembourg' },
      { name: 'Allemagne', code: 'DE', currency: 'EUR', accountingPlan: 'HGB/IFRS' },
      { name: 'Espagne', code: 'ES', currency: 'EUR', accountingPlan: 'PGC Espagne' },
      { name: 'Italie', code: 'IT', currency: 'EUR', accountingPlan: 'OIC Italie' },
      { name: 'Portugal', code: 'PT', currency: 'EUR', accountingPlan: 'SNC Portugal' },
    ]
  },
  {
    id: 'MENA',
    name: 'MENA (Moyen-Orient & Afrique du Nord)',
    countries: [
      { name: 'Maroc', code: 'MA', currency: 'MAD', accountingPlan: 'PCM Maroc' },
      { name: 'Algérie', code: 'DZ', currency: 'DZD', accountingPlan: 'NSCF Algérie' },
      { name: 'Tunisie', code: 'TN', currency: 'TND', accountingPlan: 'SCT Tunisie' },
      { name: 'Égypte', code: 'EG', currency: 'EGP', accountingPlan: 'EAS Égypte' },
      { name: 'Émirats Arabes Unis', code: 'AE', currency: 'AED', accountingPlan: 'IFRS' },
      { name: 'Arabie Saoudite', code: 'SA', currency: 'SAR', accountingPlan: 'IFRS' },
    ]
  },
  {
    id: 'AMERICAS',
    name: 'Amériques (USMCA & MERCOSUR)',
    countries: [
      { name: 'États-Unis', code: 'US', currency: 'USD', accountingPlan: 'US GAAP' },
      { name: 'Canada', code: 'CA', currency: 'CAD', accountingPlan: 'ASPE/IFRS' },
      { name: 'Brésil', code: 'BR', currency: 'BRL', accountingPlan: 'CPC Brésil' },
      { name: 'Argentine', code: 'AR', currency: 'ARS', accountingPlan: 'RT Argentine' },
      { name: 'Chili', code: 'CL', currency: 'CLP', accountingPlan: 'IFRS Chile' },
      { name: 'Mexique', code: 'MX', currency: 'MXN', accountingPlan: 'NIF Mexique' },
    ]
  },
  {
    id: 'ASIA',
    name: 'Asie-Pacifique',
    countries: [
      { name: 'Chine', code: 'CN', currency: 'CNY', accountingPlan: 'ASBE Chine' },
      { name: 'Japon', code: 'JP', currency: 'JPY', accountingPlan: 'J-GAAP' },
      { name: 'Inde', code: 'IN', currency: 'INR', accountingPlan: 'Ind AS' },
      { name: 'Australie', code: 'AU', currency: 'AUD', accountingPlan: 'AASB Australie' },
      { name: 'Singapour', code: 'SG', currency: 'SGD', accountingPlan: 'SFRS Singapour' },
      { name: 'Corée du Sud', code: 'KR', currency: 'KRW', accountingPlan: 'K-IFRS' },
    ]
  },
  {
    id: 'OTHER',
    name: 'Autres Régions / Global',
    countries: [
      { name: 'Royaume-Uni', code: 'GB', currency: 'GBP', accountingPlan: 'UK GAAP' },
      { name: 'Suisse', code: 'CH', currency: 'CHF', accountingPlan: 'Swiss GAAP FER' },
      { name: 'Afrique du Sud', code: 'ZA', currency: 'ZAR', accountingPlan: 'IFRS' },
      { name: 'Russie', code: 'RU', currency: 'RUB', accountingPlan: 'RAS Russie' },
      { name: 'Turquie', code: 'TR', currency: 'TRY', accountingPlan: 'TMS/TFRS' },
    ]
  }
];

export const CURRENCIES = [
  'FCFA', 'EUR', 'USD', 'MAD', 'DZD', 'TND', 'CAD', 'GBP', 'CHF', 'JPY', 'CNY', 'INR', 'AED', 'SAR', 'EGP', 'ZAR', 'MXN', 'BRL', 'ARS', 'AUD', 'SGD', 'RUB', 'TRY'
];

export const SECTORS = [
  'Commerce / Distribution',
  'Industrie / Manufacture',
  'Services Professionnels',
  'Technologie / Logiciel',
  'Santé / Pharmacie',
  'Construction / BTP',
  'Agriculture / Agro-industrie',
  'Tourisme / Hôtellerie',
  'Énergie / Mines',
  'Transport / Logistique',
  'Autre'
];

export const LEGAL_FORMS = [
  'Entreprise Individuelle',
  'SARL (Soc. à Resp. Limitée)',
  'SAS (Soc. par Actions Simplifiée)',
  'SA (Société Anonyme)',
  'SNC (Soc. au Nom Collectif)',
  'GIE (Group. d\'Intérêt Éco.)',
  'Association / ONG',
  'Autre'
];

export const TAX_REGIMES = [
  'Régime du Réel Normal (RRN)',
  'Régime du Réel Simplifié (RSI)',
  'Régime de l\'Entreprenant',
  'Impôt d\'État Libératoire',
  'Micro-entreprise',
  'Exonéré',
  'Autre'
];
