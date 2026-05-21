import React from 'react';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface ActionType {
  label: string;
  icon: any;
  onClick: (row: any) => void;
  variant?: 'default' | 'danger' | 'ghost';
}

interface DataTableProps {
  columns: {
    header: string;
    key: string;
    render?: (val: any, row: any) => React.ReactNode;
    className?: string;
  }[];
  data: any[];
  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onDownload?: (row: any) => void;
  actions?: ActionType[];
  isLoading?: boolean;
}

export const DataTable = ({ 
  columns, 
  data, 
  onView, 
  onEdit, 
  onDelete,
  onDownload,
  actions,
  isLoading 
}: DataTableProps) => {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              {columns.map((col, i) => (
                <th 
                  key={i} 
                  className={cn(
                    "px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-slate-100 border-t-brand rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Traitement Quantum...</p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-20 text-center">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Aucune donnée trouvée</p>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className={cn(
                    "transition-colors group",
                    rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50/30",
                    "hover:bg-slate-50/80"
                  )}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={cn("px-6 py-4.5 text-[12px] font-bold text-slate-600", col.className)}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4.5">
                    <div className="flex items-center justify-end gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                      {actions?.map((action, i) => {
                        const Icon = action.icon;
                        return (
                          <button 
                            key={i}
                            onClick={() => action.onClick(row)}
                            className={cn(
                              "p-2 rounded-lg transition-all flex items-center gap-2",
                              action.variant === 'danger' ? "text-rose-500 hover:bg-rose-50" : "text-slate-400 hover:text-brand hover:bg-brand/5"
                            )}
                            title={action.label}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        );
                      })}
                      {!actions && (
                        <>
                          {onView && (
                            <button 
                              onClick={() => onView(row)}
                              className="p-2 text-slate-400 hover:text-brand hover:bg-brand/5 rounded-lg transition-all"
                              title="Voir"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {onEdit && (
                            <button 
                              onClick={() => onEdit(row)}
                              className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                              title="Modifier"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          {onDownload && (
                            <button 
                              onClick={() => onDownload(row)}
                              className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all"
                              title="Télecharger"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button 
                              onClick={() => onDelete(row)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination - Minimal */}
      <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Affichage de {data.length} entrées</p>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-30" disabled>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
             <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-900 shadow-sm transition-all focus:ring-2 focus:ring-brand">1</span>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-30" disabled>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
