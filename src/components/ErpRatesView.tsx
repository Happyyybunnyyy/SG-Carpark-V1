import React, { useState } from 'react';
import { ERP_GANTRIES } from '../data/mockData';
import { VehicleType } from '../types';

interface ErpRatesViewProps {
  vehicle: VehicleType;
  onVehicleChange: (v: VehicleType) => void;
  onBackToCarparks?: () => void;
}

export const ErpRatesView: React.FC<ErpRatesViewProps> = ({
  vehicle,
  onVehicleChange,
  onBackToCarparks,
}) => {
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
    <div className="max-w-2xl mx-auto w-full px-4 py-3 pb-24 space-y-3">
      {/* Back Navigation & Title */}
      <div className="flex items-center gap-2">
        {onBackToCarparks && (
          <button
            type="button"
            onClick={onBackToCarparks}
            aria-label="Back to carparks directory"
            className="w-10 h-10 rounded-xl bg-white border border-surface-container flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
        )}
        <div>
          <h2 className="font-headline font-bold text-[18px] text-on-surface">
            Singapore ERP 2.0 Live Monitor
          </h2>
          <p className="text-[12px] text-secondary">
            Live toll status & electronic road pricing schedules
          </p>
        </div>
      </div>

      {/* Vehicle Segmented Toggle */}
      <div className="bg-white rounded-2xl p-3.5 border border-surface-container shadow-xs space-y-2">
        <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
          Toll Rate for Vehicle Class:
        </span>
        <div className="flex bg-surface-container p-1 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => onVehicleChange('cars')}
            className={`flex-1 min-h-[40px] rounded-lg text-center text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              vehicle === 'cars'
                ? 'bg-white text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">directions_car</span>
            <span>Cars</span>
          </button>
          <button
            type="button"
            onClick={() => onVehicleChange('bikes')}
            className={`flex-1 min-h-[40px] rounded-lg text-center text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              vehicle === 'bikes'
                ? 'bg-white text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
            <span>Bikes</span>
          </button>
          <button
            type="button"
            onClick={() => onVehicleChange('heavy')}
            className={`flex-1 min-h-[40px] rounded-lg text-center text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              vehicle === 'heavy'
                ? 'bg-white text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">local_shipping</span>
            <span>Heavy</span>
          </button>
        </div>
      </div>

      {/* Search & Zones */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <span className="absolute left-3.5 top-3 text-secondary material-symbols-outlined text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search gantry by expressway (CTE, PIE) or road..."
            value={searchErp}
            onChange={(e) => setSearchErp(e.target.value)}
            className="w-full h-11 pl-10 pr-3 rounded-xl bg-white border border-surface-container text-[13px] shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {['All', 'Orchard', 'CBD', 'CTE', 'PIE', 'ECP'].map((zone) => (
            <button
              key={zone}
              type="button"
              onClick={() => setFilterZone(zone)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-[12px] whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                filterZone === zone
                  ? 'bg-primary text-white font-bold shadow-xs'
                  : 'bg-white border border-surface-container text-secondary hover:text-on-surface'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Gantries List */}
      <div className="space-y-3">
        {filteredGantries.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-surface-container space-y-2">
            <span className="material-symbols-outlined text-[32px] text-secondary">
              search_off
            </span>
            <p className="font-semibold text-on-surface text-[14px]">No ERP Gantries Found</p>
            <button
              type="button"
              onClick={() => {
                setSearchErp('');
                setFilterZone('All');
              }}
              className="px-4 py-2 rounded-xl bg-surface-container text-primary font-bold text-[12px]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredGantries.map((gantry) => {
            const rateToDisplay =
              vehicle === 'bikes'
                ? gantry.vehicleTypeRates.bikes
                : vehicle === 'heavy'
                ? gantry.vehicleTypeRates.heavy
                : gantry.vehicleTypeRates.cars;

            return (
              <div
                key={gantry.id}
                className="bg-white rounded-2xl p-4 border border-surface-container shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface-container text-secondary">
                        {gantry.zone}
                      </span>
                      <h3 className="font-headline font-bold text-[15px] text-on-surface">
                        {gantry.name}
                      </h3>
                    </div>
                    <p className="text-[12px] text-secondary mt-0.5">{gantry.road}</p>
                  </div>

                  <div
                    className={`px-3 py-1.5 rounded-xl text-right border ${
                      gantry.status === 'active'
                        ? 'bg-rose-50 text-rose-900 border-rose-200'
                        : 'bg-surface-container-low text-secondary border-surface-container'
                    }`}
                  >
                    <span className="block text-[9px] uppercase font-bold tracking-wider">
                      {gantry.status === 'active' ? 'ACTIVE NOW' : 'NEXT CHARGE'}
                    </span>
                    <span className="font-mono text-[18px] font-bold text-on-surface">
                      ${rateToDisplay.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-surface-container flex items-center justify-between text-[12px] text-secondary">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">schedule</span>
                    <span>Toll Hours: {gantry.activeHours}</span>
                  </span>
                  <span className="font-semibold text-on-surface">
                    {gantry.status === 'active'
                      ? 'Tolling in effect'
                      : `Charges start at ${gantry.nextChargeTime}`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
