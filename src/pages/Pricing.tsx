import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { cn, formatCurrency, detectCurrency } from '../lib/utils';
import { CheckCircle2, ArrowRight, ArrowLeft, Zap, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Pricing() {
  const navigate = useNavigate();
  const currency = detectCurrency();

  const plans = [
    {
      name: "Startup",
      price: 65000,
      desc: "Parfait pour les TPE.",
      features: ["Module SKOMPTAB", "1 Dossier de gestion", "Support Digital"],
      cta: "Commencer"
    },
    {
      name: "Advanced",
      price: 165000,
      desc: "Le choix des experts.",
      features: ["Accès à tous les modules", "3 Dossiers inclus", "Support Prioritaire 24/7", "Formation Socix"],
      featured: true,
      cta: "Déployer maintenant"
    },
    {
      name: "Enterprise",
      price: "Sur mesure",
      desc: "Pour les grands groupes.",
      features: ["Dossiers illimités", "SLA Garanti 99.9%", "API Cloud Illimitée", "Déploiement sur site"],
      cta: "Contacter INNOV'KORP"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      <Navbar />
      
      <section className="pt-44 pb-32 px-6">
        <div className="max-w-7xl mx-auto space-y-24">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-slate-100 pb-20">
            <div className="space-y-6">
              <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.85] uppercase">
                Plans <span className="text-brand">Souverains.</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium tracking-tight max-w-xl leading-relaxed uppercase">
                Chaque entreprise mérite une infrastructure de classe mondiale. Commencez gratuitement pendant 15 jours.
              </p>
            </div>
            
            <div className="bg-[#09090b] rounded-[2.5rem] p-10 text-white flex items-center gap-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Zap className="w-16 h-16" />
               </div>
               <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white shrink-0">
                 <Zap className="w-7 h-7" />
               </div>
               <div>
                 <p className="text-[10px] font-black text-brand uppercase tracking-[0.4em] mb-1">PROMOTION ACTIVE</p>
                 <h4 className="text-xl font-bold tracking-tight">15 JOURS DE DÉMO OFFERTS</h4>
                 <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-1">Accès illimité à tous les modules</p>
               </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pb-24">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={cn(
                  "p-12 rounded-[4rem] border-2 flex flex-col gap-12 transition-all hover:shadow-2xl relative",
                  plan.featured ? "bg-[#09090b] text-white border-transparent shadow-2xl scale-105 z-10" : "bg-white text-slate-900 border-slate-100"
                )}
              >
                {plan.featured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-brand rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-xl text-white">
                    Recommandé
                  </div>
                )}
                
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand">{plan.name} Package</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-tighter tabular-nums uppercase">
                      {typeof plan.price === 'number' ? formatCurrency(plan.price, currency) : plan.price}
                    </span>
                    {typeof plan.price === 'number' && (
                      <span className="opacity-40 text-[9px] font-black uppercase tracking-widest">/ mois HT</span>
                    )}
                  </div>
                  <p className="text-xs opacity-60 font-bold uppercase tracking-widest">{plan.desc}</p>
                </div>

                <div className="space-y-5 flex-grow pt-10 border-t border-slate-100/10">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-4 text-xs font-bold tracking-tight uppercase">
                      <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                      <span className="opacity-80 tracking-widest truncate">{f}</span>
                    </div>
                  ))}
                </div>

                <Button 
                   onClick={() => navigate('/auth')}
                   className={cn(
                    "w-full h-16 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] transition-all cursor-pointer shadow-xl border-0",
                    plan.featured ? "bg-brand hover:brightness-110 text-white shadow-brand/20" : "bg-slate-50 text-slate-900 hover:bg-slate-100"
                   )}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-3" />
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-[#fafafa] rounded-[4rem] p-20 flex flex-col md:flex-row items-center gap-20 border border-slate-100">
             <div className="flex-1 space-y-6">
                <ShieldCheck className="w-16 h-16 text-brand" />
                <h3 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">La Souveraineté de vos données avant tout.</h3>
                <p className="text-slate-500 font-medium leading-relaxed max-w-md uppercase text-xs tracking-widest">
                  Tous nos plans incluent le chiffrement de bout en bout, l'isolation des dossiers et une garantie de conformité SOC2.
                </p>
             </div>
             <div className="grid grid-cols-2 gap-8 flex-1 w-full">
                {[
                  { l: 'Uptime', v: '99.9%' },
                  { l: 'Encryption', v: 'AES-256' },
                  { l: 'Trial', v: '15 Days' },
                  { l: 'Support', v: '24/7' },
                ].map(stat => (
                  <div key={stat.l} className="p-8 bg-white border border-slate-100 rounded-3xl text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.l}</p>
                    <p className="text-2xl font-black text-slate-900">{stat.v}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
