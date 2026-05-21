import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Button } from '../../components/ui/Button';
import { motion } from 'motion/react';
import { Target, CheckCircle2, ArrowRight, Zap, Target as TargetIcon, MessageSquare, Globe, Sparkles, ArrowLeft, TrendingUp } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Markos() {
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
                className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-orange-600 border border-orange-100 shadow-xl shadow-orange-500/10"
              >
                <Target className="w-10 h-10" />
              </motion.div>
              
              <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-[0.85]">
                MARKOS<br/>
                <span className="text-orange-600">Croissance Agile.</span>
              </h1>
              
              <p className="text-xl text-slate-500 font-medium tracking-tight max-w-lg leading-relaxed">
                Le module CRM et Marketing pour captiver votre audience à Abidjan et au-delà. Identifiez vos opportunités et convertissez plus vite.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="bg-orange-600 hover:bg-orange-700 text-white border-0 shadow-xl shadow-orange-500/20 font-bold uppercase text-xs tracking-widest cursor-pointer"
                >
                  Booster mon business <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="border-slate-200 text-slate-900 font-bold uppercase text-xs tracking-widest cursor-pointer hover:bg-slate-50">
                  Calculer mon ROI
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col group overflow-hidden">
                <div className="h-10 bg-slate-50 border-b border-slate-100 px-6 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-red-400" />
                   <div className="w-2 h-2 rounded-full bg-orange-400" />
                   <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                
                <div className="flex-grow p-8 flex flex-col gap-6">
                   <div className="flex justify-between items-center">
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Dashboard Marketing</p>
                         <h4 className="text-xl font-bold text-slate-900 tracking-tight">Pipeline de Ventes</h4>
                      </div>
                      <div className="flex -space-x-3">
                         {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" />)}
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                         <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">Leads</p>
                         <p className="text-2xl font-bold text-slate-900">1,240</p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                         <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Conversion</p>
                         <p className="text-2xl font-bold text-slate-900">32.4%</p>
                      </div>
                   </div>

                   <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex-grow">
                      <div className="flex items-center gap-3 mb-4">
                         <Sparkles className="w-4 h-4 text-orange-500" />
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Activité Récente</span>
                      </div>
                      <div className="space-y-3">
                         <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-brand w-3/4" />
                         </div>
                         <div className="h-2 w-2/3 bg-slate-200 rounded-full" />
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-4 bg-white">
         <div className="max-w-7xl mx-auto space-y-20">
            <div className="grid md:grid-cols-4 gap-8">
               {[
                 { title: "CRM Unifié", icon: TargetIcon, label: "Vue 360°" },
                 { title: "Campagnes SMS/Email", icon: MessageSquare, label: "Ciblage Local" },
                 { title: "Multi-Pays", icon: Globe, label: "Exportation" },
                 { title: "Insight IA", icon: Sparkles, label: "Prdictif" }
               ].map(item => (
                 <div key={item.title} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center space-y-4 group hover:bg-white hover:shadow-2xl transition-all">
                    <div className="w-12 h-12 bg-white shadow-sm rounded-xl mx-auto flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                       <item.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm tracking-tight">{item.title}</h4>
                    <span className="inline-block text-[10px] font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">{item.label}</span>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
