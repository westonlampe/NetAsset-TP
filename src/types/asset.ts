export interface BasisAdjustment {
  section179: number;
  section168k: number;
  specialDepreciation: number;
  otherAdjustments: number;
  notes?: string;
}

export interface DepreciationSchedule {
  id: string;
  method: 'straight-line' | 'declining-balance' | 'sum-of-years-digits' | 'units-of-production';
  life: number; // in years
  salvageValue: number;
  convention: 'half-year' | 'mid-quarter' | 'mid-month' | 'full-month';
  type: 'GAAP' | 'Tax';
  taxCode?: string; // For tax depreciation schedules (e.g., MACRS class)
  depreciation?: number; // Annual depreciation amount
}

export interface DisposalInfo {
  date: Date;
  proceeds: number;
  reason: string;
  method: 'sale' | 'scrapped' | 'donated' | 'traded-in';
  notes?: string;
}

export interface Asset {
  id: string;
  name: string;
  description: string;
  acquisitionDate: Date;
  cost: number;
  location: string;
  department: string;
  serialNumber?: string;
  status: 'active' | 'disposed' | 'inactive';
  depreciationSchedules: DepreciationSchedule[];
  category: string;
  subCategory?: string;
  inServiceDate: Date;
  lastDepreciationDate?: Date;
  accumulatedDepreciation: number;
  netBookValue: number;
  disposalInfo?: DisposalInfo;
  basisAdjustments?: BasisAdjustment;
}