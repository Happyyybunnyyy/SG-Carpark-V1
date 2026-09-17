import React from 'react';
import { FilterState } from '../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilters: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onResetFilters,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-surface-container flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
            <h3 className="font-headline font-bold text-[17px] text-on-surface">Filter & Sort</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Filter options */}
        <div className="p-4 overflow-y-auto space-y-4 no-scrollbar">
          {/* Sort By */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-secondary tracking-wider mb-2">
              Sort By
            </label>
            <div className="grid grid-cols-2 gap-2">
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
                    className={`p-2.5 rounded-lg border text-left text-[12px] font-medium flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary font-semibold'
                        : 'border-surface-container bg-surface-container-low text-secondary hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability & Facilities Toggles */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-secondary tracking-wider mb-2">
              Carpark Features
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low border border-surface-container cursor-pointer hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2 text-[13px] font-medium text-on-surface">
                  <span className="material-symbols-outlined text-lot-available text-[18px]">
                    check_circle
                  </span>
                  <span>Available Lots Only (Hide Full)</span>
                </div>
                <input
                  type="checkbox"
                  checked={filters.onlyAvailable}
                  onChange={(e) => onUpdateFilters({ onlyAvailable: e.target.checked })}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low border border-surface-container cursor-pointer hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2 text-[13px] font-medium text-on-surface">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">
                    ev_station
                  </span>
                  <span>EV Charging Available</span>
                </div>
                <input
                  type="checkbox"
                  checked={filters.evOnly}
                  onChange={(e) => onUpdateFilters({ evOnly: e.target.checked })}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low border border-surface-container cursor-pointer hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2 text-[13px] font-medium text-on-surface">
                  <span className="material-symbols-outlined text-lot-available text-[18px]">
                    timer
                  </span>
                  <span>15m+ Extended Grace Period</span>
                </div>
                <input
                  type="checkbox"
                  checked={filters.minGracePeriod}
                  onChange={(e) => onUpdateFilters({ minGracePeriod: e.target.checked })}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Height Clearance */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-secondary tracking-wider mb-2">
              Vehicle Height Clearance
            </label>
            <div className="flex gap-2">
              {['Any', '1.9m+', '2.0m+', '2.1m+'].map((h) => {
                const isSelected = filters.maxHeightFilter === h;
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => onUpdateFilters({ maxHeightFilter: h })}
                    className={`flex-1 py-1.5 rounded-lg border text-center text-[12px] font-medium transition-all ${
                      isSelected
                        ? 'border-primary bg-primary text-white font-semibold shadow-xs'
                        : 'border-surface-container bg-surface-container-low text-secondary hover:text-on-surface'
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
        <div className="p-3 border-t border-surface-container bg-surface-container-low/30 flex items-center gap-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 h-10 rounded-lg border border-surface-container text-secondary hover:text-on-surface font-headline font-semibold text-[13px] transition-colors"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-lg bg-primary hover:bg-primary-hover text-white font-headline font-semibold text-[13px] shadow-xs transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
