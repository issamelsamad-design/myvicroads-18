import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Smartphone, CheckCircle2 } from 'lucide-react';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

export default function SecuritySettings() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === '2fa' ? '2fa' : 'password';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [twoFAMessage, setTwoFAMessage] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    if (newPassword !== confirmPassword) { setPasswordMessage('New passwords do not match.'); return; }
    if (newPassword.length < 8) { setPasswordMessage('Password must be at least 8 characters long.'); return; }
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setPasswordMessage('Password updated successfully!');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (error) {
      if (error.code === 'auth/wrong-password') { setPasswordMessage('Current password is incorrect.'); } 
      else { setPasswordMessage('Failed to update password. Please try again.'); }
    }
  };

  const handleSendOTP = () => { setTwoFAMessage('OTP sent successfully! (Demo mode)'); setStep('otp'); };
  const handleVerifyOTP = () => { setTwoFAMessage('Two-step verification enabled successfully! (Demo mode)'); };

  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="bg-card px-5 py-4 border-b border-border flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-full"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold text-foreground">Security settings</h1>
      </div>
      <div className="bg-card border-b border-border flex">
        <button onClick={() => setActiveTab('password')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'password' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>Password</button>
        <button onClick={() => setActiveTab('2fa')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === '2fa' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>Two-step verification</button>
      </div>
      <div className="p-5">
        {activeTab === 'password' ? (
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Current password</label><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="w-full px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">New password</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Confirm new password</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" /></div>
            {passwordMessage && <p className={`text-sm ${passwordMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{passwordMessage}</p>}
            <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">Update password</button>
          </form>
        ) : (
          <div className="space-y-4">
            {step === 'phone' ? (
              <>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3"><Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /><div><p className="text-sm font-medium text-blue-900">Add an extra layer of security</p><p className="text-xs text-blue-700 mt-1">We'll send a code to your phone to verify it's you when you log in.</p></div></div>
                <div><label className="block text-sm font-medium text-foreground mb-1.5">Mobile number</label><input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+61 400 000 000" className="w-full px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" /></div>
                {twoFAMessage && <p className="text-sm text-green-600">{twoFAMessage}</p>}
                <button onClick={handleSendOTP} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">Send verification code</button>
              </>
            ) : (
              <>
                <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" /><div><p className="text-sm font-medium text-green-900">Code sent to {phoneNumber}</p><p className="text-xs text-green-700 mt-1">Enter the 6-digit code we sent to your phone.</p></div></div>
                <div><label className="block text-sm font-medium text-foreground mb-1.5">Verification code</label><input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" maxLength={6} className="w-full px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground text-center text-lg tracking-widest" /></div>
                {twoFAMessage && <p className="text-sm text-green-600">{twoFAMessage}</p>}
                <button onClick={handleVerifyOTP} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">Verify and enable</button>
                <button onClick={() => setStep('phone')} className="w-full text-sm text-muted-foreground hover:text-foreground">Change phone number</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
