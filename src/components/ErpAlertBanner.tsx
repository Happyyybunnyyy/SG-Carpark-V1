import React from 'react';

interface ErpAlertBannerProps {
  onViewErpDetails: () => void;
}

export const ErpAlertBanner: React.FC<ErpAlertBannerProps> = ({ onViewErpDetails }) => {
  return (
    <section className="max-w-2xl mx-auto px-4 pt-3 pb-6">
      <div
        role="button"
        tabIndex={0}
        onClick={onViewErpDetails}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onViewErpDetails();
        }}
        className="bg-white border border-erp-active/20 hover:border-erp-active/40 rounded-xl p-3.5 shadow-xs flex items-start gap-3 cursor-pointer transition-all hover:shadow-sm group text-left"
      >
        <div className="w-9 h-9 rounded-lg bg-erp-active/10 text-erp-active flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <span className="material-symbols-outlined text-[20px]">toll</span>
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-headline font-semibold text-[11px] text-erp-active uppercase tracking-wider">
              Live ERP Gantry Alert
            </span>
            <span className="text-[10px] bg-erp-active/10 text-erp-active font-mono px-1.5 py-0.5 rounded font-medium">
              Zone 1
            </span>
          </div>

          <p className="font-sans text-[12px] text-on-surface mt-0.5 leading-relaxed">
            Orchard Road gantries will turn active starting at{' '}
            <strong className="font-semibold">5:30 PM</strong>. Rates between{' '}
            <span className="font-mono font-semibold text-erp-active">$1.00 - $2.00</span> apply for
            passenger cars.
          </p>
        </div>

        <span className="material-symbols-outlined text-secondary text-[18px] self-center shrink-0 group-hover:translate-x-0.5 transition-transform">
          chevron_right
        </span>
      </div>
    </section>
  );
};
