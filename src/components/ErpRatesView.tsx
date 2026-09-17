import React, { useState } from 'react';
import { ERP_GANTRIES } from '../data/mockData';
import { VehicleType } from '../types';

interface ErpRatesViewProps {
  vehicle: VehicleType;
  onVehicleChange: (v: VehicleType) => void;
}

export const ErpRatesView: React.FC<ErpRatesViewProps> = ({ vehicle, onVehicleChange }) => {
  const [filterZone, setFilterZone] = useState<string>('All');
  const [searchErp, setSearchErp] = useState<string>('');

  const filteredGantries = ERP_GANTRIES.filter((gantry) => {
    if (filterZone !== 'All' && !gantry.zone.includes(filterZone)) return false;
    if (
      searchErp &&
      !gantry.name.toLowerCase().includes(searchErp.toLowerCase()) &&
      !gantry.road.toLowerCase().includes(searchErp.toLowerCase()) &&
      !gantry.zone.toLowerCase().includes(searchErp.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-3 pb-24 space-y-3">
      {/* ERP Header Banner */}
      <div className="bg-gradient-to-br from-erp-active/15 to-erp-active/5 border border-erp-active/20 rounded-xl p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-erp-active text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">toll</span>
          </div>
          <div>
            <h2 className="font-headline font-bold text-[17px] text-on-surface">
              Singapore ERP 2.0 Live Monitor
            </h2>
            <p className="text-[11px] text-secondary">
              Land Transport Authority (LTA) Gantry Status & Toll Schedules
            </p>
          </div>
        </div>

        {/* Vehicle Segmented Toggle */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-erp-active/15">
          <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
            Vehicle:
          </span>
          <div className="flex-1 flex bg-white/80 p-1 rounded-lg border border-erp-active/20 gap-1">
            <button
              type="button"
              onClick={() => onVehicleChange('cars')}
              className={`flex-1 py-1 rounded text-center text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                vehicle === 'cars'
                  ? 'bg-erp-active text-white shadow-xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">directions_car</span>
              <span>Cars</span>
            </button>
            <button
              type="button"
              onClick={() => onVehicleChange('bikes')}
              className={`flex-1 py-1 rounded text-center text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                vehicle === 'bikes'
                  ? 'bg-erp-active text-white shadow-xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">two_wheeler</span>
              <span>Motorcycles</span>
            </button>
            <button
              type="button"
              onClick={() => onVehicleChange('heavy')}
              className={`flex-1 py-1 rounded text-center text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                vehicle === 'heavy'
                  ? 'bg-erp-active text-white shadow-xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">local_shipping</span>
              <span>Heavy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Zones */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-secondary material-symbols-outlined text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search gantry by expressway, road or zone..."
            value={searchErp}
            onChange={(e) => setSearchErp(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-surface-container text-[13px] shadow-xs focus:outline-none focus:ring-1 focus:ring-erp-active"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {['All', 'Orchard', 'CBD', 'CTE', 'PIE', 'ECP'].map((zone) => (
            <button
              key={zone}
              type="button"
              onClick={() => setFilterZone(zone)}
              className={`px-3 py-1 rounded-full text-[12px] whitespace-nowrap transition-all ${
                filterZone === zone
                  ? 'bg-erp-active text-white font-semibold shadow-xs'
                  : 'bg-white border border-surface-container text-secondary hover:text-on-surface'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Gantries List */}
      <div className="space-y-2.5">
        {filteredGantries.map((gantry) => {
          const rateToDisplay =
            vehicle === 'bikes'
              ? gantry.vehicleTypeRates.bikes
              : vehicle === 'heavy'
              ? gantry.vehicleTypeRates.heavy
              : gantry.vehicleTypeRates.cars;

          return (
            <div
              key={gantry.id}
              className="bg-white rounded-xl p-3.5 border border-surface-container shadow-xs space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface-container text-secondary">
                      {gantry.zone}
                    </span>
                    <h3 className="font-headline font-semibold text-[14px] text-on-surface">
                      {gantry.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-secondary mt-0.5">{gantry.road}</p>
                </div>

                <div
                  className={`px-2.5 py-1 rounded-lg text-right ${
                    gantry.status === 'active'
                      ? 'bg-erp-active/10 text-erp-active'
                      : 'bg-surface-container text-secondary'
                  }`}
                >
                  <span className="block text-[9px] uppercase font-bold tracking-wider">
                    {gantry.status === 'active' ? 'ACTIVE NOW' : 'NEXT CHARGE'}
                  </span>
                  <span className="font-mono text-[16px] font-bold">
                    ${rateToDisplay.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-container flex items-center justify-between text-[11px] text-secondary">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  <span>Hours: {gantry.activeHours}</span>
                </span>
                <span className="font-medium text-on-surface">
                  Status:{' '}
                  {gantry.status === 'active'
                    ? 'Tolling in effect'
                    : `Turns on at ${gantry.nextChargeTime}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
