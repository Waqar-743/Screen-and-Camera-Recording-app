import { useCallback, useEffect, useMemo, useState } from "react";
import { tauriService } from "../services/tauri.service";
import type { TimerSession } from "../types";

type UseTimerHistoryResult = {
  sessions: TimerSession[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  clear: () => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export function useTimerHistory(): UseTimerHistoryResult {
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const h = await tauriService.getTimerHistory();
      setSessions(h);
    } catch (e) {
      setError(String(e));
    }
  }, []);

  const clear = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await tauriService.clearTimerHistory();
      await refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const remove = useCallback(
    async (id: string) => {
      setError(null);
      setLoading(true);
      try {
        const next = await tauriService.deleteTimerSession(id);
        setSessions(next);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return useMemo(
    () => ({ sessions, loading, error, refresh, clear, remove }),
    [clear, error, loading, refresh, remove, sessions],
  );
}
