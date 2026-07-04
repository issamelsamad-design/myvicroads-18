import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('cookieConsent');
    if (!hasAccepted) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleLearnMore = () => {
    alert('Privacy Policy page will open here');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white px-4 py-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        <p className="text-sm sm:text-base mb-3">
          This website uses cookies to ensure you get the best experience on our website.{' '}
          <button 
            onClick={handleLearnMore}
            className="underline hover:text-gray-300"
          >
            Learn More
          </button>
        </p>
        <button
          onClick={handleAccept}
          className="w-full sm:w-auto px-6 py-2.5 bg-white text-black font-medium rounded hover:bg-gray-100 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
}
