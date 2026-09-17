import React, { useEffect } from 'react';
import { Carpark } from '../types';

interface FullScheduleModalProps {
  carpark: Carpark | null;
  onClose: () => void;
  onNavigate: (carpark: Carpark) => void;
}

export const FullScheduleModal: React.FC<FullScheduleModalProps> = ({
  carpark,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (carpark) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [carpark, onClose]);

  if (!carpark) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-surface-container flex items-start justify-between bg-surface-container-low/60">
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <h3
                id="schedule-modal-title"
                className="font-headline font-bold text-[19px] text-on-surface truncate"
              >
                {carpark.name}
              </h3>
              <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-surface-container text-secondary">
                {carpark.zone}
              </span>
            </div>
            <p className="text-[13px] text-secondary truncate mt-0.5">
              <span className="font-semibold text-on-surface">{carpark.distance}</span> • {carpark.address}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close tariff details"
            className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 no-scrollbar">
          {/* Key Specifications Badges */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container">
              <span className="block text-[10px] text-secondary uppercase font-bold tracking-wider">
                Height Limit
              </span>
              <span className="font-mono text-[14px] font-bold text-on-surface">
                {carpark.maxHeight}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <span className="block text-[10px] uppercase font-bold tracking-wider">
                Grace Period
              </span>
              <span className="font-mono text-[14px] font-bold text-emerald-800">
                {carpark.gracePeriod}
              </span>
            </div>
            <div
              className={`p-2.5 rounded-xl border ${
                carpark.lotStatus === 'full'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : carpark.lotStatus === 'limited'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              <span className="block text-[10px] uppercase font-bold tracking-wider">
                Lots Available
              </span>
              <span className="font-mono text-[14px] font-bold">
                {carpark.lots} / {carpark.totalLots}
              </span>
            </div>
          </div>

          {/* Full Rates Table Schedule */}
          <div>
            <h4 className="font-headline font-bold text-[14px] text-on-surface mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
              <span>Complete Rate Schedule (Passenger Cars)</span>
            </h4>
            <div className="space-y-2 text-[13px]">
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="font-bold text-on-surface block mb-0.5">
                  Weekday Daytime (Mon – Fri)
                </span>
                <p className="text-secondary">{carpark.fullSchedule.weekdayDay}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="font-bold text-on-surface block mb-0.5">
                  Weekday Evening (After 5:00 / 6:00 PM)
                </span>
                <p className="text-secondary">{carpark.fullSchedule.weekdayNight}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="font-bold text-on-surface block mb-0.5">Saturday</span>
                <p className="text-secondary">{carpark.fullSchedule.saturday}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="font-bold text-on-surface block mb-0.5">
                  Sunday & Public Holidays
                </span>
                <p className="text-secondary">{carpark.fullSchedule.sundayPH}</p>
              </div>
            </div>
          </div>

          {/* Motorcycles & Other Vehicles */}
          <div>
            <h4 className="font-headline font-bold text-[14px] text-on-surface mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-secondary">two_wheeler</span>
              <span>Motorcycles & Heavy Vehicles</span>
            </h4>
            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container text-[13px] space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-secondary">Motorcycle Rate:</span>
                <span className="font-mono font-bold text-on-surface">
                  {carpark.fullSchedule.motorcycleRate}
                </span>
              </div>
              {carpark.fullSchedule.heavyRate && (
                <div className="flex justify-between items-center pt-1 border-t border-surface-container">
                  <span className="text-secondary">Heavy Vehicles:</span>
                  <span className="font-mono font-bold text-on-surface">
                    {carpark.fullSchedule.heavyRate}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Amenities & Operator Info */}
          <div>
            <h4 className="font-headline font-bold text-[14px] text-on-surface mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-blue-700">info</span>
              <span>Amenities & Information</span>
            </h4>
            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container text-[13px] space-y-2">
              {carpark.evChargers && (
                <div className="flex items-center gap-2 text-blue-900 font-medium">
                  <span className="material-symbols-outlined text-[18px] text-blue-700">ev_station</span>
                  <span>Electric Vehicle Fast Charging ({carpark.evChargers})</span>
                </div>
              )}
              {carpark.autoPassReady && (
                <div className="flex items-center gap-2 text-secondary">
                  <span className="material-symbols-outlined text-[18px]">credit_card</span>
                  <span>Foreign Vehicle AutoPass Cards Accepted</span>
                </div>
              )}
              {carpark.fullSchedule.specialTerms && (
                <p className="text-secondary italic text-[12px]">
                  Special Terms: {carpark.fullSchedule.specialTerms}
                </p>
              )}
              <div className="pt-2 border-t border-surface-container text-[12px] text-secondary">
                Operator: <span className="font-medium text-on-surface">{carpark.fullSchedule.operator}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer (44px touch targets) */}
        <div className="p-3 sm:p-4 border-t border-surface-container bg-surface-container-low/40 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-white border border-surface-container hover:bg-surface-container-low text-on-surface font-headline font-semibold text-[13px] transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-2xs"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate(carpark);
            }}
            className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-hover text-white font-headline font-semibold text-[13px] shadow-xs flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <span className="material-symbols-outlined text-[18px]">navigation</span>
            <span>Navigate Here</span>
          </button>
        </div>
      </div>
    </div>
  );
};
