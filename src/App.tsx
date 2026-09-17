/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CARPARKS } from './data/mockData';
import { Carpark, VehicleType, TabType, FilterState } from './types';
import { Header } from './components/Header';
import { SubHeader } from './components/SubHeader';
import { TelemetryBanner } from './components/TelemetryBanner';
import { CarparkCard } from './components/CarparkCard';
import { ErpAlertBanner } from './components/ErpAlertBanner';
import { BottomNav } from './components/BottomNav';
import { FullScheduleModal } from './components/FullScheduleModal';
import { FilterModal } from './components/FilterModal';
import { TimeSimulatorModal } from './components/TimeSimulatorModal';
import { AlternativesModal } from './components/AlternativesModal';
import { NavigationModal } from './components/NavigationModal';
import { ProfileModal } from './components/ProfileModal';
import { MapView } from './components/MapView';
import { ErpRatesView } from './components/ErpRatesView';
import { SavedView } from './components/SavedView';

export default function App() {
  const [carparksData, setCarparksData] = useState<Carpark[]>(CARPARKS);
  const [searchQuery, setSearchQuery] = useState<string>('Orchard');
  const [selectedZone, setSelectedZone] = useState<string>('Orchard / Somerset');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('cars');
  const [activeTab, setActiveTab] = useState<TabType>('carparks');
  const [simulatedTimeLabel, setSimulatedTimeLabel] = useState<string>('Now 2:30 PM');

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    zone: 'Orchard / Somerset',
    vehicle: 'cars',
    sortBy: 'rate',
    onlyAvailable: false,
    evOnly: false,
    minGracePeriod: false,
    maxHeightFilter: 'Any',
  });

  // Saved carparks persistence
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sgcarmart_saved_carparks');
      return stored ? JSON.parse(stored) : ['ion-orchard', 'plaza-singapura'];
    } catch {
      return ['ion-orchard', 'plaza-singapura'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sgcarmart_saved_carparks', JSON.stringify(savedIds));
    } catch {
      // Ignore storage errors
    }
  }, [savedIds]);

  // Modal states
  const [scheduleModalCarpark, setScheduleModalCarpark] = useState<Carpark | null>(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [timeSimulatorModalOpen, setTimeSimulatorModalOpen] = useState(false);
  const [navigationModalCarpark, setNavigationModalCarpark] = useState<Carpark | null>(null);
  const [alternativesModalCarpark, setAlternativesModalCarpark] = useState<Carpark | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      const carpark = carparksData.find((c) => c.id === id);
      const name = carpark ? carpark.name : 'Carpark';
      showToast(exists ? `Removed ${name} from Saved` : `Saved ${name} to Bookmarks`);
      return updated;
    });
  };

  // Real-time lot data sync simulation
  const handleRefreshData = () => {
    setCarparksData((prev) =>
      prev.map((item) => {
        if (item.lotStatus === 'full') return item;
        const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4
        const newLots = Math.max(2, Math.min(item.totalLots, item.lots + delta));
        return {
          ...item,
          lots: newLots,
          lotStatus: newLots < 50 ? 'limited' : 'available',
        };
      })
    );
    showToast('Updated live lots via LTA Datamall sync');
  };

  // Cycle through sorting options on the telemetry banner
  const handleCycleSort = () => {
    const sortCycle: FilterState['sortBy'][] = ['rate', 'distance', 'lots', 'grace'];
    const currentIndex = sortCycle.indexOf(filters.sortBy);
    const nextSort = sortCycle[(currentIndex + 1) % sortCycle.length];
    setFilters((prev) => ({ ...prev, sortBy: nextSort }));
    showToast(`Sorted by: ${nextSort.toUpperCase()}`);
  };

  // Filtered and sorted carparks
  const filteredCarparks = useMemo(() => {
    return carparksData
      .filter((carpark) => {
        // Zone filter
        if (selectedZone !== 'All SG') {
          if (carpark.zone !== selectedZone) {
            // Also permit if searched specifically
            if (
              !searchQuery ||
              !carpark.name.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              return false;
            }
          }
        }

        // Search text filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = carpark.name.toLowerCase().includes(q);
          const matchesAddress = carpark.address.toLowerCase().includes(q);
          const matchesZone = carpark.zone.toLowerCase().includes(q);
          if (!matchesName && !matchesAddress && !matchesZone) {
            return false;
          }
        }

        // Feature toggles
        if (filters.onlyAvailable && carpark.lotStatus === 'full') {
          return false;
        }

        if (filters.evOnly && !carpark.evChargers) {
          return false;
        }

        if (filters.minGracePeriod && !carpark.gracePeriod.includes('15m')) {
          return false;
        }

        if (filters.maxHeightFilter !== 'Any') {
          const heightThreshold = parseFloat(filters.maxHeightFilter);
          const carparkHeight = parseFloat(carpark.maxHeight.replace(/[^0-9.]/g, ''));
          if (carparkHeight < heightThreshold) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'rate') {
          return a.baseRateNum - b.baseRateNum;
        }
        if (filters.sortBy === 'distance') {
          return a.distanceKm - b.distanceKm;
        }
        if (filters.sortBy === 'lots') {
          return b.lots - a.lots;
        }
        if (filters.sortBy === 'grace') {
          const aGrace = a.gracePeriod.includes('15m') ? 15 : 10;
          const bGrace = b.gracePeriod.includes('15m') ? 15 : 10;
          return bGrace - aGrace;
        }
        return 0;
      });
  }, [carparksData, selectedZone, searchQuery, filters]);

  // Saved carparks objects
  const savedCarparks = useMemo(() => {
    return carparksData.filter((c) => savedIds.includes(c.id));
  }, [carparksData, savedIds]);

  // Alternatives for full carpark
  const getAlternativeCarparks = (fullCarpark: Carpark) => {
    return carparksData.filter(
      (c) => c.id !== fullCarpark.id && c.lotStatus !== 'full' && c.zone === fullCarpark.zone
    );
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface flex flex-col selection:bg-primary/20">
      {/* Fixed Header */}
      <Header
        onOpenSaved={() => setActiveTab('saved')}
        onFocusSearch={() => {
          setActiveTab('carparks');
          setTimeout(() => searchInputRef.current?.focus(), 100);
        }}
        onOpenProfile={() => setProfileModalOpen(true)}
        savedCount={savedIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pt-14 pb-20 bg-surface">
        {activeTab === 'carparks' && (
          <>
            {/* Interactive Sticky Sub-Header */}
            <SubHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedZone={selectedZone}
              onZoneSelect={(zone) => {
                setSelectedZone(zone);
                // Clear search if selecting specific zone for cleaner listing
                if (zone !== 'All SG') {
                  setSearchQuery('');
                }
              }}
              selectedVehicle={selectedVehicle}
              onVehicleSelect={setSelectedVehicle}
              onOpenFilter={() => setFilterModalOpen(true)}
              onOpenTimeSimulator={() => setTimeSimulatorModalOpen(true)}
              simulatedTimeLabel={simulatedTimeLabel}
              searchInputRef={searchInputRef}
            />

            {/* Live Telemetry Status Banner */}
            <TelemetryBanner
              count={filteredCarparks.length}
              zone={selectedZone}
              sortBy={filters.sortBy}
              onCycleSort={handleCycleSort}
              onRefreshData={handleRefreshData}
            />

            {/* Carpark Cards Section */}
            <section className="max-w-2xl mx-auto w-full px-4 flex flex-col gap-3 pt-1">
              {filteredCarparks.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border border-surface-container my-4 space-y-2">
                  <span className="material-symbols-outlined text-[32px] text-secondary">
                    search_off
                  </span>
                  <h3 className="font-headline font-semibold text-[16px] text-on-surface">
                    No Carparks Match Your Filters
                  </h3>
                  <p className="text-[12px] text-secondary max-w-xs mx-auto">
                    Try clearing search criteria or resetting filters to view all Singapore
                    carparks.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedZone('Orchard / Somerset');
                      setFilters({
                        search: '',
                        zone: 'Orchard / Somerset',
                        vehicle: 'cars',
                        sortBy: 'rate',
                        onlyAvailable: false,
                        evOnly: false,
                        minGracePeriod: false,
                        maxHeightFilter: 'Any',
                      });
                    }}
                    className="mt-2 px-4 py-2 rounded-lg bg-surface-container text-primary font-headline font-semibold text-[12px] hover:bg-surface-container-high transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredCarparks.map((carpark) => (
                  <CarparkCard
                    key={carpark.id}
                    carpark={carpark}
                    vehicle={selectedVehicle}
                    isSaved={savedIds.includes(carpark.id)}
                    onToggleSave={handleToggleSave}
                    onOpenSchedule={(cp) => setScheduleModalCarpark(cp)}
                    onNavigate={(cp) => setNavigationModalCarpark(cp)}
                    onFindAlternatives={(cp) => setAlternativesModalCarpark(cp)}
                  />
                ))
              )}
            </section>

            {/* Singapore Road Utility Notice & ERP Gantry Banner */}
            <ErpAlertBanner onViewErpDetails={() => setActiveTab('erp-rates')} />
          </>
        )}

        {activeTab === 'nearby-map' && (
          <MapView
            carparks={filteredCarparks}
            selectedZone={selectedZone}
            onSelectCarpark={(cp) => setScheduleModalCarpark(cp)}
            onNavigate={(cp) => setNavigationModalCarpark(cp)}
          />
        )}

        {activeTab === 'erp-rates' && (
          <ErpRatesView vehicle={selectedVehicle} onVehicleChange={setSelectedVehicle} />
        )}

        {activeTab === 'saved' && (
          <SavedView
            savedCarparks={savedCarparks}
            vehicle={selectedVehicle}
            onToggleSave={handleToggleSave}
            onOpenSchedule={(cp) => setScheduleModalCarpark(cp)}
            onNavigate={(cp) => setNavigationModalCarpark(cp)}
            onFindAlternatives={(cp) => setAlternativesModalCarpark(cp)}
            onExploreMore={() => {
              setActiveTab('carparks');
              setSelectedZone('Orchard / Somerset');
            }}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={savedIds.length}
      />

      {/* Modals & Dialogs */}
      <FullScheduleModal
        carpark={scheduleModalCarpark}
        onClose={() => setScheduleModalCarpark(null)}
        onNavigate={(cp) => {
          setScheduleModalCarpark(null);
          setNavigationModalCarpark(cp);
        }}
      />

      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={filters}
        onUpdateFilters={(newVals) => setFilters((prev) => ({ ...prev, ...newVals }))}
        onResetFilters={() => {
          setFilters({
            search: '',
            zone: selectedZone,
            vehicle: selectedVehicle,
            sortBy: 'rate',
            onlyAvailable: false,
            evOnly: false,
            minGracePeriod: false,
            maxHeightFilter: 'Any',
          });
          showToast('Filters reset to default');
        }}
      />

      <TimeSimulatorModal
        isOpen={timeSimulatorModalOpen}
        onClose={() => setTimeSimulatorModalOpen(false)}
        currentTimeLabel={simulatedTimeLabel}
        onSelectTime={(label) => {
          setSimulatedTimeLabel(label);
          showToast(`Simulating tariff for: ${label}`);
        }}
      />

      <AlternativesModal
        sourceCarpark={alternativesModalCarpark}
        alternatives={
          alternativesModalCarpark ? getAlternativeCarparks(alternativesModalCarpark) : []
        }
        onClose={() => setAlternativesModalCarpark(null)}
        onSelectAlternative={(alt) => {
          setAlternativesModalCarpark(null);
          setNavigationModalCarpark(alt);
        }}
      />

      <NavigationModal
        carpark={navigationModalCarpark}
        onClose={() => setNavigationModalCarpark(null)}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        selectedVehicle={selectedVehicle}
        onVehicleChange={setSelectedVehicle}
      />

      {/* Floating Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-[12px] font-medium px-4 py-2 rounded-full shadow-lg backdrop-blur-md animate-in fade-in duration-150 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-lot-available">check</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
