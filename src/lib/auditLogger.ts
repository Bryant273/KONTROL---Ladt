// Simple system audit logging utility for tracking user operations

export interface SystemActionLog {
  id: string;
  dateSec: string;
  date: string;
  time: string;
  user: string;
  type: string;
  desc: string;
  details: string;
}

export function getActionLogs(dossierId: string): SystemActionLog[] {
  const dKey = `action-logs-${dossierId || 'default'}`;
  try {
    const raw = localStorage.getItem(dKey);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading logs', e);
  }
  
  // Default populated audit history for display
  return [
    { 
      id: 'log-1', 
      dateSec: new Date(Date.now() - 3600000 * 20).toISOString(), 
      date: new Date(Date.now() - 3600000 * 20).toLocaleDateString('fr-FR'), 
      time: '10:14:30', 
      user: 'Chef Comptable', 
      type: 'Saisie', 
      desc: 'Saisie d\'écriture ACH-2026-00001', 
      details: 'Achat de matières premières à SOCIX SARL' 
    },
    { 
      id: 'log-2', 
      dateSec: new Date(Date.now() - 3600000 * 15).toISOString(), 
      date: new Date(Date.now() - 3600000 * 15).toLocaleDateString('fr-FR'), 
      time: '14:22:15', 
      user: 'Comptable', 
      type: 'Digitalisation', 
      desc: 'Digitalisation de la facture FACT-088', 
      details: 'Importation du document de pièce justificative' 
    },
    { 
      id: 'log-3', 
      dateSec: new Date(Date.now() - 3600000 * 8).toISOString(), 
      date: new Date(Date.now() - 3600000 * 8).toLocaleDateString('fr-FR'), 
      time: '09:05:00', 
      user: 'Administrateur', 
      type: 'Création', 
      desc: 'Création du tiers 4011-SOC', 
      details: 'Paramétrage compte fournisseur SOCIX SARL rattaché au 401100' 
    },
    { 
      id: 'log-4', 
      dateSec: new Date(Date.now() - 3600000 * 2).toISOString(), 
      date: new Date(Date.now() - 3600000 * 2).toLocaleDateString('fr-FR'), 
      time: '11:15:22', 
      user: 'Administrateur', 
      type: 'Configuration', 
      desc: 'Création du journal des ventes VTE', 
      details: 'Rattachement compte de contrepartie 701100' 
    },
  ];
}

export function saveActionLog(dossierId: string, log: { type: string; desc: string; details: string; user?: string }) {
  const dKey = `action-logs-${dossierId || 'default'}`;
  const logs = getActionLogs(dossierId);
  const now = new Date();
  const newLog: SystemActionLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    dateSec: now.toISOString(),
    date: now.toLocaleDateString('fr-FR'),
    time: now.toLocaleTimeString('fr-FR'),
    user: log.user || 'Administrateur',
    type: log.type,
    desc: log.desc,
    details: log.details
  };
  try {
    localStorage.setItem(dKey, JSON.stringify([newLog, ...logs].slice(0, 100))); // Cap at 100 logs
  } catch (e) {
    console.error('Error saving log', e);
  }
}
