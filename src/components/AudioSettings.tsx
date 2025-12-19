import { useEffect, useMemo, useState } from "react";
import { tauriService } from "../services/tauri.service";
import type { AudioDeviceInfo } from "../types";
import { SelectDropdown } from "./SelectDropdown";
import { VolumeSlider } from "./VolumeSlider";

type Props = {
  micEnabled: boolean;
  onMicToggle: (enabled: boolean) => void;
  selectedMic: string;
  onMicChange: (deviceName: string) => void;
  micVolume: number; // 0.0-1.0
  onMicVolume: (volume: number) => void;

  systemAudioEnabled: boolean;
  onSystemAudioToggle: (enabled: boolean) => void;
  selectedSystemAudio: string;
  onSystemAudioChange: (deviceName: string) => void;
  systemAudioVolume: number; // 0.0-1.0
  onSystemAudioVolume: (volume: number) => void;
};

export function AudioSettings({
  micEnabled,
  onMicToggle,
  selectedMic,
  onMicChange,
  micVolume,
  onMicVolume,
  systemAudioEnabled,
  onSystemAudioToggle,
  selectedSystemAudio,
  onSystemAudioChange,
  systemAudioVolume,
  onSystemAudioVolume,
}: Props) {
  const [micDevices, setMicDevices] = useState<AudioDeviceInfo[]>([]);
  const [systemDevices, setSystemDevices] = useState<AudioDeviceInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [mics, sys] = await Promise.all([
          tauriService.getAudioInputs(),
          tauriService.getSystemAudioDevices(),
        ]);
        if (cancelled) return;
        setMicDevices(mics);
        setSystemDevices(sys);
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

  const micOptions = useMemo(
    () => micDevices.map((d) => ({ value: d.name, label: d.name })),
    [micDevices],
  );
  const sysOptions = useMemo(
    () => systemDevices.map((d) => ({ value: d.name, label: d.name })),
    [systemDevices],
  );

  const micValue = selectedMic || "";
  const sysValue = selectedSystemAudio || "";

  return (
    <section className="rf-card">
      <div className="rf-card-title">Audio</div>

      <div className="rf-audio-section">
        <label className="rf-toggle">
          <input
            type="checkbox"
            checked={micEnabled}
            onChange={(e) => onMicToggle(e.currentTarget.checked)}
          />
          <span>Record Microphone</span>
        </label>

        <SelectDropdown
          label="Select Microphone"
          value={micValue}
          options={micOptions}
          disabled={!micEnabled || loading || micOptions.length === 0}
          placeholder={loading ? "Loading..." : "Select Microphone"}
          onChange={onMicChange}
        />

        <VolumeSlider
          value={Math.round(micVolume * 100)}
          onChange={(v) => onMicVolume(v / 100)}
          disabled={!micEnabled}
        />
      </div>

      <div className="rf-divider" />

      <div className="rf-audio-section">
        <label className="rf-toggle">
          <input
            type="checkbox"
            checked={systemAudioEnabled}
            onChange={(e) => onSystemAudioToggle(e.currentTarget.checked)}
          />
          <span>Record System Audio</span>
        </label>

        <SelectDropdown
          label="Select System Audio"
          value={sysValue}
          options={sysOptions}
          disabled={!systemAudioEnabled || loading || sysOptions.length === 0}
          placeholder={loading ? "Loading..." : "Select System Audio"}
          onChange={onSystemAudioChange}
        />

        <VolumeSlider
          value={Math.round(systemAudioVolume * 100)}
          onChange={(v) => onSystemAudioVolume(v / 100)}
          disabled={!systemAudioEnabled}
        />
      </div>

      {error ? <div className="rf-error">{error}</div> : null}
    </section>
  );
}
