import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Button } from '../../components/ui/Button';
import { motion } from 'motion/react';
import { BarChart3, CheckCircle2, ArrowRight, ShieldCheck, PieChart, TrendingUp, FileText, ArrowLeft, Search, Download } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../../components/ui/Logo';

export default function Skomptab() {
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
                className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-brand border border-emerald-100 shadow-xl shadow-emerald-500/10"
              >
                <BarChart3 className="w-10 h-10" />
              </motion.div>
              
              <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-[0.85]">
                SKOMPTAB<br/>
                <span className="text-brand">Finance de précision.</span>
              </h1>
              
              <p className="text-xl text-slate-500 font-medium tracking-tight max-w-lg leading-relaxed">
                Le module de comptabilité générale et analytique conçu pour les structures exigeantes d'Abidjan. Sécurisez vos flux et optimisez votre rentabilité.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="bg-brand hover:bg-emerald-600 text-white border-0 shadow-xl shadow-emerald-500/20 font-bold uppercase text-xs tracking-widest cursor-pointer"
                >
                  Essayer gratuitement <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="border-slate-200 text-slate-900 font-bold uppercase text-xs tracking-widest cursor-pointer hover:bg-slate-50">
                  Démo en direct
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden group">
                <div className="h-12 bg-slate-50 border-b border-slate-100 px-6 flex items-center justify-between">
                   <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                   </div>
                   <div className="flex items-center gap-4">
                      <Search className="w-3.5 h-3.5 text-slate-300" />
                      <div className="w-24 h-5 bg-slate-100 rounded-md" />
                   </div>
                </div>

                <div className="flex-grow p-8 flex flex-col gap-6">
                   <div className="flex justify-between items-end">
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bilan de Période</p>
                         <p className="text-2xl font-bold text-slate-900 tracking-tighter">Journal Général</p>
                      </div>
                      <div className="flex gap-2">
                         <div className="px-3 py-1 bg-emerald-50 text-brand text-[10px] font-bold rounded-full border border-emerald-100">OHADA 2026</div>
                         <Download className="w-4 h-4 text-slate-300" />
                      </div>
                   </div>

                   <div className="space-y-3">
                      {[
                        { label: 'Ventes Mars', val: '+ 12 450 000 FCFA', color: 'text-emerald-500' },
                        { label: 'Achats Fournisseurs', val: '- 4 200 000 FCFA', color: 'text-slate-900' },
                        { label: 'Charges Sociales', val: '- 1 850 000 FCFA', color: 'text-slate-900' }
                      ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                           <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{row.label}</span>
                           <span className={`text-sm font-bold ${row.color}`}>{row.val}</span>
                        </div>
                      ))}
                   </div>
                   
                   <div className="mt-auto p-6 bg-slate-900 rounded-3xl text-white shadow-xl shadow-slate-900/20">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Résultat Net</span>
                         <TrendingUp className="w-4 h-4 text-brand" />
                      </div>
                      <div className="text-3xl font-bold tracking-tight">6 400 000 FCFA</div>
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
              {
                title: "Fiscalité Conforme",
                desc: "Adapté au système OHADA pour une conformité parfaite en Côte d'Ivoire.",
                icon: FileText
              },
              {
                title: "Automatisation Bancaire",
                desc: "Synchronisez vos comptes bancaires locaux pour un lettrage automatique.",
                icon: ShieldCheck
              },
              {
                title: "Reporting Multiniveau",
                desc: "Générez des rapports consolidés pour plusieurs fichiers .ukp.",
                icon: PieChart
              }
            ].map(feature => (
              <div key={feature.title} className="space-y-6 p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 font-medium tracking-tight text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-5xl font-bold text-slate-900 tracking-tighter">Prêt à transformer votre finance ?</h2>
          <p className="text-xl text-slate-500 font-medium tracking-tight">Rejoignez les entreprises de Côte d'Ivoire qui font confiance à UNIKORP pour leur gestion.</p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-slate-900 hover:bg-black text-white border-0 shadow-2xl shadow-slate-900/20 rounded-2xl h-16 px-12 font-bold uppercase text-xs tracking-widest cursor-pointer"
          >
            Commencer maintenant
          </Button>
        </div>
      </section>
    </div>
  );
}
