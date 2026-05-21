import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useCompany } from '../../context/CompanyContext';
import { 
  Building2, 
  Globe, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck,
  FileText,
  Upload,
  Plus,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { Logo } from '../../components/ui/Logo';

export default function EnterpriseInfo() {
  const { activeEnterprise } = useCompany();

  const InfoRow = ({ label, value, icon: Icon }: any) => (
    <div className="flex items-center justify-between py-6 border-b border-slate-50 group hover:bg-slate-50/50 transition-colors px-4 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-brand/10 group-hover:text-brand transition-all">
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-[13px] font-extrabold text-slate-900 uppercase tracking-tight">{value || 'Non renseigné'}</p>
    </div>
  );

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Entity Hero */}
        <div className="bg-[#09090b] rounded-[4rem] p-16 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-12 border border-white/5 shadow-2xl">
           <div className="absolute top-0 right-0 p-16 opacity-[0.03] rotate-12">
              <Building2 className="w-80 h-80" />
           </div>
           
           <div className="relative z-10 shrink-0">
             {activeEnterprise?.logo ? (
               <img src={activeEnterprise.logo} alt="Logo" className="w-40 h-40 rounded-[3rem] object-contain bg-white p-4 shadow-2xl shadow-brand/20 ring-1 ring-white/10" />
             ) : (
               <div className="w-40 h-40 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center shadow-2xl">
                 <Logo iconClassName="w-20 h-20 bg-brand text-white rounded-[2rem]" showText={false} />
               </div>
             )}
             <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-brand text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
             </button>
           </div>

           <div className="relative z-10 text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                 <span className="px-4 py-1.5 bg-brand text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand/20">Active Entity</span>
                 <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px] italic">RCCM: {activeEnterprise?.rccm || 'N/A'}</p>
              </div>
              <h1 className="text-6xl font-black tracking-tighter uppercase mb-2 leading-none">{activeEnterprise?.name}</h1>
              <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">{activeEnterprise?.industry} • {activeEnterprise?. legalForm || 'SARL'}</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* Primary Info */}
           <div className="bg-white rounded-[3.5rem] border border-slate-100 p-12 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
                 <ShieldCheck className="w-4 h-4 text-emerald-500" /> Profil d'Identification
              </h3>
              <div className="space-y-2">
                 <InfoRow label="NCC (N° Fiscal)" value={activeEnterprise?.ncc} icon={ShieldCheck} />
                 <InfoRow label="CNPS (Employeur)" value={activeEnterprise?.cnps} icon={ShieldCheck} />
                 <InfoRow label="RCCM" value={activeEnterprise?.rccm} icon={Building2} />
                 <InfoRow label="Régime Fiscal" value={activeEnterprise?.taxRegime} icon={FileText} />
                 <InfoRow label="Forme Juridique" value={activeEnterprise?.legalForm} icon={Building2} />
              </div>
              <div className="mt-12">
                 <Button className="w-full h-14 border border-slate-100 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:border-brand hover:text-brand transition-all">Mettre à jour l'identité</Button>
              </div>
           </div>

           {/* Contact & Documents */}
           <div className="space-y-10">
              <div className="bg-white rounded-[3.5rem] border border-slate-100 p-12 shadow-sm">
                 <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10">Communications</h3>
                 <div className="space-y-2">
                    <InfoRow label="Email Corporate" value={activeEnterprise?.email} icon={Mail} />
                    <InfoRow label="Standard Tél." value={activeEnterprise?.contact} icon={Phone} />
                    <InfoRow label="Site Internet" value={activeEnterprise?.website} icon={Globe} />
                    <InfoRow label="Siège Social" value={activeEnterprise?.address} icon={MapPin} />
                 </div>
              </div>

              <div className="bg-[#09090b] rounded-[3.5rem] p-12 text-white border border-white/5 shadow-2xl">
                 <div className="flex items-center justify-between mb-10">
                    <h3 className="text-[10px] font-black text-brand uppercase tracking-[0.4em]">Vault Légal</h3>
                    <button className="text-slate-500 hover:text-white transition-colors">
                       <Plus className="w-4 h-4" />
                    </button>
                 </div>
                 <div className="space-y-4">
                    {[
                      { name: 'Statuts_Entreprise.pdf', size: '2.4 MB' },
                      { name: 'Attestation_Fiscale_2025.pdf', size: '1.1 MB' },
                      { name: 'Registre_Commerce.pdf', size: '3.2 MB' },
                    ].map((doc, i) => (
                      <div key={i} className="group p-5 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-brand">
                               <FileText className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="text-[12px] font-bold text-white/90">{doc.name}</p>
                               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{doc.size}</p>
                            </div>
                         </div>
                         <button className="text-slate-600 hover:text-brand p-2">
                            <Download className="w-4 h-4" />
                         </button>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
