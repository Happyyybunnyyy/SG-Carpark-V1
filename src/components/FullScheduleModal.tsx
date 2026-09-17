import React from 'react';
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
  if (!carpark) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-surface-container flex items-start justify-between bg-surface-container-low/50">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-headline font-bold text-[18px] text-on-surface truncate">
                {carpark.name}
              </h3>
              <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-surface-container text-secondary">
                {carpark.zone}
              </span>
            </div>
            <p className="text-[12px] text-secondary truncate mt-0.5">
              {carpark.address} • {carpark.distance}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 no-scrollbar">
          {/* Key Specifications Badges */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-surface-container-low border border-surface-container">
              <span className="block text-[10px] text-secondary uppercase font-semibold">
                Clearance
              </span>
              <span className="font-mono text-[13px] font-bold text-on-surface">
                {carpark.maxHeight}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-surface-container-low border border-surface-container">
              <span className="block text-[10px] text-secondary uppercase font-semibold">
                Grace Period
              </span>
              <span className="font-mono text-[13px] font-bold text-lot-available">
                {carpark.gracePeriod}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-surface-container-low border border-surface-container">
              <span className="block text-[10px] text-secondary uppercase font-semibold">
                Available Lots
              </span>
              <span
                className={`font-mono text-[13px] font-bold ${
                  carpark.lotStatus === 'full'
                    ? 'text-lot-full'
                    : carpark.lotStatus === 'limited'
                    ? 'text-lot-limited'
                    : 'text-lot-available'
                }`}
              >
                {carpark.lots} / {carpark.totalLots}
              </span>
            </div>
          </div>

          {/* Full Rates Table Schedule */}
          <div>
            <h4 className="font-headline font-semibold text-[13px] text-on-surface mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">calendar_month</span>
              <span>Detailed Tariff Breakdown (Cars)</span>
            </h4>
            <div className="space-y-2 text-[12px]">
              <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container">
                <span className="font-semibold text-on-surface block mb-0.5">
                  Weekday Daytime
                </span>
                <p className="text-secondary">{carpark.fullSchedule.weekdayDay}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container">
                <span className="font-semibold text-on-surface block mb-0.5">
                  Weekday Evening
                </span>
                <p className="text-secondary">{carpark.fullSchedule.weekdayNight}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container">
                <span className="font-semibold text-on-surface block mb-0.5">Saturday</span>
                <p className="text-secondary">{carpark.fullSchedule.saturday}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container">
                <span className="font-semibold text-on-surface block mb-0.5">
                  Sunday & Public Holidays
                </span>
                <p className="text-secondary">{carpark.fullSchedule.sundayPH}</p>
              </div>
            </div>
          </div>

          {/* Motorcycles & Heavy Vehicles */}
          <div>
            <h4 className="font-headline font-semibold text-[13px] text-on-surface mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">two_wheeler</span>
              <span>Motorcycles & Other Vehicles</span>
            </h4>
            <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-[12px] space-y-1">
              <div className="flex justify-between">
                <span className="text-secondary">Motorcycle Rate:</span>
                <span className="font-mono font-semibold text-on-surface">
                  {carpark.fullSchedule.motorcycleRate}
                </span>
              </div>
              {carpark.fullSchedule.heavyRate && (
                <div className="flex justify-between">
                  <span className="text-secondary">Heavy Vehicles:</span>
                  <span className="font-mono font-semibold text-on-surface">
                    {carpark.fullSchedule.heavyRate}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Amenities & Operator Info */}
          <div>
            <h4 className="font-headline font-semibold text-[13px] text-on-surface mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-tertiary">info</span>
              <span>Amenities & Terms</span>
            </h4>
            <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-[12px] space-y-2">
              {carpark.evChargers && (
                <div className="flex items-center gap-2 text-tertiary font-medium">
                  <span className="material-symbols-outlined text-[16px]">ev_station</span>
                  <span>EV Charging Available ({carpark.evChargers})</span>
                </div>
              )}
              {carpark.autoPassReady && (
                <div className="flex items-center gap-2 text-secondary">
                  <span className="material-symbols-outlined text-[16px]">credit_card</span>
                  <span>Foreign Vehicles AutoPass Accepted</span>
                </div>
              )}
              {carpark.fullSchedule.specialTerms && (
                <p className="text-secondary italic">
                  Note: {carpark.fullSchedule.specialTerms}
                </p>
              )}
              <div className="pt-1 border-t border-surface-container text-[11px] text-secondary">
                Operator: {carpark.fullSchedule.operator}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-3 border-t border-surface-container bg-surface-container-low/30 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-headline font-semibold text-[13px] transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate(carpark);
            }}
            className="flex-1 h-10 rounded-lg bg-primary hover:bg-primary-hover text-white font-headline font-semibold text-[13px] shadow-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">navigation</span>
            <span>Navigate Here</span>
          </button>
        </div>
      </div>
    </div>
  );
};
