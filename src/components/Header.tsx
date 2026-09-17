import React from 'react';

interface HeaderProps {
  onGoHome: () => void;
  onOpenSaved: () => void;
  onFocusSearch: () => void;
  onOpenProfile: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onGoHome,
  onOpenSaved,
  onFocusSearch,
  onOpenProfile,
  savedCount,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-white/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
      <div className="max-w-2xl mx-auto h-14 px-4 flex items-center justify-between">
        {/* Brand Home Click Target */}
        <button
          type="button"
          onClick={onGoHome}
          aria-label="sgCarMart Carpark Rates Home"
          className="flex items-center gap-2.5 text-left rounded-lg p-1 -ml-1 hover:bg-surface-container/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-white text-[20px]">local_parking</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-headline font-bold text-[18px] text-primary leading-tight tracking-tight">
              sgCarMart
            </span>
            <span className="font-headline font-semibold text-[10px] text-secondary uppercase tracking-widest leading-none">
              Carpark Rates
            </span>
          </div>
        </button>

        {/* Header Action Buttons (Accessible min 44x44px touch targets) */}
        <div className="flex items-center gap-1">
          <button
            onClick={onFocusSearch}
            aria-label="Search carpark location or mall"
            className="w-11 h-11 flex items-center justify-center rounded-full text-secondary hover:text-on-surface hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          <button
            onClick={onOpenSaved}
            aria-label={`Saved carparks (${savedCount} saved)`}
            className="relative w-11 h-11 flex items-center justify-center rounded-full text-secondary hover:text-on-surface hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">bookmark</span>
            {savedCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenProfile}
            aria-label="Driver settings and vehicle profile"
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
            type="button"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
