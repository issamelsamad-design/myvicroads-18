import { useState, useEffect, useRef } from 'react';

export default function HolographicOverlay() {
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [needsPermission, setNeedsPermission] = useState(false);
  const containerRef = useRef(null);

  const handleOrientation = (e) => {
    let x = (e.gamma || 0) + 90; 
    let y = (e.beta || 0) + 180; 

    x = (x / 180) * 100;
    y = (y / 360) * 100;

    setCoords({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const requestAccess = async () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') {
        setNeedsPermission(false);
        window.addEventListener('deviceorientation', handleOrientation);
        window.addEventListener('mousemove', handleMouseMove);
      }
    }
  };

  useEffect(() => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      setNeedsPermission(true);
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
      window.addEventListener('mousemove', handleMouseMove);
    }

    // FIX: Wake up the sensors when the user comes back to the app
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        window.addEventListener('deviceorientation', handleOrientation);
        window.addEventListener('mousemove', handleMouseMove);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-lg"
    >
      {/* The subtle white glare */}
      <div
        className="absolute inset-0 transition-all duration-75 ease-out"
        style={{
          background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.15) 25%, transparent 60%)`
        }}
      />

      {/* iOS Permission Button */}
      {needsPermission && (
        <button
          onClick={requestAccess}
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 text-white text-xs font-semibold pointer-events-auto backdrop-blur-sm"
        >
          Tap to enable holographic effect
        </button>
      )}
    </div>
  );
}
