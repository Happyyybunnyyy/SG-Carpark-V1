import React, { useState } from 'react';
import { Carpark, VehicleType } from '../types';
import { calculateEstimatedParkingCost } from '../utils/calculator';

interface CarparkCardProps {
  carpark: Carpark;
  vehicle: VehicleType;
  isSaved: boolean;
  durationHours?: number;
  timePeriod?: 'day' | 'evening' | 'weekend';
  onToggleSave: (id: string) => void;
  onOpenSchedule: (carpark: Carpark) => void;
  onNavigate: (carpark: Carpark) => void;
  onFindAlternatives: (carpark: Carpark) => void;
}

export const CarparkCard: React.FC<CarparkCardProps> = ({
  carpark,
  vehicle,
  isSaved,
  durationHours = 2,
  timePeriod = 'day',
  onToggleSave,
  onOpenSchedule,
  onNavigate,
  onFindAlternatives,
}) => {
  const [isTableExpanded, setIsTableExpanded] = useState(true);

  // Dynamic cost calculation based on selected duration
  const estimatedCost = calculateEstimatedParkingCost(
    carpark,
    durationHours,
    timePeriod,
    vehicle
  );

  const getCategoryIcon = () => {
    if (carpark.lotStatus === 'full') {
      return (
        <span
          className="material-symbols-outlined text-rose-700 text-[18px] shrink-0"
          title="Lots Full"
          aria-hidden="true"
        >
          block
        </span>
      );
    }
    switch (carpark.category) {
      case 'value':
        return (
          <span
            className="material-symbols-outlined text-emerald-700 text-[18px] shrink-0"
            title="Value Pick"
            aria-hidden="true"
          >
            savings
          </span>
        );
      case 'shopping':
        return (
          <span
            className="material-symbols-outlined text-secondary text-[18px] shrink-0"
            title="Shopping Centre"
            aria-hidden="true"
          >
            shopping_bag
          </span>
        );
      case 'mall':
      default:
        return (
          <span
            className="material-symbols-outlined text-secondary text-[18px] shrink-0"
            title="Mall Carpark"
            aria-hidden="true"
          >
            store
          </span>
        );
    }
  };

  const renderStatusBadge = () => {
    if (carpark.lotStatus === 'full') {
      return (
        <div
          role="status"
          aria-label="Carpark status: Full, 0 lots available"
          className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-900"
        >
          <span className="material-symbols-outlined text-rose-700 text-[16px]">block</span>
          <span className="font-mono text-[12px] font-bold tracking-tight">
            FULL (0 Lots)
          </span>
        </div>
      );
    }
    if (carpark.lotStatus === 'limited') {
      return (
        <div
          role="status"
          aria-label={`Carpark status: Limited, only ${carpark.lots} lots left`}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900"
        >
          <span className="material-symbols-outlined text-amber-700 text-[16px]">warning</span>
          <span className="font-mono text-[12px] font-bold tracking-tight">
            {carpark.lots} Lots Left
          </span>
        </div>
      );
    }
    return (
      <div
        role="status"
        aria-label={`Carpark status: Plenty of space, ${carpark.lots} lots available`}
        className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900"
      >
        <span className="material-symbols-outlined text-emerald-700 text-[16px]">check_circle</span>
        <span className="font-mono text-[12px] font-bold tracking-tight">
          {carpark.lots} Lots Available
        </span>
      </div>
    );
  };

  return (
    <article
      id={`carpark-${carpark.id}`}
      aria-labelledby={`carpark-title-${carpark.id}`}
      className={`bg-white rounded-2xl p-4 shadow-xs hover:shadow-md transition-all relative overflow-hidden border ${
        carpark.lotStatus === 'full'
          ? 'border-rose-200/80 bg-rose-50/10'
          : 'border-surface-container/90'
      }`}
    >
      {/* Top Row: Name, Live Badge, Distance */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2
              id={`carpark-title-${carpark.id}`}
              className="font-headline font-bold text-[18px] text-on-surface truncate"
            >
              {carpark.name}
            </h2>
            {getCategoryIcon()}
          </div>
          <p className="font-sans text-[13px] text-secondary truncate mt-0.5">
            <span className="font-medium text-on-surface/80">{carpark.distance}</span> • {carpark.address}
          </p>
        </div>

        {renderStatusBadge()}
      </div>

      {/* Quick Metadata Badges */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-0.5">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container-low text-secondary text-[11px] font-medium border border-surface-container">
          <span className="material-symbols-outlined text-[14px]">height</span>
          {carpark.maxHeight}
        </span>

        {carpark.hasGraceHighlight ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            {carpark.gracePeriod}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container-low text-secondary text-[11px] font-medium border border-surface-container">
            <span className="material-symbols-outlined text-[14px]">timer</span>
            {carpark.gracePeriod}
          </span>
        )}

        {carpark.evChargers && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 text-[11px] font-semibold border border-blue-200">
            <span className="material-symbols-outlined text-[14px] text-blue-700">ev_station</span>
            {carpark.evChargers}
          </span>
        )}

        {carpark.autoPassReady && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container-low text-secondary text-[11px] font-medium border border-surface-container">
            <span className="material-symbols-outlined text-[14px]">credit_card</span>
            AutoPass
          </span>
        )}

        {carpark.highTraffic && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-900 text-[11px] font-semibold border border-rose-200">
            <span className="material-symbols-outlined text-[14px] text-rose-700">traffic</span>
            High Traffic Q
          </span>
        )}
      </div>

      {/* Prominent Estimated Cost & Current Tariff Spotlight */}
      <div className="mt-3.5 p-3 rounded-xl bg-surface-container-low/70 border border-surface-container flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold uppercase text-secondary tracking-wider block">
            {vehicle === 'bikes'
              ? 'Motorcycle Parking'
              : `Est. Total (${durationHours} ${durationHours === 1 ? 'Hour' : 'Hours'} Stay)`}
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-mono text-[20px] font-bold text-primary">
              {estimatedCost.formatted}
            </span>
            <span className="text-[11px] text-secondary">
              ({estimatedCost.breakdown})
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsTableExpanded(!isTableExpanded)}
          aria-expanded={isTableExpanded}
          className="text-[11px] font-semibold text-secondary hover:text-on-surface flex items-center gap-0.5 px-2 py-1 rounded-lg hover:bg-surface-container transition-colors"
        >
          <span>Tariff Table</span>
          <span
            className={`material-symbols-outlined text-[16px] transition-transform ${
              isTableExpanded ? 'rotate-180' : ''
            }`}
          >
            expand_more
          </span>
        </button>
      </div>

      {/* Structured Pricing Breakdown Table (Collapsible for cleaner scanning) */}
      {isTableExpanded && (
        <div className="mt-2.5 bg-surface-container-low rounded-xl overflow-hidden border border-surface-container animate-in fade-in duration-150">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-surface-container px-3.5 py-2 text-secondary font-headline text-[11px] font-bold uppercase tracking-wider">
            <span className="col-span-5">Period</span>
            <span className="col-span-4">First Rate</span>
            <span className="col-span-3 text-right">Subsequent</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-surface-container">
            {vehicle === 'bikes' ? (
              <div className="grid grid-cols-12 px-3.5 py-2.5 bg-white text-[13px] items-center">
                <div className="col-span-5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                  <span className="font-semibold text-on-surface truncate">Motorcycles</span>
                </div>
                <span className="col-span-7 font-mono text-[13px] text-right font-bold text-on-surface">
                  {carpark.fullSchedule.motorcycleRate}
                </span>
              </div>
            ) : (
              carpark.rates.map((rate, idx) => {
                const isPerEntry = rate.firstRateUnit.includes('per entry');
                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-12 px-3.5 py-2.5 text-[13px] items-center transition-colors ${
                      rate.isActiveNow
                        ? 'bg-white font-sans'
                        : 'text-secondary font-sans'
                    }`}
                  >
                    <div className="col-span-5 flex items-center gap-1.5 min-w-0 pr-1">
                      {rate.isActiveNow && (
                        <span
                          className="w-2 h-2 rounded-full bg-primary shrink-0"
                          title="Active rate right now"
                        ></span>
                      )}
                      <span
                        className={`truncate ${
                          rate.isActiveNow
                            ? 'font-bold text-on-surface'
                            : 'font-normal'
                        }`}
                      >
                        {rate.period}
                      </span>
                    </div>

                    {isPerEntry ? (
                      <span className="col-span-7 font-mono text-[13px] text-on-surface text-right font-bold">
                        {rate.firstRate}{' '}
                        <span className="text-[11px] font-normal text-secondary">
                          {rate.firstRateUnit}
                        </span>
                      </span>
                    ) : (
                      <>
                        <span className="col-span-4 font-mono text-[13px] text-on-surface font-bold truncate">
                          {rate.firstRate}{' '}
                          <span className="text-[11px] font-normal text-secondary">
                            {rate.firstRateUnit}
                          </span>
                        </span>

                        <span className="col-span-3 font-mono text-[13px] text-right text-on-surface font-bold truncate">
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
      )}

      {/* Action Footer (Min 44px ergonomic touch targets) */}
      <div className="flex items-center gap-2.5 mt-3.5 pt-1">
        {/* Secondary Action: Full Schedule */}
        <button
          type="button"
          onClick={() => onOpenSchedule(carpark)}
          className="flex-1 h-11 rounded-xl bg-white border border-surface-container hover:bg-surface-container-low text-on-surface font-headline font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-2xs"
        >
          <span className="material-symbols-outlined text-[18px] text-secondary">visibility</span>
          <span>Full Tariff</span>
        </button>

        {/* Primary Action: Navigate or Find Alternatives (Clear Main Action) */}
        {carpark.lotStatus === 'full' ? (
          <button
            type="button"
            onClick={() => onFindAlternatives(carpark)}
            className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-hover text-white font-headline font-semibold text-[13px] shadow-xs flex items-center justify-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <span className="material-symbols-outlined text-[18px]">alt_route</span>
            <span>Alternatives</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate(carpark)}
            className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-hover text-white font-headline font-semibold text-[13px] shadow-xs flex items-center justify-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <span className="material-symbols-outlined text-[18px]">navigation</span>
            <span>Navigate</span>
          </button>
        )}

        {/* Accessible Bookmark Action */}
        <button
          type="button"
          aria-label={
            isSaved
              ? `Remove ${carpark.name} from saved bookmarks`
              : `Bookmark ${carpark.name} for quick access`
          }
          onClick={() => onToggleSave(carpark.id)}
          className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
            isSaved
              ? 'text-primary bg-primary/10 border-primary/30 shadow-2xs'
              : 'text-secondary hover:text-primary bg-white border-surface-container hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isSaved ? 'bookmark' : 'bookmark_border'}
          </span>
        </button>
      </div>
    </article>
  );
};
