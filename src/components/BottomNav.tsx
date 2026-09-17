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
    <nav
      role="navigation"
      aria-label="Main application tabs"
      className="fixed bottom-0 w-full z-50 pb-safe bg-white/95 backdrop-blur-xl border-t border-surface-container shadow-[0_-2px_12px_rgba(0,0,0,0.05)]"
    >
      <div className="max-w-2xl mx-auto flex items-center justify-around h-16 px-2">
        {/* Carparks Tab */}
        <button
          type="button"
          aria-current={activeTab === 'carparks' ? 'page' : undefined}
          onClick={() => onTabChange('carparks')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 h-full min-h-[44px] transition-colors relative focus:outline-none focus:ring-1 focus:ring-primary ${
            activeTab === 'carparks'
              ? 'text-primary font-bold'
              : 'text-secondary hover:text-on-surface font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">local_parking</span>
          <span className="font-sans text-[11px] tracking-tight">Carparks</span>
          {activeTab === 'carparks' && (
            <span className="absolute bottom-1 w-8 h-1 rounded-full bg-primary" />
          )}
        </button>

        {/* Nearby Map Tab */}
        <button
          type="button"
          aria-current={activeTab === 'nearby-map' ? 'page' : undefined}
          onClick={() => onTabChange('nearby-map')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 h-full min-h-[44px] transition-colors relative focus:outline-none focus:ring-1 focus:ring-primary ${
            activeTab === 'nearby-map'
              ? 'text-primary font-bold'
              : 'text-secondary hover:text-on-surface font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">map</span>
          <span className="font-sans text-[11px] tracking-tight">Nearby Map</span>
          {activeTab === 'nearby-map' && (
            <span className="absolute bottom-1 w-8 h-1 rounded-full bg-primary" />
          )}
        </button>

        {/* ERP Rates Tab */}
        <button
          type="button"
          aria-current={activeTab === 'erp-rates' ? 'page' : undefined}
          onClick={() => onTabChange('erp-rates')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 h-full min-h-[44px] transition-colors relative focus:outline-none focus:ring-1 focus:ring-primary ${
            activeTab === 'erp-rates'
              ? 'text-primary font-bold'
              : 'text-secondary hover:text-on-surface font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">toll</span>
          <span className="font-sans text-[11px] tracking-tight">ERP Rates</span>
          {activeTab === 'erp-rates' && (
            <span className="absolute bottom-1 w-8 h-1 rounded-full bg-primary" />
          )}
        </button>

        {/* Saved Tab */}
        <button
          type="button"
          aria-current={activeTab === 'saved' ? 'page' : undefined}
          onClick={() => onTabChange('saved')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 h-full min-h-[44px] transition-colors relative focus:outline-none focus:ring-1 focus:ring-primary ${
            activeTab === 'saved'
              ? 'text-primary font-bold'
              : 'text-secondary hover:text-on-surface font-medium'
          }`}
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[24px]">bookmark</span>
            {savedCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </div>
          <span className="font-sans text-[11px] tracking-tight">Saved</span>
          {activeTab === 'saved' && (
            <span className="absolute bottom-1 w-8 h-1 rounded-full bg-primary" />
          )}
        </button>
      </div>
    </nav>
  );
};
