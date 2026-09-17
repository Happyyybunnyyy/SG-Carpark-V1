import React from 'react';
import { Carpark, VehicleType } from '../types';
import { CarparkCard } from './CarparkCard';

interface SavedViewProps {
  savedCarparks: Carpark[];
  vehicle: VehicleType;
  onToggleSave: (id: string) => void;
  onOpenSchedule: (carpark: Carpark) => void;
  onNavigate: (carpark: Carpark) => void;
  onFindAlternatives: (carpark: Carpark) => void;
  onExploreMore: () => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  savedCarparks,
  vehicle,
  onToggleSave,
  onOpenSchedule,
  onNavigate,
  onFindAlternatives,
  onExploreMore,
}) => {
  if (savedCarparks.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-surface-container flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined text-[32px]">bookmark_border</span>
        </div>

        <div>
          <h3 className="font-headline font-bold text-[18px] text-on-surface">No Saved Carparks</h3>
          <p className="text-[13px] text-secondary mt-1">
            Tap the bookmark icon on any carpark card to quickly access rates, live lots, and
            directions here.
          </p>
        </div>

        <button
          type="button"
          onClick={onExploreMore}
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-headline font-semibold text-[13px] shadow-xs transition-colors"
        >
          Explore Orchard Carparks
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-3 pb-24 space-y-3">
      {/* Saved Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline font-bold text-[18px] text-on-surface">
            Saved Carparks ({savedCarparks.length})
          </h2>
          <p className="text-[12px] text-secondary">Quick access to your frequently parked malls</p>
        </div>
      </div>

      {/* Comparison Strip */}
      {savedCarparks.length >= 2 && (
        <div className="bg-white rounded-xl p-3 border border-surface-container shadow-xs">
          <span className="font-headline font-semibold text-[11px] text-secondary uppercase tracking-wider block mb-2">
            Quick Rate Comparison (Weekday 1st Hour)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {savedCarparks.map((cp) => (
              <div
                key={cp.id}
                className="p-2 rounded-lg bg-surface-container-low border border-surface-container"
              >
                <span className="font-medium text-[12px] text-on-surface truncate block">
                  {cp.name}
                </span>
                <span className="font-mono font-bold text-[13px] text-primary">
                  {cp.rates[0]?.firstRate || '$2.50'}{' '}
                  <span className="text-[10px] text-secondary font-normal">/1st hr</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cards list */}
      <div className="space-y-3">
        {savedCarparks.map((carpark) => (
          <CarparkCard
            key={carpark.id}
            carpark={carpark}
            vehicle={vehicle}
            isSaved={true}
            onToggleSave={onToggleSave}
            onOpenSchedule={onOpenSchedule}
            onNavigate={onNavigate}
            onFindAlternatives={onFindAlternatives}
          />
        ))}
      </div>
    </div>
  );
};
