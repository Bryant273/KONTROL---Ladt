import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, Building2, Briefcase, ShieldCheck, Mail, Lock, ArrowRight, User, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';

export default function Auth() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) navigate('/app');
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    role: 'COMPANY_ADMIN'
  });

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmail(formData.email, formData.password);
      } else {
        await signUpWithEmail(formData.email, formData.password, formData.role);
      }
    } catch (error: any) {
      alert(error.message || "Erreur lors de l'authentification");
    } finally {
      setLoading(false);
    }
  };

  const internalEmail = formData.companyName 
    ? `${formData.companyName.toLowerCase().trim().replace(/\s+/g, '-')}@unikorp-erp.com`
    : 'entreprise@unikorp-erp.com';

  const handleCompanyNameChange = (value: string) => {
    const generated = value
      ? `${value.toLowerCase().trim().replace(/\s+/g, '-')}@unikorp-erp.com`
      : 'entreprise@unikorp-erp.com';
    
    setFormData((prev) => ({
      ...prev, 
      companyName: value,
      email: isLogin ? prev.email : generated
    }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Visual Sidebar */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand/20 via-transparent to-transparent" />
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest transition-all mb-12 backdrop-blur-sm border border-white/10 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour à l'accueil
          </Link>

          <Logo 
            className="mb-12" 
            textClassName="text-white" 
            iconClassName="w-10 h-10 text-brand"
          />
          
          <h2 className="text-5xl font-bold text-white tracking-tighter leading-tight mb-6">
            L'infrastructure logicielle<br/> des <span className="text-brand">leaders</span>.
          </h2>
          <p className="text-slate-400 text-lg font-medium tracking-tight max-w-md">
            Connectez votre organisation à l'écosystème ERP le plus performant du marché.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-6">
          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
            <ShieldCheck className="w-8 h-8 text-brand mb-4" />
            <h4 className="text-white font-bold text-sm mb-1">Sécurité Grade Bancaire</h4>
            <p className="text-slate-500 text-xs">Chiffrement AES-256 et isolation des données.</p>
          </div>
          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
            <Building2 className="w-8 h-8 text-emerald-400 mb-4" />
            <h4 className="text-white font-bold text-sm mb-1">Architecture Entreprise</h4>
            <p className="text-slate-500 text-xs">Conçu pour les structures multi-fichiers.</p>
          </div>
        </div>
      </div>

      {/* Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-4">
            <div className="flex gap-2">
               <button 
                onClick={() => setIsLogin(true)}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all cursor-pointer ${isLogin ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
              >
                Connexion
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all cursor-pointer ${!isLogin ? 'bg-brand text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
              >
                Inscription
              </button>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tighter">
              {isLogin ? 'Bienvenue chez UNIKORP' : 'Initialiser mon accès'}
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">
              {isLogin 
                ? 'Accédez à votre console de gestion centralisée.' 
                : 'Créez votre dossier entreprise et vos identifiants ERP.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Nom de l'organisation</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required={!isLogin}
                        type="text" 
                        value={formData.companyName}
                        onChange={(e) => handleCompanyNameChange(e.target.value)}
                        className="w-full h-14 pl-12 pr-6 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:border-brand transition-all text-sm font-medium" 
                        placeholder="Ex: INNOV'KORP SARL" 
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                       <Mail className="w-3.5 h-3.5 text-brand" />
                       <span className="text-[10px] font-bold text-brand uppercase tracking-widest">Identifiant interne généré</span>
                    </div>
                    <code className="text-xs font-bold text-slate-600 block bg-white px-3 py-2 rounded-lg border border-emerald-100">
                      {internalEmail}
                    </code>
                    <p className="text-[10px] text-slate-400 mt-2 italic">Valable pour tous les modules (SKOMPTAB, SOCIX...)</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  Email
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full h-14 pl-12 pr-6 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:border-brand transition-all text-sm font-medium" 
                    placeholder="entreprise@unikorp-erp.com" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full h-14 pl-12 pr-6 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:border-brand transition-all text-sm font-medium" 
                    placeholder="••••••••" 
                  />
                </div>
                {!isLogin && formData.password && (
                  <div className="space-y-1.5 mt-2">
                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-400 px-1">
                      <span>Robustesse</span>
                      <span className={strength <= 2 ? 'text-red-500' : strength <= 4 ? 'text-orange-500' : 'text-emerald-500'}>
                        {strength <= 2 ? 'Faible' : strength <= 4 ? 'Moyenne' : 'Excellente'}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div 
                          key={level}
                          className={`h-full flex-1 transition-all duration-500 ${
                            level <= strength 
                              ? (strength <= 2 ? 'bg-red-500' : strength <= 4 ? 'bg-orange-500' : 'bg-emerald-500') 
                              : 'bg-slate-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Confirmer le mot de passe</label>
                  <div className="relative">
                    <ShieldCheck className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${formData.password && formData.confirmPassword ? (formData.password === formData.confirmPassword ? 'text-emerald-500' : 'text-red-500') : 'text-slate-400'}`} />
                    <input 
                      required 
                      type="password" 
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full h-14 pl-12 pr-6 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:border-brand transition-all text-sm font-medium" 
                      placeholder="••••••••" 
                    />
                  </div>
                  {formData.confirmPassword && (
                    <div className="flex items-center gap-2 pl-1 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${formData.password === formData.confirmPassword ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${formData.password === formData.confirmPassword ? 'text-emerald-500' : 'text-red-500'}`}>
                        {formData.password === formData.confirmPassword ? 'Mots de passe identiques' : 'Les mots de passe diffèrent'}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            <Button 
              type="submit" 
              loading={loading}
              className={`w-full h-14 rounded-2xl font-bold uppercase text-xs tracking-widest shadow-xl transition-all border-0 cursor-pointer ${isLogin ? 'bg-slate-900 hover:bg-black shadow-slate-900/20' : 'bg-brand hover:bg-emerald-600 shadow-brand/20'}`}
            >
              VALIDER
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {isLogin && (
            <div className="text-center">
               <button className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline decoration-2 underline-offset-4 cursor-pointer">
                 Identifiant interne perdu ? Contactez INNOV'KORP
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
