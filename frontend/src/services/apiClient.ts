import type { HealthCheckResponse } from '../types';
import { frontendEnv } from '../utils/env';

export async function fetchHealthCheck(): Promise<HealthCheckResponse> {
  const response = await fetch(`${frontendEnv.apiBaseUrl}/health`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  return (await response.json()) as HealthCheckResponse;
}
