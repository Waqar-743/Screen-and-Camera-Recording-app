import { useCallback, useEffect, useState } from "react";
import { tauriService } from "../services/tauri.service";
import type { RecordingSettings } from "../types";

type UseSettingsResult = {
  settings: RecordingSettings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (patch: Partial<RecordingSettings>) => Promise<void>;
  replaceSettings: (next: RecordingSettings) => Promise<void>;
};

export function useSettings(): UseSettingsResult {
  const [settings, setSettings] = useState<RecordingSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const s = await tauriService.getSettings();
        if (!cancelled) setSettings(s);
      } catch (e) {
        if (!cancelled) setError(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const replaceSettings = useCallback(async (next: RecordingSettings) => {
    setSettings(next);
    await tauriService.updateSettings(next);
  }, []);

  const updateSettings = useCallback(
    async (patch: Partial<RecordingSettings>) => {
      if (!settings) return;
      const next = { ...settings, ...patch };
      await replaceSettings(next);
    },
    [replaceSettings, settings],
  );

  return { settings, loading, error, updateSettings, replaceSettings };
}
