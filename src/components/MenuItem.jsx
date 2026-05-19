import { ChevronRight } from 'lucide-react';

export default function MenuItem({ title, subtitle, onClick, rightIcon, showChevron = false }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-foreground">{title}</p>
        {subtitle && (
          <p className="text-[13px] text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {rightIcon && <div className="ml-3 text-muted-foreground">{rightIcon}</div>}
      {showChevron && <ChevronRight className="w-4 h-4 ml-2 text-muted-foreground" />}
    </button>
  );
}