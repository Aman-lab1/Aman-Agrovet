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
