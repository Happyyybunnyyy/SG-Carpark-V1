import React, { useState, useEffect } from 'react';
import { Carpark } from '../types';

interface NavigationModalProps {
  carpark: Carpark | null;
  onClose: () => void;
}

export const NavigationModal: React.FC<NavigationModalProps> = ({ carpark, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (carpark) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [carpark, onClose]);

  if (!carpark) return null;

  const encodedQuery = encodeURIComponent(`${carpark.name} ${carpark.address} Singapore`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
  const wazeUrl = `https://waze.com/ul?q=${encodedQuery}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${carpark.name}, ${carpark.address}, Singapore`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="nav-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-surface-container flex items-center justify-between bg-surface-container-low/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">navigation</span>
            </div>
            <div>
              <h3 id="nav-modal-title" className="font-headline font-bold text-[17px] text-on-surface truncate">
                Get Directions
              </h3>
              <p className="text-[12px] text-secondary truncate max-w-[210px]">{carpark.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation options"
            className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="p-3 rounded-xl bg-surface-container-low text-[13px] flex items-center justify-between border border-surface-container">
            <span className="text-secondary">Destination Distance</span>
            <span className="font-mono font-bold text-on-surface">{carpark.distance} away</span>
          </div>

          {/* Navigation app links (Min 48px touch targets) */}
          <div className="space-y-2.5">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[50px] w-full p-3.5 rounded-xl border border-surface-container hover:border-primary/50 bg-white flex items-center justify-between group transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-700 text-[22px]">
                  map
                </span>
                <span className="font-headline font-bold text-[14px] text-on-surface">
                  Google Maps
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary text-[18px] group-hover:translate-x-0.5 transition-transform">
                open_in_new
              </span>
            </a>

            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[50px] w-full p-3.5 rounded-xl border border-surface-container hover:border-primary/50 bg-white flex items-center justify-between group transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-700 text-[22px]">
                  directions_car
                </span>
                <span className="font-headline font-bold text-[14px] text-on-surface">
                  Waze Live Navigation
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary text-[18px] group-hover:translate-x-0.5 transition-transform">
                open_in_new
              </span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="min-h-[50px] w-full p-3.5 rounded-xl border border-surface-container hover:border-primary/50 bg-white flex items-center justify-between group transition-all shadow-2xs text-left focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span className="font-headline font-bold text-[14px] text-on-surface">
                  {copied ? 'Address Copied to Clipboard!' : 'Copy Postal Code & Address'}
                </span>
              </div>
              {copied && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  COPIED
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-container bg-surface-container-low/40">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-white border border-surface-container hover:bg-surface-container-low text-on-surface font-headline font-semibold text-[13px] transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
