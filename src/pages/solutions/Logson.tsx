import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Button } from '../../components/ui/Button';
import { motion } from 'motion/react';
import { Truck, CheckCircle2, ArrowRight, Package, MapPin, BarChart2, Shield, ArrowLeft, Search, Navigation } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Logson() {
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
                className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white border border-emerald-400 shadow-xl shadow-emerald-500/20"
              >
                <Truck className="w-10 h-10" />
              </motion.div>
              
              <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-[0.85]">
                LOGSON<br/>
                <span className="text-brand">Logistique Totale.</span>
              </h1>
              
              <p className="text-xl text-slate-500 font-medium tracking-tight max-w-lg leading-relaxed">
                Le module de gestion de la chaîne logistique et de contrôle de gestion. Du port d'Abidjan à votre entrepôt final.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="bg-brand hover:bg-emerald-600 text-white border-0 shadow-xl shadow-emerald-500/20 font-bold uppercase text-xs tracking-widest cursor-pointer"
                >
                  Optimiser mes flux <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="border-slate-200 text-slate-900 font-bold uppercase text-xs tracking-widest cursor-pointer hover:bg-slate-50">
                   Voir les intégrations
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col group overflow-hidden">
                <div className="h-12 bg-slate-900 flex items-center justify-between px-8">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <p className="text-[10px] font-bold text-white uppercase tracking-widest">Suivi Flotte Temps Réel</p>
                   </div>
                   <Navigation className="w-4 h-4 text-emerald-400" />
                </div>
                
                <div className="flex-grow p-8 flex flex-col gap-6">
                   <div className="flex gap-4">
                      <div className="flex-1 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Véhicules Actifs</p>
                         <p className="text-2xl font-bold text-slate-900">12 / 15</p>
                      </div>
                      <div className="flex-1 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Livraisons Jour</p>
                         <p className="text-2xl font-bold text-slate-900">78%</p>
                      </div>
                   </div>

                   <div className="space-y-3">
                      {[
                        { location: 'Zone 4C, Marcory', status: 'En route', time: '14:20' },
                        { location: 'Port Autonome, Abidjan', status: 'Chargement', time: '15:45' }
                      ].map((item, i) => (
                        <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                                 <MapPin className="w-4 h-4 text-brand" />
                              </div>
                              <div>
                                 <p className="text-xs font-bold text-slate-900">{item.location}</p>
                                 <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{item.status}</p>
                              </div>
                           </div>
                           <span className="text-[10px] font-bold text-slate-400">{item.time}</span>
                        </div>
                      ))}
                   </div>

                   <div className="mt-auto p-4 bg-brand/10 rounded-2xl border border-brand/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <BarChart2 className="w-5 h-5 text-brand" />
                         <span className="text-xs font-bold text-brand uppercase tracking-widest">Optimisation Carburant</span>
                      </div>
                      <span className="text-sm font-bold text-brand">-15%</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-4 bg-white">
         <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { title: "Gestion Stock", desc: "Inventaire temps réel et alertes de rupture.", icon: Package },
                 { title: "Suivi Flotte", desc: "GPS et optimisation des tournées de livraison.", icon: MapPin },
                 { title: "Contrôle de Gestion", desc: "Analyse des coûts de revient et marges nettes.", icon: BarChart2 },
                 { title: "Sûreté Flux", desc: "Traçabilité et audit de chaque mouvement de stock.", icon: Shield }
               ].map(item => (
                 <div key={item.title} className="p-8 rounded-[3rem] bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand mb-6">
                       <item.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-xs text-slate-500 font-medium tracking-tight leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
