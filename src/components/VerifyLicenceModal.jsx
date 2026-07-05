import { useState, useEffect } from 'react';

export default function VerifyLicenceModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="w-16"></div>
        <h2 className="text-lg font-semibold text-gray-900">Verify Licence</h2>
        <button onClick={onClose} className="text-gray-900 font-medium">Close</button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[350px] mb-6">
              <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden relative">
                 <div className="absolute inset-0 flex items-center justify-center opacity-30 blur-sm">
                    <div className="grid grid-cols-12 gap-1 p-8">
                       {[...Array(144)].map((_, i) => (
                         <div key={i} className="w-3 h-3 bg-gray-800 rounded-sm"></div>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-[#5aab2a] rounded-full"></div>
              </div>
            </div>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-6 px-2">
              By presenting this QR code you <span className="font-bold">consent</span> to share some or all of your driver licence information, including with scanners, venues and law enforcement agencies. They may retain your information in accordance with their business practices and legal requirements.
            </p>

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
        ) : (
          <div className="flex flex-col items-center">
             <div className="w-full aspect-square max-w-[350px] mb-2 bg-white p-4 border border-gray-200 rounded-lg">
                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white text-xs">
                   Real QR Code Here
                </div> 
             </div>
             <p className="text-gray-500 text-sm mb-6 font-medium">QR expires 02:00</p>

             <p className="text-gray-700 text-sm leading-relaxed mb-6 px-2">
              By presenting this QR code you <span className="font-bold">consent</span> to share some or all of your driver licence information, including with scanners, venues and law enforcement agencies. They may retain your information in accordance with their business practices and legal requirements.
            </p>

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
        )}
      </div>
    </div>
  );
}
