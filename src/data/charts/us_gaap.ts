import { SystemAccount } from './syscohada';

export const US_GAAP_CHART: SystemAccount[] = [
  // Assets (1000 - 1999)
  { num: '101000', label: 'Cash and Cash Equivalents', classe: 'Classe 1 (Assets)' },
  { num: '102000', label: 'Petty Cash', classe: 'Classe 1 (Assets)' },
  { num: '105000', label: 'Short-term investments', classe: 'Classe 1 (Assets)' },
  { num: '111000', label: 'Accounts Receivable (A/R)', classe: 'Classe 1 (Assets)' },
  { num: '112000', label: 'Allowance for Doubtful Accounts (Contra-Asset)', classe: 'Classe 1 (Assets)' },
  { num: '121000', label: 'Prepaid Expenses', classe: 'Classe 1 (Assets)' },
  { num: '122000', label: 'Prepaid Rent', classe: 'Classe 1 (Assets)' },
  { num: '131000', label: 'Inventory (Finis Goods)', classe: 'Classe 1 (Assets)' },
  { num: '132000', label: 'Inventory (Raw Materials)', classe: 'Classe 1 (Assets)' },
  { num: '151000', label: 'Land', classe: 'Classe 1 (Assets)' },
  { num: '152000', label: 'Buildings', classe: 'Classe 1 (Assets)' },
  { num: '153000', label: 'Equipment and Machinery', classe: 'Classe 1 (Assets)' },
  { num: '154000', label: 'Computer Software and Hardware', classe: 'Classe 1 (Assets)' },
  { num: '155000', label: 'Office Furniture', classe: 'Classe 1 (Assets)' },
  { num: '161000', label: 'Accumulated Depreciation - Buildings', classe: 'Classe 1 (Assets)' },
  { num: '162000', label: 'Accumulated Depreciation - Equipment', classe: 'Classe 1 (Assets)' },
  { num: '171000', label: 'Goodwill', classe: 'Classe 1 (Assets)' },
  { num: '172000', label: 'Patents and Trademarks', classe: 'Classe 1 (Assets)' },
  { num: '181000', label: 'Security Deposits', classe: 'Classe 1 (Assets)' },

  // Liabilities (2000 - 2999)
  { num: '201000', label: 'Accounts Payable (A/P)', classe: 'Classe 2 (Liabilities)' },
  { num: '205000', label: 'Accrued Wages and Salaries', classe: 'Classe 2 (Liabilities)' },
  { num: '208000', label: 'Accrued Interest Payable', classe: 'Classe 2 (Liabilities)' },
  { num: '211000', label: 'Unearned Revenue / Deferred Revenue', classe: 'Classe 2 (Liabilities)' },
  { num: '221000', label: 'Sales Tax Payable', classe: 'Classe 2 (Liabilities)' },
  { num: '222000', label: 'Federal & State Taxes Payable', classe: 'Classe 2 (Liabilities)' },
  { num: '231000', label: 'Short-term Notes Payable', classe: 'Classe 2 (Liabilities)' },
  { num: '251000', label: 'Long-term Bank Loans', classe: 'Classe 2 (Liabilities)' },
  { num: '255000', label: 'Bonds Payable', classe: 'Classe 2 (Liabilities)' },

  // Equity (3000 - 3999)
  { num: '301000', label: 'Common Stock ($1 par value)', classe: 'Classe 3 (Equity)' },
  { num: '302000', label: 'Preferred Stock', classe: 'Classe 3 (Equity)' },
  { num: '305000', label: 'Additional Paid-in Capital', classe: 'Classe 3 (Equity)' },
  { num: '311000', label: 'Retained Earnings', classe: 'Classe 3 (Equity)' },
  { num: '315000', label: 'Treasury Stock', classe: 'Classe 3 (Equity)' },
  { num: '320000', label: 'Accumulated Other Comprehensive Income (AOCI)', classe: 'Classe 3 (Equity)' },

  // Revenue (4000 - 4999)
  { num: '401000', label: 'Product Sales Revenue', classe: 'Classe 4 (Revenue)' },
  { num: '402000', label: 'Service Fees Revenue', classe: 'Classe 4 (Revenue)' },
  { num: '405000', label: 'Sales Discounts given', classe: 'Classe 4 (Revenue)' },
  { num: '406000', label: 'Sales Returns and Allowances', classe: 'Classe 4 (Revenue)' },
  { num: '411000', label: 'Interest and Rent Income', classe: 'Classe 4 (Revenue)' },

  // Cost of Goods Sold - COGS (5000 - 5999)
  { num: '501000', label: 'Cost of Goods Sold - Products', classe: 'Classe 5 (COGS)' },
  { num: '502000', label: 'Cost of Goods Sold - Services', classe: 'Classe 5 (COGS)' },
  { num: '505000', label: 'Purchase Freight & Customs', classe: 'Classe 5 (COGS)' },

  // Operating Expenses (6000 - 7999)
  { num: '601000', label: 'Wages and Salaries Expense', classe: 'Classe 6 (Expenses)' },
  { num: '602000', label: 'Payroll Taxes and Employee Benefits', classe: 'Classe 6 (Expenses)' },
  { num: '611000', label: 'Advertising and Digital Marketing', classe: 'Classe 6 (Expenses)' },
  { num: '612000', label: 'Office Rent and Facilities Expense', classe: 'Classe 6 (Expenses)' },
  { num: '615000', label: 'Electricity and Utilities Expense', classe: 'Classe 6 (Expenses)' },
  { num: '621000', label: 'Legal and Professional Fees', classe: 'Classe 6 (Expenses)' },
  { num: '622000', label: 'Accounting and Audit Fees', classe: 'Classe 6 (Expenses)' },
  { num: '631000', label: 'Travel and Entertainment Expense', classe: 'Classe 6 (Expenses)' },
  { num: '641000', label: 'ISP and Software Subscriptions', classe: 'Classe 6 (Expenses)' },
  { num: '651000', label: 'Insurance Expense', classe: 'Classe 6 (Expenses)' },
  { num: '661000', label: 'Merchant Fees and Bank Charges', classe: 'Classe 6 (Expenses)' },
  { num: '681000', label: 'Depreciation Expense - Plant & Equipment', classe: 'Classe 6 (Expenses)' },
  { num: '682000', label: 'Amortization Expense - Intangible Assets', classe: 'Classe 6 (Expenses)' },
  { num: '691000', label: 'Bad Debt Expense', classe: 'Classe 6 (Expenses)' },

  // Other Income / Expense & Taxes (8000+)
  { num: '801000', label: 'Interest Expense on Loans', classe: 'Classe 7 (Other)' },
  { num: '805000', label: 'Gain or Loss on Asset Disposal', classe: 'Classe 7 (Other)' },
  { num: '891000', label: 'Provision for Income Taxes (Corporation Tax)', classe: 'Classe 7 (Other)' }
];
