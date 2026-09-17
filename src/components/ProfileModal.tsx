import React, { useState, useEffect } from 'react';
import { VehicleType } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVehicle: VehicleType;
  onVehicleChange: (v: VehicleType) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  selectedVehicle,
  onVehicleChange,
}) => {
  const [erpAlertsEnabled, setErpAlertsEnabled] = useState(true);
  const [foreignVehicleMode, setForeignVehicleMode] = useState(false);
  const [autoRefreshLots, setAutoRefreshLots] = useState(true);

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
      aria-labelledby="profile-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-surface-container flex items-center justify-between bg-surface-container-low/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </div>
            <div>
              <h3 id="profile-modal-title" className="font-headline font-bold text-[18px] text-on-surface">
                Driver Settings
              </h3>
              <p className="text-[12px] text-secondary">Urban mobility & vehicle preferences</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close driver settings"
            className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-4 sm:p-5 space-y-4 text-[13px]">
          <div>
            <label className="block text-[11px] uppercase font-bold text-secondary tracking-wider mb-2.5">
              Default Vehicle Class
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'cars', label: 'Car', icon: 'directions_car' },
                { id: 'bikes', label: 'Motorcycle', icon: 'two_wheeler' },
                { id: 'heavy', label: 'Heavy Goods', icon: 'local_shipping' },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onVehicleChange(v.id as VehicleType)}
                  className={`min-h-[58px] p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                    selectedVehicle === v.id
                      ? 'border-primary bg-primary text-white font-bold shadow-xs'
                      : 'border-surface-container bg-white text-secondary hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">{v.icon}</span>
                  <span className="text-[12px]">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 pt-3 border-t border-surface-container">
            <label className="block text-[11px] uppercase font-bold text-secondary tracking-wider">
              Alerts & Connectivity
            </label>

            <label className="min-h-[52px] flex items-center justify-between p-3 rounded-xl bg-white border border-surface-container cursor-pointer hover:bg-surface-container-low transition-colors">
              <div className="pr-3">
                <span className="font-semibold text-on-surface block text-[13px]">
                  Live ERP Gantry Proximity Alerts
                </span>
                <span className="text-[11px] text-secondary block">
                  Notify before passing active toll gantries
                </span>
              </div>
              <input
                type="checkbox"
                checked={erpAlertsEnabled}
                onChange={(e) => setErpAlertsEnabled(e.target.checked)}
                className="w-5 h-5 accent-primary rounded cursor-pointer"
              />
            </label>

            <label className="min-h-[52px] flex items-center justify-between p-3 rounded-xl bg-white border border-surface-container cursor-pointer hover:bg-surface-container-low transition-colors">
              <div className="pr-3">
                <span className="font-semibold text-on-surface block text-[13px]">
                  Foreign Vehicle AutoPass Mode
                </span>
                <span className="text-[11px] text-secondary block">
                  Highlight carparks supporting Malaysian / foreign cards
                </span>
              </div>
              <input
                type="checkbox"
                checked={foreignVehicleMode}
                onChange={(e) => setForeignVehicleMode(e.target.checked)}
                className="w-5 h-5 accent-primary rounded cursor-pointer"
              />
            </label>

            <label className="min-h-[52px] flex items-center justify-between p-3 rounded-xl bg-white border border-surface-container cursor-pointer hover:bg-surface-container-low transition-colors">
              <div className="pr-3">
                <span className="font-semibold text-on-surface block text-[13px]">
                  LTA Dynamic Live Lots Sync
                </span>
                <span className="text-[11px] text-secondary block">
                  Auto-sync lot availability counters every minute
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoRefreshLots}
                onChange={(e) => setAutoRefreshLots(e.target.checked)}
                className="w-5 h-5 accent-primary rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-container bg-surface-container-low/40">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-primary hover:bg-primary-hover text-white font-headline font-semibold text-[13px] shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
