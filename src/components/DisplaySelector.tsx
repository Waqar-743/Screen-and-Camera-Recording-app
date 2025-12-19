import { useEffect, useMemo, useState } from "react";
import { tauriService } from "../services/tauri.service";
import type { DisplayInfo } from "../types";
import { SelectDropdown } from "./SelectDropdown";

type Props = {
  onDisplayChange: (displayIndex: number) => void;
  selectedDisplay: number;
  screenEnabled: boolean;
  onScreenToggle: (enabled: boolean) => void;
};

export function DisplaySelector({
  onDisplayChange,
  selectedDisplay,
  screenEnabled,
  onScreenToggle,
}: Props) {
  const [displays, setDisplays] = useState<DisplayInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await tauriService.getDisplays();
        if (cancelled) return;
        setDisplays(list);
      } catch (e) {
        if (cancelled) return;
        setError(String(e));
        setDisplays([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const options = useMemo(
    () =>
      displays.map((d) => ({
        value: String(d.index),
        label: `${d.name} - ${d.width}x${d.height}`,
      })),
    [displays],
  );

  return (
    <section className="rf-card">
      <div className="rf-card-title">Display/Window Selection</div>

      <label className="rf-toggle">
        <input
          type="checkbox"
          checked={screenEnabled}
          onChange={(e) => onScreenToggle(e.currentTarget.checked)}
        />
        <span>Record Screen</span>
      </label>

      <SelectDropdown
        label="Select Display"
        value={options.length === 0 ? "" : String(selectedDisplay)}
        options={options}
        disabled={!screenEnabled || loading || options.length === 0}
        placeholder={loading ? "Loading..." : "Select Display"}
        onChange={(v) => onDisplayChange(Number(v))}
      />

      {error ? <div className="rf-error">{error}</div> : null}
      {!error && !loading && displays.length === 0 ? (
        <div className="rf-hint">No displays found.</div>
      ) : null}
    </section>
  );
}
