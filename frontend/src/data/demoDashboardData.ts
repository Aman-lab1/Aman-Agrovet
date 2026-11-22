export type DateRangePreset = 'today' | 'last_7_days' | 'this_month' | 'cumulative';

export const DATE_RANGE_LABELS: Record<DateRangePreset, string> = {
  today: 'Today',
  last_7_days: 'Last 7 Days',
  this_month: 'This Month',
  cumulative: 'Cumulative',
};

export interface DemoHouseSupervisor {
  houseId: string;
  houseCode: string;
  houseName: string;
  supervisorName: string;
  supervisorUsername: string;
}

export const DEMO_HOUSE_SUPERVISORS: DemoHouseSupervisor[] = [
  {
    houseId: 'house-1',
    houseCode: 'H-01',
    houseName: 'House 1',
    supervisorName: 'Supervisor 1',
    supervisorUsername: 'supervisor1',
  },
  {
    houseId: 'house-2',
    houseCode: 'H-02',
    houseName: 'House 2',
    supervisorName: 'Supervisor 2',
    supervisorUsername: 'supervisor2',
  },
];

export interface DemoAppUserAccess {
  id: string;
  username: string;
  fullName: string;
  role: 'owner' | 'manager';
  isActive: boolean;
}

export const DEMO_APP_USERS: DemoAppUserAccess[] = [
  {
    id: 'u-1',
    username: 'aman',
    fullName: 'Aman Rajpura',
    role: 'owner',
    isActive: true,
  },
  {
    id: 'u-2',
    username: 'supervisor1',
    fullName: 'Supervisor 1',
    role: 'manager',
    isActive: true,
  },
  {
    id: 'u-3',
    username: 'supervisor2',
    fullName: 'Supervisor 2',
    role: 'manager',
    isActive: true,
  },
];

export interface DemoBatchSnapshot {
  id: string;
  houseId: string;
  houseName: string;
  primarySupervisor: string;
  batchCode: string;
  placementDate: string;
  startingAgeWeeks: number;
  initialFemales: number;
  initialMales: number;
  openingLiveFemales: number;
  openingLiveMales: number;
  periodFemaleDeaths: number;
  periodMaleDeaths: number;
  cumulativeFemaleDeaths: number;
  cumulativeMaleDeaths: number;
  hatchingEggs: number;
  commercialEggs: number;
  rejectEggs: number;
  feedBags: number;
  feedKg: number;
}

export interface DemoDashboardDataset {
  referenceDate: string;
  totalHouses: number;
  activeBatchesCount: number;
  attendance: {
    totalActiveStaff: number;
    present: number;
    halfDay: number;
    absent: number;
    leave: number;
  };
  financePaise: {
    expensesPaise: number;
    salariesPaise: number;
    paidPaise: number;
    outstandingPaise: number;
  };
  batches: DemoBatchSnapshot[];
}

export const DEMO_REFERENCE_DATE = '2026-11-22';

