import React from 'react';

interface HeaderProps {
  onOpenSaved: () => void;
  onFocusSearch: () => void;
  onOpenProfile: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSaved,
  onFocusSearch,
  onOpenProfile,
  savedCount,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface-card/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
      <div className="max-w-2xl mx-auto h-14 px-4 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-white text-[20px]">local_parking</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-headline font-bold text-[18px] text-primary leading-tight tracking-tight truncate">
              sgCarMart
            </span>
            <span className="font-headline font-semibold text-[10px] text-secondary uppercase tracking-widest leading-none">
              Carpark Rates
            </span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onFocusSearch}
            aria-label="Search location"
            className="w-10 h-10 flex items-center justify-center rounded-full text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          <button
            onClick={onOpenSaved}
            aria-label="Saved carparks"
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">bookmark</span>
            {savedCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenProfile}
            aria-label="User profile settings"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 ml-1 hover:opacity-90 transition-opacity shadow-xs text-white"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
