import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/Button';
import { Building2, Globe, Calendar, Hash, ArrowRight } from 'lucide-react';

const companySchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  industry: z.string().min(2, "Le secteur est requis"),
  registrationNumber: z.string().optional(),
  exercise: z.string().regex(/^\d{4}$/, "L'exercice doit être une année à 4 chiffres (ex: 2025)"),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormProps {
  onSubmit: (data: CompanyFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CompanyForm({ onSubmit, onCancel, isSubmitting }: CompanyFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      exercise: new Date().getFullYear().toString(),
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand mb-2 block pl-2">Nom de l'entreprise</label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              {...register('name')}
              placeholder="E.g. UNIKORP SARL"
              className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-brand transition-all text-white font-bold"
            />
          </div>
          {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 pl-2">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand mb-2 block pl-2">Secteur d'activité</label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              {...register('industry')}
              placeholder="E.g. Technologie, Commerce, etc."
              className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-brand transition-all text-white font-bold"
            />
          </div>
          {errors.industry && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 pl-2">{errors.industry.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand mb-2 block pl-2">N° Registre (RCCM)</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                {...register('registrationNumber')}
                placeholder="Optionnel"
                className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-brand transition-all text-white font-bold"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand mb-2 block pl-2">Année Exercice</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                {...register('exercise')}
                placeholder="2025"
                className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-brand transition-all text-white font-bold"
              />
            </div>
            {errors.exercise && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 pl-2">{errors.exercise.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 h-14 rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-500 hover:text-white transition-colors"
        >
          Annuler
        </button>
        <Button 
          type="submit" 
          loading={isSubmitting}
          className="flex-1 h-14 bg-brand hover:bg-brand/90 text-white border-0 font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-brand/20 rounded-xl"
        >
          Initialiser <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
