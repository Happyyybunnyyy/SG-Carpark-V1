import React, { useEffect } from 'react';
import { FilterState } from '../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilters: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  matchingCount?: number;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onResetFilters,
  matchingCount,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-surface-container flex items-center justify-between bg-surface-container-low/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </div>
            <div>
              <h3 id="filter-modal-title" className="font-headline font-bold text-[18px] text-on-surface">
                Filter & Sort
              </h3>
              <p className="text-[12px] text-secondary">Tailor rates, lots, and vehicle clearance</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filter options"
            className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Filter options */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 no-scrollbar">
          {/* Sort By */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-secondary tracking-wider mb-2.5">
              Sort Carparks By
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'rate', label: 'Cheapest Rate', icon: 'payments' },
                { id: 'distance', label: 'Nearest Distance', icon: 'near_me' },
                { id: 'lots', label: 'Most Available Lots', icon: 'local_parking' },
                { id: 'grace', label: 'Longest Grace Period', icon: 'timer' },
              ].map((item) => {
                const isSelected = filters.sortBy === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      onUpdateFilters({ sortBy: item.id as FilterState['sortBy'] })
                    }
                    className={`min-h-[48px] p-3 rounded-xl border text-left text-[13px] font-medium flex items-center gap-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                        : 'border-surface-container bg-white text-secondary hover:text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability & Facilities Toggles */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-secondary tracking-wider mb-2.5">
              Preferences & Amenities
            </label>
            <div className="space-y-2.5">
              <label className="min-h-[50px] flex items-center justify-between p-3 rounded-xl bg-white border border-surface-container cursor-pointer hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-2.5 text-[13px] font-semibold text-on-surface">
                  <span className="material-symbols-outlined text-emerald-700 text-[20px]">
                    check_circle
                  </span>
                  <div>
                    <span>Available Lots Only</span>
                    <span className="block text-[11px] text-secondary font-normal">
                      Hide full carparks with 0 lots
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={filters.onlyAvailable}
                  onChange={(e) => onUpdateFilters({ onlyAvailable: e.target.checked })}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                />
              </label>

              <label className="min-h-[50px] flex items-center justify-between p-3 rounded-xl bg-white border border-surface-container cursor-pointer hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-2.5 text-[13px] font-semibold text-on-surface">
                  <span className="material-symbols-outlined text-blue-700 text-[20px]">
                    ev_station
                  </span>
                  <div>
                    <span>Electric Vehicle (EV) Chargers</span>
                    <span className="block text-[11px] text-secondary font-normal">
                      Superchargers & Type-2 points
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={filters.evOnly}
                  onChange={(e) => onUpdateFilters({ evOnly: e.target.checked })}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                />
              </label>

              <label className="min-h-[50px] flex items-center justify-between p-3 rounded-xl bg-white border border-surface-container cursor-pointer hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-2.5 text-[13px] font-semibold text-on-surface">
                  <span className="material-symbols-outlined text-emerald-700 text-[20px]">
                    timer
                  </span>
                  <div>
                    <span>15m Extended Grace Period</span>
                    <span className="block text-[11px] text-secondary font-normal">
                      Extra pickup & dropoff buffer
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={filters.minGracePeriod}
                  onChange={(e) => onUpdateFilters({ minGracePeriod: e.target.checked })}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Height Clearance */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-secondary tracking-wider mb-2.5">
              Vehicle Height Clearance
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Any', '1.9m+', '2.0m+', '2.1m+'].map((h) => {
                const isSelected = filters.maxHeightFilter === h;
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => onUpdateFilters({ maxHeightFilter: h })}
                    className={`min-h-[44px] rounded-xl border text-center text-[13px] font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                      isSelected
                        ? 'border-primary bg-primary text-white shadow-xs'
                        : 'border-surface-container bg-white text-secondary hover:text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-container bg-surface-container-low/40 flex items-center gap-3">
          <button
            type="button"
            onClick={onResetFilters}
            className="px-5 h-11 rounded-xl bg-white border border-surface-container text-secondary hover:text-on-surface font-headline font-semibold text-[13px] transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-2xs"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-hover text-white font-headline font-semibold text-[13px] shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {matchingCount !== undefined
              ? `Show ${matchingCount} Carparks`
              : 'Apply Filters'}
          </button>
        </div>
      </div>
    </div>
  );
};
