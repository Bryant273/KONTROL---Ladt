import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { motion } from 'motion/react';
import { Logo } from '../components/ui/Logo';
import { Globe, ShieldCheck, Zap, Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 mt-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour à l'accueil
          </Link>

          <div className="space-y-20">
            <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center mb-8"
            >
               <Logo iconClassName="w-20 h-20 text-brand" textClassName="text-5xl" />
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 leading-[0.85]">
              Redéfinir le <span className="text-brand">possible</span>.
            </h1>
            <p className="text-xl text-slate-500 font-medium tracking-tight leading-relaxed">
              UNIKORP est une initiative du groupe technologique INNOV'KORP, dont le siège est fièrement établi à Abidjan. Nous construisons les infrastructures logicielles souveraines du continent.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
               <h3 className="text-3xl font-bold tracking-tighter text-slate-900">Notre Mission</h3>
               <p className="text-slate-500 font-medium tracking-tight leading-relaxed">
                 Donner à chaque organisation les outils de classe mondiale nécessaires pour piloter leur croissance avec une transparence totale et une efficacité mathématique.
               </p>
            </div>
            <div className="space-y-6">
               <h3 className="text-3xl font-bold tracking-tighter text-slate-900">Notre Vision</h3>
               <p className="text-slate-500 font-medium tracking-tight leading-relaxed">
                 Devenir le standard global de l'ERP agile, en prouvant que l'excellence en ingénierie logicielle n'a pas de frontières.
               </p>
            </div>
          </div>

          <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
             {[
               { icon: Globe, label: "Fierté Locale", value: "Abidjan, CI" },
               { icon: ShieldCheck, label: "Fiabilité", value: "99.9% Uptime" },
               { icon: Zap, label: "Performance", value: "< 2ms Latence" },
               { icon: Heart, label: "Support", value: "24/7 Experts" }
             ].map(stat => (
               <div key={stat.label} className="text-center space-y-2">
                  <stat.icon className="w-8 h-8 text-brand mx-auto mb-2" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                  <p className="text-lg font-bold text-slate-900 tracking-tight">{stat.value}</p>
               </div>
             ))}
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}
