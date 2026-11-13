export interface WifiPassword {
  day: number;
  password: string;
}

export const WIFI_SSID = 'Teman Kenangan';

export const WIFI_PASSWORDS: Record<number, string> = {
  1: 'NgopiSantuy#01',
  2: 'KopiPenyemangat@02',
  3: 'SemangatBaru03',
  4: 'HariCeria=04',
  5: 'KopiTemanSetia!05',
  6: 'NgopiSeru#06',
  7: 'KopiTemanPagi@07',
  8: 'KopiPenutupSore08',
  9: 'SegarnyaKopi=09',
  10: 'NgopiBarengYuk!10',
  11: 'KenanganIndah#11',
  12: 'KopiJodohSejati@12',
  13: 'HangatnyaKopi13',
  14: 'PagiSemangat=14',
  15: 'NgopiDuluGaes!15',
  16: 'KopiPenyelamat#16',
  17: 'RasaKangen@17',
  18: 'SecangkirRindu18',
  19: 'KopiTanpaBatas=19',
  20: 'NgopiSambilKerja!20',
  21: 'KenanganManis#21',
  22: 'KopiTemanCurhat@22',
  23: 'BahagiaItuSederhana23',
  24: 'NgopiPenuhCinta=24',
  25: 'KopiRasaCinta!25',
  26: 'SemangatPejuang#26',
  27: 'KopiBikinSemangat@27',
  28: 'PagiPenuhSyukur28',
  29: 'KenanganTakTelupa=29',
  30: 'KopiSelaluSetia!30',
  31: 'NgopiSampaiPuas#31',
};

export const MONTH_NAMES_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const DAY_NAMES_ID = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

// WIB Timezone helper (UTC + 7)
export function getWIBDate(): {
  date: Date;
  day: number;
  month: number;
  year: number;
  dayName: string;
  monthName: string;
  formattedFull: string;
} {
  const now = new Date();
  // Offset to UTC+7 (Jakarta)
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const wib = new Date(utc + 3600000 * 7);

  const day = wib.getDate();
  const month = wib.getMonth();
  const year = wib.getFullYear();
  const dayName = DAY_NAMES_ID[wib.getDay()];
  const monthName = MONTH_NAMES_ID[month];

  return {
    date: wib,
    day,
    month,
    year,
    dayName,
    monthName,
    formattedFull: `${dayName}, ${day} ${monthName} ${year}`,
  };
}

