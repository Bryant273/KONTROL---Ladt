/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompanyProvider, useCompany } from './context/CompanyContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import DossierSetup from './pages/DossierSetup';
import Users from './pages/modules/Users';
import EnterpriseInfo from './pages/modules/EnterpriseInfo';
import Actions from './pages/modules/Actions';
import Dossiers from './pages/modules/Dossiers';
import Notifications from './pages/modules/Notifications';
import RH from './pages/modules/RH';
import Finance from './pages/modules/Finance';
import InvoicesAdminPage from './pages/modules/InvoicesAdminPage';
import JournalsAdminPage from './pages/modules/JournalsAdminPage';
import LedgerAdminPage from './pages/modules/LedgerAdminPage';
import BalanceAdminPage from './pages/modules/BalanceAdminPage';
import Logistics from './pages/modules/Logistics';
import Marketing from './pages/modules/Marketing';
import Skomptab from './pages/solutions/Skomptab';
import Socix from './pages/solutions/Socix';
import Markos from './pages/solutions/Markos';
import Logson from './pages/solutions/Logson';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';

import { SplashScreen } from './components/ui/SplashScreen';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const [showBypass, setShowBypass] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowBypass(true), 6000);
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) return (
    <div className="relative min-h-screen">
      <SplashScreen />
      {showBypass && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="fixed bottom-24 left-0 right-0 z-[10000] flex flex-col items-center gap-4 px-6"
        >
           <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-100">L'opération prend plus de temps que prévu</p>
           <div className="flex gap-2">
             <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
               Actualiser
             </button>
             <button onClick={signOut} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all cursor-pointer shadow-sm">
               Déconnexion
             </button>
           </div>
        </motion.div>
      )}
    </div>
  );
  
  if (!user) return <Navigate to="/auth" />;
  
  return <>{children}</>;
}

import FileSelectionModal from './components/modals/FileSelectionModal';

function AppRoutes() {
  const { selectedDossier, dossiers, loading: companyLoading } = useCompany();
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  console.log("[Quantum Engine] AppState:", { authLoading, companyLoading, user: !!user, dossiers: dossiers.length, selection: !!selectedDossier });

  // Gateway check: If logged in, in app path, and no dossier selected, show modal
  const showModalGateway = user && !selectedDossier && !authLoading;

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/solutions/skomptab" element={<Skomptab />} />
        <Route path="/solutions/socix" element={<Socix />} />
        <Route path="/solutions/markos" element={<Markos />} />
        <Route path="/solutions/logson" element={<Logson />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route 
          path="/setup" 
          element={
            <ProtectedRoute>
              <DossierSetup />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/app" 
          element={
            <ProtectedRoute>
              {companyLoading ? (
                <SplashScreen />
              ) : (
                <DashboardForceRefresh />
              )}
            </ProtectedRoute>
          } 
        />
        
        {/* Module Specific Routes */}
        <Route path="/app/rh/*" element={<ProtectedRoute><RH /></ProtectedRoute>} />
        <Route path="/app/finance/invoices" element={<ProtectedRoute><InvoicesAdminPage /></ProtectedRoute>} />
        <Route path="/app/finance/journals" element={<ProtectedRoute><JournalsAdminPage /></ProtectedRoute>} />
        <Route path="/app/finance/ledger" element={<ProtectedRoute><LedgerAdminPage /></ProtectedRoute>} />
        <Route path="/app/finance/balance" element={<ProtectedRoute><BalanceAdminPage /></ProtectedRoute>} />
        <Route path="/app/finance/*" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
        <Route path="/app/logistics/*" element={<ProtectedRoute><Logistics /></ProtectedRoute>} />
        <Route path="/app/marketing/*" element={<ProtectedRoute><Marketing /></ProtectedRoute>} />
        
        {/* Admin Specific Routes */}
        <Route path="/app/admin/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/app/admin/actions" element={<ProtectedRoute><Actions /></ProtectedRoute>} />
        <Route path="/app/admin/dossiers" element={<ProtectedRoute><Dossiers /></ProtectedRoute>} />
        <Route path="/app/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/app/admin/info" element={<ProtectedRoute><EnterpriseInfo /></ProtectedRoute>} />
        <Route path="/app/admin/settings" element={<ProtectedRoute><Navigate to="/app" /></ProtectedRoute>} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Gateway Modal */}
      <AnimatePresence>
        {showModalGateway && location.pathname.startsWith('/app') && (
          <FileSelectionModal />
        )}
      </AnimatePresence>
    </>
  );
}

// Helper to force a clean mount of Dashboard when selection changes
function DashboardForceRefresh() {
  const { selectedDossier } = useCompany();
  return <Dashboard key={selectedDossier?.id} />;
}

export default function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <Router>
          <AppRoutes />
        </Router>
      </CompanyProvider>
    </AuthProvider>
  );
}
