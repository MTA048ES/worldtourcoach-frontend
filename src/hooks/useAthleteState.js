import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../utils/constants';

const FETCH_TIMEOUT = 15000; // 15 segundos

const fetchWithTimeout = async (url, timeout = FETCH_TIMEOUT) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

export const useAthleteState = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithTimeout(`${API_URL}/api/estado`);
      if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('La solicitud tardó demasiado. Intenta de nuevo.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};