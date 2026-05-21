import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Button } from '../../components/ui/Button';
import { motion } from 'motion/react';
import { Users, CheckCircle2, ArrowRight, UserPlus, Heart, Zap, UserCheck, ArrowLeft, Search, Filter } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function Socix() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 mt-20">
        <div className="max-w-7xl mx-auto space-y-12">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour à l'accueil
          </Link>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-emerald-400 border border-slate-800 shadow-xl shadow-slate-900/10"
              >
                <Users className="w-10 h-10" />
              </motion.div>
              
              <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-[0.85]">
                SOCIX<br/>
                <span className="text-emerald-500">Capital Humain.</span>
              </h1>
              
              <p className="text-xl text-slate-500 font-medium tracking-tight max-w-lg leading-relaxed">
                Le module RH et Mix Social pour bâtir des équipes performantes. Recrutement, paie et bien-être au travail.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="bg-brand hover:bg-emerald-600 text-white border-0 shadow-xl shadow-emerald-500/20 font-bold uppercase text-xs tracking-widest cursor-pointer"
                >
                  Gérer mes équipes <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="ghost" size="lg" className="text-slate-400 font-bold uppercase text-xs tracking-widest cursor-pointer hover:text-slate-900">
                  En savoir plus
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 flex flex-col group overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                
                <div className="relative z-10 flex flex-col h-full gap-8">
                   <div className="flex justify-between items-center">
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">RH & Mix Social</p>
                         <h4 className="text-white text-xl font-bold tracking-tight">Liste du Personnel</h4>
                      </div>
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-brand border border-white/10">
                         <Search className="w-5 h-5" />
                      </div>
                   </div>

                   <div className="space-y-3">
                      {[
                        { name: 'S. Koffi', role: 'Directeur Financier', status: 'Actif' },
                        { name: 'M. Diallo', role: 'Logistique', status: 'Actif' },
                        { name: 'A. Bamba', role: 'Marketing', status: 'Onboarding' }
                      ].map((staff, i) => (
                        <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between backdrop-blur-md">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white uppercase">{staff.name[0]}</div>
                              <div>
                                 <p className="text-xs font-bold text-white">{staff.name}</p>
                                 <p className="text-[10px] text-slate-400 font-medium">{staff.role}</p>
                              </div>
                           </div>
                           <span className={cn(
                             "px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest",
                             staff.status === 'Actif' ? "bg-emerald-500/20 text-emerald-400" : "bg-orange-500/20 text-orange-400"
                           )}>{staff.status}</span>
                        </div>
                      ))}
                   </div>

                   <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <Heart className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Score Engagement</p>
                            <p className="text-xl text-white font-bold leading-none">A+</p>
                         </div>
                      </div>
                      <div className="flex -space-x-2">
                         {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700" />)}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
             {[
               { title: "Paie", desc: "Calcul automatique des cotisations sociales et fiscales locales.", icon: Zap },
               { title: "Gestion des Talents", icon: UserPlus, desc: "Recrutement et onboarding centralisés." },
               { title: "Engagement Social", icon: Heart, desc: "Mesurez le climat social et la satisfaction interne." }
             ].map(feature => (
               <div key={feature.title} className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-slate-900 hover:text-white transition-all group">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-brand group-hover:text-white transition-all">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tighter mb-2">{feature.title}</h3>
                  <p className="text-sm opacity-60 font-medium tracking-tight leading-relaxed">{feature.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
}
