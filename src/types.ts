export type VehicleType = 'cars' | 'bikes' | 'heavy';
export type TabType = 'carparks' | 'nearby-map' | 'erp-rates' | 'saved' | 'talk-to-us';
export type LotStatus = 'available' | 'limited' | 'full';

export interface RateItem {
  period: string;
  firstRate: string;
  firstRateUnit: string;
  subsequentRate: string;
  subsequentRateUnit: string;
  isActiveNow?: boolean;
}

export interface Carpark {
  id: string;
  name: string;
  category: 'mall' | 'shopping' | 'value' | 'hotel' | 'commercial';
  distance: string;
  distanceKm: number;
  address: string;
  zone: string;
  lots: number;
  totalLots: number;
  lotStatus: LotStatus;
  maxHeight: string;
  gracePeriod: string;
  hasGraceHighlight?: boolean;
  evChargers?: string;
  autoPassReady?: boolean;
  highTraffic?: boolean;
  baseRateNum: number; // For sorting by price
  rates: RateItem[];
  fullSchedule: {
    weekdayDay: string;
    weekdayNight: string;
    saturday: string;
    sundayPH: string;
    motorcycleRate: string;
    heavyRate?: string;
    operator: string;
    seasonParking?: string;
    specialTerms?: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ERPGantry {
  id: string;
  zone: string;
  name: string;
  road: string;
  currentRate: number;
  peakRate: number;
  status: 'active' | 'scheduled' | 'inactive';
  activeHours: string;
  nextChargeTime: string;
  nextRate: number;
  vehicleTypeRates: {
    cars: number;
    bikes: number;
    heavy: number;
  };
}

export interface FilterState {
  search: string;
  zone: string;
  vehicle: VehicleType;
  sortBy: 'rate' | 'distance' | 'lots' | 'grace';
  onlyAvailable: boolean;
  evOnly: boolean;
  minGracePeriod: boolean;
  maxHeightFilter: string;
}
