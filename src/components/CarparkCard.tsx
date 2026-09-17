import React from 'react';
import { Carpark, VehicleType } from '../types';

interface CarparkCardProps {
  carpark: Carpark;
  vehicle: VehicleType;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenSchedule: (carpark: Carpark) => void;
  onNavigate: (carpark: Carpark) => void;
  onFindAlternatives: (carpark: Carpark) => void;
}

export const CarparkCard: React.FC<CarparkCardProps> = ({
  carpark,
  vehicle,
  isSaved,
  onToggleSave,
  onOpenSchedule,
  onNavigate,
  onFindAlternatives,
}) => {
  const getCategoryIcon = () => {
    if (carpark.lotStatus === 'full') {
      return (
        <span
          className="material-symbols-outlined text-lot-full text-[16px] shrink-0"
          title="Lots Full"
        >
          do_not_disturb_on
        </span>
      );
    }
    switch (carpark.category) {
      case 'value':
        return (
          <span
            className="material-symbols-outlined text-lot-available text-[16px] shrink-0"
            title="Value Pick"
          >
            savings
          </span>
        );
      case 'shopping':
        return (
          <span
            className="material-symbols-outlined text-secondary text-[16px] shrink-0"
            title="Shopping Centre"
          >
            shopping_bag
          </span>
        );
      case 'mall':
      default:
        return (
          <span
            className="material-symbols-outlined text-secondary text-[16px] shrink-0"
            title="Mall Carpark"
          >
            store
          </span>
        );
    }
  };

  const renderStatusBadge = () => {
    if (carpark.lotStatus === 'full') {
      return (
        <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-high border border-lot-full/20">
          <span className="inline-block w-2 h-2 rounded-full bg-lot-full"></span>
          <span className="font-mono text-[12px] text-lot-full font-bold tracking-tight">
            FULL (0 Lots)
          </span>
        </div>
      );
    }
    if (carpark.lotStatus === 'limited') {
      return (
        <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-high border border-lot-limited/20">
          <span className="inline-block w-2 h-2 rounded-full bg-lot-limited"></span>
          <span className="font-mono text-[12px] text-lot-limited font-semibold tracking-tight">
            {carpark.lots} Lots Left
          </span>
        </div>
      );
    }
    return (
      <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-low border border-lot-available/20">
        <span className="inline-block w-2 h-2 rounded-full bg-lot-available"></span>
        <span className="font-mono text-[12px] text-lot-available font-semibold tracking-tight">
          {carpark.lots} Lots
        </span>
      </div>
    );
  };

  return (
    <article
      id={`carpark-${carpark.id}`}
      className={`bg-white rounded-xl p-3.5 shadow-xs hover:shadow-md transition-all relative overflow-hidden border border-surface-container/70 ${
        carpark.lotStatus === 'full' ? 'opacity-95' : ''
      }`}
    >
      {/* Top Row: Name, Live Badge, Distance */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="font-headline font-semibold text-[17px] text-on-surface truncate">
              {carpark.name}
            </h2>
            {getCategoryIcon()}
          </div>
          <p className="font-sans text-[12px] text-secondary truncate mt-0.5">
            {carpark.distance} • {carpark.address}
          </p>
        </div>

        {renderStatusBadge()}
      </div>

      {/* Quick Metadata Strip */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-0.5">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-low text-secondary text-[11px] font-medium border border-surface-container">
          <span className="material-symbols-outlined text-[13px]">height</span>
          {carpark.maxHeight}
        </span>

        {carpark.hasGraceHighlight ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-low text-lot-available text-[11px] font-semibold border border-lot-available/20">
            <span className="material-symbols-outlined text-[13px]">check_circle</span>
            {carpark.gracePeriod}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-low text-secondary text-[11px] font-medium border border-surface-container">
            <span className="material-symbols-outlined text-[13px]">timer</span>
            {carpark.gracePeriod}
          </span>
        )}

        {carpark.evChargers && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-low text-tertiary text-[11px] font-semibold border border-tertiary/20">
            <span className="material-symbols-outlined text-[13px]">ev_station</span>
            {carpark.evChargers}
          </span>
        )}

        {carpark.autoPassReady && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-low text-secondary text-[11px] font-medium border border-surface-container">
            <span className="material-symbols-outlined text-[13px]">credit_card</span>
            AutoPass Ready
          </span>
        )}

        {carpark.highTraffic && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-low text-lot-full text-[11px] font-semibold border border-lot-full/20">
            High Traffic Q
          </span>
        )}
      </div>

      {/* Structured Pricing Breakdown Table */}
      <div className="mt-3 bg-surface-container-low rounded-lg overflow-hidden border border-surface-container">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-surface-container px-3 py-1.5 text-secondary font-headline text-[11px] font-bold uppercase tracking-wider">
          <span className="col-span-5">Period</span>
          <span className="col-span-4">First Rate</span>
          <span className="col-span-3 text-right">Subsequent</span>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-surface-container">
          {vehicle === 'bikes' ? (
            <div className="grid grid-cols-12 px-3 py-2 bg-white text-[12px] items-center">
              <div className="col-span-5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                <span className="font-medium text-on-surface truncate">Motorcycles</span>
              </div>
              <span className="col-span-7 font-mono text-[12px] text-right font-medium text-on-surface">
                {carpark.fullSchedule.motorcycleRate}
              </span>
            </div>
          ) : (
            carpark.rates.map((rate, idx) => {
              const isPerEntry = rate.firstRateUnit.includes('per entry');
              return (
                <div
                  key={idx}
                  className={`grid grid-cols-12 px-3 py-2 text-[12px] items-center transition-colors ${
                    rate.isActiveNow
                      ? 'bg-white font-sans'
                      : 'text-secondary font-sans'
                  }`}
                >
                  <div className="col-span-5 flex items-center gap-1 min-w-0 pr-1">
                    {rate.isActiveNow && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                    )}
                    <span
                      className={`truncate ${
                        rate.isActiveNow ? 'font-medium text-on-surface' : ''
                      }`}
                    >
                      {rate.period}
                    </span>
                  </div>

                  {isPerEntry ? (
                    <span className="col-span-7 font-mono text-[13px] text-on-surface text-right font-semibold">
                      {rate.firstRate} {rate.firstRateUnit}
                    </span>
                  ) : (
                    <>
                      <span className="col-span-4 font-mono text-[13px] text-on-surface font-semibold truncate">
                        {rate.firstRate}{' '}
                        <span className="text-[11px] font-normal text-secondary">
                          {rate.firstRateUnit}
                        </span>
                      </span>

                      <span className="col-span-3 font-mono text-[13px] text-right text-on-surface font-semibold truncate">
                        {rate.subsequentRate ? (
                          <>
                            {rate.subsequentRate}{' '}
                            <span className="text-[11px] font-normal text-secondary">
                              {rate.subsequentRateUnit}
                            </span>
                          </>
                        ) : (
                          '-'
                        )}
                      </span>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 mt-3 pt-1">
        <button
          type="button"
          onClick={() => onOpenSchedule(carpark)}
          className="flex-1 h-9 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-headline font-semibold text-[12px] flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">visibility</span>
          <span>Full Schedule</span>
        </button>

        {carpark.lotStatus === 'full' ? (
          <button
            type="button"
            onClick={() => onFindAlternatives(carpark)}
            className="flex-1 h-9 rounded-lg bg-surface-container-highest text-primary hover:bg-surface-container-high font-headline font-semibold text-[12px] shadow-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">alt_route</span>
            <span>Alternatives</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate(carpark)}
            className="flex-1 h-9 rounded-lg bg-primary hover:bg-primary-hover text-white font-headline font-semibold text-[12px] shadow-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">navigation</span>
            <span>Navigate</span>
          </button>
        )}

        <button
          type="button"
          aria-label={isSaved ? `Remove ${carpark.name} bookmark` : `Bookmark ${carpark.name}`}
          onClick={() => onToggleSave(carpark.id)}
          className={`w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0 transition-colors ${
            isSaved
              ? 'text-primary bg-primary/10 hover:bg-primary/20'
              : 'text-secondary hover:text-primary hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isSaved ? 'bookmark' : 'bookmark_border'}
          </span>
        </button>
      </div>
    </article>
  );
};
