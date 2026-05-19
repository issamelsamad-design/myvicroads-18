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
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
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
