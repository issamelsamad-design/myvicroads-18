import { ChevronRight } from 'lucide-react';

export default function MenuItem({ title, subtitle, onClick, rightIcon, showChevron = false }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-4 px-0 text-left"
    >
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-normal text-gray-900">{title}</p>
        {subtitle && (
          <p className="text-[13px] text-gray-500 mt-0.5 leading-snug">
            {subtitle}
          </p>
        )}
      </div>
      {rightIcon && <div className="ml-3 flex-shrink-0">{rightIcon}</div>}
      {showChevron && <ChevronRight className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" />}
    </button>
  );
}