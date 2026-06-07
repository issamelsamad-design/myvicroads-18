import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { AuthGuard } from '@/lib/AuthGuard';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Login from './pages/Login';
import PendingApproval from './pages/PendingApproval';
import PinEntry from './pages/PinEntry';
import Home from './pages/Home';
import Vehicles from './pages/Vehicles';
import Licence from './pages/Licence';
import LicenceDetails from './pages/LicenceDetails';
import Payments from './pages/Payments';
import Profile from './pages/Profile';
import AppLayout from './components/vicroads/AppLayout';
import HelpAndInfo from './pages/HelpAndInfo';
import DemeritPoints from './pages/DemeritPoints';
import AdminPanel from './pages/AdminPanel';
import EditDetails from './pages/EditDetails';
import RequestAccess from './pages/RequestAccess';
import VerifyLicence from './pages/VerifyLicence';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #4caf50, #2e7d32)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(46,125,50,0.35)' }}>
          <svg width="52" height="52" viewBox="0 0 64 64" fill="none" style={{ animation: 'spin 0.9s linear infinite', transformOrigin: '32px 32px' }}>
            <circle cx="32" cy="32" r="22" stroke="rgba(255,255,255,0.2)" strokeWidth="5" fill="none"/>
            <path d="M 32 10 A 22 22 0 1 1 10 32" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/pending" element={<PendingApproval />} />
      <Route path="/verify-licence" element={<VerifyLicence />} />

      {/* Protected routes */}
      <Route path="/" element={<AuthGuard><PinEntry /></AuthGuard>} />
      <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
        <Route path="/home" element={<Home />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/licence" element={<Licence />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/licence-details" element={<AuthGuard><LicenceDetails /></AuthGuard>} />
      <Route path="/admin" element={<AuthGuard><AdminPanel /></AuthGuard>} />
      <Route path="/help-and-info" element={<AuthGuard><HelpAndInfo /></AuthGuard>} />
      <Route path="/demerit-points" element={<AuthGuard><DemeritPoints /></AuthGuard>} />
      <Route path="/edit-details" element={<AuthGuard><EditDetails /></AuthGuard>} />
      <Route path="/request-access" element={<RequestAccess />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
