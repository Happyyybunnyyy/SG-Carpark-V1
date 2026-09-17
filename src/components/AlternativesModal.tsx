import React from 'react';
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
  if (!sourceCarpark) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-surface-container flex items-center justify-between bg-error-container/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lot-full text-[22px]">
              do_not_disturb_on
            </span>
            <div>
              <h3 className="font-headline font-bold text-[16px] text-on-surface">
                {sourceCarpark.name} is FULL
              </h3>
              <p className="text-[11px] text-secondary">
                Recommended nearby alternatives with available lots:
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* List of alternatives */}
        <div className="p-4 overflow-y-auto space-y-2.5 no-scrollbar">
          {alternatives.map((alt) => (
            <div
              key={alt.id}
              className="p-3 rounded-xl border border-surface-container hover:border-primary/50 bg-white transition-all shadow-2xs hover:shadow-xs flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-headline font-semibold text-[14px] text-on-surface truncate">
                    {alt.name}
                  </h4>
                  <span className="text-[11px] text-secondary">• {alt.distance}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[11px] text-lot-available font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-lot-available"></span>
                    {alt.lots} Lots Available
                  </span>
                  <span className="text-[11px] text-secondary">
                    1st hr: {alt.rates[0]?.firstRate || '$2.50'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectAlternative(alt);
                }}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[11px] font-headline font-semibold flex items-center gap-1 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">navigation</span>
                <span>Navigate</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-surface-container bg-surface-container-low/30">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-headline font-semibold text-[13px] transition-colors"
          >
            Back to All Carparks
          </button>
        </div>
      </div>
    </div>
  );
};
