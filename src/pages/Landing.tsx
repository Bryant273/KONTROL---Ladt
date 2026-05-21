import { motion } from 'motion/react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { formatCurrency, detectCurrency } from '../lib/utils';
import { 
  BarChart3, 
  Users, 
  Target, 
  Truck, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  MapPin
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const currency = detectCurrency();

  useEffect(() => {
    if (!loading && user) {
      navigate('/app');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      
      {/* Hero Section - Bento style */}
      <section className="pt-40 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 shadow-sm shadow-emerald-100/50"
              >
                <span className="text-[10px] font-bold text-brand uppercase tracking-[0.2em]">Propulsé par INNOV'KORP</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 leading-[0.85]"
              >
                L'ERP qui <span className="text-brand">unifie</span><br/> votre ambition.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-500 max-w-xl font-medium tracking-tight"
              >
                UNIKORP fusionne finances, RH et logistique dans une interface intelligente conçue pour l'excellence opérationnelle.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="w-full sm:w-auto gap-2 bg-brand hover:bg-emerald-600 text-white border-0 shadow-xl shadow-emerald-500/20 font-bold uppercase text-xs tracking-widest cursor-pointer"
                >
                  Initialiser mon projet <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="lg" className="w-full sm:w-auto font-bold uppercase text-xs tracking-widest text-slate-400 hover:text-slate-900 cursor-pointer">
                  Découvrir SOCIX & MARKOS
                </Button>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="aspect-[4/3] bg-white rounded-[3rem] border border-slate-200 shadow-2xl p-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-50 flex flex-col p-8 gap-6">
                   <div className="h-6 w-1/3 bg-slate-200 rounded-lg animate-pulse" />
                   <div className="grid grid-cols-3 gap-4">
                      <div className="h-24 bg-white rounded-2xl border border-slate-100 shadow-sm" />
                      <div className="h-24 bg-white rounded-2xl border border-slate-100 shadow-sm" />
                      <div className="h-24 bg-brand/10 rounded-2xl border border-emerald-100" />
                   </div>
                   <div className="flex-grow bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                      <div className="space-y-4">
                        <div className="h-4 w-full bg-slate-50 rounded" />
                        <div className="h-4 w-5/6 bg-slate-50 rounded" />
                        <div className="h-4 w-4/6 bg-slate-50 rounded" />
                      </div>
                   </div>
                </div>
              </div>
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand/5 rounded-full blur-[100px] -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modules (Solutions) - Grid Bento style */}
      <section id="solutions" className="py-32 px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tighter mb-4">Un écosystème modulaire.</h2>
            <p className="text-slate-500 font-medium tracking-tight">Activez uniquement les outils dont votre croissance a besoin aujourd'hui.</p>
          </div>

          <div className="grid md:grid-cols-12 gap-6 auto-rows-[240px]">
            {[
              { 
                id: 'SKOMPTAB', 
                name: 'SKOMPTAB', 
                path: '/solutions/skomptab',
                desc: 'Finance et comptabilité générale. Pilotez votre rentabilité avec une précision chirurgicale.',
                icon: BarChart3,
                class: 'md:col-span-8',
                theme: 'bg-white text-slate-900 border-slate-200',
                accent: 'text-brand bg-emerald-50'
              },
              { 
                id: 'SOCIX', 
                name: 'SOCIX', 
                path: '/solutions/socix',
                desc: 'RH et Mix Social. Gérez le capital humain.',
                icon: Users,
                class: 'md:col-span-4',
                theme: 'bg-slate-900 text-white border-slate-800',
                accent: 'text-emerald-400 bg-slate-800'
              },
              { 
                id: 'MARKOS', 
                name: 'MARKOS', 
                path: '/solutions/markos',
                desc: 'Marketing et CRM. Boostez votre croissance.',
                icon: Target,
                class: 'md:col-span-4',
                theme: 'bg-white text-slate-900 border-slate-200',
                accent: 'text-orange-600 bg-orange-50'
              },
              { 
                id: 'LOGSON', 
                name: 'LOGSON', 
                path: '/solutions/logson',
                desc: 'Logistique et Contrôle de gestion. Optimisez chaque flux de votre chaîne de valeur.',
                icon: Truck,
                class: 'md:col-span-8',
                theme: 'bg-brand text-white border-emerald-400',
                accent: 'text-white bg-emerald-400/50'
              }
            ].map((module) => (
              <motion.div 
                key={module.id}
                whileHover={{ y: -8 }}
                onClick={() => navigate(module.path)}
                className={cn(
                  "p-10 rounded-[2.5rem] border shadow-sm flex flex-col justify-between transition-all hover:shadow-xl cursor-pointer",
                  module.theme,
                  module.class
                )}
              >
                <div className="flex justify-between items-start">
                  <div className={`w-14 h-14 rounded-2xl ${module.accent} flex items-center justify-center`}>
                    <module.icon className="w-7 h-7" />
                  </div>
                  <CheckCircle2 className="w-5 h-5 opacity-20" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tighter mb-2">{module.name}</h3>
                  <p className="text-sm opacity-60 font-medium tracking-tight max-w-sm">{module.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INNOV'KORP Branding - Bento layout */}
      <section id="about" className="py-32 px-4 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-brand uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1 rounded-full">L'Écosystème INNOV'KORP</span>
                <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-slate-900 leading-tight">
                  L'excellence technologique<br/> au service de <span className="italic font-serif text-slate-400">votre vision.</span>.
                </h2>
              </div>
              <p className="text-xl text-slate-500 font-medium tracking-tight leading-relaxed">
                UNIKORP est l'aboutissement de décennies d'expertise en ingénierie de gestion. Nous concevons des briques logicielles souveraines pour les leaders de demain.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "Grades Bancaires", icon: ShieldCheck, desc: "Sécurité maximale ISO 27001." },
                  { title: "Cloud Souverain", icon: Globe, desc: "Vos données, votre juridiction." },
                  { title: "Temps Réel", icon: Zap, desc: "Latence zéro, efficacité infinie." },
                  { title: "Multi-Unités", icon: CheckCircle2, desc: "Gérez plusieurs fichiers UNIKORP." }
                ].map((item) => (
                  <div key={item.title} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                    <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand group-hover:text-white transition-all">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 font-medium tracking-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-slate-50 rounded-[4rem] flex items-center justify-center border border-slate-100 shadow-inner relative overflow-hidden group">
                 <div className="w-4/5 grid grid-cols-2 gap-4 auto-rows-fr">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 flex flex-col justify-between">
                       <div className="w-8 h-8 bg-brand/10 rounded-lg" />
                       <div className="space-y-2">
                          <div className="h-2 w-full bg-slate-100 rounded" />
                          <div className="h-2 w-1/2 bg-slate-100 rounded" />
                       </div>
                    </div>
                    <div className="bg-slate-900 rounded-3xl shadow-2xl p-6 flex flex-col justify-center gap-4">
                        <div className="flex -space-x-2">
                           {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700" />)}
                        </div>
                        <div className="h-2 w-3/4 bg-slate-700 rounded" />
                    </div>
                    <div className="bg-brand rounded-3xl shadow-2xl col-span-2 flex items-center justify-center p-8 overflow-hidden relative">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent" />
                        <span className="text-white font-bold text-lg tracking-tighter relative z-10">Intégration Totale</span>
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-brand/5 rounded-full blur-[120px] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Contrast Slate/Brand */}
      <section id="pricing" className="py-32 px-4 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter leading-tight">Une tarification qui<br/> respecte votre croissance.</h2>
            <p className="text-slate-500 font-medium tracking-tight">Démarrez avec SKOMPTAB, évoluez vers l'écosystème complet.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Startup",
                price: currency === 'XOF' ? 65000 : 99,
                desc: "Parfait pour les TPE.",
                features: ["Module SKOMPTAB", "1 Dossier de gestion", "Support Digital"],
                cta: "Démarrer"
              },
              {
                name: "Advanced",
                price: currency === 'XOF' ? 165000 : 249,
                desc: "Le choix des experts.",
                features: ["Accès à tous les modules", "3 Dossiers inclus", "Support Prioritaire 24/7"],
                featured: true,
                cta: "Initialiser SOCIX"
              },
              {
                name: "Enterprise",
                price: "Custom",
                desc: "Besoin de sur-mesure ?",
                features: ["Dossiers illimités", "SLA Garanti 99.9%", "API Cloud Illimitée"],
                cta: "Contacter INNOV'KORP"
              }
            ].map((plan) => (
              <div 
                key={plan.name}
                className={cn(
                  "p-12 rounded-[3rem] border flex flex-col gap-10 transition-all hover:shadow-2xl",
                  plan.featured ? "bg-slate-900 text-white border-slate-800 shadow-xl scale-105 z-10" : "bg-white text-slate-900 border-slate-200"
                )}
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand mb-1">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold tracking-tighter">
                        {typeof plan.price === 'number' ? formatCurrency(plan.price, currency) : plan.price}
                      </span>
                      {typeof plan.price === 'number' && (
                        <span className="opacity-40 text-sm font-bold uppercase tracking-widest">/MOIS</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm opacity-60 font-medium tracking-tight">{plan.desc}</p>
                </div>

                <div className="space-y-4 flex-grow">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-3 text-sm font-medium tracking-tight">
                      <CheckCircle2 className="w-4 h-4 text-brand" />
                      <span className="opacity-80">{f}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant={plan.featured ? "default" : "outline"} 
                  onClick={() => navigate('/auth')}
                  className={cn(
                    "w-full h-14 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all cursor-pointer",
                    plan.featured ? "bg-brand hover:bg-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/20" : "border-slate-200 text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form - Refined Bento */}
      <section id="contact" className="py-32 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-50 rounded-[4rem] border border-slate-100 p-8 md:p-20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
            
            <div className="grid lg:grid-cols-2 gap-16 relative z-10">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter leading-none">
                  Une question ?<br/> <span className="text-brand">Expertise</span> à votre écoute.
                </h2>
                <p className="text-xl text-slate-500 font-medium tracking-tight">
                  Nos consultants en transformation digitale vous répondent sous 24h.
                </p>
                <div className="space-y-4 pt-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-brand" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Siège Social</h4>
                      <p className="text-xs text-slate-400 font-medium tracking-tight">Plateau, Avenue Marchand, Abidjan</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Identité</label>
                    <input type="text" className="w-full h-14 px-6 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:border-brand transition-all text-sm font-medium" placeholder="Ex: Marc Lavoie" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email Pro</label>
                    <input type="email" className="w-full h-14 px-6 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:border-brand transition-all text-sm font-medium" placeholder="marc@entreprise.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Votre besoin</label>
                  <textarea className="w-full h-40 px-6 py-5 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:border-brand transition-all resize-none text-sm font-medium" placeholder="Comment UNIKORP peut-il vous aider ?" />
                </div>
                <Button className="w-full h-14 bg-slate-900 hover:bg-black text-white border-0 shadow-xl shadow-slate-900/10 rounded-2xl font-bold uppercase text-xs tracking-widest cursor-pointer">
                  Envoyer ma demande
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-6 max-w-sm">
               <Logo 
                  iconClassName="w-8 h-8 text-white" 
                  className="bg-slate-900 rounded-lg p-1.5 shadow-lg shadow-slate-900/10"
                  textClassName="text-slate-900 text-xl"
               />
               <p className="text-xs text-slate-400 font-medium tracking-tight leading-relaxed">
                 Le système d'exploitation des entreprises modernes. Une marque du groupe technologique INNOV'KORP.
               </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest text-brand">Modules</h4>
                 <ul className="space-y-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <li><Link to="/solutions/skomptab" className="hover:text-brand transition-colors cursor-pointer">SKOMPTAB</Link></li>
                    <li><Link to="/solutions/socix" className="hover:text-brand transition-colors cursor-pointer">SOCIX</Link></li>
                    <li><Link to="/solutions/markos" className="hover:text-brand transition-colors cursor-pointer">MARKOS</Link></li>
                    <li><Link to="/solutions/logson" className="hover:text-brand transition-colors cursor-pointer">LOGSON</Link></li>
                 </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest text-brand">Compagnie</h4>
                <ul className="space-y-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                   <li><Link to="/about" className="hover:text-slate-900 transition-colors cursor-pointer">Innouv'Korp</Link></li>
                   <li><Link to="/contact" className="hover:text-slate-900 transition-colors cursor-pointer">Contact</Link></li>
                   <li><Link to="/pricing" className="hover:text-slate-900 transition-colors cursor-pointer">Tarifs</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Légal</h4>
                <ul className="space-y-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                   <li><Link to="#" className="hover:text-slate-900 transition-colors">RGPD</Link></li>
                   <li><Link to="#" className="hover:text-slate-900 transition-colors">Mentions</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
               UNIKORP Global System © 2026
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
               Engineering excellence by <span className="text-slate-900 px-1 text-xs">INNOV'KORP</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
