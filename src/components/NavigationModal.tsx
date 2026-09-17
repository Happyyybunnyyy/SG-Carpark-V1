import React, { useState } from 'react';
import { Carpark } from '../types';

interface NavigationModalProps {
  carpark: Carpark | null;
  onClose: () => void;
}

export const NavigationModal: React.FC<NavigationModalProps> = ({ carpark, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!carpark) return null;

  const encodedQuery = encodeURIComponent(`${carpark.name} ${carpark.address} Singapore`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
  const wazeUrl = `https://waze.com/ul?q=${encodedQuery}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${carpark.name}, ${carpark.address}, Singapore`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-surface-container flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">navigation</span>
            <div>
              <h3 className="font-headline font-bold text-[16px] text-on-surface truncate">
                Navigate to {carpark.name}
              </h3>
              <p className="text-[11px] text-secondary">{carpark.address}</p>
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

        {/* Content */}
        <div className="p-4 space-y-2.5">
          <div className="p-2.5 rounded-lg bg-surface-container-low text-[12px] flex items-center justify-between">
            <span className="text-secondary">Estimated Arrival</span>
            <span className="font-mono font-bold text-on-surface">~4 - 7 mins drive</span>
          </div>

          {/* Navigation app links */}
          <div className="space-y-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3 rounded-xl border border-surface-container hover:border-primary/40 bg-white flex items-center justify-between group transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lot-available text-[20px]">
                  map
                </span>
                <span className="font-headline font-semibold text-[13px] text-on-surface">
                  Open in Google Maps
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary text-[16px] group-hover:translate-x-0.5 transition-transform">
                open_in_new
              </span>
            </a>

            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3 rounded-xl border border-surface-container hover:border-primary/40 bg-white flex items-center justify-between group transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-tertiary text-[20px]">
                  directions_car
                </span>
                <span className="font-headline font-semibold text-[13px] text-on-surface">
                  Open in Waze
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary text-[16px] group-hover:translate-x-0.5 transition-transform">
                open_in_new
              </span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="w-full p-3 rounded-xl border border-surface-container hover:border-primary/40 bg-white flex items-center justify-between group transition-colors shadow-2xs text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  content_copy
                </span>
                <span className="font-headline font-semibold text-[13px] text-on-surface">
                  {copied ? 'Address Copied!' : 'Copy Address & Postal Code'}
                </span>
              </div>
              {copied ? (
                <span className="material-symbols-outlined text-lot-available text-[16px]">
                  check
                </span>
              ) : (
                <span className="material-symbols-outlined text-secondary text-[16px]">
                  content_copy
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-surface-container bg-surface-container-low/30">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-headline font-semibold text-[13px] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
