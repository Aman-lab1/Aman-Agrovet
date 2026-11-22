import type {
  AppUser,
  AuditLogEntry,
  AuthUser,
  Employee,
  FlockBatch,
  HealthCheckResponse,
  House,
  LoginResponse,
  UserRole,
} from '../types';
import { frontendEnv } from '../utils/env';

const AUTH_TOKEN_KEY = 'aman_agrovet_auth_token';

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getStoredAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredAuthToken();
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${frontendEnv.apiBaseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body?.message) {
        message = body.message;
      }
    } catch {
      // Ignore non-JSON error body
    }
    throw new ApiError(response.status, message);
  }

  return (await response.json()) as T;
}

// Health & Auth
export function fetchHealthCheck(): Promise<HealthCheckResponse> {
  return apiRequest<HealthCheckResponse>('/health');
}

export function loginWithPasscode(username: string, passcode: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, passcode }),
  });
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const data = await apiRequest<{ user: AuthUser }>('/auth/me');
  return data.user;
}

// Houses
export async function fetchHouses(): Promise<House[]> {
  const data = await apiRequest<{ houses: House[] }>('/houses');
  return data.houses;
}

export async function createHouse(payload: {
  houseCode: string;
  houseName: string;
  primarySupervisorName?: string;
  notes?: string;
}): Promise<House> {
  const data = await apiRequest<{ house: House }>('/houses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.house;
}

export async function updateHouse(
  id: number,
  payload: {
    houseCode: string;
    houseName: string;
    primarySupervisorName?: string;
    notes?: string;
    isActive?: boolean;
    version: number;
    reason?: string;
  },
): Promise<House> {
  const data = await apiRequest<{ house: House }>(`/houses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return data.house;
}

export async function deactivateHouse(
  id: number,
  payload: { version: number; reason?: string },
): Promise<House> {
  const data = await apiRequest<{ house: House }>(`/houses/${id}/deactivate`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return data.house;
}

// Flock Batches
export async function fetchBatches(): Promise<FlockBatch[]> {
  const data = await apiRequest<{ batches: FlockBatch[] }>('/batches');
  return data.batches;
}

export async function createBatch(payload: {
  houseId: number;
  batchCode: string;
  placementDate: string;
  startingAgeWeeks: number;
  initialFemales: number;
  initialMales: number;
  notes?: string;
}): Promise<FlockBatch> {
  const data = await apiRequest<{ batch: FlockBatch }>('/batches', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.batch;
}

export async function closeBatch(
  id: number,
  payload: { version: number; closedDate?: string; reason?: string },
): Promise<FlockBatch> {
  const data = await apiRequest<{ batch: FlockBatch }>(`/batches/${id}/close`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return data.batch;
}

// Employees (Owner-Only)
export async function fetchEmployees(): Promise<Employee[]> {
  const data = await apiRequest<{ employees: Employee[] }>('/employees');
  return data.employees;
}

export async function createEmployee(payload: {
  employeeCode: string;
  fullName: string;
  phone?: string;
  designation: string;
  assignedHouseId: number | null;
  joiningDate: string;
  monthlySalary: number;
}): Promise<Employee> {
  const data = await apiRequest<{ employee: Employee }>('/employees', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.employee;
}

export async function updateEmployee(
  id: number,
  payload: {
    employeeCode: string;
    fullName: string;
    phone?: string;
    designation: string;
    assignedHouseId: number | null;
    joiningDate: string;
    monthlySalary: number;
    version: number;
    reason?: string;
  },
): Promise<Employee> {
  const data = await apiRequest<{ employee: Employee }>(`/employees/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return data.employee;
}

export async function deactivateEmployee(
  id: number,
  payload: { version: number; reason?: string },
): Promise<Employee> {
  const data = await apiRequest<{ employee: Employee }>(`/employees/${id}/deactivate`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return data.employee;
}

// App Users (Owner-Only)
export async function fetchUsers(): Promise<AppUser[]> {
  const data = await apiRequest<{ users: AppUser[] }>('/users');
  return data.users;
}

export async function createUser(payload: {
  username: string;
  fullName: string;
  passcode: string;
  role: UserRole;
}): Promise<AppUser> {
  const data = await apiRequest<{ user: AppUser }>('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.user;
}

export async function updateUser(
  id: number,
  payload: {
    fullName?: string;
    role?: UserRole;
    isActive?: boolean;
    passcode?: string;
    reason?: string;
  },
): Promise<AppUser> {
  const data = await apiRequest<{ user: AppUser }>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return data.user;
}

// Audit Logs (Owner-Only)
export async function fetchAuditLogs(params?: {
  entityType?: string;
  action?: string;
}): Promise<AuditLogEntry[]> {
  const query = new URLSearchParams();
  if (params?.entityType) query.set('entityType', params.entityType);
  if (params?.action) query.set('action', params.action);
  const qs = query.toString();
  const data = await apiRequest<{ auditLogs: AuditLogEntry[] }>(
    `/audit-logs${qs ? `?${qs}` : ''}`,
  );
  return data.auditLogs;
}
