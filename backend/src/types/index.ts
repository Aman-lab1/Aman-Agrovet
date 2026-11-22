export type UserRole = 'owner' | 'manager';

export interface AuthUserProfile {
  id: number;
  username: string;
  fullName: string;
  role: UserRole;
}

export interface HealthCheckResponse {
  status: 'ok';
  service: string;
  environment: string;
  timestamp: string;
}
