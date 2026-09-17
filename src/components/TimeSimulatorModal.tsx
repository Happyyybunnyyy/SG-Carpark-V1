import React, { useState, useEffect } from 'react';

interface TimeSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTimeLabel: string;
  currentDurationHours: number;
  onSelectTime: (
    label: string,
    periodType: 'day' | 'evening' | 'weekend',
    durationHours: number
  ) => void;
}

export const TimeSimulatorModal: React.FC<TimeSimulatorModalProps> = ({
  isOpen,
  onClose,
  currentTimeLabel,
  currentDurationHours,
  onSelectTime,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>(currentTimeLabel);
  const [parkingDurationHours, setParkingDurationHours] = useState<number>(currentDurationHours || 2);

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

  const presets = [
    { label: 'Now 2:30 PM', sub: 'Mon–Fri Daytime (Hourly charge)', type: 'day' as const },
    { label: 'Today 6:00 PM', sub: 'Mon–Fri Evening Entry (Flat / Per Entry rates)', type: 'evening' as const },
    { label: 'Today 8:30 PM', sub: 'Late Dinner & Movies (Per Entry flat rate)', type: 'evening' as const },
    { label: 'Saturday 2:00 PM', sub: 'Weekend Peak Shopping', type: 'weekend' as const },
    { label: 'Sunday 11:30 AM', sub: 'Weekend Family Brunch', type: 'weekend' as const },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="time-simulator-modal-title"
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
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
            </div>
            <div>
              <h3
                id="time-simulator-modal-title"
                className="font-headline font-bold text-[18px] text-on-surface"
              >
                Time & Fee Simulator
              </h3>
              <p className="text-[12px] text-secondary">
                Calculate parking cost for planned arrival & stay
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close time simulator"
            className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto no-scrollbar">
          <div>
            <label className="block text-[11px] uppercase font-bold text-secondary tracking-wider mb-2">
              Arrival Time Window
            </label>
            <div className="space-y-2">
              {presets.map((preset) => {
                const isSelected = selectedPreset === preset.label;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setSelectedPreset(preset.label)}
                    className={`min-h-[50px] w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                        : 'border-surface-container bg-white text-secondary hover:text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <div>
                      <span className="font-mono text-[14px] font-bold block text-on-surface">
                        {preset.label}
                      </span>
                      <span className="text-[12px] text-secondary font-normal">{preset.sub}</span>
                    </div>
                    {isSelected && (
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        check_circle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Parking Duration Selector */}
          <div className="pt-3 border-t border-surface-container">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] uppercase font-bold text-secondary tracking-wider">
                Planned Parking Duration
              </label>
              <span className="font-mono text-[14px] font-bold text-primary">
                {parkingDurationHours} {parkingDurationHours === 1 ? 'Hour' : 'Hours'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setParkingDurationHours(hrs)}
                  className={`min-h-[44px] rounded-xl border text-center text-[13px] font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                    parkingDurationHours === hrs
                      ? 'border-primary bg-primary text-white shadow-xs'
                      : 'border-surface-container bg-white text-secondary hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  {hrs} {hrs === 1 ? 'hr' : 'hrs'}
                </button>
              ))}
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-surface-container-low text-[12px] text-secondary flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">
                calculate
              </span>
              <span>
                Cards will dynamically display estimated cost for a <strong>{parkingDurationHours}-hour</strong> visit at <strong>{selectedPreset}</strong>.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-container bg-surface-container-low/40 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 h-11 rounded-xl bg-white border border-surface-container text-secondary hover:text-on-surface font-headline font-semibold text-[13px] transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              const preset = presets.find((p) => p.label === selectedPreset) || presets[0];
              onSelectTime(preset.label, preset.type, parkingDurationHours);
              onClose();
            }}
            className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-hover text-white font-headline font-semibold text-[13px] shadow-xs transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <span>Apply Simulation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
