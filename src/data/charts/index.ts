import { SYSCOHADA_CHART, SystemAccount } from './syscohada';
import { PCG_FRANCE_CHART } from './pcg_france';
import { US_GAAP_CHART } from './us_gaap';
import { PCM_MAROC_CHART } from './pcm_maroc';

export * from './syscohada';
export * from './pcg_france';
export * from './us_gaap';
export * from './pcm_maroc';

export const SYSTEM_CHARTS: Record<string, SystemAccount[]> = {
  'SYSCOHADA Révisé': SYSCOHADA_CHART,
  'PCG France': PCG_FRANCE_CHART,
  'US GAAP': US_GAAP_CHART,
  'PCM Maroc': PCM_MAROC_CHART,
};

/**
 * Resolves the chart of accounts template closest to the law name.
 */
export function getSystemChartTemplate(lawName: string): SystemAccount[] {
  if (!lawName) return SYSCOHADA_CHART;
  
  // Direct match
  if (SYSTEM_CHARTS[lawName]) {
    return SYSTEM_CHARTS[lawName];
  }
  
  // Loose match
  const normalized = lawName.toLowerCase();
  if (normalized.includes('ohada') || normalized.includes('syscohada')) {
    return SYSCOHADA_CHART;
  }
  if (normalized.includes('france') || normalized.includes('pcg')) {
    return PCG_FRANCE_CHART;
  }
  if (normalized.includes('maroc') || normalized.includes('pcm')) {
    return PCM_MAROC_CHART;
  }
  if (normalized.includes('us') || normalized.includes('gaap') || normalized.includes('ifrs') || normalized.includes('america')) {
    return US_GAAP_CHART;
  }

  // Fallback to SYSCOHADA Révisé
  return SYSCOHADA_CHART;
}
export function getSystemChartID(lawName: string): string {
  if (!lawName) return 'syscohada-revis-sys';
  const normalized = lawName.toLowerCase();
  if (normalized.includes('ohada') || normalized.includes('syscohada')) {
    return 'syscohada-revis-sys';
  }
  if (normalized.includes('france') || normalized.includes('pcg')) {
    return 'pcg-france-sys';
  }
  if (normalized.includes('maroc') || normalized.includes('pcm')) {
    return 'pcm-maroc-sys';
  }
  if (normalized.includes('us') || normalized.includes('gaap') || normalized.includes('ifrs')) {
    return 'us-gaap-sys';
  }
  return 'syscohada-revis-sys';
}
