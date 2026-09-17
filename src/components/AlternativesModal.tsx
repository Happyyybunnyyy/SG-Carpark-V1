import React, { useEffect } from 'react';
import { Carpark } from '../types';

interface AlternativesModalProps {
  sourceCarpark: Carpark | null;
  alternatives: Carpark[];
  onClose: () => void;
  onSelectAlternative: (carpark: Carpark) => void;
}

export const AlternativesModal: React.FC<AlternativesModalProps> = ({
  sourceCarpark,
  alternatives,
  onClose,
  onSelectAlternative,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (sourceCarpark) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sourceCarpark, onClose]);

  if (!sourceCarpark) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="alternatives-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-surface-container flex items-center justify-between bg-rose-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">block</span>
            </div>
            <div>
              <h3 id="alternatives-modal-title" className="font-headline font-bold text-[17px] text-rose-950">
                {sourceCarpark.name} is Full
              </h3>
              <p className="text-[12px] text-rose-800 font-medium">
                Nearby carparks with confirmed available lots:
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close alternatives"
            className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* List of alternatives */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 no-scrollbar">
          {alternatives.length === 0 ? (
            <div className="p-6 text-center text-secondary text-[13px]">
              No direct alternatives found in this immediate zone. Try browsing the Nearby Map or
              All Singapore zones.
            </div>
          ) : (
            alternatives.map((alt) => (
              <div
                key={alt.id}
                className="p-3.5 rounded-xl border border-surface-container hover:border-primary/50 bg-white transition-all shadow-2xs hover:shadow-xs flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-headline font-bold text-[15px] text-on-surface truncate">
                      {alt.name}
                    </h4>
                    <span className="text-[12px] text-secondary">• {alt.distance}</span>
                  </div>
                  <div className="flex items-center gap-2.5 mt-1">
                    <span className="font-mono text-[12px] text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      {alt.lots} Lots Available
                    </span>
                    <span className="text-[12px] text-secondary">
                      1st hr: <strong className="text-on-surface">{alt.rates[0]?.firstRate || '$2.50'}</strong>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectAlternative(alt);
                  }}
                  className="shrink-0 h-10 px-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-[12px] font-headline font-semibold flex items-center gap-1.5 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <span className="material-symbols-outlined text-[16px]">navigation</span>
                  <span>Go Here</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-container bg-surface-container-low/40">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-white border border-surface-container hover:bg-surface-container-low text-on-surface font-headline font-semibold text-[13px] transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-2xs"
          >
            Back to Directory
          </button>
        </div>
      </div>
    </div>
  );
};
