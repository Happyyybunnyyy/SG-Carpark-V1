import React, { useState } from 'react';
import { Carpark } from '../types';

interface MapViewProps {
  carparks: Carpark[];
  selectedZone: string;
  onSelectCarpark: (carpark: Carpark) => void;
  onNavigate: (carpark: Carpark) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  carparks,
  selectedZone,
  onSelectCarpark,
  onNavigate,
}) => {
  const [activePinId, setActivePinId] = useState<string>(carparks[0]?.id || '');

  const activeCarpark = carparks.find((c) => c.id === activePinId) || carparks[0];

  // Map pin placement coordinates scaled to an intuitive visual grid
  // Using pseudo-geographic positions centered around Orchard / CBD
  const getPinPosition = (carpark: Carpark, index: number) => {
    // Generate layout positions spread nicely across the canvas
    const basePositions: Record<string, { x: number; y: number }> = {
      'ion-orchard': { x: 38, y: 48 },
      'ngee-ann-city': { x: 50, y: 52 },
      'plaza-singapura': { x: 74, y: 38 },
      'paragon-shopping-centre': { x: 55, y: 42 },
      '313-somerset': { x: 62, y: 58 },
      'wisma-atria': { x: 44, y: 45 },
      'mbs': { x: 78, y: 72 },
      'suntec-city': { x: 70, y: 55 },
      'bugis-junction': { x: 65, y: 42 },
      'jem-jurong': { x: 20, y: 35 },
      'tampines-mall': { x: 85, y: 30 },
      'causeway-point': { x: 30, y: 15 },
    };

    if (basePositions[carpark.id]) {
      return basePositions[carpark.id];
    }
    // Fallback spread
    return {
      x: 30 + ((index * 13) % 55),
      y: 35 + ((index * 17) % 45),
    };
  };

  return (
    <div className="relative w-full h-[calc(100dvh-130px)] bg-slate-50 flex flex-col overflow-hidden">
      {/* Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-surface-container flex items-center gap-2 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-lot-available animate-pulse"></span>
          <span className="font-headline font-semibold text-[12px] text-on-surface">
            {selectedZone} Live Map
          </span>
          <span className="text-[11px] text-secondary font-mono">({carparks.length} Carparks)</span>
        </div>

        <div className="bg-white/95 backdrop-blur-md px-2 py-1 rounded-xl shadow-md border border-surface-container flex items-center gap-1.5 pointer-events-auto">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-lot-available">
            <span className="w-2 h-2 rounded-full bg-lot-available"></span> Plenty
          </div>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-lot-limited ml-1">
            <span className="w-2 h-2 rounded-full bg-lot-limited"></span> Limited
          </div>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-lot-full ml-1">
            <span className="w-2 h-2 rounded-full bg-lot-full"></span> Full
          </div>
        </div>
      </div>

      {/* Styled Interactive SVG Map Canvas */}
      <div className="relative flex-1 w-full h-full bg-[#edf2f7] overflow-hidden select-none">
        {/* Abstract Singapore Road Network Representation */}
        <svg
          className="absolute inset-0 w-full h-full text-slate-300 opacity-60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Major thoroughfares representation: Orchard Rd, Somerset, Scotts Rd, CTE */}
          {/* CTE Expressway */}
          <path
            d="M 68 0 Q 70 50 82 100"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Orchard Road Spine */}
          <path
            d="M 20 40 Q 50 48 85 45"
            fill="none"
            stroke="#fef08a"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Scotts Road */}
          <path
            d="M 45 10 L 40 65"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Bras Basah Road */}
          <path
            d="M 65 42 Q 78 50 90 60"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>

        {/* Street Name Overlays */}
        <div className="absolute top-[41%] left-[30%] text-[10px] font-bold text-slate-400 tracking-wider uppercase pointer-events-none rotate-6">
          Orchard Road
        </div>
        <div className="absolute top-[32%] left-[45%] text-[9px] font-bold text-slate-400 tracking-wider uppercase pointer-events-none -rotate-45">
          Scotts Rd
        </div>
        <div className="absolute top-[18%] right-[22%] text-[9px] font-bold text-slate-400 tracking-wider uppercase pointer-events-none rotate-75">
          CTE Expressway
        </div>

        {/* User GPS Beacon Position */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ left: '33%', top: '53%' }}
        >
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-500 opacity-40"></span>
            <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white shadow-md border-2 border-white">
              <span className="material-symbols-outlined text-[12px]">my_location</span>
            </span>
          </div>
          <span className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-700 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
            You
          </span>
        </div>

        {/* Carpark Location Pins */}
        {carparks.map((carpark, idx) => {
          const pos = getPinPosition(carpark, idx);
          const isSelected = activeCarpark?.id === carpark.id;

          const pinColor =
            carpark.lotStatus === 'full'
              ? 'bg-lot-full text-white'
              : carpark.lotStatus === 'limited'
              ? 'bg-lot-limited text-white'
              : 'bg-lot-available text-white';

          return (
            <div
              key={carpark.id}
              onClick={() => setActivePinId(carpark.id)}
              className={`absolute z-30 cursor-pointer -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${
                isSelected ? 'scale-115 z-40' : 'hover:scale-110'
              }`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {/* Tooltip badge */}
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full shadow-md font-mono text-[11px] font-bold border-2 border-white ${pinColor}`}
              >
                <span className="material-symbols-outlined text-[13px]">local_parking</span>
                <span>{carpark.lotStatus === 'full' ? 'FULL' : carpark.lots}</span>
              </div>

              {/* Pin Arrow Tip */}
              <div
                className={`w-2 h-2 mx-auto -mt-1 rotate-45 border-r border-b border-white ${
                  carpark.lotStatus === 'full'
                    ? 'bg-lot-full'
                    : carpark.lotStatus === 'limited'
                    ? 'bg-lot-limited'
                    : 'bg-lot-available'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Card Preview for Active Pin */}
      {activeCarpark && (
        <div className="absolute bottom-4 left-3 right-3 z-30 max-w-xl mx-auto animate-in slide-in-from-bottom-3 duration-200">
          <div className="bg-white rounded-xl p-3.5 shadow-xl border border-surface-container flex flex-col gap-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-headline font-bold text-[16px] text-on-surface truncate">
                    {activeCarpark.name}
                  </h3>
                  <span className="font-mono text-[11px] font-medium text-secondary">
                    • {activeCarpark.distance}
                  </span>
                </div>
                <p className="text-[12px] text-secondary truncate mt-0.5">
                  {activeCarpark.address} • {activeCarpark.gracePeriod}
                </p>
              </div>

              <div
                className={`px-2 py-0.5 rounded-md font-mono text-[12px] font-bold shrink-0 ${
                  activeCarpark.lotStatus === 'full'
                    ? 'bg-lot-full/15 text-lot-full'
                    : activeCarpark.lotStatus === 'limited'
                    ? 'bg-lot-limited/15 text-lot-limited'
                    : 'bg-lot-available/15 text-lot-available'
                }`}
              >
                {activeCarpark.lotStatus === 'full' ? 'FULL' : `${activeCarpark.lots} Lots`}
              </div>
            </div>

            {/* Price Preview */}
            <div className="flex items-center justify-between text-[12px] bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container">
              <span className="text-secondary font-medium">1st Hour Daytime:</span>
              <span className="font-mono font-bold text-on-surface">
                {activeCarpark.rates[0]?.firstRate || '$2.50'}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectCarpark(activeCarpark)}
                className="flex-1 h-9 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-headline font-semibold text-[12px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>Full Schedule</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate(activeCarpark)}
                className="flex-1 h-9 rounded-lg bg-primary hover:bg-primary-hover text-white font-headline font-semibold text-[12px] shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">navigation</span>
                <span>Navigate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
