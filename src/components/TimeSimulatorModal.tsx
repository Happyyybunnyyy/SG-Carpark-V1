import React, { useState } from 'react';

interface TimeSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTimeLabel: string;
  onSelectTime: (label: string, periodType: 'day' | 'evening' | 'weekend') => void;
}

export const TimeSimulatorModal: React.FC<TimeSimulatorModalProps> = ({
  isOpen,
  onClose,
  currentTimeLabel,
  onSelectTime,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>(currentTimeLabel);
  const [parkingDurationHours, setParkingDurationHours] = useState<number>(2);

  if (!isOpen) return null;

  const presets = [
    { label: 'Now 2:30 PM', sub: 'Mon-Fri Daytime Peak', type: 'day' as const },
    { label: 'Today 6:00 PM', sub: 'Mon-Fri Evening Entry (Flat / Per Entry)', type: 'evening' as const },
    { label: 'Today 8:30 PM', sub: 'Late Night Dinner & Movies', type: 'evening' as const },
    { label: 'Saturday 2:00 PM', sub: 'Weekend Afternoon Shopping', type: 'weekend' as const },
    { label: 'Sunday 11:30 AM', sub: 'Weekend Family Brunch', type: 'weekend' as const },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-surface-container flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[20px]">schedule</span>
            <h3 className="font-headline font-bold text-[17px] text-on-surface">
              Time & Rate Simulator
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto no-scrollbar">
          <div>
            <label className="block text-[11px] uppercase font-bold text-secondary tracking-wider mb-2">
              Select Parking Scenario Time
            </label>
            <div className="space-y-2">
              {presets.map((preset) => {
                const isSelected = selectedPreset === preset.label;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setSelectedPreset(preset.label)}
                    className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-surface-container bg-surface-container-low text-secondary hover:text-on-surface'
                    }`}
                  >
                    <div>
                      <span className="font-mono text-[13px] font-bold block text-on-surface">
                        {preset.label}
                      </span>
                      <span className="text-[11px] text-secondary">{preset.sub}</span>
                    </div>
                    {isSelected && (
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        check_circle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Parking Duration Estimator */}
          <div className="pt-2 border-t border-surface-container">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] uppercase font-bold text-secondary tracking-wider">
                Planned Parking Duration
              </label>
              <span className="font-mono text-[13px] font-bold text-primary">
                {parkingDurationHours} Hours
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setParkingDurationHours(hrs)}
                  className={`py-1.5 rounded-lg border text-center text-[12px] font-semibold transition-all ${
                    parkingDurationHours === hrs
                      ? 'border-primary bg-primary text-white shadow-xs'
                      : 'border-surface-container bg-surface-container-low text-secondary hover:text-on-surface'
                  }`}
                >
                  {hrs} {hrs === 1 ? 'Hour' : 'Hours'}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-secondary mt-2">
              Simulating parking at {selectedPreset} for {parkingDurationHours} hours will highlight
              the applicable tariff window on cards.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-surface-container bg-surface-container-low/30 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const preset = presets.find((p) => p.label === selectedPreset) || presets[0];
              onSelectTime(preset.label, preset.type);
              onClose();
            }}
            className="w-full h-10 rounded-lg bg-primary hover:bg-primary-hover text-white font-headline font-semibold text-[13px] shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Apply Simulation Time</span>
          </button>
        </div>
      </div>
    </div>
  );
};
