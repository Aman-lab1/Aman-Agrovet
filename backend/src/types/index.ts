export type UserRole = 'owner' | 'manager';

export interface HealthCheckResponse {
  status: 'ok';
  service: string;
  environment: string;
  timestamp: string;
}
