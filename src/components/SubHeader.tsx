import React, { useRef } from 'react';
import { VehicleType, FilterState } from '../types';
import { ZONES } from '../data/mockData';

interface SubHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedZone: string;
  onZoneSelect: (zone: string) => void;
  selectedVehicle: VehicleType;
  onVehicleSelect: (v: VehicleType) => void;
  onOpenFilter: () => void;
  onOpenTimeSimulator: () => void;
  simulatedTimeLabel: string;
  activeFilterCount?: number;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  filters?: FilterState;
  onUpdateFilters?: (newFilters: Partial<FilterState>) => void;
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  zone: 'Orchard / Somerset',
  vehicle: 'cars',
  sortBy: 'rate',
  onlyAvailable: false,
  evOnly: false,
  minGracePeriod: false,
  maxHeightFilter: 'Any',
};

export const SubHeader: React.FC<SubHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedZone,
  onZoneSelect,
  selectedVehicle,
  onVehicleSelect,
  onOpenFilter,
  onOpenTimeSimulator,
  simulatedTimeLabel,
  activeFilterCount = 0,
  searchInputRef,
  filters = DEFAULT_FILTERS,
  onUpdateFilters = (_newFilters: Partial<FilterState> = {}) => {},
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const quickChips = [
    { label: 'ION', query: 'ION Orchard' },
    { label: 'Takashimaya', query: 'Ngee Ann' },
    { label: 'Plaza Sing', query: 'Plaza Singapura' },
    { label: 'Paragon', query: 'Paragon' },
  ];

  return (
    <section className="sticky top-14 z-30 bg-[#f8f9ff]/95 backdrop-blur-md px-4 pt-2.5 pb-2 shadow-xs border-b border-surface-container">
      <div className="max-w-2xl mx-auto flex flex-col gap-2">
        {/* Search Bar & Filter Action */}
        <div className="relative flex items-center w-full gap-2">
          <div className="relative flex-1 flex items-center">
            <label htmlFor="carpark-search" className="sr-only">
              Search mall, building, MRT or road in Singapore
            </label>
            <div className="absolute left-3.5 flex items-center pointer-events-none text-secondary">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>

            <input
              ref={searchInputRef}
              id="carpark-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search mall, building, MRT, postal code..."
              className="w-full h-11 pl-10 pr-10 bg-white text-on-surface rounded-xl text-[14px] font-normal shadow-xs border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-secondary/60 transition-all"
            />

            {searchQuery && (
              <button
                id="btn-clear-search"
                type="button"
                aria-label="Clear search text"
                onClick={() => {
                  onSearchChange('');
                  searchInputRef.current?.focus();
                }}
                className="absolute right-1 w-9 h-9 flex items-center justify-center text-secondary hover:text-on-surface rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}
          </div>

          {/* Filter Modal Trigger Button (44px touch target) */}
          <button
            id="btn-filter-modal"
            type="button"
            aria-label={`Open filter options. ${activeFilterCount} active filters.`}
            onClick={onOpenFilter}
            className={`h-11 px-3 min-w-[44px] flex items-center justify-center gap-1.5 rounded-xl border transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              activeFilterCount > 0
                ? 'bg-primary text-white border-primary font-semibold'
                : 'bg-white border-surface-container text-secondary hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">tune</span>
            <span className="text-[12px] font-semibold hidden sm:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-primary text-[10px] font-bold flex items-center justify-center shadow-xs">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick Search Shortcut Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4 text-[11px]">
          <span className="text-secondary font-medium shrink-0 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[13px]">bolt</span> Quick:
          </span>
          {quickChips.map((chip) => {
            const isActive = searchQuery.toLowerCase() === chip.query.toLowerCase();
            return (
              <button
                key={chip.label}
                type="button"
                onClick={() => onSearchChange(isActive ? '' : chip.query)}
                className={`shrink-0 px-2.5 py-1 rounded-lg transition-colors border font-medium ${
                  isActive
                    ? 'bg-primary/10 border-primary text-primary font-semibold'
                    : 'bg-white border-surface-container text-secondary hover:text-on-surface'
                }`}
              >
                {chip.label}
              </button>
            );
          })}

          {/* 1-tap toggles for EV and 15m grace */}
          <button
            type="button"
            onClick={() => onUpdateFilters?.({ evOnly: !filters?.evOnly })}
            className={`shrink-0 px-2.5 py-1 rounded-lg transition-colors border flex items-center gap-1 font-medium ${
              filters?.evOnly
                ? 'bg-tertiary text-white border-tertiary font-semibold'
                : 'bg-white border-surface-container text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">ev_station</span>
            <span>EV Charging</span>
          </button>

          <button
            type="button"
            onClick={() => onUpdateFilters?.({ onlyAvailable: !filters?.onlyAvailable })}
            className={`shrink-0 px-2.5 py-1 rounded-lg transition-colors border flex items-center gap-1 font-medium ${
              filters?.onlyAvailable
                ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                : 'bg-white border-surface-container text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">check_circle</span>
            <span>Available Only</span>
          </button>
        </div>

        {/* Quick Area Horizontal Scroll Ribbon */}
        <div
          ref={scrollContainerRef}
          role="tablist"
          aria-label="Singapore Parking Zones"
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4"
        >
          {ZONES.map((zone) => {
            const isSelected = selectedZone === zone;
            return (
              <button
                key={zone}
                role="tab"
                aria-selected={isSelected}
                onClick={() => onZoneSelect(zone)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] transition-all flex items-center gap-1 whitespace-nowrap min-h-[36px] ${
                  isSelected
                    ? 'bg-primary text-white font-semibold shadow-xs'
                    : 'bg-surface-container text-secondary hover:bg-surface-container-high hover:text-on-surface font-normal'
                }`}
              >
                {isSelected && (
                  <span className="material-symbols-outlined text-[15px]">location_on</span>
                )}
                {zone}
              </button>
            );
          })}
        </div>

        {/* Vehicle Segmented Toggle & Time Simulator Button */}
        <div className="grid grid-cols-12 gap-2 pt-0.5 items-center">
          {/* Vehicle Selector (Cars, Bikes, Heavy) */}
          <div
            role="group"
            aria-label="Vehicle class selection"
            className="col-span-7 bg-surface-container p-1 rounded-xl flex items-center justify-between min-h-[40px]"
          >
            <button
              type="button"
              aria-pressed={selectedVehicle === 'cars'}
              onClick={() => onVehicleSelect('cars')}
              className={`flex-1 py-1.5 text-center rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                selectedVehicle === 'cars'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">directions_car</span>
              <span>Cars</span>
            </button>

            <button
              type="button"
              aria-pressed={selectedVehicle === 'bikes'}
              onClick={() => onVehicleSelect('bikes')}
              className={`flex-1 py-1.5 text-center rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                selectedVehicle === 'bikes'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">two_wheeler</span>
              <span>Bikes</span>
            </button>

            <button
              type="button"
              aria-pressed={selectedVehicle === 'heavy'}
              onClick={() => onVehicleSelect('heavy')}
              className={`flex-1 py-1.5 text-center rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                selectedVehicle === 'heavy'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">local_shipping</span>
              <span>Heavy</span>
            </button>
          </div>

          {/* Time & Tariff Calculator Pill */}
          <button
            type="button"
            onClick={onOpenTimeSimulator}
            aria-label={`Simulated time: ${simulatedTimeLabel}. Tap to change entry time or duration.`}
            className="col-span-5 min-h-[40px] bg-white px-2.5 rounded-xl shadow-xs border border-surface-container flex items-center justify-between text-secondary hover:text-on-surface hover:border-primary/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="material-symbols-outlined text-[16px] text-tertiary">schedule</span>
              <span className="font-mono text-[11px] font-semibold text-on-surface truncate">
                {simulatedTimeLabel}
              </span>
            </div>
            <span className="material-symbols-outlined text-[16px] shrink-0 text-secondary">
              expand_more
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
