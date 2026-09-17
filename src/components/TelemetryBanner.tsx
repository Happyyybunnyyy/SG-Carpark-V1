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

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefreshData();
    setTimeout(() => setIsRefreshing(false), 700);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'rate':
        return 'Sort: Rate';
      case 'distance':
        return 'Sort: Distance';
      case 'lots':
        return 'Sort: Available Lots';
      case 'grace':
        return 'Sort: Grace Period';
      default:
        return 'Sort: Rate';
    }
  };

  const zoneDisplayName = zone === 'All SG' ? 'All Singapore' : zone.replace(' / Somerset', ' Zone');

  return (
    <section className="max-w-2xl mx-auto px-4 pt-2.5 pb-1">
      <div className="bg-surface-container-high/60 border border-surface-container rounded-lg p-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lot-available opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lot-available"></span>
          </span>

          <div className="flex flex-col min-w-0">
            <span className="font-headline font-semibold text-[11px] text-on-surface leading-tight truncate">
              {count} Carparks in {zoneDisplayName}
            </span>
            <div className="flex items-center gap-1.5 font-sans text-[10px] text-secondary truncate">
              <span>LTA Real-time Sync • Updated 1m ago</span>
              <button
                type="button"
                onClick={handleRefresh}
                title="Refresh availability"
                className="hover:text-primary transition-colors inline-flex items-center"
              >
                <span
                  className={`material-symbols-outlined text-[13px] ${
                    isRefreshing ? 'animate-spin text-primary' : ''
                  }`}
                >
                  sync
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Sort Trigger Button */}
        <div className="flex items-center gap-1 shrink-0 pl-2">
          <button
            type="button"
            onClick={onCycleSort}
            className="bg-white border border-surface-container px-2.5 py-1 rounded-md text-on-surface text-[11px] font-semibold shadow-xs flex items-center gap-1 hover:bg-surface-container-low transition-colors"
          >
            <span>{getSortLabel()}</span>
            <span className="material-symbols-outlined text-[14px] text-secondary">tune</span>
          </button>
        </div>
      </div>
    </section>
  );
};
