import React, { useState } from 'react';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-surface-container flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[14px]">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-[16px] text-on-surface">Driver Profile</h3>
              <p className="text-[11px] text-secondary">sgCarMart Urban Mobility Singapore</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-4 space-y-4 text-[13px]">
          <div>
            <label className="block text-[11px] uppercase font-bold text-secondary tracking-wider mb-2">
              Default Vehicle Class
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cars', label: 'Passenger Car', icon: 'directions_car' },
                { id: 'bikes', label: 'Motorcycle', icon: 'two_wheeler' },
                { id: 'heavy', label: 'Heavy Goods', icon: 'local_shipping' },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onVehicleChange(v.id as VehicleType)}
                  className={`p-2.5 rounded-lg border text-center flex flex-col items-center gap-1 transition-all ${
                    selectedVehicle === v.id
                      ? 'border-primary bg-primary text-white font-semibold shadow-xs'
                      : 'border-surface-container bg-surface-container-low text-secondary hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{v.icon}</span>
                  <span className="text-[11px]">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-surface-container">
            <label className="block text-[11px] uppercase font-bold text-secondary tracking-wider">
              Alerts & Connectivity
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low border border-surface-container cursor-pointer">
              <div>
                <span className="font-medium text-on-surface block text-[12px]">
                  Live ERP Gantry Proximity Alerts
                </span>
                <span className="text-[11px] text-secondary block">
                  Notify before passing active gantries
                </span>
              </div>
              <input
                type="checkbox"
                checked={erpAlertsEnabled}
                onChange={(e) => setErpAlertsEnabled(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low border border-surface-container cursor-pointer">
              <div>
                <span className="font-medium text-on-surface block text-[12px]">
                  AutoPass (Foreign Registered Vehicles)
                </span>
                <span className="text-[11px] text-secondary block">
                  Highlight AutoPass ready carparks
                </span>
              </div>
              <input
                type="checkbox"
                checked={foreignVehicleMode}
                onChange={(e) => setForeignVehicleMode(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low border border-surface-container cursor-pointer">
              <div>
                <span className="font-medium text-on-surface block text-[12px]">
                  LTA Dynamic Live Lots Sync (1 min)
                </span>
                <span className="text-[11px] text-secondary block">
                  Auto-fetch real-time lot counters
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoRefreshLots}
                onChange={(e) => setAutoRefreshLots(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-surface-container bg-surface-container-low/30">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 rounded-lg bg-primary hover:bg-primary-hover text-white font-headline font-semibold text-[13px] shadow-xs transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
