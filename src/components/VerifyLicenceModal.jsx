import { useState, useEffect } from 'react';

export default function VerifyLicenceModal({ isOpen, onClose }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset to loading state every time it opens
      setIsLoaded(false);
      
      // Wait 0.3 seconds (300ms) before showing the real QR code
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 300); 
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="w-16"></div>
        <h2 className="text-lg font-semibold text-gray-900">Verify Licence</h2>
        <button onClick={onClose} className="text-gray-900 font-medium">Close</button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex flex-col items-center">
          
          {/* QR Code Container */}
          <div className="relative w-full aspect-square max-w-[350px] mb-2 bg-white rounded-lg overflow-hidden">
            
            {/* 1. THE GRAY BLOCKY PLACEHOLDER QR (Always renders first) */}
            <div className={`absolute inset-0 bg-gray-50 p-6 transition-opacity duration-300 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}>
               {/* Top-Left Finder Pattern */}
               <div className="absolute top-6 left-6 w-14 h-14 border-4 border-gray-300 rounded-sm">
                  <div className="absolute inset-2 bg-gray-300"></div>
               </div>
               {/* Top-Right Finder Pattern */}
               <div className="absolute top-6 right-6 w-14 h-14 border-4 border-gray-300 rounded-sm">
                  <div className="absolute inset-2 bg-gray-300"></div>
               </div>
               {/* Bottom-Left Finder Pattern */}
               <div className="absolute bottom-6 left-6 w-14 h-14 border-4 border-gray-300 rounded-sm">
                  <div className="absolute inset-2 bg-gray-300"></div>
               </div>
               
               {/* Random Gray Blocks to mimic QR data */}
               <div className="absolute inset-0 grid grid-cols-12 gap-1 p-8 opacity-60">
                  {Array.from({ length: 144 }).map((_, i) => (
                     <div key={i} className={`w-full h-full rounded-[2px] ${Math.random() > 0.4 ? 'bg-gray-300' : 'bg-transparent'}`}></div>
                  ))}
               </div>
            </div>

            {/* 2. THE REAL QR CODE (Fades in after 0.3s) */}
            <div className={`absolute inset-0 bg-white p-4 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
               {/* REPLACE THIS DIV WITH YOUR ACTUAL QR CODE COMPONENT */}
               <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white text-xs rounded">
                  [ Real QR Code Loads Here ]
               </div> 
            </div>

            {/* 3. THE GREEN CIRCLE (Sits on top during loading) */}
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-32 h-32 bg-[#5aab2a] rounded-full shadow-lg"></div>
              </div>
            )}
          </div>

          {/* Timer */}
          <p className={`text-gray-500 text-sm mb-6 font-medium transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            QR expires 02:00
          </p>

          {/* Consent Text */}
          <p className="text-gray-700 text-sm leading-relaxed mb-6 px-2 text-center">
            By presenting this QR code you <span className="font-bold">consent</span> to share some or all of your driver licence information, including with scanners, venues and law enforcement agencies. They may retain your information in accordance with their business practices and legal requirements.
          </p>

          {/* Sharing List */}
          <div className="w-full">
            <h3 className="font-bold text-gray-900 mb-3">You're sharing:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
              <li>Victorian driver licence photo</li>
              <li>Full name, birth date and address</li>
              <li>Licence number, type and expiry date</li>
              <li>Licence status</li>
              <li>Proficiency</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
