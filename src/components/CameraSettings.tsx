import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { tauriService } from "../services/tauri.service";
import type { CameraInfo, CameraPosition, CameraSize } from "../types";
import { SelectDropdown } from "./SelectDropdown";

type Props = {
  onCameraChange: (index: string) => void;
  onPositionChange: (position: CameraPosition) => void;
  onSizeChange: (size: CameraSize) => void;
  cameraEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  selectedCamera: string;
  selectedPosition: CameraPosition;
  selectedSize: CameraSize;
};

const positions: CameraPosition[] = [
  "TopLeft",
  "TopRight",
  "BottomLeft",
  "BottomRight",
];

const sizes: CameraSize[] = ["Small", "Medium", "Large"];

export function CameraSettings({
  onCameraChange,
  onPositionChange,
  onSizeChange,
  cameraEnabled,
  onToggle,
  selectedCamera,
  selectedPosition,
  selectedSize,
}: Props) {
  const [cameras, setCameras] = useState<CameraInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await tauriService.getCameras();
        if (!cancelled) setCameras(list);
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

  const cameraOptions = useMemo(
    () =>
      cameras.map((c) => ({
        value: String(c.index),
        label: c.width && c.height ? `${c.name} (${c.width}x${c.height})` : c.name,
      })),
    [cameras],
  );

  const positionOptions = useMemo(
    () => positions.map((p) => ({ value: p, label: p })),
    [],
  );
  const sizeOptions = useMemo(() => sizes.map((s) => ({ value: s, label: s })), []);

  const previewSizePct = selectedSize === "Small" ? 18 : selectedSize === "Medium" ? 28 : 38;
  const indicatorStyle: CSSProperties = {
    width: `${previewSizePct}%`,
    height: `${previewSizePct}%`,
  };

  return (
    <section className="rf-card">
      <div className="rf-card-title">Camera</div>

      <label className="rf-toggle">
        <input
          type="checkbox"
          checked={cameraEnabled}
          onChange={(e) => onToggle(e.currentTarget.checked)}
        />
        <span>Record Camera</span>
      </label>

      <SelectDropdown
        label="Select Camera"
        value={cameraOptions.length === 0 ? "" : selectedCamera}
        options={cameraOptions}
        disabled={!cameraEnabled || loading || cameraOptions.length === 0}
        placeholder={loading ? "Loading..." : "Select Camera"}
        onChange={onCameraChange}
      />

      <div className="rf-grid-2">
        <SelectDropdown
          label="Camera Position"
          value={selectedPosition}
          options={positionOptions}
          disabled={!cameraEnabled}
          onChange={(v) => onPositionChange(v as CameraPosition)}
        />
        <SelectDropdown
          label="Camera Size"
          value={selectedSize}
          options={sizeOptions}
          disabled={!cameraEnabled}
          onChange={(v) => onSizeChange(v as CameraSize)}
        />
      </div>

      <div className="rf-camera-preview" aria-label="Camera overlay preview">
        <div
          className={`rf-camera-indicator rf-pos-${selectedPosition}`}
          style={indicatorStyle}
        />
      </div>

      {error ? <div className="rf-error">{error}</div> : null}
    </section>
  );
}