export const DEMO_DASHBOARD_BY_RANGE: Record<DateRangePreset, DemoDashboardDataset> = {
  today: {
    referenceDate: DEMO_REFERENCE_DATE,
    totalHouses: 2,
    activeBatchesCount: 2,
    attendance: {
      totalActiveStaff: 14,
      present: 12,
      halfDay: 1,
      absent: 0,
      leave: 1,
    },
    financePaise: {
      expensesPaise: 4850000,
      salariesPaise: 0,
      paidPaise: 3000000,
      outstandingPaise: 1850000,
    },
    batches: [
      {
        id: 'b-101',
        houseId: 'house-1',
        houseName: 'House 1',
        primarySupervisor: 'Supervisor 1',
        batchCode: 'B-2026-H1',
        placementDate: '2026-10-01',
        startingAgeWeeks: 20,
        initialFemales: 4200,
        initialMales: 430,
        openingLiveFemales: 4164,
        openingLiveMales: 424,
        periodFemaleDeaths: 3,
        periodMaleDeaths: 1,
        cumulativeFemaleDeaths: 39,
        cumulativeMaleDeaths: 7,
        hatchingEggs: 3180,
        commercialEggs: 195,
        rejectEggs: 48,
        feedBags: 14,
        feedKg: 62.5,
      },
      {
        id: 'b-102',
        houseId: 'house-2',
        houseName: 'House 2',
        primarySupervisor: 'Supervisor 2',
        batchCode: 'B-2026-H2',
        placementDate: '2026-09-10',
        startingAgeWeeks: 20,
        initialFemales: 3800,
        initialMales: 390,
        openingLiveFemales: 3728,
        openingLiveMales: 379,
        periodFemaleDeaths: 2,
        periodMaleDeaths: 0,
        cumulativeFemaleDeaths: 74,
        cumulativeMaleDeaths: 11,
        hatchingEggs: 2890,
        commercialEggs: 210,
        rejectEggs: 39,
        feedBags: 12,
        feedKg: 54.0,
      },
    ],
  },
  last_7_days: {
    referenceDate: DEMO_REFERENCE_DATE,
    totalHouses: 2,
    activeBatchesCount: 2,
    attendance: {
      totalActiveStaff: 14,
      present: 82,
      halfDay: 5,
      absent: 4,
      leave: 7,
    },
    financePaise: {
      expensesPaise: 24650000,
      salariesPaise: 0,
      paidPaise: 18500000,
      outstandingPaise: 6150000,
    },
    batches: [
      {
        id: 'b-101',
        houseId: 'house-1',
        houseName: 'House 1',
        primarySupervisor: 'Supervisor 1',
        batchCode: 'B-2026-H1',
        placementDate: '2026-10-01',
        startingAgeWeeks: 20,
        initialFemales: 4200,
        initialMales: 430,
        openingLiveFemales: 4178,
        openingLiveMales: 426,
        periodFemaleDeaths: 17,
        periodMaleDeaths: 3,
        cumulativeFemaleDeaths: 39,
        cumulativeMaleDeaths: 7,
        hatchingEggs: 22140,
        commercialEggs: 1380,
        rejectEggs: 312,
        feedBags: 98,
        feedKg: 435.0,
      },
      {
        id: 'b-102',
        houseId: 'house-2',
        houseName: 'House 2',
        primarySupervisor: 'Supervisor 2',
        batchCode: 'B-2026-H2',
        placementDate: '2026-09-10',
        startingAgeWeeks: 20,
        initialFemales: 3800,
        initialMales: 390,
        openingLiveFemales: 3741,
        openingLiveMales: 382,
        periodFemaleDeaths: 15,
        periodMaleDeaths: 3,
        cumulativeFemaleDeaths: 74,
        cumulativeMaleDeaths: 11,
        hatchingEggs: 20110,
        commercialEggs: 1425,
        rejectEggs: 268,
        feedBags: 84,
        feedKg: 378.5,
      },
    ],
  },
  this_month: {
    referenceDate: DEMO_REFERENCE_DATE,
    totalHouses: 2,
    activeBatchesCount: 2,
    attendance: {
      totalActiveStaff: 14,
      present: 262,
      halfDay: 14,
      absent: 16,
      leave: 16,
    },
    financePaise: {
      expensesPaise: 58420000,
      salariesPaise: 24800000,
      paidPaise: 69050000,
      outstandingPaise: 14170000,
    },
    batches: [
      {
        id: 'b-101',
        houseId: 'house-1',
        houseName: 'House 1',
        primarySupervisor: 'Supervisor 1',
        batchCode: 'B-2026-H1',
        placementDate: '2026-10-01',
        startingAgeWeeks: 20,
        initialFemales: 4200,
        initialMales: 430,
        openingLiveFemales: 4191,
        openingLiveMales: 428,
        periodFemaleDeaths: 30,
        periodMaleDeaths: 5,
        cumulativeFemaleDeaths: 39,
        cumulativeMaleDeaths: 7,
        hatchingEggs: 68420,
        commercialEggs: 4310,
        rejectEggs: 945,
        feedBags: 308,
        feedKg: 1365.0,
      },
      {
        id: 'b-102',
        houseId: 'house-2',
        houseName: 'House 2',
        primarySupervisor: 'Supervisor 2',
        batchCode: 'B-2026-H2',
        placementDate: '2026-09-10',
        startingAgeWeeks: 20,
        initialFemales: 3800,
        initialMales: 390,
        openingLiveFemales: 3765,
        openingLiveMales: 385,
        periodFemaleDeaths: 39,
        periodMaleDeaths: 6,
        cumulativeFemaleDeaths: 74,
        cumulativeMaleDeaths: 11,
        hatchingEggs: 62850,
        commercialEggs: 4480,
        rejectEggs: 820,
        feedBags: 264,
        feedKg: 1188.0,
      },
    ],
  },
  cumulative: {
    referenceDate: DEMO_REFERENCE_DATE,
    totalHouses: 2,
    activeBatchesCount: 2,
    attendance: {
      totalActiveStaff: 14,
      present: 1120,
      halfDay: 48,
      absent: 62,
      leave: 54,
    },
    financePaise: {
      expensesPaise: 194500000,
      salariesPaise: 94800000,
      paidPaise: 268400000,
      outstandingPaise: 20900000,
    },
    batches: [
      {
        id: 'b-101',
        houseId: 'house-1',
        houseName: 'House 1',
        primarySupervisor: 'Supervisor 1',
        batchCode: 'B-2026-H1',
        placementDate: '2026-10-01',
        startingAgeWeeks: 20,
        initialFemales: 4200,
        initialMales: 430,
        openingLiveFemales: 4200,
        openingLiveMales: 430,
        periodFemaleDeaths: 39,
        periodMaleDeaths: 7,
        cumulativeFemaleDeaths: 39,
        cumulativeMaleDeaths: 7,
        hatchingEggs: 162400,
        commercialEggs: 10120,
        rejectEggs: 2140,
        feedBags: 728,
        feedKg: 3224.0,
      },
      {
        id: 'b-102',
        houseId: 'house-2',
        houseName: 'House 2',
        primarySupervisor: 'Supervisor 2',
        batchCode: 'B-2026-H2',
        placementDate: '2026-09-10',
        startingAgeWeeks: 20,
        initialFemales: 3800,
        initialMales: 390,
        openingLiveFemales: 3800,
        openingLiveMales: 390,
        periodFemaleDeaths: 74,
        periodMaleDeaths: 11,
        cumulativeFemaleDeaths: 74,
        cumulativeMaleDeaths: 11,
        hatchingEggs: 214500,
        commercialEggs: 15280,
        rejectEggs: 2790,
        feedBags: 876,
        feedKg: 3942.0,
      },
    ],
  },
};
