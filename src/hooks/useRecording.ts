import { useCallback, useEffect, useMemo, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { tauriService } from "../services/tauri.service";
import { isTauriApp } from "../services/tauri.service";
import type { RecordingStatus } from "../types";

type UseRecordingResult = {
  status: RecordingStatus;
  loading: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  refresh: () => Promise<void>;
};

const defaultStatus: RecordingStatus = {
  is_recording: false,
  is_paused: false,
  output_file: null,
  elapsed_seconds: 0,
};

export function useRecording(): UseRecordingResult {
  const [status, setStatus] = useState<RecordingStatus>(defaultStatus);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const s = await tauriService.getRecordingStatus();
      setStatus(s);
    } catch (e) {
      setError(String(e));
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => {
      void refresh();
    }, 1000);
    return () => window.clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    if (!isTauriApp()) return;

    const unlisten = listen<RecordingStatus>("recording_status", (event) => {
      setStatus(event.payload);
    });

    return () => {
      void unlisten.then((fn) => fn());
    };
  }, []);

  const run = useCallback(async (fn: () => Promise<unknown>) => {
    setError(null);
    setLoading(true);
    try {
      await fn();
      await refresh();
    } catch (e) {
      setError(String(e));
      await refresh();
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const start = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await tauriService.startRecording();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
      await refresh();
    }
  }, [refresh]);

  const stop = useCallback(async () => {
    await run(async () => {
      await tauriService.stopRecording();
    });
  }, [run]);

  const pause = useCallback(async () => {
    await run(async () => {
      await tauriService.pauseRecording();
    });
  }, [run]);

  const resume = useCallback(async () => {
    await run(async () => {
      await tauriService.resumeRecording();
    });
  }, [run]);

  const result = useMemo(
    () => ({ status, loading, error, start, stop, pause, resume, refresh }),
    [error, loading, pause, refresh, resume, start, status, stop],
  );

  return result;
}
