import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export interface ImportedAccount {
  account: string;
  label: string;
  amount?: number;
}

export const parseImportFile = (file: File): Promise<ImportedAccount[]> => {
  return new Promise((resolve, reject) => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const data = results.data as any[];
          const accounts = data.map(row => ({
            account: row.account || row['N° Compte'] || row['compte'],
            label: row.label || row['Intitulé'] || row['libelle'],
            amount: parseFloat(row.amount || row['Montant'] || row['solde'] || '0')
          })).filter(a => a.account && a.label);
          resolve(accounts);
        },
        error: (err) => reject(err)
      });
    } else if (extension === 'xlsx' || extension === 'xls' || extension === 'ukp') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet) as any[];
        
        const accounts = json.map(row => ({
          account: (row.account || row['N° Compte'] || row['compte'] || '').toString(),
          label: (row.label || row['Intitulé'] || row['libelle'] || '').toString(),
          amount: parseFloat(row.amount || row['Montant'] || row['solde'] || '0')
        })).filter(a => a.account && a.label);
        resolve(accounts);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error('Format de fichier non supporté'));
    }
  });
};
