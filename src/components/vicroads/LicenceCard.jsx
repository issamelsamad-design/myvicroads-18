import { Maximize2 } from 'lucide-react';

export default function LicenceCard({ onClick, compact = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-t-2xl overflow-hidden text-left relative ${compact ? 'h-32' : 'h-32'}`}
      style={{
        background: 'linear-gradient(160deg, #2c3e50 0%, #3b5068 50%, #4a6680 100%)',
      }}
    >
      {/* Top row: title + expand icon */}
      <div className="absolute top-0 left-0 right-0 p-5 flex items-start justify-between">
        <div>
          <h3 className="text-white text-[17px] font-semibold">My licence</h3>
          <p className="text-white/60 text-[13px] mt-0.5">Tap to view licence</p>
        </div>
        <Maximize2 className="text-white/70 w-5 h-5 mt-0.5" />
      </div>
    </button>
  );
}