export type UserRole = 'owner' | 'manager';

export interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface HealthCheckResponse {
  status: 'ok';
  service: string;
  environment: string;
  timestamp: string;
}

export interface House {
  id: number;
  houseCode: string;
  houseName: string;
  primarySupervisorName: string | null;
  isActive: boolean;
  notes: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface FlockBatch {
  id: number;
  houseId: number;
  houseCode: string;
  houseName: string;
  primarySupervisorName: string | null;
  batchCode: string;
  placementDate: string;
  startingAgeWeeks: number;
  initialFemales: number;
  initialMales: number;
  status: 'active' | 'depleted' | 'closed';
  closedDate: string | null;
  notes: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: number;
  employeeCode: string;
  fullName: string;
  phone: string | null;
  designation: string;
  assignedHouseId: number | null;
  assignedHouseName: string | null;
  joiningDate: string;
  monthlySalary: string;
  status: 'active' | 'inactive';
  deactivatedAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppUser {
  id: number;
  username: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: number;
  actorUserId: number;
  actorUsername: string;
  actorName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VOID' | 'REVERSE' | 'DEACTIVATE';
  entityType: string;
  entityId: number;
  summaryText: string;
  previousValues: Record<string, unknown> | null;
  updatedValues: Record<string, unknown> | null;
  reason: string | null;
  createdAt: string;
}
