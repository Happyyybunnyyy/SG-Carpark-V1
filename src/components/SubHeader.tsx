import React, { useRef } from 'react';
import { VehicleType } from '../types';
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
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

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
  searchInputRef,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="sticky top-14 z-30 bg-[#f8f9ff]/95 backdrop-blur-md px-4 pt-2 pb-2.5 shadow-xs border-b border-surface-container">
      <div className="max-w-2xl mx-auto flex flex-col gap-2">
        {/* Search Bar */}
        <div className="relative flex items-center w-full">
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
            className="w-full h-11 pl-10 pr-20 bg-surface-container-lowest text-on-surface rounded-xl text-[14px] font-normal shadow-xs border border-surface-container/60 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:bg-white placeholder:text-secondary/60"
          />

          <div className="absolute right-1.5 flex items-center gap-1">
            {searchQuery && (
              <button
                id="btn-clear-search"
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  onSearchChange('');
                  searchInputRef.current?.focus();
                }}
                className="w-8 h-8 flex items-center justify-center text-secondary hover:text-on-surface rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}

            <button
              id="btn-filter-modal"
              type="button"
              aria-label="Filter parameters"
              onClick={onOpenFilter}
              className="w-8 h-8 flex items-center justify-center bg-surface-container text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
          </div>
        </div>

        {/* Quick Area Horizontal Scroll Ribbon */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4"
        >
          {ZONES.map((zone) => {
            const isSelected = selectedZone === zone;
            return (
              <button
                key={zone}
                onClick={() => onZoneSelect(zone)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-primary text-white font-semibold shadow-xs'
                    : 'bg-surface-container text-secondary hover:bg-surface-container-high font-normal'
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

        {/* Vehicle Segmented Toggle & Dynamic Calculation Slot */}
        <div className="grid grid-cols-12 gap-2 pt-0.5 items-center">
          {/* Vehicle Selector */}
          <div className="col-span-7 bg-surface-container p-1 rounded-lg flex items-center justify-between">
            <button
              type="button"
              onClick={() => onVehicleSelect('cars')}
              className={`flex-1 py-1 text-center rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
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
              onClick={() => onVehicleSelect('bikes')}
              className={`flex-1 py-1 text-center rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
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
              onClick={() => onVehicleSelect('heavy')}
              className={`flex-1 py-1 text-center rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                selectedVehicle === 'heavy'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">local_shipping</span>
              <span>Heavy</span>
            </button>
          </div>

          {/* Time Simulator Pill */}
          <button
            type="button"
            onClick={onOpenTimeSimulator}
            className="col-span-5 h-8 bg-surface-container-lowest px-2.5 rounded-lg shadow-xs border border-surface-container/60 flex items-center justify-between text-secondary hover:text-on-surface hover:border-surface-container-highest transition-colors"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="material-symbols-outlined text-[16px] text-tertiary">schedule</span>
              <span className="font-mono text-[11px] font-medium text-on-surface truncate">
                {simulatedTimeLabel}
              </span>
            </div>
            <span className="material-symbols-outlined text-[16px] shrink-0">expand_more</span>
          </button>
        </div>
      </div>
    </section>
  );
};
