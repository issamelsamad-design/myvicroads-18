import { Maximize2 } from 'lucide-react';

export default function LicenceCard({ onClick, compact = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl text-white text-left relative overflow-hidden ${compact ? 'p-5' : 'px-6 pt-4 pb-16'}`}
      style={{ background: 'linear-gradient(135deg, #2d3a4a 0%, #3d4f5f 50%, #4a5d6d 100%)' }}
    >
      {/* Carousel dots */}
      <div className="flex items-center justify-center gap-1.5 mb-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="w-[6px] h-[6px] rounded-full bg-white/20" />
        ))}
      </div>
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-[16px]">My licence</h3>
            <p className="text-white/60 text-[13px] mt-0.5">Tap to view licence</p>
          </div>
          <Maximize2 className="w-5 h-5 text-white/70" />
        </div>
      </div>
    </button>
  );
}
