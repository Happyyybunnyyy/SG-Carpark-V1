import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    disqus_config?: () => void;
    DISQUS?: {
      reset: (params: { reload: boolean; config?: () => void }) => void;
    };
  }
}

interface TalkToUsViewProps {
  onBackToCarparks: () => void;
}

// Fixed canonical URL and unique identifier for Disqus
const PAGE_URL = 'https://sgcarmart-carpark.app/talk-to-us';
const PAGE_IDENTIFIER = 'sgcarmart-carpark-talk-to-us';
const PAGE_TITLE = 'Talk to Us - Community Discussions & Carpark Rates Feedback';
const DISQUS_SHORTNAME = 'bunny-carpark';

export const TalkToUsView: React.FC<TalkToUsViewProps> = ({ onBackToCarparks }) => {
  const [isLoadingDisqus, setIsLoadingDisqus] = useState(true);

  useEffect(() => {
    // Define the Disqus config with fixed real values
    const disqusConfig = function (this: any) {
      this.page.url = PAGE_URL;
      this.page.identifier = PAGE_IDENTIFIER;
      this.page.title = PAGE_TITLE;
    };

    window.disqus_config = disqusConfig;

    if (window.DISQUS) {
      // If Disqus has already been loaded in this SPA session, trigger reload
      try {
        window.DISQUS.reset({
          reload: true,
          config: disqusConfig,
        });
        setIsLoadingDisqus(false);
      } catch (err) {
        console.warn('Disqus reset failed, falling back:', err);
      }
    } else {
      // First load in session: check if script tag already exists
      let script = document.getElementById('disqus-embed-script') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = 'disqus-embed-script';
        script.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
        script.setAttribute('data-timestamp', String(+new Date()));
        script.async = true;
        script.onload = () => setIsLoadingDisqus(false);
        (document.head || document.body).appendChild(script);
      } else {
        const handleLoad = () => {
          if (window.DISQUS) {
            window.DISQUS.reset({
              reload: true,
              config: disqusConfig,
            });
          }
          setIsLoadingDisqus(false);
        };
        script.addEventListener('load', handleLoad);
        return () => {
          script?.removeEventListener('load', handleLoad);
        };
      }
    }

    // Safety timeout to hide spinner if network/embed is delayed
    const timer = setTimeout(() => {
      setIsLoadingDisqus(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="max-w-2xl mx-auto w-full px-4 pt-3 pb-8 space-y-4">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-surface-container shadow-2xs">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">forum</span>
            </div>
            <div>
              <h1 className="font-headline font-bold text-[18px] text-on-surface leading-snug">
                Talk to Us
              </h1>
              <p className="font-sans text-[12px] text-secondary">
                Community forum, rate corrections & driver tips
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToCarparks}
            className="h-9 px-3 bg-surface-container-low hover:bg-surface-container border border-surface-container text-on-surface text-[12px] font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Carparks</span>
          </button>
        </div>

        {/* Community Topics Quick Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
          <span className="bg-surface-container-low border border-surface-container text-secondary px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Live Community
          </span>
          <span className="bg-surface-container-low border border-surface-container text-secondary px-2.5 py-1 rounded-full">
            Report Rate Updates
          </span>
          <span className="bg-surface-container-low border border-surface-container text-secondary px-2.5 py-1 rounded-full">
            Suggest New Carpark
          </span>
          <span className="bg-surface-container-low border border-surface-container text-secondary px-2.5 py-1 rounded-full">
            ERP Feedback
          </span>
        </div>
      </div>

      {/* Discussion Board / Disqus Container */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-surface-container shadow-2xs min-h-[400px]">
        <div className="flex items-center justify-between border-b border-surface-container pb-3 mb-4">
          <div className="flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-primary text-[20px]">chat_bubble</span>
            <h2 className="font-headline font-semibold text-[15px]">Comments & Discussions</h2>
          </div>
          <span className="text-[11px] text-secondary">Powered by Disqus</span>
        </div>

        {/* Loading placeholder when initializing */}
        {isLoadingDisqus && (
          <div className="py-10 flex flex-col items-center justify-center text-secondary gap-2">
            <span className="material-symbols-outlined animate-spin text-[26px] text-primary">
              progress_activity
            </span>
            <p className="text-[13px] font-medium">Loading community comments...</p>
          </div>
        )}

        {/* Target div for Disqus Embed */}
        <div id="disqus_thread" className="w-full"></div>

        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" rel="noopener noreferrer" target="_blank">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </section>
  );
};
