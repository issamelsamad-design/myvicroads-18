import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useLicenceData } from '../lib/licenceData';

export default function DemeritPoints() {
  const navigate = useNavigate();
  const { data } = useLicenceData();

  const balance = parseInt(data.demeritBalance) || 0;
  const threshold = parseInt(data.demeritThreshold) || 5;
  const pct = Math.min((balance / threshold) * 100, 100);

  return (
    <div className="px-5 pt-8 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-[22px] font-bold text-foreground">Demerit points</h1>
      </div>

      {/* Balance card */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-5">
        <p className="text-[13px] text-muted-foreground font-medium mb-3">Current balance</p>
        <p className="text-[36px] font-bold text-foreground leading-none">
          {balance}<span className="text-[20px] text-muted-foreground font-normal">/ {threshold}</span>
        </p>
        {/* Progress bar */}
        <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              backgroundColor: pct >= 80 ? '#ef4444' : pct >= 50 ? '#f59e0b' : '#d1d5db',
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[12px] text-muted-foreground">
          <span>0 points</span>
          <span>{threshold} points</span>
        </div>
      </div>

      {/* About card */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
        <h2 className="text-[17px] font-bold text-foreground mb-3">About demerit points</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-3">
          Demerit points are added to your licence when you commit certain traffic offences. 
          If you accumulate too many points, your licence may be suspended.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Full licence holders can accumulate up to{' '}
          <span className="font-semibold text-foreground">{threshold} demerit points</span>{' '}
          before their licence is suspended. Probationary and learner permit holders have lower thresholds.
        </p>
      </div>
    </div>
  );
}