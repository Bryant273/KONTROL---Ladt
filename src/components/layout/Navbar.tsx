import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { LayoutDashboard, LogOut, User as UserIcon, Menu, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../ui/Logo';

export function Navbar() {
  const { user, loading, signOut, signInWithGoogle } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Solutions', href: '/solutions/skomptab' },
    { name: 'Tarifs', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
    { name: 'À propos', href: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f8fafc]/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-10">
            <Link to="/">
              <Logo 
                iconClassName="w-10 h-10 text-brand" 
                textClassName="text-slate-900" 
              />
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-brand transition-colors cursor-pointer"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!loading && (
              user ? (
                <Button size="sm" onClick={() => navigate('/app')} className="bg-brand text-white border-0 font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg shadow-emerald-500/10 gap-2">
                  Accéder à l'ERP <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate('/auth')} className="font-bold text-xs uppercase tracking-widest cursor-pointer">Connexion</Button>
                  <Button size="sm" onClick={() => navigate('/auth')} className="bg-brand text-white border-0 font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg shadow-emerald-500/10">Inscription</Button>
                </div>
              )
            )}
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-zinc-600 hover:text-black"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-bottom border-zinc-200 px-4 py-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="text-lg font-medium text-zinc-600 cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-zinc-100 my-2" />
              {!loading && (
                user ? (
                  <Button size="sm" onClick={() => { navigate('/app'); setIsMenuOpen(false); }} className="bg-brand text-white border-0 font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg shadow-emerald-500/10 gap-2">
                    Accéder à l'ERP <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => navigate('/auth')}>Connexion</Button>
                    <Button onClick={() => navigate('/auth')} className="bg-brand text-white">Inscription</Button>
                  </>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
