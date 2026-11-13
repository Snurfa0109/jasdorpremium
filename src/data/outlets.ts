import outletsData from './outlets_data.json';

export interface OutletItem {
  id: string;
  name: string;
  city: string;
  address: string;
  hours?: string;
}

export const KOPKEN_OUTLETS: OutletItem[] = outletsData.kopken;
export const TOMORO_OUTLETS: OutletItem[] = outletsData.tomoro;

export const POPULAR_CITIES = [
  'Semua',
  'Jakarta',
  'Bogor',
  'Depok',
  'Tangerang',
  'Bekasi',
  'Bandung',
  'Surabaya',
  'Semarang',
  'Yogyakarta',
  'Medan',
  'Bali',
];

