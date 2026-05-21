import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Globe, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      
      <section className="pt-32 pb-32 px-4 mt-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour à l'accueil
          </Link>

          <div className="grid lg:grid-cols-2 gap-20">
             <div className="space-y-12">
                <div className="space-y-6">
                   <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-[0.85]">
                      Parlons de votre <br/> <span className="text-brand">Transformation.</span>
                   </h1>
                   <p className="text-xl text-slate-500 font-medium tracking-tight leading-relaxed max-w-md">
                      Nos bureaux à Abidjan sont ouverts pour vous accompagner dans votre migration vers UNIKORP.
                   </p>
                </div>

                <div className="space-y-8">
                   {[
                     { icon: MapPin, title: "Siège Social", value: "Plateau, Avenue Marchand, Abidjan, CI" },
                     { icon: Mail, title: "Support", value: "assistance@unikorp-erp.com" },
                     { icon: Phone, title: "Bureaux", value: "+225 27 22 00 00 00" }
                   ].map(item => (
                     <div key={item.title} className="flex items-start gap-6 group">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all">
                           <item.icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                           <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.title}</h4>
                           <p className="text-lg font-bold text-slate-900 tracking-tight">{item.value}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-white rounded-[3.5rem] border border-slate-100 p-12 shadow-2xl shadow-slate-200/50">
                <form className="space-y-8">
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Nom Complet</label>
                         <input type="text" className="w-full h-16 px-8 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-brand transition-all text-sm font-medium" placeholder="Ex: Jean Koffi" />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Email Professionnel</label>
                         <input type="email" className="w-full h-16 px-8 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-brand transition-all text-sm font-medium" placeholder="jean@entreprise.com" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Votre Message</label>
                      <textarea className="w-full h-48 px-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-brand transition-all resize-none text-sm font-medium" placeholder="Décrivez votre projet ou vos besoins en gestion..." />
                   </div>
                   <Button className="w-full h-16 bg-slate-900 hover:bg-black text-white border-0 shadow-xl shadow-slate-900/20 rounded-2xl font-bold uppercase text-xs tracking-widest cursor-pointer">
                      Envoyer ma demande
                   </Button>
                </form>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
