import React from 'react';
import { Carpark, VehicleType } from '../types';
import { CarparkCard } from './CarparkCard';

interface SavedViewProps {
  savedCarparks: Carpark[];
  vehicle: VehicleType;
  durationHours?: number;
  timePeriod?: 'day' | 'evening' | 'weekend';
  onToggleSave: (id: string) => void;
  onOpenSchedule: (carpark: Carpark) => void;
  onNavigate: (carpark: Carpark) => void;
  onFindAlternatives: (carpark: Carpark) => void;
  onExploreMore: () => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  savedCarparks,
  vehicle,
  durationHours = 2,
  timePeriod = 'day',
  onToggleSave,
  onOpenSchedule,
  onNavigate,
  onFindAlternatives,
  onExploreMore,
}) => {
  if (savedCarparks.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-surface-container flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined text-[32px]">bookmark_border</span>
        </div>

        <div>
          <h3 className="font-headline font-bold text-[19px] text-on-surface">No Saved Carparks</h3>
          <p className="text-[13px] text-secondary mt-1 max-w-xs mx-auto">
            Tap the bookmark icon on any carpark card to quickly access live lots, rates, and one-tap
            navigation here.
          </p>
        </div>

        <button
          type="button"
          onClick={onExploreMore}
          className="min-h-[44px] px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-headline font-semibold text-[13px] shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          Explore Carparks Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-3 pb-24 space-y-3">
      {/* Saved Header with Return Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExploreMore}
            aria-label="Back to all carparks"
            className="w-10 h-10 rounded-xl bg-white border border-surface-container flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h2 className="font-headline font-bold text-[18px] text-on-surface">
              Saved Carparks ({savedCarparks.length})
            </h2>
            <p className="text-[12px] text-secondary">Quick access to your bookmarked locations</p>
          </div>
        </div>
      </div>

      {/* Comparison Strip */}
      {savedCarparks.length >= 2 && (
        <div className="bg-white rounded-2xl p-3.5 border border-surface-container shadow-xs">
          <span className="font-headline font-bold text-[11px] text-secondary uppercase tracking-wider block mb-2">
            Side-by-Side Tariff Comparison (Weekday 1st Hour)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {savedCarparks.map((cp) => (
              <div
                key={cp.id}
                className="p-3 rounded-xl bg-surface-container-low/80 border border-surface-container"
              >
                <span className="font-bold text-[13px] text-on-surface truncate block">
                  {cp.name}
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-mono font-bold text-[15px] text-primary">
                    {cp.rates[0]?.firstRate || '$2.50'}
                  </span>
                  <span className="text-[11px] text-secondary font-normal">/1st hr</span>
                </div>
                <span className="text-[11px] text-secondary block mt-0.5">
                  Grace: <strong className="text-on-surface">{cp.gracePeriod}</strong>
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
            durationHours={durationHours}
            timePeriod={timePeriod}
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
