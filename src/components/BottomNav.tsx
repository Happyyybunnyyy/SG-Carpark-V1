import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  savedCount,
}) => {
  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface-card/95 backdrop-blur-xl border-t border-surface-container shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-2xl mx-auto flex items-center justify-around h-16 px-2">
        {/* Carparks Tab */}
        <button
          type="button"
          onClick={() => onTabChange('carparks')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-12 transition-colors relative ${
            activeTab === 'carparks'
              ? 'text-primary font-semibold'
              : 'text-secondary hover:text-on-surface font-normal'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">directions_car</span>
          <span className="font-sans text-[11px] tracking-tight">Carparks</span>
          {activeTab === 'carparks' && (
            <span className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-primary" />
          )}
        </button>

        {/* Nearby Map Tab */}
        <button
          type="button"
          onClick={() => onTabChange('nearby-map')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-12 transition-colors relative ${
            activeTab === 'nearby-map'
              ? 'text-primary font-semibold'
              : 'text-secondary hover:text-on-surface font-normal'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">distance</span>
          <span className="font-sans text-[11px] tracking-tight">Nearby Map</span>
          {activeTab === 'nearby-map' && (
            <span className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-primary" />
          )}
        </button>

        {/* ERP Rates Tab */}
        <button
          type="button"
          onClick={() => onTabChange('erp-rates')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-12 transition-colors relative ${
            activeTab === 'erp-rates'
              ? 'text-primary font-semibold'
              : 'text-secondary hover:text-on-surface font-normal'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">toll</span>
          <span className="font-sans text-[11px] tracking-tight">ERP Rates</span>
          {activeTab === 'erp-rates' && (
            <span className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-primary" />
          )}
        </button>

        {/* Saved Tab */}
        <button
          type="button"
          onClick={() => onTabChange('saved')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-12 transition-colors relative ${
            activeTab === 'saved'
              ? 'text-primary font-semibold'
              : 'text-secondary hover:text-on-surface font-normal'
          }`}
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[22px]">favorite</span>
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </div>
          <span className="font-sans text-[11px] tracking-tight">Saved</span>
          {activeTab === 'saved' && (
            <span className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-primary" />
          )}
        </button>
      </div>
    </nav>
  );
};
