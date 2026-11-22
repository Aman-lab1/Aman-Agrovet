import { useCallback, useEffect, useState } from 'react';
import { fetchHealthCheck } from '../services/apiClient';
import type { HealthCheckResponse } from '../types';

interface HealthState {
  loading: boolean;
  data: HealthCheckResponse | null;
  error: string | null;
  refresh: () => void;
}

export function useHealthCheck(): HealthState {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HealthCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchHealthCheck();
      setData(result);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : 'Unable to reach API');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void check();
  }, [check]);

  return { loading, data, error, refresh: check };
}
