import { useEffect, useMemo, useRef, useState } from "react";
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

  const [micTestRecording, setMicTestRecording] = useState(false);
  const [micTestUrl, setMicTestUrl] = useState<string | null>(null);
  const [micTestError, setMicTestError] = useState<string | null>(null);
  const micTestStreamRef = useRef<MediaStream | null>(null);

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

  useEffect(() => {
    return () => {
      if (micTestUrl) URL.revokeObjectURL(micTestUrl);
      micTestStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [micTestUrl]);

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

  const runMicTest = async () => {
    setMicTestError(null);
    if (micTestUrl) {
      URL.revokeObjectURL(micTestUrl);
      setMicTestUrl(null);
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setMicTestError("Microphone test is not supported in this environment.");
      return;
    }

    setMicTestRecording(true);
    try {
      // Best-effort: match selected mic by label once permission is granted.
      let devices = await navigator.mediaDevices.enumerateDevices();
      let desired = devices.find(
        (d) => d.kind === "audioinput" && selectedMic && d.label === selectedMic,
      );

      if (!desired && selectedMic) {
        const warmup = await navigator.mediaDevices.getUserMedia({ audio: true });
        warmup.getTracks().forEach((t) => t.stop());
        devices = await navigator.mediaDevices.enumerateDevices();
        desired = devices.find(
          (d) => d.kind === "audioinput" && d.label === selectedMic,
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: desired ? { deviceId: { exact: desired.deviceId } } : true,
      });
      micTestStreamRef.current = stream;

      const chunks: BlobPart[] = [];
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : undefined;

      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );

      const blob = await new Promise<Blob>((resolve, reject) => {
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };
        recorder.onerror = () => reject(new Error("Microphone test failed."));
        recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType }));
        recorder.start();
        window.setTimeout(() => recorder.stop(), 3000);
      });

      stream.getTracks().forEach((t) => t.stop());
      micTestStreamRef.current = null;

      setMicTestUrl(URL.createObjectURL(blob));
    } catch (e) {
      setMicTestError(String(e));
    } finally {
      setMicTestRecording(false);
    }
  };

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

        <div className="rf-row" style={{ gap: 10, alignItems: "center" }}>
          <button
            type="button"
            className="rf-btn rf-btn-secondary"
            onClick={runMicTest}
            disabled={micTestRecording}
          >
            {micTestRecording ? "Testing..." : "Test Microphone (3s)"}
          </button>

          {micTestUrl ? <audio controls src={micTestUrl} /> : null}
        </div>

        {micTestError ? <div className="rf-error">{micTestError}</div> : null}
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
