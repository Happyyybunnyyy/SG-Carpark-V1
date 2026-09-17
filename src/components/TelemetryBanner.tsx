import React, { useState } from 'react';

interface TelemetryBannerProps {
  count: number;
  zone: string;
  sortBy: 'rate' | 'distance' | 'lots' | 'grace';
  onCycleSort: () => void;
  onRefreshData: () => void;
}

export const TelemetryBanner: React.FC<TelemetryBannerProps> = ({
  count,
  zone,
  sortBy,
  onCycleSort,
  onRefreshData,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncText, setLastSyncText] = useState('Updated just now');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastSyncText('Syncing live data...');
    onRefreshData();
    setTimeout(() => {
      setIsRefreshing(false);
      setLastSyncText('Updated just now');
    }, 700);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'rate':
        return 'Rate (Lowest)';
      case 'distance':
        return 'Distance (Nearest)';
      case 'lots':
        return 'Lots (Most)';
      case 'grace':
        return 'Grace (Longest)';
      default:
        return 'Rate';
    }
  };

  const zoneDisplayName = zone === 'All SG' ? 'All Singapore' : zone;

  return (
    <section className="max-w-2xl mx-auto w-full px-4 pt-2.5 pb-1">
      <div
        aria-live="polite"
        className="bg-white border border-surface-container rounded-xl p-2.5 px-3.5 flex items-center justify-between shadow-2xs gap-2"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-3 w-3 shrink-0" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
          </span>

          <div className="flex flex-col min-w-0">
            <span className="font-headline font-bold text-[13px] text-on-surface leading-tight truncate">
              {count} {count === 1 ? 'Carpark' : 'Carparks'} in {zoneDisplayName}
            </span>
            <div className="flex items-center gap-1.5 font-sans text-[11px] text-secondary truncate mt-0.5">
              <span>LTA Datamall • {lastSyncText}</span>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                aria-label="Refresh real-time lot availability"
                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-surface-container text-secondary hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <span
                  className={`material-symbols-outlined text-[15px] ${
                    isRefreshing ? 'animate-spin text-primary' : ''
                  }`}
                >
                  sync
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Sort Trigger Button (Accessible min 40-44px target) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onCycleSort}
            aria-label={`Current sort order: ${getSortLabel()}. Tap to cycle sorting options.`}
            className="h-9 px-3 bg-surface-container-low hover:bg-surface-container border border-surface-container text-on-surface text-[12px] font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <span className="material-symbols-outlined text-[15px] text-secondary">sort</span>
            <span>{getSortLabel()}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
